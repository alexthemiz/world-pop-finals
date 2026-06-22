// 8-bit crowd sound effects via Web Audio API — no external files needed.

let muted = false;

export function getMuted() { return muted; }
export function setMuted(val: boolean) {
  muted = val;
  if (typeof localStorage !== "undefined") localStorage.setItem("wpf-muted", val ? "1" : "0");
}
export function initMuted() {
  if (typeof localStorage !== "undefined") muted = localStorage.getItem("wpf-muted") === "1";
}

function tone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "square",
  gain = 0.12
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  g.gain.setValueAtTime(gain, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// 8-bit cheer: two-voice rapid ascending arpeggio (crowd "yeah!")
export function playCorrect() {
  if (muted) return;
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    const step = 0.055;
    // Voice 1: ascending C-E-G-C-E-G (square)
    const v1 = [523, 659, 784, 1047, 1319, 1568];
    v1.forEach((f, i) => tone(ctx, f, t + i * step, step * 1.8, "square", 0.13));
    // Voice 2: same but offset + slightly detuned (pulse feel)
    const v2 = [519, 655, 780, 1041, 1311, 1558];
    v2.forEach((f, i) => tone(ctx, f, t + i * step + 0.008, step * 1.8, "square", 0.07));
  } catch {}
}

let booCtx: AudioContext | null = null;
let booBufferPromise: Promise<AudioBuffer> | null = null;

function loadBooBuffer(): Promise<AudioBuffer> {
  if (!booCtx) booCtx = new AudioContext();
  if (!booBufferPromise) {
    booBufferPromise = fetch("/sounds/crowd-boo.mp3")
      .then((res) => res.arrayBuffer())
      .then((data) => booCtx!.decodeAudioData(data));
  }
  return booBufferPromise;
}

// Real crowd-boo recording, capped to its first 2 seconds.
export function playWrong() {
  if (muted) return;
  loadBooBuffer()
    .then((buffer) => {
      if (muted || !booCtx) return;
      const source = booCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(booCtx.destination);
      source.start(0, 0, 2);
    })
    .catch(() => {});
}

// 8-bit win fanfare: triumphant multi-voice ascent
export function playWin() {
  if (muted) return;
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    // Main melody: C-E-G-C punchy hits then high run
    const melody = [523, 659, 784, 1047, 784, 1047, 1319, 1568];
    const times =  [0,   0.1, 0.2, 0.35, 0.5, 0.6,  0.7,  0.8];
    melody.forEach((f, i) => tone(ctx, f, t + times[i], 0.18, "square", 0.14));
    // Harmony a third below
    const harm = [415, 523, 622, 831, 622, 831, 1047, 1245];
    harm.forEach((f, i) => tone(ctx, f, t + times[i], 0.18, "square", 0.07));
    // Held high note at end
    tone(ctx, 1568, t + 1.0, 0.5, "square", 0.12);
  } catch {}
}

// 8-bit lose: descending "wah wah wah wahhh" trombone slide
export function playLose() {
  if (muted) return;
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    // Classic sad trombone: Bb-Ab-Gb-E descending
    const notes = [466, 415, 370, 311];
    const dur =   [0.22, 0.22, 0.22, 0.55];
    let offset = 0;
    notes.forEach((f, i) => {
      tone(ctx, f, t + offset, dur[i] * 1.5, "sawtooth", 0.15);
      tone(ctx, f / 2, t + offset, dur[i] * 1.5, "sawtooth", 0.07);
      offset += dur[i];
    });
  } catch {}
}
