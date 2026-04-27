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
          DEFAULT: '#8B0000',
          hover: '#6B0000',
          50: '#FEF2F2',
          100: '#FDE8E8',
          200: '#FBD5D5',
          500: '#8B0000',
          600: '#6B0000',
          700: '#5A0000',
          800: '#4A0000',
          900: '#3A0000',
        },
        page: '#F5F5F5',
        card: '#FFFFFF',
        sidebar: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
};
