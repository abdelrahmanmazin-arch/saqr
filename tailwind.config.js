/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand
        saqr: {
          gold:         '#C5A028',
          navy:         '#1B2F5B',
          'navy-light': '#2A4480',
        },
        // Portal accents
        commercial: '#1B4F72',
        cd: { DEFAULT: '#991B1B', light: '#FEF2F2' },
        insurance:  '#0F1F3D',
        // Risk bands
        risk: {
          low:      '#16A34A',
          medium:   '#D97706',
          high:     '#DC2626',
          critical: '#7F1D1D',
        },
      },
    },
  },
  plugins: [],
}
