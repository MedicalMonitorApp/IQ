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
          DEFAULT: '#001e40',
          dark: '#00142d',
          light: '#003366',
        },
        medical: {
          teal: '#0d9488',
          cyan: '#0284c7',
          blue: '#2563eb',
          emerald: '#10b981',
          rose: '#e11d48',
          amber: '#f59e0b',
        },
        surface: {
          bg: '#f7f9fc',
          card: '#ffffff',
          input: '#f1f5f9',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'card-smooth': '0 12px 32px -8px rgba(0, 30, 64, 0.08)',
        'card-hover': '0 20px 40px -10px rgba(0, 30, 64, 0.14)',
        'pulse-red': '0 0 20px rgba(225, 29, 72, 0.4)',
        'pulse-green': '0 0 20px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}
