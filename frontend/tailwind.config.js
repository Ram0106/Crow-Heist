export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B0F14',
          card: '#121821',
          panel: '#1A2332',
          border: '#1E2738',
          line: '#2A3441',
        },
        accent: {
          primary: '#00FFD1',
          danger: '#FF4D6D',
          gold: '#FFC857',
          purple: '#B56BFF',
          blue: '#5B9BFF',
        },
        text: {
          primary: '#E6EDF3',
          muted: '#7D8590',
          dim: '#4A5568',
        },
        rarity: {
          legendary: '#FFC857',
          epic: '#B56BFF',
          rare: '#5B9BFF',
          uncommon: '#4AE3A5',
          common: '#7D8590',
        },
        crow: {
          black: '#0B0F14',
          panel: '#121821',
          line: '#2A3441',
          gold: '#FFC857',
          red: '#FF4D6D',
          muted: '#7D8590',
        },
      },
      fontFamily: {
        ui: ['Inter', 'Space Grotesk', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        location: ['Crimson Pro', 'serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 255, 209, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 255, 209, 0.2)',
        'glow-gold': '0 0 20px rgba(255, 200, 87, 0.2)',
        'glow-danger': '0 0 20px rgba(255, 77, 109, 0.2)',
        'glow-purple': '0 0 20px rgba(181, 107, 255, 0.2)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 255, 209, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 209, 0.6)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 200, 87, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 200, 87, 0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'scan-line': 'scan-line 3s ease-in-out infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        rotate: 'rotate 4s linear infinite',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        'noise':
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};