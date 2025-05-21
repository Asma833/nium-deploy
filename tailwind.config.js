/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        custom: {
          primary: '#fd0194',
          tablehead: '#f9fafc',
          content: '#f9fafc',
          background: '#ffffff',
          active: '#747474',
          title: '#000000',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      filter: {
        'invert-dark': 'invert(1)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  plugins: [
    tailwindcssAnimate,
    function ({ addUtilities }) {
      addUtilities({
        '.invert-in-dark': {
          '@apply dark:invert': {},
        },
        '.bg-pending-badge-bg': {
          'background-color': 'var(--pending-badge-bg)',
        },
        '.bg-approved-badge-bg': {
          'background-color': 'var(--approved-badge-bg)',
        },
        '.bg-rejected-badge-bg': {
          'background-color': 'var(--rejected-badge-bg)',
        },
        '.bg-expired-badge-bg': {
          'background-color': 'var(--expired-badge-bg)',
        },
        '.bg-completed-badge-bg': {
          'background-color': 'var(--approved-badge-bg)',
        },
        '.bg-not-required-badge-bg': {
          'background-color': 'var(--optional)',
        },
        '.bg-not-generated-badge-bg': {
          'background-color': 'var(--pending-badge-bg)',
        },
        '.text-badge-fg': {
          color: 'var(--badge-fg)',
        },
      });
    },
  ],
};
