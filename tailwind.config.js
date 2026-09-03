/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Inspofashions approved design system
        cream: {
          50: '#FDFBF9',
          100: '#F9F6F0',
          200: '#F3EDE5',
        },
        rose: {
          50: '#F5F0ED',
          100: '#E8DAD5',
          200: '#D4B8B1',
          300: '#C48B8B',
          400: '#B07A7A',
        },
        mauve: {
          50: '#F0ECEE',
          100: '#D9CDD2',
          200: '#B8A1A9',
          300: '#9D8A94',
          400: '#8C6B73',
        },
        charcoal: {
          50: '#E8E6E5',
          100: '#B8B4B0',
          200: '#5C5854',
          300: '#3C3935',
          400: '#2D2A2A',
        },
        text: {
          primary: '#2D2A2A',
          secondary: '#8C6B73',
          light: '#C48B8B',
          muted: '#D4B8B1',
        },
        border: {
          light: '#E8E2DA',
          subtle: '#F3EDE5',
          dark: '#D9CDD2',
        },
        background: {
          primary: '#F9F6F0',
          secondary: '#FDFBF9',
          tertiary: '#F3EDE5',
        },
        // Legacy colors for backwards compatibility
        'dusty-rose': '#C48B8B',
        'warm-charcoal': '#2D2A2A',
        'text-primary': '#2D2A2A',
        'text-secondary': '#8C6B73',
        'border-light': '#E8E2DA',
        'offwhite': '#F9F6F0',
        'near-black': '#2D2A2A',
        'black': '#000000',
        'white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-xl': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.005em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'label': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        'caption': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'none': 'none',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
      },
      animation: {
        'slideInMenu': 'slideInMenu 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slideInCart': 'slideInCart 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fadeUp': 'fadeUp 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fadeIn': 'fadeIn 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        'zoom': 'zoom 600ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        slideInMenu: {
          'from': { transform: 'translateX(-100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInCart: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        zoom: {
          'from': { transform: 'scale(1.03)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
