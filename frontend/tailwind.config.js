/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // DEFINIZIONE COLORI PREMIUM
      colors: {
        brand: {
          red: '#C13C37',      // Un rosso pomodoro più profondo e caldo
          redDark: '#9A2E2A',  // Per hover e accenti scuri
          gold: '#EFB75B',     // Colore crosta dorata/formaggio
          cream: '#F9F6F0',    // Sfondo caldo, non bianco puro
          dark: '#2D2424',     // Un nero morbido, color caffè
        }
      },
      // DEFINIZIONE FONT (Li importeremo nel CSS)
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'], // Elegante per i titoli
        body: ['"DM Sans"', 'sans-serif'],       // Pulito per i testi
      },
      // ANIMAZIONI CUSTOM TAILWIND (Per cose semplici continue)
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.1)', // Ombra più morbida e profonda
      }
    },
  },
  plugins: [],
}