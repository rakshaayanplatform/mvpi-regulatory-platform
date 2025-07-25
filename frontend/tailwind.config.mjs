/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Color palette
      colors: {
        primary: '#2563eb',
        secondary: '#22c55e',
        accent: '#f59e42',
        error: '#ef4444',
        warning: '#f59e42',
        info: '#2563eb',
        success: '#22c55e',
        disabled: '#cbd5e1',
        background: '#f9fafb',
        surface: '#ffffff',
        overlay: 'rgba(0,0,0,0.08)',
        'overlay-16': 'rgba(0,0,0,0.16)',
        'text-primary': '#1e293b',
        'text-muted': '#64748b',
        'text-inverse': '#ffffff',
        'text-error': '#ef4444',
        'text-success': '#22c55e',
        'text-warning': '#f59e42',
        'text-disabled': '#cbd5e1',
        'border': '#e5e7eb',
        'border-focus': '#2563eb',
        'border-error': '#ef4444',
        'border-success': '#22c55e',
        'border-disabled': '#cbd5e1',
      },
      // Font family
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
      },
      // Font sizes and line heights
      fontSize: {
        h1: ['36px', { lineHeight: '40.5px', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '32px', fontWeight: '700' }],
        h3: ['22px', { lineHeight: '26px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '24px', fontWeight: '400' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        button: ['16px', { lineHeight: '20px', fontWeight: '600' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      // Box shadows
      boxShadow: {
        'sm': '0px 1px 4px rgba(0,0,0,0.08)',
        'md': '0px 4px 16px rgba(0,0,0,0.12)',
        'lg': '0px 8px 32px rgba(0,0,0,0.16)',
        'focus': '0px 0px 8px #2563eb',
        'overlay': '0 0 0 9999px rgba(0,0,0,0.16)',
      },
      // Spacing scale (8px grid)
      spacing: {
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '48px',
        6: '64px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
} 