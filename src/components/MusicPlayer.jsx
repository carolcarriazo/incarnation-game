import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Music, Shuffle, SkipForward } from 'lucide-react';
import { getAudioContext, playUiSound } from '../utils/audio';
import { MUSIC_PLAYLIST } from '../musicData';

// ──────────────────────────────────────────────────────────────────────
// Dynamic Dual-Engine Music Player
// Mode 1: Evolving Procedural Cosmic Ambient Drone (Web Audio API)
// Mode 2: Stock Audio Library from public/music/ (Shuffles on Repeat)
// ──────────────────────────────────────────────────────────────────────

// Shifting drone chord voicings (frequencies in Hz)
const CHORD_PROGRESSIONS = [
  [55.0, 110.0, 130.81, 164.81, 246.94, 329.63], // Am9
  [43.65, 87.31, 130.81, 174.61, 220.00, 329.63], // Fmaj7#11
  [36.71, 73.42, 110.0, 146.83, 220.00, 293.66],  // Dm9
  [41.20, 82.41, 123.47, 164.81, 246.94, 293.66],  // Em7
  [32.70, 65.41, 130.81, 196.00, 246.94, 293.66]   // Cmaj9
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState('drone'); // 'drone' | 'music'
  const [volume, setVolume] = useState(0.35);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  // Backend library tracks
  const [tracks] = useState(MUSIC_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrackName, setCurrentTrackName] = useState(MUSIC_PLAYLIST[0]?.name || '');

  // Audio Refs
  const masterGainRef = useRef(null);
  const chordIntervalRef = useRef(null);
  const voiceNodesRef = useRef([]);
  const lfoNodesRef = useRef([]);
  const audioElementRef = useRef(new Audio());

  // ── Procedural Drone Engine ─────────────────────────────────────────
  const buildDrone = useCallback((ctx, vol) => {
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol), ctx.currentTime + 3.0);
    masterGainRef.current = masterGain;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);
    filter.Q.value = 0.8;

    const airFilter = ctx.createBiquadFilter();
    airFilter.type = 'peaking';
    airFilter.frequency.setValueAtTime(450, ctx.currentTime);
    airFilter.gain.setValueAtTime(2.5, ctx.currentTime);
    airFilter.Q.value = 1.2;

    masterGain.connect(airFilter);
    airFilter.connect(filter);
    filter.connect(ctx.destination);

    const initialChord = CHORD_PROGRESSIONS[0];
    const voices = [];

    initialChord.forEach((freq, idx) => {
      const osc1 = ctx.createOscillator();
      osc1.type = idx === 0 ? 'sine' : 'triangle';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      const detuneAmount = (idx + 1) * 1.2 * (idx % 2 === 0 ? 1 : -1);
      osc2.frequency.setValueAtTime(freq + (detuneAmount * 0.08), ctx.currentTime);

      const voiceGain = ctx.createGain();
      const baseGain = idx === 0 ? 0.35 : idx === 1 ? 0.22 : 0.12 / (idx * 0.75 + 1);
      voiceGain.gain.setValueAtTime(baseGain, ctx.currentTime);

      osc1.connect(voiceGain);
      osc2.connect(voiceGain);
      voiceGain.connect(masterGain);

      osc1.start();
      osc2.start();

      voices.push({ osc1, osc2, voiceGain, baseGain });
    });
    voiceNodesRef.current = voices;

    const filterLFO = ctx.createOscillator();
    const filterLFOGain = ctx.createGain();
    filterLFO.frequency.setValueAtTime(0.05, ctx.currentTime);
    filterLFOGain.gain.setValueAtTime(220, ctx.currentTime);
    filterLFO.connect(filterLFOGain);
    filterLFOGain.connect(filter.frequency);
    filterLFO.start();

    const driftLFO = ctx.createOscillator();
    const driftLFOGain = ctx.createGain();
    driftLFO.frequency.setValueAtTime(0.025, ctx.currentTime);
    driftLFOGain.gain.setValueAtTime(0.6, ctx.currentTime);
    driftLFO.connect(driftLFOGain);
    voices.forEach(v => {
      driftLFOGain.connect(v.osc1.frequency);
      driftLFOGain.connect(v.osc2.frequency);
    });
    driftLFO.start();

    lfoNodesRef.current = [filterLFO, filterLFOGain, driftLFO, driftLFOGain];

    let chordStep = 0;
    chordIntervalRef.current = setInterval(() => {
      chordStep = (chordStep + 1) % CHORD_PROGRESSIONS.length;
      setCurrentChordIndex(chordStep);
      const nextChord = CHORD_PROGRESSIONS[chordStep];
      const now = ctx.currentTime;

      voices.forEach((voice, i) => {
        if (nextChord[i]) {
          const targetFreq = nextChord[i];
          voice.osc1.frequency.exponentialRampToValueAtTime(targetFreq, now + 4.5);
          voice.osc2.frequency.exponentialRampToValueAtTime(targetFreq + 0.12, now + 4.5);
        }
      });
    }, 14000);
  }, []);

  const stopDrone = useCallback(() => {
    if (chordIntervalRef.current) {
      clearInterval(chordIntervalRef.current);
      chordIntervalRef.current = null;
    }
    const masterGain = masterGainRef.current;
    const ctx = getAudioContext();
    if (masterGain && ctx) {
      masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
    }
    setTimeout(() => {
      voiceNodesRef.current.forEach(v => {
        try {
          v.osc1.stop();
          v.osc2.stop();
          v.osc1.disconnect();
          v.osc2.disconnect();
        } catch (_) {}
      });
      voiceNodesRef.current = [];

      lfoNodesRef.current.forEach(n => {
        try {
          if (n.stop) n.stop();
          n.disconnect();
        } catch (_) {}
      });
      lfoNodesRef.current = [];
      masterGainRef.current = null;
    }, 2000);
  }, []);

  // ── Stock Music / Backend Library Engine ───────────────────────────
  const playTrack = useCallback((trackList, index) => {
    if (!trackList || trackList.length === 0) return;
    const track = trackList[index % trackList.length];
    if (!track) return;

    const audio = audioElementRef.current;
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (_) {}
    audio.src = track.url;
    audio.volume = volume;
    audio.play().catch(e => console.warn("Audio playback blocked or waiting:", e));
    setCurrentTrackName(track.name);
    setCurrentTrackIndex(index % trackList.length);
  }, [volume]);

  // Next Track (plays next track cleanly)
  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    let nextIdx = (currentTrackIndex + 1) % tracks.length;
    if (tracks.length > 1) {
      let randIdx = Math.floor(Math.random() * tracks.length);
      while (randIdx === currentTrackIndex && tracks.length > 1) {
        randIdx = Math.floor(Math.random() * tracks.length);
      }
      nextIdx = randIdx;
    }
    playTrack(tracks, nextIdx);
  }, [tracks, currentTrackIndex, playTrack]);

  // When a track finishes, automatically shuffle to the next track on repeat
  useEffect(() => {
    const audio = audioElementRef.current;
    const handleEnded = () => {
      nextTrack();
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [nextTrack]);

  const stopMusic = useCallback(() => {
    const audio = audioElementRef.current;
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (_) {}
  }, []);

  // Sync Volume
  useEffect(() => {
    const masterGain = masterGainRef.current;
    const ctx = getAudioContext();
    if (masterGain && ctx && isPlaying && mode === 'drone') {
      masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, volume), ctx.currentTime + 0.2);
    }
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume;
    }
  }, [volume, isPlaying, mode]);

  // Mode Switch
  const handleModeSwitch = (newMode) => {
    playUiSound('toggle');
    if (newMode === mode) return;

    if (isPlaying) {
      if (mode === 'drone') stopDrone();
      else stopMusic();

      if (newMode === 'drone') {
        const ctx = getAudioContext();
        if (ctx) buildDrone(ctx, volume);
      } else {
        if (tracks.length > 0) {
          playTrack(tracks, currentTrackIndex);
        }
      }
    }
    setMode(newMode);
  };

  // Toggle Global Play/Pause
  const togglePlay = () => {
    playUiSound('toggle');
    if (isPlaying) {
      if (mode === 'drone') stopDrone();
      else stopMusic();
      setIsPlaying(false);
    } else {
      if (mode === 'drone') {
        const ctx = getAudioContext();
        if (ctx) buildDrone(ctx, volume);
      } else {
        if (tracks.length > 0) {
          playTrack(tracks, currentTrackIndex);
        }
      }
      setIsPlaying(true);
    }
  };

  return (
    <div
      id="music-player"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 rounded-2xl p-3 shadow-2xl border border-indigo-900/60 transition-all duration-300 backdrop-blur-xl hover:border-indigo-500/50"
      style={{ background: 'rgba(7, 11, 24, 0.94)', minWidth: '260px', maxWidth: '320px' }}
    >
      {/* Top Bar: Mode Switcher & Master Toggle */}
      <div className="flex items-center justify-between gap-3">
        {/* Toggle Mode Switch [ Drone | Music ] */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[11px] font-sans font-semibold">
          <button
            onClick={() => handleModeSwitch('drone')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'drone'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Drone</span>
          </button>
          <button
            onClick={() => handleModeSwitch('music')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'music'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-3 h-3" />
            <span>Music {tracks.length > 0 && `(${tracks.length})`}</span>
          </button>
        </div>

        {/* Master Play/Stop Button */}
        <button
          id="music-player-toggle"
          onClick={togglePlay}
          title={isPlaying ? 'Pause ambience' : 'Play ambience'}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isPlaying
              ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isPlaying ? <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Track Info, Next Button & Volume Slider */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          {/* Animated visualizer */}
          {isPlaying && (
            <div className="flex items-end gap-[2px] h-3.5 flex-shrink-0" aria-hidden="true">
              {[2, 4, 3, 5, 4, 2, 5, 3].map((h, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-full"
                  style={{
                    height: `${h * 2.2}px`,
                    background: 'linear-gradient(to top, #4f46e5, #c084fc)',
                    opacity: 0.85,
                    animation: `equalize ${0.45 + (i % 4) * 0.12}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}

          <span className="text-[11px] font-sans text-slate-300 truncate font-medium">
            {mode === 'drone'
              ? isPlaying ? 'Cosmic Harmonic Drone' : 'Procedural Drone (Paused)'
              : tracks.length === 0
                ? 'No tracks in public/music'
                : currentTrackName || `Track ${currentTrackIndex + 1}`}
          </span>
        </div>

        {/* Controls: Next Track button + Volume Slider */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {mode === 'music' && tracks.length > 1 && (
            <button
              onClick={() => {
                playUiSound('click');
                nextTrack();
              }}
              title="Next track"
              className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/50"
            >
              <SkipForward className="w-3 h-3 text-indigo-300" />
            </button>
          )}

          <input
            id="music-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-14 h-1 cursor-pointer accent-indigo-400"
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
}
