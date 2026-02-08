import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
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
					glow: 'hsl(var(--primary-glow))',
					50: 'hsl(var(--primary-50))',
					100: 'hsl(var(--primary-100))',
					200: 'hsl(var(--primary-200))',
					300: 'hsl(var(--primary-300))',
					400: 'hsl(var(--primary-400))',
					500: 'hsl(var(--primary-500))',
					600: 'hsl(var(--primary-600))',
					700: 'hsl(var(--primary-700))',
					800: 'hsl(var(--primary-800))',
					900: 'hsl(var(--primary-900))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					50: 'hsl(var(--secondary-50))',
					100: 'hsl(var(--secondary-100))',
					200: 'hsl(var(--secondary-200))',
					300: 'hsl(var(--secondary-300))',
					400: 'hsl(var(--secondary-400))',
					500: 'hsl(var(--secondary-500))',
					600: 'hsl(var(--secondary-600))',
					700: 'hsl(var(--secondary-700))',
					800: 'hsl(var(--secondary-800))',
					900: 'hsl(var(--secondary-900))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					50: 'hsl(var(--accent-50))',
					100: 'hsl(var(--accent-100))',
					200: 'hsl(var(--accent-200))',
					300: 'hsl(var(--accent-300))',
					400: 'hsl(var(--accent-400))',
					500: 'hsl(var(--accent-500))',
					600: 'hsl(var(--accent-600))',
					700: 'hsl(var(--accent-700))',
					800: 'hsl(var(--accent-800))',
					900: 'hsl(var(--accent-900))',
				},
				// Artisan-inspired semantic colors
				terracotta: {
					50: 'hsl(var(--terracotta-50))',
					100: 'hsl(var(--terracotta-100))',
					200: 'hsl(var(--terracotta-200))',
					300: 'hsl(var(--terracotta-300))',
					400: 'hsl(var(--terracotta-400))',
					500: 'hsl(var(--terracotta-500))',
					600: 'hsl(var(--terracotta-600))',
					700: 'hsl(var(--terracotta-700))',
					800: 'hsl(var(--terracotta-800))',
					900: 'hsl(var(--terracotta-900))',
				},
				sage: {
					50: 'hsl(var(--sage-50))',
					100: 'hsl(var(--sage-100))',
					200: 'hsl(var(--sage-200))',
					300: 'hsl(var(--sage-300))',
					400: 'hsl(var(--sage-400))',
					500: 'hsl(var(--sage-500))',
					600: 'hsl(var(--sage-600))',
					700: 'hsl(var(--sage-700))',
					800: 'hsl(var(--sage-800))',
					900: 'hsl(var(--sage-900))',
				},
				warm: {
					50: 'hsl(var(--warm-50))',
					100: 'hsl(var(--warm-100))',
					200: 'hsl(var(--warm-200))',
					300: 'hsl(var(--warm-300))',
					400: 'hsl(var(--warm-400))',
					500: 'hsl(var(--warm-500))',
					600: 'hsl(var(--warm-600))',
					700: 'hsl(var(--warm-700))',
					800: 'hsl(var(--warm-800))',
					900: 'hsl(var(--warm-900))',
				},
				// Success, warning, info colors
				success: {
					50: 'hsl(var(--success-50))',
					100: 'hsl(var(--success-100))',
					200: 'hsl(var(--success-200))',
					300: 'hsl(var(--success-300))',
					400: 'hsl(var(--success-400))',
					500: 'hsl(var(--success-500))',
					600: 'hsl(var(--success-600))',
					700: 'hsl(var(--success-700))',
					800: 'hsl(var(--success-800))',
					900: 'hsl(var(--success-900))',
				},
				warning: {
					50: 'hsl(var(--warning-50))',
					100: 'hsl(var(--warning-100))',
					200: 'hsl(var(--warning-200))',
					300: 'hsl(var(--warning-300))',
					400: 'hsl(var(--warning-400))',
					500: 'hsl(var(--warning-500))',
					600: 'hsl(var(--warning-600))',
					700: 'hsl(var(--warning-700))',
					800: 'hsl(var(--warning-800))',
					900: 'hsl(var(--warning-900))',
				},
				info: {
					50: 'hsl(var(--info-50))',
					100: 'hsl(var(--info-100))',
					200: 'hsl(var(--info-200))',
					300: 'hsl(var(--info-300))',
					400: 'hsl(var(--info-400))',
					500: 'hsl(var(--info-500))',
					600: 'hsl(var(--info-600))',
					700: 'hsl(var(--info-700))',
					800: 'hsl(var(--info-800))',
					900: 'hsl(var(--info-900))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				// Artisan-themed animations
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-down': {
					'0%': { opacity: '0', transform: 'translateY(-30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' },
					'50%': { boxShadow: '0 0 30px hsl(var(--primary) / 0.5)' }
				},
				'heartbeat': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				},
				'wobble': {
					'0%': { transform: 'translateX(0%)' },
					'15%': { transform: 'translateX(-25%) rotate(-5deg)' },
					'30%': { transform: 'translateX(20%) rotate(3deg)' },
					'45%': { transform: 'translateX(-15%) rotate(-3deg)' },
					'60%': { transform: 'translateX(10%) rotate(2deg)' },
					'75%': { transform: 'translateX(-5%) rotate(-1deg)' },
					'100%': { transform: 'translateX(0%)' }
				},
				'gentle-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'spin-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'text-shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'float': 'float 3s ease-in-out infinite',
				// Artisan-themed animations
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in-down': 'fade-in-down 0.6s ease-out',
				'fade-in-left': 'fade-in-left 0.6s ease-out',
				'fade-in-right': 'fade-in-right 0.6s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.4s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'shimmer': 'shimmer 2s infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
				'wobble': 'wobble 1s ease-in-out',
				'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
				'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 3s ease infinite'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				serif: ['Playfair Display', 'Georgia', 'serif'],
				display: ['Cinzel', 'serif'],
				handwritten: ['Dancing Script', 'cursive'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
				// Artisan-themed sizes
				'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'display-md': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
				'display-lg': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
				'display-xl': ['6rem', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
				'hero': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
			},
			fontWeight: {
				thin: '100',
				extralight: '200',
				light: '300',
				normal: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
				extrabold: '800',
				black: '900',
			},
			letterSpacing: {
				tighter: '-0.05em',
				tight: '-0.025em',
				normal: '0em',
				wide: '0.025em',
				wider: '0.05em',
				widest: '0.1em',
				// Artisan spacing
				'display': '-0.02em',
				'hero': '-0.04em',
			},
			lineHeight: {
				none: '1',
				tight: '1.25',
				snug: '1.375',
				normal: '1.5',
				relaxed: '1.625',
				loose: '2',
				// Artisan line heights
				'display': '1.1',
				'hero': '0.9',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-subtle': 'var(--gradient-subtle)',
				'gradient-warm': 'var(--gradient-warm)'
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'soft': 'var(--shadow-soft)',
				'glow': 'var(--shadow-glow)',
				// Artisan shadow depths
				'xs': '0 1px 2px 0 hsl(var(--foreground) / 0.05)',
				'sm': '0 1px 3px 0 hsl(var(--foreground) / 0.1), 0 1px 2px -1px hsl(var(--foreground) / 0.1)',
				'md': '0 4px 6px -1px hsl(var(--foreground) / 0.1), 0 2px 4px -2px hsl(var(--foreground) / 0.1)',
				'lg': '0 10px 15px -3px hsl(var(--foreground) / 0.1), 0 4px 6px -4px hsl(var(--foreground) / 0.1)',
				'xl': '0 20px 25px -5px hsl(var(--foreground) / 0.1), 0 8px 10px -6px hsl(var(--foreground) / 0.1)',
				'2xl': '0 25px 50px -12px hsl(var(--foreground) / 0.25)',
				// Artisan-themed shadows
				'warm': '0 4px 20px -4px hsl(var(--primary) / 0.15)',
				'terracotta': '0 8px 32px -8px hsl(var(--terracotta-500) / 0.2)',
				'sage': '0 6px 24px -6px hsl(var(--sage-500) / 0.15)',
				'floating': '0 20px 40px -12px hsl(var(--foreground) / 0.15)',
				'card': '0 2px 8px -2px hsl(var(--foreground) / 0.08), 0 4px 16px -4px hsl(var(--foreground) / 0.04)',
				// Glow effects
				'glow-primary': '0 0 20px hsl(var(--primary) / 0.3)',
				'glow-terracotta': '0 0 30px hsl(var(--terracotta-500) / 0.4)',
				'glow-sage': '0 0 25px hsl(var(--sage-500) / 0.35)',
				'glow-warm': '0 0 15px hsl(var(--warm-500) / 0.25)',
				// Inner shadows for depth
				'inner': 'inset 0 2px 4px 0 hsl(var(--foreground) / 0.05)',
				'inner-lg': 'inset 0 4px 8px 0 hsl(var(--foreground) / 0.08)',
			},
			transitionTimingFunction: {
				'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
