export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crow: {
          black: '#0a0a0a',
          panel: '#111111',
          line: '#2a2a2a',
          gold: '#c9a84c',
          red: '#8f3333',
          muted: '#8b8b8b'
        }
      },
      fontFamily: {
        ui: ['Space Grotesk', 'sans-serif'],
        location: ['Crimson Pro', 'serif']
      },
      boxShadow: {
        gold: '0 0 0 1px #c9a84c, 0 0 24px rgba(201, 168, 76, 0.14)'
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(201,168,76,0.65)' },
          '50%': { boxShadow: '0 0 0 1px rgba(201,168,76,1), 0 0 22px rgba(201,168,76,0.22)' }
        }
      },
      animation: {
        pulseGold: 'pulseGold 1.2s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
