// Animation helper functions for Remotion (frame-based)
// All animations work with frame numbers and fps

/**
 * Linear interpolation between two values
 */
export function interpolate(
  progress: number,
  inputRange: [number, number],
  outputRange: [number, number]
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  const clamped = Math.max(0, Math.min(1, (progress - inMin) / (inMax - inMin)));
  return outMin + clamped * (outMax - outMin);
}

/**
 * Spring animation (bouncy)
 */
export function spring(
  frame: number,
  fps: number,
  duration: number = 1,
  stiffness: number = 170,
  damping: number = 26
): number {
  const totalFrames = fps * duration;
  const progress = frame / totalFrames;
  if (progress >= 1) return 1;
  if (progress <= 0) return 0;

  // Spring physics approximation
  const w0 = Math.sqrt(stiffness);
  const zeta = damping / (2 * Math.sqrt(stiffness));
  const wd = w0 * Math.sqrt(1 - zeta * zeta);

  const envelope = Math.exp(-zeta * w0 * progress * totalFrames / fps);
  const oscillation = Math.cos(wd * progress * totalFrames / fps) +
    (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * progress * totalFrames / fps);

  return 1 - envelope * oscillation;
}

/**
 * Bounce animation
 */
export function bounce(
  frame: number,
  fps: number,
  duration: number = 0.6
): number {
  const totalFrames = fps * duration;
  const progress = frame / totalFrames;
  if (progress >= 1) return 1;
  if (progress <= 0) return 1;

  // Bounce easing: overshoot and settle
  const n1 = 7.5625;
  const d1 = 2.75;
  let p = progress;

  if (p < 1 / d1) {
    return n1 * p * p;
  } else if (p < 2 / d1) {
    p -= 1.5 / d1;
    return n1 * p * p + 0.75;
  } else if (p < 2.5 / d1) {
    p -= 2.25 / d1;
    return n1 * p * p + 0.9375;
  } else {
    p -= 2.625 / d1;
    return n1 * p * p + 0.984375;
  }
}

/**
 * Pop animation (quick scale up and down)
 */
export function pop(
  frame: number,
  fps: number,
  duration: number = 0.3
): number {
  const totalFrames = fps * duration;
  const progress = frame / totalFrames;
  if (progress >= 1) return 1;
  if (progress <= 0) return 1;

  // Quick pop: scale to 1.2 then back to 1
  if (progress < 0.5) {
    return 1 + 0.2 * Math.sin(progress * Math.PI);
  }
  return 1 + 0.2 * Math.sin((1 - progress) * Math.PI);
}

/**
 * Elastic animation (overshoot with spring)
 */
export function elastic(
  frame: number,
  fps: number,
  duration: number = 0.8
): number {
  const totalFrames = fps * duration;
  const progress = frame / totalFrames;
  if (progress >= 1) return 1;
  if (progress <= 0) return 0;

  return Math.pow(2, -10 * progress) *
    Math.sin((progress * totalFrames / fps - 0.1) * (2 * Math.PI) / 0.4) + 1;
}

/**
 * Delay helper - returns progress (0-1) after delay
 */
export function delay(
  frame: number,
  delayFrames: number,
  fps: number,
  duration: number = 1
): number {
  const totalFrames = fps * duration;
  const startFrame = delayFrames;
  const progress = (frame - startFrame) / totalFrames;
  return Math.max(0, Math.min(1, progress));
}

/**
 * Loop animation (0-1 repeating)
 */
export function loop(
  frame: number,
  fps: number,
  duration: number
): number {
  const totalFrames = fps * duration;
  return (frame % totalFrames) / totalFrames;
}

/**
 * Ping-pong loop (0-1-0 repeating)
 */
export function pingPong(
  frame: number,
  fps: number,
  duration: number
): number {
  const totalFrames = fps * duration;
  const cycle = Math.floor(frame / totalFrames);
  const progress = (frame % totalFrames) / totalFrames;
  return cycle % 2 === 0 ? progress : 1 - progress;
}

/**
 * Stagger helper - delay each item by offset
 */
export function stagger(
  index: number,
  baseDelay: number,
  itemDelay: number
): number {
  return baseDelay + index * itemDelay;
}

/**
 * Ease functions
 */
export const ease = {
  linear: (t: number) => t,
  inQuad: (t: number) => t * t,
  outQuad: (t: number) => t * (2 - t),
  inOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  inCubic: (t: number) => t * t * t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  inQuart: (t: number) => t * t * t * t,
  outQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  inOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * Math.pow(t - 1, 4),
  inExpo: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  outExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  inOutExpo: (t: number) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2,
  inCirc: (t: number) => 1 - Math.sqrt(1 - t * t),
  outCirc: (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2)),
  inOutCirc: (t: number) => t < 0.5
    ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
    : (Math.sqrt(1 - Math.pow(2 * t - 2, 2)) + 1) / 2,
  inBack: (t: number) => t * t * (2.70158 * t - 1.70158),
  outBack: (t: number) => 1 + (t - 1) * (t - 1) * (2.70158 * (t - 1) + 1.70158),
  inOutBack: (t: number) => {
    const s = 1.70158 * 1.525;
    if ((t *= 2) < 1) return 0.5 * t * t * ((s + 1) * t - s);
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
  },
  // Bouncy ease for kids content
  bouncy: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  // Elastic ease for kids content
  elastic: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  },
};