/**
 * ═══════════════════════════════════════════════════════════════
 *  HOMEFIX — DESIGN SYSTEM
 *  "The Digital Atrium" — Luminous Architecture
 *  Version 1.0 — Bénin Edition
 * ═══════════════════════════════════════════════════════════════
 *
 *  USAGE:
 *    import { ds, cn } from '@/lib/design-system'
 *    import type { DSColor, DSSpace } from '@/lib/design-system'
 *
 *  PHILOSOPHY:
 *    — No 1px solid borders for sectioning (use background shifts)
 *    — No pure black (use on_surface: #1a1c1d)
 *    — No pill buttons (except status chips)
 *    — Depth via light, not lines
 *    — Noto Serif for display/body, Inter for labels/metadata
 * ═══════════════════════════════════════════════════════════════
 */

// ── Colour Tokens ─────────────────────────────────────────────────────────────

export const colors = {
  // Landing / Brand (Deep Indigo system)
  primary:           '#000666',
  primaryContainer:  '#1a237e',
  onPrimary:         '#ffffff',
  brand:             '#2d7ff9',   // App accent blue

  // Surfaces (Landing — always light)
  surface:           '#f9f9fb',
  surfaceLow:        '#f3f3f5',
  surfaceLowest:     '#ffffff',
  surfaceHighest:    '#e2e2e4',

  // Text
  onSurface:         '#1a1c1d',
  onSurfaceVar:      '#44474e',
  outlineVariant:    '#c6c5d4',

  // App — Light mode
  appBgPrimary:      '#f0f4f8',
  appBgCard:         '#ffffff',
  appBgSurface:      '#f8fafc',
  appBgInput:        '#ffffff',
  appBorder:         '#e2e8f0',
  appTextPrimary:    '#0f172a',
  appTextSecondary:  '#64748b',
  appTextMuted:      '#94a3b8',

  // App — Dark mode
  darkBgPrimary:     '#0d1b2a',
  darkBgCard:        '#1a2535',
  darkBgSurface:     '#1e2d3d',
  darkBgInput:       '#1e2d3d',
  darkBorder:        '#2a3a4d',
  darkTextPrimary:   '#ffffff',
  darkTextSecondary: '#94a3b8',
  darkTextMuted:     '#64748b',

  // Semantic
  success:  '#22c55e',
  warning:  '#f59e0b',
  error:    '#ef4444',
  info:     '#2d7ff9',
} as const

// ── Gradients ────────────────────────────────────────────────────────────────

export const gradients = {
  /** "Velvet Indigo" — primary CTA hero gradient */
  primary: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)',
  /** Subtle blue for app buttons */
  brand:   'linear-gradient(135deg, #2d7ff9 0%, #1a6ce8 100%)',
  /** Hero overlay for dark sections */
  heroOverlay: 'linear-gradient(180deg, rgba(0,6,102,0.85) 0%, rgba(13,27,42,0.95) 100%)',
} as const

// ── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  /** Static cards — no shadow, use bg shift instead */
  none:    'none',
  /** Ambient — elevated elements (dropdowns, active modals) */
  ambient: '0 20px 40px rgba(26,28,29,0.04), 0 10px 10px rgba(26,28,29,0.02)',
  /** Large — hero cards, opened panels */
  lg:      '0 32px 64px rgba(26,28,29,0.08), 0 16px 32px rgba(26,28,29,0.04)',
  /** Ghost border fallback for accessibility */
  ghostBorder: '0 0 0 1px rgba(198,197,212,0.2)',
} as const

// ── Typography Scale ──────────────────────────────────────────────────────────

