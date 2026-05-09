import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Anton"', '"Bebas Neue"', '"Pretendard"', 'sans-serif'],
        body: ['"Pretendard"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Apple SD Gothic Neo"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
        sans: [
          '"Pretendard"',
          "-apple-system",
          "BlinkMacSystemFont",
          "'Apple SD Gothic Neo'",
          "'SF Pro Text'",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // TCRC Design Tokens
        tcrc: {
          bg: {
            primary: "var(--tcrc-bg-primary)",
            inset:   "var(--tcrc-bg-inset)",
            surface: "var(--tcrc-bg-surface)",
            muted:   "var(--tcrc-bg-muted)",
          },
          accent: {
            DEFAULT: "var(--tcrc-accent)",
            hover:   "var(--tcrc-accent-hover)",
            yellow:  "var(--tcrc-accent-yellow)",
            blue:    "var(--tcrc-accent-blue)",
            green:   "var(--tcrc-accent-green)",
            red:     "var(--tcrc-accent-red)",
            lime:    "var(--tcrc-accent-lime)",
          },
          text: {
            primary:   "var(--tcrc-text-primary)",
            secondary: "var(--tcrc-text-secondary)",
            tertiary:  "var(--tcrc-text-tertiary)",
            muted:     "var(--tcrc-text-tertiary)",
            inverted:  "var(--tcrc-text-inverted)",
          },
          status: {
            success: "var(--tcrc-status-success)",
            warning: "var(--tcrc-status-warning)",
            error:   "var(--tcrc-status-error)",
          },
          border: {
            DEFAULT: "var(--tcrc-border)",
            subtle:  "var(--tcrc-border-subtle)",
          },
          divider: "var(--tcrc-divider)",
          line:    "var(--tcrc-line)",
        },
      },
      fontSize: {
        "tcrc-hero":   ["2rem",    { lineHeight: "1.2",  fontWeight: "700" }],
        "tcrc-title1": ["1.5rem",  { lineHeight: "1.2",  fontWeight: "700" }],
        "tcrc-title2": ["1.25rem", { lineHeight: "1.3",  fontWeight: "600" }],
        "tcrc-title3": ["1rem",    { lineHeight: "1.3",  fontWeight: "600" }],
        "tcrc-body":   ["0.875rem",{ lineHeight: "1.5",  fontWeight: "400" }],
        "tcrc-caption":["0.75rem", { lineHeight: "1.4",  fontWeight: "400" }],
        "tcrc-label":  ["0.6875rem",{lineHeight: "1.4",  fontWeight: "500" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "tcrc-xs":   "var(--tcrc-radius-xs)",
        "tcrc-sm":   "var(--tcrc-radius-sm)",
        "tcrc-md":   "var(--tcrc-radius-md)",
        "tcrc-lg":   "var(--tcrc-radius-lg)",
        "tcrc-xl":   "var(--tcrc-radius-xl)",
        "tcrc-2xl":  "var(--tcrc-radius-2xl)",
        "tcrc-full": "var(--tcrc-radius-full)",
      },
      spacing: {
        "tcrc-xs":  "var(--tcrc-spacing-xs)",
        "tcrc-sm":  "var(--tcrc-spacing-sm)",
        "tcrc-md":  "var(--tcrc-spacing-md)",
        "tcrc-lg":  "var(--tcrc-spacing-lg)",
        "tcrc-xl":  "var(--tcrc-spacing-xl)",
        "tcrc-2xl": "var(--tcrc-spacing-2xl)",
        "tcrc-3xl": "var(--tcrc-spacing-3xl)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "pop-in": {
          "0%":   { transform: "scale(0.4)",  opacity: "0" },
          "60%":  { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        "drift-up": {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to:   { transform: "translateY(0)" },
        },
        "marquee": {
          "0%":   { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-100%,0,0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 0.2s ease-out",
        "slide-up":       "slide-up 0.3s ease-out",
        "scale-in":       "scale-in 0.2s ease-out",
        "pop-in":         "pop-in 0.55s cubic-bezier(0.2,1.3,0.4,1) both",
        "drift-up":       "drift-up 0.55s ease-out both",
        "marquee":        "marquee 18s linear infinite",
        "sheet-up":       "sheet-up 0.32s cubic-bezier(0.32,0.72,0,1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
