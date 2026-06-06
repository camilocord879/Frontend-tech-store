/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // dark mode via clase .dark en el <html>
  theme: {
    extend: {
      colors: {
        // Paleta principal TechStore
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo principal
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316', // Naranja CTA
          600: '#ea580c',
        },
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        // Tipografía premium: display + body
        display: ['"DM Sans"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card':    '0 2px 8px 0 rgba(0,0,0,.06), 0 1px 2px 0 rgba(0,0,0,.04)',
        'card-md': '0 4px 16px 0 rgba(0,0,0,.10), 0 2px 4px 0 rgba(0,0,0,.06)',
        'card-lg': '0 8px 32px 0 rgba(0,0,0,.12), 0 4px 8px 0 rgba(0,0,0,.08)',
        'glow':    '0 0 24px 4px rgba(99,102,241,.25)',
      },
      animation: {
        'fade-in':     'fadeIn .3s ease-out',
        'slide-up':    'slideUp .35s ease-out',
        'slide-down':  'slideDown .3s ease-out',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':     'shimmer 1.6s infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown:{ from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:  { '0%': { backgroundPosition: '-700px 0' }, '100%': { backgroundPosition: '700px 0' } },
      },
    },
  },
  plugins: [],
}