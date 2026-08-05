/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        gold: {
          light: '#f3d9a4',
          DEFAULT: '#e8b45a',
          dark: '#d99a2b',
        },
        cream: '#f9f7f4',
        ivory: '#f9f7f4',
        beige: '#f0ede8',
        charcoal: '#1a1a1a',
        taupe: '#8a857f',
      },
      boxShadow: {
        premium: '0 20px 60px rgba(0, 0, 0, 0.08)',
        card: '0 4px 24px rgba(0, 0, 0, 0.06)',
      },
      letterSpacing: {
        widest2: '0.35em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
}
