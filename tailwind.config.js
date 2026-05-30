/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5f7',
          100: '#e1ecef',
          200: '#c3d9df',
          300: '#a5c6cf',
          400: '#6b9fb0',
          500: '#387478',
          600: '#325f69',
          700: '#2c5560',
          800: '#243642',
          900: '#1a2630',
        },
        secondary: '#387478',
        accent: '#629584',
        light: '#E2F1E7',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-slight': 'bounceSlite 2s infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSlite: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      gradientColorStops: {
        'dark-start': '#243642',
        'dark-end': '#387478',
      },
    },
  },
  plugins: [],
}
