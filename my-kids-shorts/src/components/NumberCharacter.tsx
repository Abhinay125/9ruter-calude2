// Number character - number with face and animations
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { KID_THEME } from '../utils/theme';
import { spring, bounce, pop, elastic, delay, loop, pingPong } from '../utils/animations';

interface NumberCharacterProps {
  frame: number;
  fps: number;
  number: number;
  color: keyof typeof KID_THEME.colors.primary;
  size: number;
  // Animation
  appearAt?: number;
  bounceAt?: number[];
  popAt?: number[];
  float?: boolean;
  floatAmplitude?: number;
  floatSpeed?: number;
  // Face
  hasFace?: boolean;
  expression?: 'happy' | 'excited' | 'wink' | 'sleepy' | 'surprised' | 'laugh';
  // Position
  x?: number;
  y?: number;
  scale?: number;
}

const NumberCharacter: React.FC<NumberCharacterProps> = ({
  frame,
  fps,
  number,
  color,
  size = 180,
  appearAt = 0,
  bounceAt = [],
  popAt = [],
  float = true,
  floatAmplitude = 12,
  floatSpeed = 4,
  hasFace = true,
  expression = 'happy',
  x = 0,
  y = 0,
  scale = 1,
}) => {
  const appearProgress = delay(frame, appearAt, fps, 0.5);
  const appearClamped = Math.max(0, Math.min(1, appearProgress));
  const springScale = spring(appearClamped * fps * 0.5, fps, 0.5);

  const floatProgress = loop(frame, fps, floatSpeed);
  const floatY = float ? interpolate(floatProgress, [0, 1], [-floatAmplitude, floatAmplitude]) : 0;

  // Bounce triggers
  let bounceScale = 1;
  for (const bounceFrame of bounceAt) {
    const bounceProg = delay(frame, bounceFrame, fps, 0.35);
    if (bounceProg > 0 && bounceProg <= 1) {
      bounceScale *= bounce(bounceProg * fps * 0.35, fps, 0.35) * 0.25 + 1;
    }
  }

  // Pop triggers
  let popScale = 1;
  for (const popFrame of popAt) {
    const popProg = delay(frame, popFrame, fps, 0.25);
    if (popProg > 0 && popProg <= 1) {
      popScale *= pop(popProg * fps * 0.25, fps, 0.25) * 0.4 + 1;
    }
  }

  const primaryColor = KID_THEME.colors.primary[color];
  const darkColor = KID_THEME.colors.dark[color];

  // Face components
  const Eye = ({ offsetX = 0, offsetY = 0, blink = false }: {
    offsetX?: number;
    offsetY?: number;
    blink?: boolean;
  }) => (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
        width: `${size * 0.11}px`,
        height: blink ? `${size * 0.02}px` : `${size * 0.11}px`,
        borderRadius: '50%',
        background: KID_THEME.colors.eye,
        transition: 'height 0.05s ease',
      }}
    />
  );

  const Cheek = ({ offsetX = 0 }: { offsetX?: number }) => (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${size * 0.12}px)`,
        width: `${size * 0.09}px`,
        height: `${size * 0.09}px`,
        borderRadius: '50%',
        background: KID_THEME.colors.cheek,
        opacity: 0.6,
      }}
    />
  );

  const Mouth = () => {
    const mouthStyles: Record<string, React.CSSProperties> = {
      happy: {
        width: `${size * 0.16}px`,
        height: `${size * 0.1}px`,
        borderRadius: '0 0 50% 50%',
        border: `${size * 0.02}px solid ${KID_THEME.colors.mouth}`,
        borderTop: 'none',
        background: 'transparent',
      },
      excited: {
        width: `${size * 0.2}px`,
        height: `${size * 0.13}px`,
        borderRadius: '50%',
        border: `${size * 0.02}px solid ${KID_THEME.colors.mouth}`,
        borderTop: 'none',
        background: 'transparent',
      },
      laugh: {
        width: `${size * 0.22}px`,
        height: `${size * 0.15}px`,
        borderRadius: '0 0 50% 50%',
        border: `${size * 0.025}px solid ${KID_THEME.colors.mouth}`,
        borderTop: 'none',
        background: 'transparent',
      },
      surprised: {
        width: `${size * 0.1}px`,
        height: `${size * 0.1}px`,
        borderRadius: '50%',
        border: `${size * 0.02}px solid ${KID_THEME.colors.mouth}`,
        background: 'transparent',
      },
      sleepy: {
        width: `${size * 0.13}px`,
        height: `${size * 0.015}px`,
        borderRadius: `${size * 0.008}px`,
        background: KID_THEME.colors.mouth,
      },
      wink: {
        width: `${size * 0.16}px`,
        height: `${size * 0.1}px`,
        borderRadius: '0 0 50% 50%',
        border: `${size * 0.02}px solid ${KID_THEME.colors.mouth}`,
        borderTop: 'none',
        background: 'transparent',
      },
    };

    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) translateY(12%)',
          ...mouthStyles[expression],
        }}
      />
    );
  };

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `translate(${x}px, ${y + floatY}px) scale(${springScale * bounceScale * popScale * scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Number shape with gradient */}
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: KID_THEME.fonts.display,
            fontSize: `${size * 0.55}px`,
            fontWeight: 800,
            color: KID_THEME.colors.white,
            textShadow: `
              0 ${size * 0.03}px ${size * 0.06}px rgba(0,0,0,0.2),
              0 ${size * 0.01}px ${size * 0.02}px rgba(0,0,0,0.1)
            `,
            position: 'relative',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${darkColor} 100%)`,
            borderRadius: `${size * 0.22}px`,
            boxShadow: `
              inset 0 -${size * 0.07}px ${size * 0.12}px rgba(0,0,0,0.15),
              0 ${size * 0.05}px ${size * 0.1}px rgba(0,0,0,0.1),
              0 ${size * 0.02}px ${size * 0.03}px rgba(0,0,0,0.05)
            `,
          }}
        >
          {number}

          {/* Inner highlight */}
          <div
            style={{
              position: 'absolute',
              top: `${size * 0.08}px`,
              left: `${size * 0.08}px`,
              width: `${size * 0.25}px`,
              height: `${size * 0.25}px`,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              filter: `blur(${size * 0.08}px)`,
              pointerEvents: 'none',
            }}
          />

          {/* Face */}
          {hasFace && (
            <div style={{ position: 'relative', zIndex: 2 }}>
              {expression === 'wink' ? (
                <>
                  <Eye offsetX={-size * 0.1} offsetY={-size * 0.08} blink />
                  <Eye offsetX={size * 0.1} offsetY={-size * 0.08} />
                </>
              ) : expression === 'sleepy' ? (
                <>
                  <Eye offsetX={-size * 0.1} offsetY={-size * 0.08} blink />
                  <Eye offsetX={size * 0.1} offsetY={-size * 0.08} blink />
                </>
              ) : (
                <>
                  <Eye offsetX={-size * 0.1} offsetY={-size * 0.08} />
                  <Eye offsetX={size * 0.1} offsetY={-size * 0.08} />
                </>
              )}

              <Cheek offsetX={-size * 0.18} />
              <Cheek offsetX={size * 0.18} />

              <Mouth />
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default NumberCharacter;