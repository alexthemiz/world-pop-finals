// Crowd sound effects via Web Audio API. Correct/wrong use real recordings
// from public/sounds; win/lose are synthesized 8-bit fanfares.

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

let clipCtx: AudioContext | null = null;
const clipBufferPromises = new Map<string, Promise<AudioBuffer>>();

function loadClipBuffer(url: string): Promise<AudioBuffer> {
  if (!clipCtx) clipCtx = new AudioContext();
  let promise = clipBufferPromises.get(url);
  if (!promise) {
    promise = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => clipCtx!.decodeAudioData(data));
    clipBufferPromises.set(url, promise);
  }
  return promise;
}

// Plays [offset, offset + duration) seconds of an audio clip from public/sounds.
function playClip(url: string, offset: number, duration: number) {
  if (muted) return;
  loadClipBuffer(url)
    .then((buffer) => {
      if (muted || !clipCtx) return;
      const source = clipCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(clipCtx.destination);
      source.start(0, offset, duration);
    })
    .catch(() => {});
}

// Real crowd-cheer recording, using the second half of its 24s-26s segment.
export function playCorrect() {
  playClip("/sounds/crowd-cheer.mp3", 25, 1);
}

// Real crowd-boo recording, using the first half of its first 2 seconds.
export function playWrong() {
  playClip("/sounds/crowd-boo.mp3", 0, 1);
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
