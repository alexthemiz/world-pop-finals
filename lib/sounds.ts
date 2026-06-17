// Crowd sound effects via Web Audio API — no external files needed.

let muted = false;

export function getMuted() { return muted; }
export function setMuted(val: boolean) {
  muted = val;
  if (typeof localStorage !== "undefined") localStorage.setItem("wpf-muted", val ? "1" : "0");
}
export function initMuted() {
  if (typeof localStorage !== "undefined") muted = localStorage.getItem("wpf-muted") === "1";
}

function createNoise(ctx: AudioContext, duration: number): AudioBufferSourceNode {
  const bufferSize = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

export function playCorrect() {
  if (muted) return;
  try {
    const ctx = new AudioContext();
    const duration = 1.2;

    // Crowd roar: bandpass noise rising in energy
    const noise = createNoise(ctx, duration);
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(600, ctx.currentTime);
    bandpass.frequency.linearRampToValueAtTime(1800, ctx.currentTime + 0.4);
    bandpass.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.15);
    gain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.4);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.9);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    // High shimmer (excitement overtones)
    const noise2 = createNoise(ctx, duration);
    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 3000;
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.2);
    gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    noise.connect(bandpass).connect(gain).connect(ctx.destination);
    noise2.connect(high).connect(gain2).connect(ctx.destination);
    noise.start();
    noise2.start();
  } catch {}
}

export function playWrong() {
  if (muted) return;
  try {
    const ctx = new AudioContext();
    const duration = 1.0;

    // Crowd boo: low rumble noise with downward sweep
    const noise = createNoise(ctx, duration);
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(500, ctx.currentTime);
    bandpass.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.5);
    bandpass.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.6);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    // Low "boo" drone
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.8);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    noise.connect(bandpass).connect(gain).connect(ctx.destination);
    osc.connect(oscGain).connect(ctx.destination);
    noise.start();
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playWin() {
  if (muted) return;
  try {
    const ctx = new AudioContext();
    const duration = 2.5;

    // Big crowd roar with sustained excitement
    const noise = createNoise(ctx, duration);
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(400, ctx.currentTime);
    bandpass.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 0.5);
    bandpass.frequency.setValueAtTime(1500, ctx.currentTime + 0.5);
    bandpass.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 1.5);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    const noise2 = createNoise(ctx, duration);
    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 2500;
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
    gain2.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2.0);
    gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    noise.connect(bandpass).connect(gain).connect(ctx.destination);
    noise2.connect(high).connect(gain2).connect(ctx.destination);
    noise.start();
    noise2.start();
  } catch {}
}

export function playLose() {
  if (muted) return;
  try {
    const ctx = new AudioContext();
    const duration = 2.0;

    // Sustained crowd boo
    const noise = createNoise(ctx, duration);
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(600, ctx.currentTime);
    bandpass.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.7);
    bandpass.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.15);
    gain.gain.linearRampToValueAtTime(0.65, ctx.currentTime + 1.2);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 1.5);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
    oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    noise.connect(bandpass).connect(gain).connect(ctx.destination);
    osc.connect(oscGain).connect(ctx.destination);
    noise.start();
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}
