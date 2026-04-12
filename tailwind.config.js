/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:        '#FF7A3C',
        accent:         '#FFB673',
        'primary-dark': '#C7632D',
        'bg-deep':      '#050608',
        'bg-surface':   '#151A20',
        'surface-1':    '#0B0F12',
        'surface-2':    '#151A20',
        'surface-3':    '#1E2530',
        text:           '#E6EDF7',
        'text-muted':   '#8B95A6',
        success:        '#37D39C',
        warning:        '#FFCC4D',
        danger:         '#FF5A5A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['11px', { lineHeight: '16px' }],
        'sm':   ['13px', { lineHeight: '20px' }],
        'base': ['15px', { lineHeight: '24px' }],
        'lg':   ['18px', { lineHeight: '28px' }],
        'xl':   ['22px', { lineHeight: '32px' }],
        '2xl':  ['28px', { lineHeight: '38px' }],
      },
      borderRadius: {
        glass:      '16px',
        'glass-sm': '10px',
      },
      backdropBlur: {
        glass:         '24px',
        'glass-hover': '28px',
        'glass-max':   '32px',
      },
      boxShadow: {
        glass:     '0 8px 32px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,200,150,0.45)',
        'glass-sm':'0 4px 16px rgba(0,0,0,0.36), 0 0 0 1px rgba(255,200,150,0.18)',
        glow:      '0 0 24px rgba(255,122,60,0.28)',
      },
      transitionDuration: {
        fast: '150',
        base: '220',
        page: '280',
      },
    },
  },
  plugins: [],
}

