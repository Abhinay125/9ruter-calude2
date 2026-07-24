// Text overlay component with kid-friendly animations
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { KID_THEME } from '../utils/theme';
import { spring, bounce, pop, delay, elastic } from '../utils/animations';

interface TextOverlayProps {
  frame: number;
  fps: number;
  text: string | number;
  // Animation
  appearAt?: number;
  animation?: 'spring' | 'bounce' | 'pop' | 'elastic' | 'fade' | 'slide-up' | 'slide-down';
  duration?: number;
  // Styling
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'extrabold';
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  // Position
  x?: number;
  y?: number;
  // Alignment
  align?: 'left' | 'center' | 'right';
  // Shadow
  shadow?: boolean;
  shadowColor?: string;
  shadowOffset?: number;
  // Scale
  scale?: number;
}

const TextOverlay: React.FC<TextOverlayProps> = ({
  frame,
  fps,
  text,
  appearAt = 0,
  animation = 'spring',
  duration = 0.6,
  fontSize = 120,
  fontWeight = 'extrabold',
  color = KID_THEME.colors.black,
  strokeColor,
  strokeWidth = 0,
  x = 0,
  y = 0,
  align = 'center',
  shadow = true,
  shadowColor = 'rgba(0,0,0,0.15)',
  shadowOffset = 4,
  scale = 1,
}) => {
  const appearProgress = delay(frame, appearAt, fps, duration);
  const appearClamped = Math.max(0, Math.min(1, appearProgress));

  let transform = '';
  let opacity = appearClamped;

  switch (animation) {
    case 'spring': {
      const s = spring(appearClamped * fps * duration, fps, duration);
      transform = `scale(${interpolate(s, [0, 1], [0, 1]) * scale})`;
      break;
    }
    case 'bounce': {
      const b = bounce(appearClamped * fps * duration, fps, duration);
      transform = `scale(${b * scale})`;
      break;
    }
    case 'pop': {
      const p = pop(appearClamped * fps * duration, fps, duration);
      transform = `scale(${p * scale})`;
      break;
    }
    case 'elastic': {
      const e = elastic(appearClamped * fps * duration, fps, duration);
      transform = `scale(${e * scale})`;
      break;
    }
    case 'fade': {
      opacity = interpolate(appearClamped, [0, 1], [0, 1]);
      transform = `scale(${scale})`;
      break;
    }
    case 'slide-up': {
      const s = spring(appearClamped * fps * duration, fps, duration);
      const slideY = interpolate(s, [0, 1], [50, 0]);
      transform = `translateY(${slideY}px) scale(${scale})`;
      opacity = interpolate(s, [0, 1], [0, 1]);
      break;
    }
    case 'slide-down': {
      const s = spring(appearClamped * fps * duration, fps, duration);
      const slideY = interpolate(s, [0, 1], [-50, 0]);
      transform = `translateY(${slideY}px) scale(${scale})`;
      opacity = interpolate(s, [0, 1], [0, 1]);
      break;
    }
    default:
      transform = `scale(${scale})`;
  }

  const textStr = String(text);
  const fontFamily = KID_THEME.fonts.display;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `translate(${x}px, ${y}px) ${transform}`,
          transformOrigin: 'center center',
          opacity,
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight === 'extrabold' ? 800 : fontWeight === 'bold' ? 700 : 400,
          color,
          textAlign: align,
          WebkitTextStroke: strokeWidth > 0 ? `${strokeWidth}px ${strokeColor}` : undefined,
          textShadow: shadow ? `${shadowOffset}px ${shadowOffset}px 0 ${shadowColor}` : undefined,
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
        }}
      >
        {textStr}
      </div>
    </AbsoluteFill>
  );
};

export default TextOverlay;