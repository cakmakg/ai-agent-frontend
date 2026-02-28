/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a14',
        surface: 'rgba(25, 25, 35, 0.65)',
        primary: '#00f0ff',
        secondary: '#bf00ff',
        success: '#00ffaa',
        warning: '#ffaa00',
        danger: '#ff3366',
        accent: '#6366f1',
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(0, 240, 255, 0.4), 0 0 30px rgba(0, 240, 255, 0.2)',
        'neon-purple': '0 0 15px rgba(191, 0, 255, 0.4), 0 0 30px rgba(191, 0, 255, 0.2)',
        'neon-green': '0 0 15px rgba(0, 255, 170, 0.4), 0 0 30px rgba(0, 255, 170, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.3)' },
        },
      },
    },
  },
  plugins: [],
}
