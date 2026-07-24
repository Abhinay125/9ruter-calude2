// Shape character - base shape with face (circle, square, triangle, star, heart)
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { KID_THEME } from '../utils/theme';
import { spring, bounce, pop, elastic, delay, loop, pingPong } from '../utils/animations';

type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'rounded-square';

interface ShapeCharacterProps {
  frame: number;
  fps: number;
  shape: ShapeType;
  color: keyof typeof KID_THEME.colors.primary;
  size: number;
  // Face
  hasFace?: boolean;
  expression?: 'happy' | 'excited' | 'wink' | 'sleepy' | 'surprised' | 'laugh';
  // Animations
  appearAt?: number;
  float?: boolean;
  floatAmplitude?: number;
  floatSpeed?: number;
  bounceAt?: number[];
  popAt?: number[];
  rotate?: boolean;
  rotateSpeed?: number;
  // Position
  x?: number;
  y?: number;
  // Scale
  scale?: number;
}

const ShapeCharacter: React.FC<ShapeCharacterProps> = ({
  frame,
  fps,
  shape,
  color,
  size = 200,
  hasFace = true,
  expression = 'happy',
  appearAt = 0,
  float = true,
  floatAmplitude = 15,
  floatSpeed = 3,
  bounceAt = [],
  popAt = [],
  rotate = false,
  rotateSpeed = 8,
  x = 0,
  y = 0,
  scale = 1,
}) => {
  const appearProgress = delay(frame, appearAt, fps, 0.6);
  const appearClamped = Math.max(0, Math.min(1, appearProgress));
  const springScale = spring(appearClamped * fps * 0.6, fps, 0.6);

  // Continuous animations
  const floatProgress = loop(frame, fps, floatSpeed);
  const floatY = float ? interpolate(floatProgress, [0, 1], [-floatAmplitude, floatAmplitude]) : 0;

  const pingPongRotate = rotate ? pingPong(frame, fps, rotateSpeed) * 20 - 10 : 0;

  // Bounce triggers
  let bounceScale = 1;
  for (const bounceFrame of bounceAt) {
    const bounceProg = delay(frame, bounceFrame, fps, 0.4);
    if (bounceProg > 0 && bounceProg <= 1) {
      bounceScale *= bounce(bounceProg * fps * 0.4, fps, 0.4) * 0.3 + 1;
    }
  }

  // Pop triggers
  let popScale = 1;
  for (const popFrame of popAt) {
    const popProg = delay(frame, popFrame, fps, 0.3);
    if (popProg > 0 && popProg <= 1) {
      popScale *= pop(popProg * fps * 0.3, fps, 0.3) * 0.5 + 1;
    }
  }

  // Color values
  const primaryColor = KID_THEME.colors.primary[color];
  const darkColor = KID_THEME.colors.dark[color];

  // Build shape path
  const getShapePath = (s: number) => {
    const half = s / 2;
    const r = half * 0.9;

    switch (shape) {
      case 'circle':
        return `circle(${r}px at center)`;
      case 'square':
        return `inset(0 round 0)`;
      case 'rounded-square':
        return `inset(0 round ${s * 0.25}px)`;
      case 'triangle':
        return `polygon(50% 0%, 0% 100%, 100% 100%)`;
      case 'star':
        return `polygon(
          50% 0%,
          61% 35%,
          98% 35%,
          68% 57%,
          79% 91%,
          50% 70%,
          21% 91%,
          32% 57%,
          2% 35%,
          39% 35%
        )`;
      case 'heart':
        return `path('M ${half} ${s * 0.3} C ${half} ${s * 0.1} ${s * 0.9} ${s * 0.1} ${s * 0.9} ${half} C ${s * 0.9} ${s * 0.75} ${half} ${s * 0.95} ${half} ${s * 0.95} C ${half} ${s * 0.95} ${s * 0.1} ${s * 0.75} ${s * 0.1} ${half} C ${s * 0.1} ${s * 0.1} ${half} ${s * 0.1} ${half} ${s * 0.3}')`;
      default:
        return `circle(${r}px at center)`;
    }
  };

  // Face components
  const Eye = ({ offsetX = 0, offsetY = 0, scale: eyeScale = 1, blink = false }: {
    offsetX?: number;
    offsetY?: number;
    scale?: number;
    blink?: boolean;
  }) => (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${eyeScale})`,
        width: `${size * 0.12}px`,
        height: blink ? `${size * 0.02}px` : `${size * 0.12}px`,
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
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${size * 0.15}px)`,
        width: `${size * 0.1}px`,
        height: `${size * 0.1}px`,
        borderRadius: '50%',
        background: KID_THEME.colors.cheek,
        opacity: 0.6,
      }}
    />
  );

  const Mouth = () => {
    const mouthStyles: Record<string, React.CSSProperties> = {
      happy: {
        width: `${size * 0.18}px`,
        height: `${size * 0.12}px`,
        borderRadius: '0 0 50% 50%',
        border: `${size * 0.025}px solid ${KID_THEME.colors.mouth}`,
        borderTop: 'none',
        background: 'transparent',
      },
      excited: {
        width: `${size * 0.22}px`,
        height: `${size * 0.15}px`,
        borderRadius: '50%',
        border: `${size * 0.025}px solid ${KID_THEME.colors.mouth}`,
        borderTop: 'none',
        background: 'transparent',
      },
      laugh: {
        width: `${size * 0.25}px`,
        height: `${size * 0.18}px`,
        borderRadius: '0 0 50% 50%',
        border: `${size * 0.03}px solid ${KID_THEME.colors.mouth}`,
        borderTop: 'none',
        background: 'transparent',
      },
      surprised: {
        width: `${size * 0.12}px`,
        height: `${size * 0.12}px`,
        borderRadius: '50%',
        border: `${size * 0.025}px solid ${KID_THEME.colors.mouth}`,
        background: 'transparent',
      },
      sleepy: {
        width: `${size * 0.15}px`,
        height: `${size * 0.02}px`,
        borderRadius: `${size * 0.01}px`,
        background: KID_THEME.colors.mouth,
      },
      wink: {
        width: `${size * 0.18}px`,
        height: `${size * 0.12}px`,
        borderRadius: '0 0 50% 50%',
        border: `${size * 0.025}px solid ${KID_THEME.colors.mouth}`,
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
          transform: 'translate(-50%, -50%) translateY(15%)',
          ...mouthStyles[expression],
        }}
      />
    );
  };

  const WinkEye = ({ offsetX = 0 }: { offsetX?: number }) => (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${offsetX}px, -${size * 0.08}px)`,
        width: `${size * 0.14}px`,
        height: `${size * 0.02}px`,
        borderRadius: `${size * 0.01}px`,
        background: KID_THEME.colors.eye,
      }}
    />
  );

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
          transform: `translate(${x}px, ${y + floatY}px) scale(${springScale * bounceScale * popScale * scale}) rotate(${pingPongRotate}deg)`,
          transformOrigin: 'center center',
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* Shape body */}
        <div
          style={{
            width: '100%',
            height: '100%',
            clipPath: getShapePath(size),
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${darkColor} 100%)`,
            boxShadow: `
              inset 0 -${size * 0.08}px ${size * 0.15}px rgba(0,0,0,0.15),
              0 ${size * 0.06}px ${size * 0.12}px rgba(0,0,0,0.1),
              0 ${size * 0.02}px ${size * 0.04}px rgba(0,0,0,0.05)
            `,
            position: 'relative',
            borderRadius: shape === 'rounded-square' ? `${size * 0.25}px` : shape === 'square' ? '0' : undefined,
          }}
        >
          {/* Inner highlight */}
          <div
            style={{
              position: 'absolute',
              top: `${size * 0.1}px`,
              left: `${size * 0.1}px`,
              width: `${size * 0.3}px`,
              height: `${size * 0.3}px`,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
              filter: `blur(${size * 0.1}px)`,
              pointerEvents: 'none',
            }}
          />

          {/* Face */}
          {hasFace && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {expression === 'wink' ? (
                <>
                  <WinkEye offsetX={-size * 0.12} />
                  <Eye offsetX={size * 0.12} offsetY={-size * 0.05} />
                </>
              ) : expression === 'sleepy' ? (
                <>
                  <Eye offsetX={-size * 0.12} offsetY={-size * 0.05} blink />
                  <Eye offsetX={size * 0.12} offsetY={-size * 0.05} blink />
                </>
              ) : (
                <>
                  <Eye offsetX={-size * 0.12} offsetY={-size * 0.05} />
                  <Eye offsetX={size * 0.12} offsetY={-size * 0.05} />
                </>
              )}

              <Cheek offsetX={-size * 0.2} />
              <Cheek offsetX={size * 0.2} />

              <Mouth />
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ShapeCharacter;