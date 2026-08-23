import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Volume2, VolumeX, ChevronRight, ChevronLeft } from 'lucide-react';
import { getAudioContext, playUiSound } from '../utils/audio';

// ──────────────────────────────────────────────────────────────────────
// Ambient Drone Player (Web Audio API)
// Procedural, evolving harmonic drone with collapsible drawer pane
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [volume, setVolume] = useState(0.35);

  // Audio Node References
  const masterGainRef = useRef(null);
  const chordIntervalRef = useRef(null);
  const voiceNodesRef = useRef([]);
  const lfoNodesRef = useRef([]);

  // ── Procedural Drone Engine ─────────────────────────────────────────
  const buildDrone = useCallback((ctx, vol) => {
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol), ctx.currentTime + 2.5);
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
      masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
    }
    setTimeout(() => {
      voiceNodesRef.current.forEach(v => {
        try {
          v.osc1.stop();
          v.osc2.stop();
          v.osc1.disconnect();
          v.osc2.disconnect();
        } catch (_) { }
      });
      voiceNodesRef.current = [];

      lfoNodesRef.current.forEach(n => {
        try {
          if (n.stop) n.stop();
          n.disconnect();
        } catch (_) { }
      });
      lfoNodesRef.current = [];
      masterGainRef.current = null;
    }, 1600);
  }, []);

  // Sync Volume Changes
  useEffect(() => {
    const masterGain = masterGainRef.current;
    const ctx = getAudioContext();
    if (masterGain && ctx && isPlaying) {
      masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, volume), ctx.currentTime + 0.15);
    }
  }, [volume, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopDrone();
    };
  }, [stopDrone]);

  // Toggle Play / Mute
  const togglePlay = () => {
    try { playUiSound('toggle'); } catch (_) { }
    if (isPlaying) {
      stopDrone();
      setIsPlaying(false);
    } else {
      const ctx = getAudioContext();
      if (ctx) buildDrone(ctx, volume);
      setIsPlaying(true);
    }
  };

  return (
    <div
      id="drone-player-container"
      className="fixed bottom-6 right-6 z-50 flex items-center font-sans"
    >
      {isCollapsed ? (
        /* Collapsed Minimal Tab */
        <div className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 border border-indigo-900/60 hover:border-indigo-500/50 shadow-2xl rounded-full px-3 py-2 backdrop-blur-xl transition-all duration-300">
          <button
            onClick={() => setIsCollapsed(false)}
            title="Expand Ambient Drone Pane"
            className="p-1 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Mute Ambient Drone' : 'Unmute Ambient Drone'}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isPlaying
                ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPlaying ? <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      ) : (
        /* Expanded Hideable Pane */
        <div
          className="flex items-center gap-3 bg-slate-950/92 border border-indigo-900/70 shadow-2xl rounded-2xl p-2.5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 animate-fade-in"
          style={{ minWidth: '240px' }}
        >
          {/* Mute / Unmute Button */}
          <button
            id="drone-mute-button"
            onClick={togglePlay}
            title={isPlaying ? 'Mute Ambient Drone' : 'Start Ambient Drone'}
            className={`p-2 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
              isPlaying
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-indigo-300 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Center Info & Animated Equalizer */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-200 tracking-wide truncate">
                Ambient Drone
              </span>
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3 flex-shrink-0" aria-hidden="true">
                  {[2, 4, 3, 5, 3].map((h, i) => (
                    <div
                      key={i}
                      className="w-[2px] rounded-full"
                      style={{
                        height: `${h * 2}px`,
                        background: 'linear-gradient(to top, #6366f1, #a855f7)',
                        opacity: 0.85,
                        animation: `equalize ${0.45 + (i % 3) * 0.15}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 mt-1">
              <input
                id="drone-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 cursor-pointer accent-indigo-400"
                title="Drone Volume"
              />
              <span className="text-[9px] font-mono text-slate-400">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Hide / Collapse Toggle Arrow */}
          <button
            onClick={() => setIsCollapsed(true)}
            title="Hide Ambient Drone Pane"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
