// soundEffects.js — tiny original synth blips made with WebAudio oscillators.
// No audio files: every sound is generated in code, so the game stays fully
// offline and self-contained.

let audioContext = null;

function ensureContext() {
  if (!audioContext) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  return audioContext;
}

export function playBlip(frequency, durationSeconds, type = 'square', volume = 0.05) {
  try {
    const ctx = ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSeconds);
    osc.stop(ctx.currentTime + durationSeconds);
  } catch { /* sound is optional */ }
}

export function playChopSound() { playBlip(220, 0.07, 'square', 0.04); }
export function playSizzleSound() { playBlip(880, 0.18, 'sawtooth', 0.02); }
export function playServeSound() { playBlip(660, 0.1, 'triangle', 0.06); setTimeout(() => playBlip(990, 0.14, 'triangle', 0.06), 90); }
export function playMissSound() { playBlip(140, 0.22, 'sawtooth', 0.05); }
