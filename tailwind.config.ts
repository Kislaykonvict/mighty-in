import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080C14',
          surface: '#0F1626',
          card: '#141D30',
          cardHover: '#1B2740',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
          text: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B',
          accent: '#38BDF8',
          crimson: '#C52233',
          crimsonHover: '#B01B2A',
          navy: '#1F3A60',
          royal: '#2563EB',
        },
        growth: {
          DEFAULT: '#FF5E3A',
          hover: '#FF451A',
          subtle: 'rgba(255, 94, 58, 0.12)',
          border: 'rgba(255, 94, 58, 0.25)',
          glow: 'rgba(255, 94, 58, 0.35)',
          light: '#FFF1EE',
          dark: '#1C0D0A',
        },
        tech: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          subtle: 'rgba(59, 130, 246, 0.12)',
          border: 'rgba(59, 130, 246, 0.25)',
          glow: 'rgba(59, 130, 246, 0.35)',
          cyan: '#06B6D4',
          light: '#EFF6FF',
          dark: '#0A1526',
        },
        talent: {
          DEFAULT: '#10B981',
          hover: '#059669',
          subtle: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.25)',
          glow: 'rgba(16, 185, 129, 0.35)',
          light: '#ECFDF5',
          dark: '#091E18',
        },
        momentum: {
          purple: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'subtle-grid': "radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      screens: {
        'xs': '480px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
