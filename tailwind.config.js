/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0F8B6D', 50: '#EAF6F2', 100: '#CFEBE3', 600: '#0F8B6D', 700: '#0B7059', 800: '#075B49' },
        navy: { DEFAULT: '#12263A', 700: '#1D3650' },
        canvas: '#FAF9F6',
        ink: { DEFAULT: '#12263A', soft: '#475569', muted: '#64748B' },
        line: '#E5E3DC',
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'] },
      boxShadow: { card: '0 1px 2px rgba(18,38,58,.06)', lift: '0 6px 18px rgba(18,38,58,.08)' },
    },
  },
  plugins: [],
}
