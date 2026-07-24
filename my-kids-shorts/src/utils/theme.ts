// Kid-friendly theme configuration
export const KID_THEME = {
  colors: {
    // Primary pastel colors (kid-friendly)
    primary: {
      pink: '#FFB3D1',
      peach: '#FFD6A5',
      yellow: '#FFF8B3',
      mint: '#B8E5B8',
      lavender: '#D8B4FE',
      sky: '#A5D8FF',
      coral: '#FFB5A7',
      lilac: '#E0BEFE',
    },
    // Darker shades for shadows/outlines
    dark: {
      pink: '#E89CC0',
      peach: '#E8C190',
      yellow: '#E8E0A0',
      mint: '#A0D0A0',
      lavender: '#C0A0E8',
      sky: '#8CC8F0',
      coral: '#E8A090',
      lilac: '#C8A8E8',
    },
    // Neutral colors
    white: '#FFFFFF',
    offWhite: '#FFFDF5',
    cream: '#FFF8E7',
    lightGray: '#F5F5F0',
    gray: '#D0D0C8',
    darkGray: '#6B6B60',
    black: '#2D2D28',
    // Face colors
    eye: '#2D2D28',
    mouth: '#2D2D28',
    cheek: '#FFB3D1',
  },

  // Kid-friendly fonts (available on Google Fonts)
  fonts: {
    primary: '"Fredoka", "Nunito", "Quicksand", system-ui, sans-serif',
    display: '"Fredoka One", "Fredoka", "Nunito", sans-serif',
    mono: '"Space Mono", monospace',
  },

  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },

  // Video dimensions (YouTube Shorts: 1080x1920)
  video: {
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 30 * 30, // 30 seconds max for Shorts
  },

  // Shorts safe zones
  safeZones: {
    top: 250,      // Avoid YouTube UI at top
    bottom: 350,   // Avoid caption/UI at bottom
    sides: 80,     // Safe margins on sides
  },
};

// Helper to get safe area
export const SAFE_AREA = {
  top: KID_THEME.safeZones.top,
  bottom: KID_THEME.video.height - KID_THEME.safeZones.bottom,
  left: KID_THEME.safeZones.sides,
  right: KID_THEME.video.width - KID_THEME.safeZones.sides,
  width: KID_THEME.video.width - KID_THEME.safeZones.sides * 2,
  height: KID_THEME.video.height - KID_THEME.safeZones.top - KID_THEME.safeZones.bottom,
};

// Animation presets for kids content (bouncy, playful)
export const KID_ANIMATIONS = {
  // Bouncy entrance
  bounceIn: { duration: 0.6, ease: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  // Gentle float
  float: { duration: 3, ease: 'ease-in-out' },
  // Quick pop
  pop: { duration: 0.3, ease: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  // Elastic stretch
  elastic: { duration: 0.8, ease: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  // Slow gentle pulse
  pulse: { duration: 2, ease: 'ease-in-out' },
};

export type KidTheme = typeof KID_THEME;