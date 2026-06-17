// 8-bit sound effects via Web Audio API — no external files needed.

function tone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "square",
  gain = 0.15
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

export function playCorrect() {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    tone(ctx, 523, t, 0.1);       // C5
    tone(ctx, 659, t + 0.08, 0.1); // E5
    tone(ctx, 784, t + 0.16, 0.2); // G5
  } catch {}
}

export function playWrong() {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    tone(ctx, 220, t, 0.15, "sawtooth");
    tone(ctx, 196, t + 0.15, 0.25, "sawtooth");
  } catch {}
}

export function playWin() {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => tone(ctx, f, t + i * 0.1, 0.15));
    tone(ctx, 1047, t + 0.5, 0.4, "square", 0.2);
  } catch {}
}

export function playLose() {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    const notes = [349, 311, 277, 220];
    notes.forEach((f, i) => tone(ctx, f, t + i * 0.12, 0.18, "sawtooth"));
  } catch {}
}
