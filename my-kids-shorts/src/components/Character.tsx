// Main Character component - body with face, supports multiple shapes and animations
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { KID_THEME } from '../utils/theme';
import { spring, bounce, pop, delay, loop, pingPong, elastic } from '../utils/animations';
import { Face, FaceProps } from './Face';

export type CharacterShape =
  | 'circle'
  | 'square'
  | 'rounded-square'
  | 'star'
  | 'heart'
  | 'cloud'
  | 'blob'
  | 'triangle';

export type CharacterColor =
  | 'pink'
  | 'peach'
  | 'yellow'
  | 'mint'
  | 'lavender'
  | 'sky'
  | 'coral'
  | 'lilac';

interface CharacterProps {
  frame: number;
  fps: number;
  // Shape & appearance
  shape?: CharacterShape;
  color?: CharacterColor;
  size?: number;
  // Face
  face?: Partial<FaceProps>;
  expression?: FaceProps['expression'];
  // Animations
  appearAt?: number;
  bounceAt?: number[];
  float?: boolean;
  floatSpeed?: number;    // seconds per cycle
  floatAmount?: number;   // pixels
  rotate?: boolean;
  rotateSpeed?: number;   // seconds per cycle
  wiggle?: boolean;
  wiggleSpeed?: number;
  wiggleAmount?: number;
  pulse?: boolean;
  pulseSpeed?: number;
  pulseAmount?: number;
  // Position
  x?: number;
  y?: number;
  // Z-index
  zIndex?: number;
  // Opacity
  opacity?: number;
}

const SHAPE_CLIP_PATHS: Record<CharacterShape, string> = {
  circle: 'circle(50% at 50% 50%)',
  square: 'inset(0)',
  'rounded-square': 'inset(0 round 24px)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  heart: 'polygon(50% 0%, 100% 35%, 80% 100%, 50% 70%, 20% 100%, 0% 35%)',
  cloud: 'polygon(20% 60%, 0% 30%, 20% 0%, 50% 0%, 70% 0%, 100% 30%, 80% 60%, 100% 100%, 0% 100%)',
  blob: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  triangle: 'polygon(50% 0%, 100% 100%, 0% 100%)',
};

const Character: React.FC<CharacterProps> = ({
  frame,
  fps,
  shape = 'circle',
  color = 'pink',
  size = 200,
  face = {},
  expression = 'happy',
  appearAt = 0,
  bounceAt = [],
  float = false,
  floatSpeed = 3,
  floatAmount = 15,
  rotate = false,
  rotateSpeed = 20,
  wiggle = false,
  wiggleSpeed = 1.5,
  wiggleAmount = 8,
  pulse = false,
  pulseSpeed = 2,
  pulseAmount = 0.08,
  x = 0,
  y = 0,
  zIndex = 1,
  opacity = 1,
}) => {
  const colorValue = KID_THEME.colors.primary[color];
  const darkColor = KID_THEME.colors.dark[color];

  // Appear animation
  const appearProgress = delay(frame, appearAt, fps, 0.8);
  const appearSpring = spring(appearProgress * fps, fps, 0.8);
  const appearScale = interpolate(appearSpring, [0, 1], [0, 1]);
  const appearOpacity = interpolate(appearProgress, [0, 1], [0, 1]);

  // Float animation (gentle up/down)
  const floatOffset = float
    ? Math.sin(loop(frame, fps, floatSpeed) * Math.PI * 2) * floatAmount
    : 0;

  // Rotation animation
  const rotateAngle = rotate
    ? loop(frame, fps, rotateSpeed) * 360 * 0.15
    : 0;

  // Wiggle animation (side to side)
  const wiggleOffset = wiggle
    ? Math.sin(pingPong(frame, fps, wiggleSpeed) * Math.PI * 2) * wiggleAmount
    : 0;

  // Pulse animation (scale)
  const pulseScale = pulse
    ? 1 + Math.sin(loop(frame, fps, pulseSpeed) * Math.PI * 2) * pulseAmount
    : 1;

  // Bounce animations
  let bounceScale = 1;
  let bounceY = 0;
  for (const bounceFrame of bounceAt) {
    const bounceDelay = delay(frame, bounceFrame, fps, 0.5);
    if (bounceDelay > 0 && bounceDelay < 1) {
      const bn = bounce(bounceDelay * fps, fps, 0.5);
      bounceScale = Math.max(bounceScale, 1 + 0.2 * bn);
      bounceY = Math.min(bounceY, -20 * bn);
    }
  }

  const totalScale = appearScale * bounceScale * pulseScale;
  const totalRotation = `${rotateAngle}deg`;

  // Face size relative to character
  const faceSize = size * 0.55;

  return (
    <AbsoluteFill
      style={{
        zIndex,
        opacity: appearOpacity * opacity,
        transform: `translate(${x + wiggleOffset}px, ${y + floatOffset + bounceY}px) scale(${totalScale}) rotate(${totalRotation})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
      }}
    >
      {/* Character Body */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${size}px`,
          height: `${size}px`,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle at 30% 30%, ${colorValue}EE, ${colorValue} 60%, ${darkColor})`,
          clipPath: SHAPE_CLIP_PATHS[shape],
          boxShadow: `inset 0 -${size * 0.15}px 0 0 ${darkColor}80, 0 ${size * 0.08}px ${size * 0.15}px rgba(0,0,0,0.15)`,
        }}
      >
        {/* Inner highlight for 3D depth */}
        <div
          style={{
            position: 'absolute',
            top: `${size * 0.1}px`,
            left: `${size * 0.15}px`,
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            filter: `blur(${size * 0.06}px)`,
            pointerEvents: 'none',
          }}
        />

        {/* Subtle inner shadow at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: `${size * 0.05}px`,
            left: `${size * 0.2}px`,
            width: `${size * 0.6}px`,
            height: `${size * 0.2}px`,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.08)',
            filter: `blur(${size * 0.04}px)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Face */}
      <Face
        frame={frame}
        fps={fps}
        expression={expression}
        appearAt={appearAt + 10}
        bounceAt={bounceAt}
        blinkAt={face.blinkAt || [30, 90, 150, 210, 270, 330, 390, 450, 510, 570, 630, 690, 750, 810, 870]}
        popAt={face.popAt}
        size={faceSize}
        xOffset={x}
        yOffset={y + bounceY - size * 0.05}
        eyeColor={face.eyeColor}
        cheekColor={face.cheekColor}
        mouthColor={face.mouthColor}
        faceShape={face.faceShape}
        scale={face.scale}
        {...face}
      />
    </AbsoluteFill>
  );
};

export default Character;