/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				royal: {
					900: '#00245d',
					800: '#003a88',
					700: '#004d9d',
					600: '#0a67c1',
					500: '#1a7fd4',
					400: '#3ba0ff',
					300: '#6bb8ff',
					200: '#9ed0ff',
					100: '#d1e8ff'
				},
				dark: {
					900: '#0b1220',
					800: '#141d2e',
					700: '#1b2437',
					600: '#2d3a4f',
					500: '#3d4d66'
				}
			},
			fontFamily: {
				sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
			},
			backdropBlur: {
				xs: '2px'
			},
			animation: {
				'fade-in': 'fadeIn 0.2s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			}
		}
	},
	plugins: []
};
