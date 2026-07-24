// Reusable cute face component for characters
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { KID_THEME } from '../utils/theme';
import { spring, bounce, pop, delay, interpolate as interp } from '../utils/animations';

interface FaceProps {
  frame: number;
  fps: number;
  // Face expression
  expression?: 'happy' | 'excited' | 'wink' | 'sleepy' | 'surprised' | 'laugh' | 'neutral';
  // Animation triggers (frame numbers)
  appearAt?: number;
  bounceAt?: number[];
  blinkAt?: number[];
  popAt?: number[];
  // Face customization
  eyeColor?: string;
  cheekColor?: string;
  mouthColor?: string;
  faceShape?: 'circle' | 'rounded-square' | 'oval';
  // Size
  size?: number;
  // Position offsets
  xOffset?: number;
  yOffset?: number;
  // Scale
  scale?: number;
}

export const Face: React.FC<FaceProps> = ({
  frame,
  fps,
  expression = 'happy',
  appearAt = 0,
  bounceAt = [],
  blinkAt = [],
  popAt = [],
  eyeColor = KID_THEME.colors.eye,
  cheekColor = KID_THEME.colors.cheek,
  mouthColor = KID_THEME.colors.mouth,
  faceShape = 'circle',
  size = 120,
  xOffset = 0,
  yOffset = 0,
  scale = 1,
}) => {
  // Appear animation
  const appearProgress = delay(frame, appearAt, fps, 1);
  const appearSpring = spring(appearProgress * fps, fps, 0.8);
  const appearScale = interp(appearSpring, [0, 1], [0, 1]);

  // Blink animation
  const blinkProgress = blinkAt.map(b => delay(frame, b, fps, 0.15));
  const isBlinking = blinkProgress.some(p => p > 0 && p < 1);
  const blinkHeight = isBlinking ? 1 - interp(blinkProgress.find(p => p > 0 && p < 1) || 0, [0, 0.5, 1], [1, 0, 1]) : 1;

  // Bounce animation (head bob)
  let bounceY = 0;
  let bounceScaleX = 1;
  let bounceScaleY = 1;

  for (const b of bounceAt) {
    const bp = delay(frame, b, fps, 0.5);
    if (bp > 0 && bp < 1) {
      const bn = bounce(bp * fps, fps, 0.5);
      bounceY = -15 * bn;
      const squash = 1 - 0.15 * bn;
      bounceScaleX = 1 / squash;
      bounceScaleY = squash;
    }
  }

  // Pop animation
  let popScale = 1;
  for (const p of popAt) {
    const pp = delay(frame, p, fps, 0.25);
    if (pp > 0 && pp < 1) {
      popScale = 1 + 0.25 * Math.sin(pp * Math.PI);
    }
  }

  // Expression-based features
  const getEyeStyle = (side: 'left' | 'right') => {
    const baseSize = size * 0.12;
    const xPos = side === 'left' ? -size * 0.18 : size * 0.18;
    const yPos = -size * 0.05;

    switch (expression) {
      case 'wink':
        return side === 'left'
          ? { width: baseSize * 1.2, height: baseSize * 0.15, borderRadius: '50%', background: eyeColor, transform: `rotate(-10deg)` }
          : { width: baseSize, height: baseSize * blinkHeight, borderRadius: '50%', background: eyeColor };
      case 'sleepy':
        return { width: baseSize * 1.2, height: baseSize * 0.1, borderRadius: '50%', background: eyeColor, borderTop: `3px solid ${eyeColor}`, borderBottom: 'none' };
      case 'surprised':
        return { width: baseSize * 1.5, height: baseSize * 1.5, borderRadius: '50%', background: eyeColor };
      case 'laugh':
        return { width: baseSize * 1.3, height: baseSize * 0.15, borderRadius: '50%', background: eyeColor, transform: `rotate(${side === 'left' ? -15 : 15}deg)` };
      case 'excited':
        return { width: baseSize * 1.1, height: baseSize * 1.3, borderRadius: '50%', background: eyeColor };
      default: // happy, neutral
        return { width: baseSize, height: baseSize * blinkHeight, borderRadius: '50%', background: eyeColor };
    }
  };

  const getMouthStyle = () => {
    const baseWidth = size * 0.35;
    const baseHeight = size * 0.15;
    const yPos = size * 0.25;

    switch (expression) {
      case 'excited':
        return {
          width: baseWidth * 1.2,
          height: baseHeight * 1.5,
          borderRadius: '50%',
          border: `4px solid ${mouthColor}`,
          background: 'transparent',
          borderTop: 'none',
        };
      case 'laugh':
        return {
          width: baseWidth * 1.4,
          height: baseHeight * 1.2,
          borderRadius: '50%',
          border: `4px solid ${mouthColor}`,
          background: mouthColor,
          borderTop: 'none',
        };
      case 'surprised':
        return {
          width: size * 0.2,
          height: size * 0.2,
          borderRadius: '50%',
          background: mouthColor,
        };
      case 'sleepy':
        return {
          width: baseWidth * 0.6,
          height: 3,
          borderRadius: '2px',
          background: mouthColor,
        };
      case 'wink':
      case 'happy':
      default:
        return {
          width: baseWidth,
          height: baseHeight,
          borderRadius: '0 0 50% 50%',
          border: `4px solid ${mouthColor}`,
          background: 'transparent',
          borderTop: 'none',
        };
    }
  };

  const getCheekStyle = (side: 'left' | 'right') => {
    const xPos = side === 'left' ? -size * 0.35 : size * 0.35;
    const yPos = size * 0.15;
    const cheekSize = size * 0.1;

    return {
      width: cheekSize,
      height: cheekSize,
      borderRadius: '50%',
      background: cheekColor,
      opacity: expression === 'surprised' ? 0 : 1,
    };
  };

  const faceBorderRadius = faceShape === 'circle'
    ? '50%'
    : faceShape === 'rounded-square'
    ? `${size * 0.3}px`
    : `${size * 0.5}px / ${size * 0.4}px`;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${xOffset}px, ${yOffset + bounceY}px) scale(${appearScale * scale * popScale * bounceScaleX}, ${appearScale * scale * popScale * bounceScaleY})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
      }}
    >
      {/* Face base */}
      <div
        style={{
          width: size,
          height: size,
          background: KID_THEME.colors.white,
          border: `4px solid ${KID_THEME.colors.gray}`,
          borderRadius: faceBorderRadius,
          boxShadow: `0 4px 12px rgba(0,0,0,0.1), inset 0 -4px 8px rgba(0,0,0,0.05)`,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Left cheek */}
        <div
          style={{
            position: 'absolute',
            left: size * 0.05,
            top: size * 0.4,
            ...getCheekStyle('left'),
          }}
        />

        {/* Right cheek */}
        <div
          style={{
            position: 'absolute',
            right: size * 0.05,
            top: size * 0.4,
            ...getCheekStyle('right'),
          }}
        />

        {/* Left eye */}
        <div
          style={{
            position: 'absolute',
            left: size * 0.22,
            top: size * 0.25,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={getEyeStyle('left')} />
          {/* Eye highlight */}
          <div
            style={{
              position: 'absolute',
              width: size * 0.04,
              height: size * 0.04,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              top: size * 0.02,
              left: size * 0.02,
              opacity: expression === 'sleepy' ? 0 : 1,
            }}
          />
        </div>

        {/* Right eye */}
        <div
          style={{
            position: 'absolute',
            right: size * 0.22,
            top: size * 0.25,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={getEyeStyle('right')} />
          {/* Eye highlight */}
          <div
            style={{
              position: 'absolute',
              width: size * 0.04,
              height: size * 0.04,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              top: size * 0.02,
              left: size * 0.02,
              opacity: expression === 'sleepy' ? 0 : 1,
            }}
          />
        </div>

        {/* Mouth */}
        <div
          style={{
            position: 'absolute',
            bottom: size * 0.15,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <div style={getMouthStyle()} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Face;