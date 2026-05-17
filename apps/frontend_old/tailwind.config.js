/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // دعم Dark Mode
  theme: {
    extend: {
      // الألوان المحسّنة
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        secondary: '#8b5cf6',
        'secondary-dark': '#7c3aed',
        dark: '#020617',
        card: '#0f172a',
      },
      
      // الخطوط
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // الظلال
      boxShadow: {
        glow: '0 0 40px rgba(99,102,241, 0.35)',
        'glow-lg': '0 0 60px rgba(99,102,241, 0.5)',
        'card': '0 10px 40px -5px rgba(0, 0, 0, 0.3)',
      },
      
      // الحركات
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}