export const typography = {
  fonts: {
    serif: "'Noto Serif', Georgia, serif",
    sans:  "'Inter', system-ui, sans-serif",
  },
  sizes: {
    displayLg: '3.5rem',    // Hero headlines — Noto Serif, -0.02em tracking
    displayMd: '2.5rem',    // Section headlines
    displaySm: '1.75rem',   // Card headlines
    titleLg:   '1.25rem',   // Section titles
    titleMd:   '1rem',      // Component titles
    bodyLg:    '1rem',      // Primary body text — Noto Serif, 1.6 line-height
    bodyMd:    '0.875rem',  // Secondary body
    labelMd:   '0.75rem',   // Metadata, captions — Inter
    labelSm:   '0.625rem',  // Micro-labels — Inter
  },
  weights: {
    light:    300,
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },
  tracking: {
    tight:  '-0.02em',  // Display headlines
    normal: '0',
    wide:   '0.05em',   // Labels, metadata
    wider:  '0.15em',   // Small caps labels
  },
  leading: {
    tight:   1.2,
    normal:  1.5,
    relaxed: 1.6,   // Body text — allows text to breathe
    loose:   1.8,
  },
} as const

// ── Spacing Scale (0.7rem base) ───────────────────────────────────────────────

export const spacing = {
  s1:  '0.35rem',
  s2:  '0.7rem',
  s3:  '1rem',
  s4:  '1.4rem',
  s5:  '1.7rem',
  s6:  '2.1rem',
  s8:  '2.8rem',
  s10: '3.5rem',
  s12: '4.2rem',
  s16: '5.5rem',   // Section padding
  s20: '7rem',     // Generous section padding
  s24: '8.4rem',
} as const

// ── Border Radius ─────────────────────────────────────────────────────────────

export const radius = {
  sm:   '0.25rem',  // DEFAULT — "architectural block" (not pill)
  md:   '0.5rem',
  lg:   '0.75rem',
  xl:   '1rem',
  '2xl':'1.5rem',
  chip: '9999px',   // ONLY for small status chips
} as const

// ── Glassmorphism ─────────────────────────────────────────────────────────────

export const glass = {
  /** Floating nav / overlay modals */
  nav:   'backdrop-filter: blur(12px); background: rgba(255,255,255,0.7);',
  modal: 'backdrop-filter: blur(20px); background: rgba(255,255,255,0.7);',
  dark:  'backdrop-filter: blur(16px); background: rgba(13,27,42,0.8);',
} as const

// ── Component Presets ─────────────────────────────────────────────────────────

export const components = {
  button: {
    /** Primary — velvet indigo gradient */
    primary: {
      background: gradients.primary,
      color:      colors.onPrimary,
      borderRadius: radius.sm,
      padding:    `${spacing.s3} ${spacing.s6}`,
      fontFamily: typography.fonts.sans,
      fontSize:   typography.sizes.labelMd,
      fontWeight: typography.weights.semibold,
      letterSpacing: typography.tracking.wide,
    },
    /** Secondary — ghost */
    secondary: {
      background: 'transparent',
      border:     `1px solid rgba(198,197,212,0.2)`,
      color:      colors.primary,
    },
    /** App — brand blue */
    app: {
      background: gradients.brand,
      color:      '#ffffff',
      borderRadius: '1rem',
    },
  },
  input: {
    /** Minimalist tray — bottom border only */
    tray: {
      background:    colors.surfaceLow,
      borderBottom:  `1px solid rgba(198,197,212,0.2)`,
      borderRadius:  `${radius.sm} ${radius.sm} 0 0`,
      padding:       `${spacing.s3} ${spacing.s4}`,
    },
    /** Focus state */
    focus: {
      borderBottom: `2px solid ${colors.primary}`,
    },
  },
  card: {
    /** No shadow — use bg nesting for depth */
    base: {
      background:   colors.surfaceLowest,
      borderRadius: radius.lg,
      padding:      spacing.s5,
    },
  },
} as const

// ── Animation Durations ───────────────────────────────────────────────────────

export const animation = {
  fast:   '150ms',
  normal: '300ms',
  slow:   '500ms',
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in:      'cubic-bezier(0.4, 0, 1, 1)',
    out:     'cubic-bezier(0, 0, 0.2, 1)',
    spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

// ── Utility: cn (classnames merge) ───────────────────────────────────────────

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// ── Export all as ds namespace ────────────────────────────────────────────────

export const ds = {
  colors,
  gradients,
  shadows,
  typography,
  spacing,
  radius,
  glass,
  components,
  animation,
} as const

export type DSColor  = keyof typeof colors
export type DSSpace  = keyof typeof spacing
export type DSRadius = keyof typeof radius
