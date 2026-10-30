/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ========== SOFT LUXURY PRIMARY PALETTE ==========
        // Warm ivory/cream base
        ivory: {
          50: '#fdfbf8',
          100: '#f8f5f0',  // Primary background
          200: '#f0ebe6',
          300: '#e8dfd8',
        },
        
        // Soft cream secondary
        cream: {
          50: '#fffef9',
          100: '#fefbf3',
          150: '#fdf8f1',
          200: '#fdf5ed',
          300: '#fce8e0',
        },
        
        // Soft nude/taupe (warm mid-tone)
        nude: {
          100: '#f5ede8',
          200: '#ede3dd',
          300: '#e8d9d0',
          400: '#ddc9bf',
        },
        
        // Dusty rose (brand accent)
        rose: {
          50: '#fdf6f5',
          100: '#f9eceb',
          150: '#f5dcd9',
          200: '#f0ccc8',
          250: '#edbfb6',
          300: '#e8b5ad',
          400: '#d99a8f',
          500: '#c8846e',
        },
        
        // Muted mocha (warm accent)
        mocha: {
          100: '#f0ebe6',
          200: '#e5d9ce',
          300: '#d5b2a7',
          400: '#c09984',
          500: '#a67c5f',
        },
        
        // Espresso/dark brown (primary text)
        espresso: {
          50: '#f7f5f4',
          100: '#ede8e6',
          200: '#d9cfc9',
          300: '#8b7570',
          400: '#6b5552',
          500: '#5a4a46',
          600: '#3d2f2c',  // Primary text
          700: '#2a1f1d',
          800: '#1c1410',
        },
        
        // Text color utilities (based on espresso)
        text: {
          primary: '#2a1f1d',      // Near-black, warm brown
          secondary: '#6b5552',    // Mid-tone brown
          light: '#8b7570',        // Light brown
          muted: '#b8aca8',        // Very light brown
          disabled: '#d0c4c0',
          white: '#ffffff',
          inverse: '#ffffff',
        },
        
        // Border colors (very subtle)
        border: {
          light: '#ede8e6',      // Light border
          subtle: '#f5ede8',     // Very subtle border
          divider: '#e5d9ce',    // Divider line
        },
        
        // Legacy palette for backward compatibility
        brand: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
        },
        
        warm: {
          50: '#fdf8f6',
          100: '#f9f1ed',
          200: '#f2e8e1',
          300: '#e8d6cc',
          400: '#d4b9a7',
          500: '#bc9a84',
        },
      },
      
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      
      fontSize: {
        // ========== EDITORIAL TYPOGRAPHY SCALE ==========
        // Headings (serif)
        'h1': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '400' }],      // 56px
        'h2': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '400' }],      // 40px
        'h3': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],     // 30px
        'h4': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],       // 24px
        
        // Body (sans)
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0em' }],                       // 18px
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0em' }],                               // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0em' }],                       // 14px
        
        // Labels & captions
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '600' }],    // 12px
        'caption': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.15em', fontWeight: '600' }], // 11px
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'xs': '2px',
        'sm': '3px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'soft': '0 2px 6px rgba(0, 0, 0, 0.05)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'none': 'none',
      },
      
      animation: {
        'slideInMenu': 'slideInMenu 260ms ease-out',
        'slideInCart': 'slideInCart 260ms ease-out',
        'fadeUp': 'fadeUp 600ms ease-out',
        'fadeIn': 'fadeIn 800ms ease-out',
        'zoom': 'zoom 1200ms ease-out',
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
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        zoom: {
          'from': { transform: 'scale(1.05)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
