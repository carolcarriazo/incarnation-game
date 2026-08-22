const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) {
    const b = import.meta.env.BASE_URL;
    return b.endsWith('/') ? b : b + '/';
  }
  return './';
};

const BASE = getBaseUrl();

export const MUSIC_PLAYLIST = [
  { name: "Danse Morialta", url: `${BASE}music/${encodeURIComponent("Danse Morialta.mp3")}` },
  { name: "Dreams Become Real", url: `${BASE}music/${encodeURIComponent("Dreams Become Real.mp3")}` },
  { name: "Evening Fall - Harp", url: `${BASE}music/${encodeURIComponent("Evening Fall - Harp.mp3")}` },
  { name: "Immersed", url: `${BASE}music/${encodeURIComponent("Immersed.mp3")}` },
  { name: "Mesmerize", url: `${BASE}music/${encodeURIComponent("Mesmerize.mp3")}` },
  { name: "Plaint", url: `${BASE}music/${encodeURIComponent("Plaint.mp3")}` },
  { name: "Reaching Out", url: `${BASE}music/${encodeURIComponent("Reaching Out.mp3")}` },
  { name: "Teller of the Tales", url: `${BASE}music/${encodeURIComponent("Teller of the Tales.mp3")}` },
  { name: "Thunderbird", url: `${BASE}music/${encodeURIComponent("Thunderbird.mp3")}` },
];
