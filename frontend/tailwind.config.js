import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        ink: {
          950: '#07111f',
          900: '#0b1728',
          800: '#10213a'
        },
        brand: {
          50: '#eefbf8',
          100: '#d7f6ee',
          500: '#19b394',
          600: '#0f9d82',
          700: '#0d7f6a'
        },
        amber: {
          500: '#f59e0b'
        }
      },
      boxShadow: {
        glow: '0 20px 60px rgba(15, 157, 130, 0.18)',
        soft: '0 12px 35px rgba(7, 17, 31, 0.08)'
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
        'hero-gradient': 'linear-gradient(135deg, #07111f 0%, #0b1728 45%, #12314d 100%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeUp: 'fadeUp 0.5s ease-out both'
      }
    }
  },
  plugins: [forms]
};
