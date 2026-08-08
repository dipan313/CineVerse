/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#080b11',
          surface: '#0f1420',
          card: '#141b2d',
          border: 'rgba(255, 255, 255, 0.08)',
          cyan: '#00f0ff',
          purple: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          pink: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glowPulse 6s ease-in-out infinite alternate',
        'float-slow': 'floatSlow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        glowPulse: {
          '0%': { opacity: '0.2', transform: 'scale(1)' },
          '100%': { opacity: '0.35', transform: 'scale(1.1)' },
        },
        floatSlow: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
