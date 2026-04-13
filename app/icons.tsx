/**
 * FIREWALL — Icon Library
 * Uses react-native-svg with proper Heroicons / Phosphor paths.
 * Install: npx expo install react-native-svg
 *          — or —
 *          yarn add react-native-svg && npx pod-install
 */
import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Line,
  Polyline,
  Ellipse,
  ClipPath,
  Defs,
} from 'react-native-svg';

interface IconProps {
  size?:  number;
  color?: string;
  strokeWidth?: number;
}

const DEFAULT_SIZE  = 24;
const DEFAULT_COLOR = '#1F3864';
const DEFAULT_SW    = 1.75;

// ─── Shield (brand) ───────────────────────────────────────────────────────────
export const ShieldIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L3 6.5V11c0 5.25 3.75 10.15 9 11.5 5.25-1.35 9-6.25 9-11.5V6.5L12 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12l2 2 4-4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Shield — filled variant for logo block
export const ShieldFilledIcon = ({
  size  = DEFAULT_SIZE,
  color = '#FFFFFF',
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L3 6.5V11c0 5.25 3.75 10.15 9 11.5 5.25-1.35 9-6.25 9-11.5V6.5L12 2z"
      fill={color}
      fillOpacity={0.15}
    />
    <Path
      d="M12 2L3 6.5V11c0 5.25 3.75 10.15 9 11.5 5.25-1.35 9-6.25 9-11.5V6.5L12 2z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12l2 2 4-4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Eye ──────────────────────────────────────────────────────────────────────
export const EyeIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const EyeOffIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.12 14.12a3 3 0 11-4.24-4.24"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="1" y1="1" x2="23" y2="23"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ─── Check ────────────────────────────────────────────────────────────────────
export const CheckIcon = ({
  size  = DEFAULT_SIZE,
  color = '#FFFFFF',
  strokeWidth = 2.5,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 13l4 4L19 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Fingerprint ──────────────────────────────────────────────────────────────
export const FingerprintIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 10a2 2 0 00-2 2c0 1.02-.1 2.51-.26 4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.9 2.1A10 10 0 0122 12c0 2.3-.4 4.5-1.1 6.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.6 4.6A9.96 9.96 0 002 12c0 2.5.5 4.9 1.3 7.1"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 12a4 4 0 018 0c0 1.5-.1 3.1-.4 4.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 12a4.1 4.1 0 00-.08-.78"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.5 12c0 .6 0 1.2-.06 1.82"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 12v.01"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ─── Face ID ──────────────────────────────────────────────────────────────────
export const FaceIdIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Corners */}
    <Path d="M3 7V4a1 1 0 011-1h3"       stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M17 3h3a1 1 0 011 1v3"      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M21 17v3a1 1 0 01-1 1h-3"   stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M7 21H4a1 1 0 01-1-1v-3"    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Eyes */}
    <Path d="M9 10h.01"  stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M15 10h.01" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    {/* Nose */}
    <Path d="M12 10v3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Mouth */}
    <Path
      d="M9 16c.83.83 2 1.33 3 1.33s2.17-.5 3-1.33"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Lock ─────────────────────────────────────────────────────────────────────
export const LockIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3" y="11"
      width="18" height="11"
      rx="2" ry="2"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M7 11V7a5 5 0 0110 0v4"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Mail ─────────────────────────────────────────────────────────────────────
export const MailIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="22,6 12,13 2,6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Arrow Right ──────────────────────────────────────────────────────────────
export const ArrowRightIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12h14M12 5l7 7-7 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Zero-Knowledge ───────────────────────────────────────────────────────────
export const ZeroKnowledgeIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L3 6.5V11c0 5.25 3.75 10.15 9 11.5 5.25-1.35 9-6.25 9-11.5V6.5L12 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 8v2M12 14v2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// ─── User / Person ────────────────────────────────────────────────────────────
export const UserIcon = ({
  size  = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = DEFAULT_SW,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="12" cy="7" r="4"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);