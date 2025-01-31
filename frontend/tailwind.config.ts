import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
    	extend: {
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
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
    			},
    			shiki: {
    				light: 'var(--shiki-light)',
    				'light-bg': 'var(--shiki-light-bg)',
    				dark: 'var(--shiki-dark)',
    				'dark-bg': 'var(--shiki-dark-bg)'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		animation: {
    			'shiny-text': 'shiny-text 8s infinite',
    			'caret-blink': 'caret-blink 1.25s ease-out infinite',
    			'bg-fade': 'bg-fade 2s ease-in-out 0s 1 normal none running',
    			'bg-fade-up': 'bg-fade-up 2s ease-in-out 0s 1 normal none running',
    			'bg-fade-down': 'bg-fade-down 2s ease-in-out 0s 1 normal none running',
    			ripple: 'ripple 1.5s infinite',
    			'typing-dot-bounce': 'typing-dot-bounce 1.25s ease-out infinite'
    		},
    		keyframes: {
    			'shiny-text': {
    				'0%, 90%, 100%': {
    					'background-position': 'calc(-100% - var(--shiny-width)) 0'
    				},
    				'30%, 60%': {
    					'background-position': 'calc(100% + var(--shiny-width)) 0'
    				}
    			},
    			'caret-blink': {
    				'0%,70%,100%': {
    					opacity: '1'
    				},
    				'20%,50%': {
    					opacity: '0'
    				}
    			},
    			ripple: {
    				'0%': {
    					transform: 'scale(0.8)',
    					opacity: '1'
    				},
    				'100%': {
    					transform: 'scale(2.5)',
    					opacity: '0'
    				}
    			},
    			'bg-fade': {
    				'0%': {
    					backgroundColor: 'transparent',
    					color: 'hsl(var(--primary-foreground))'
    				},
    				'30%': {
    					backgroundColor: 'hsl(var(--primary))',
    					color: 'hsl(var(--primary-foreground))'
    				},
    				'100%': {
    					backgroundColor: 'transparent',
    					color: 'hsl(var(--primary-foreground))'
    				}
    			},
    			'bg-fade-up': {
    				'0%': {
    					backgroundColor: 'transparent',
    					color: 'hsl(var(--chart-2))'
    				},
    				'30%': {
    					backgroundColor: '#42cdbc',
    					color: 'hsl(var(--chart-2))'
    				},
    				'100%': {
    					backgroundColor: 'transparent',
    					color: 'hsl(var(--chart-2))'
    				}
    			},
    			'bg-fade-down': {
    				'0%': {
    					backgroundColor: 'transparent',
    					color: 'hsl(var(--chart-5))'
    				},
    				'30%': {
    					backgroundColor: '#e1608b',
    					color: 'hsl(var(--chart-5))'
    				},
    				'100%': {
    					backgroundColor: 'transparent',
    					color: 'hsl(var(--chart-5))'
    				}
    			},
    			'typing-dot-bounce': {
    				'0%,40%': {
    					transform: 'translateY(0)'
    				},
    				'20%': {
    					transform: 'translateY(-0.25rem)'
    				}
    			}
    		}
    	}
    },
    plugins: [
        require("tailwindcss-animate"),

    ],
};
export default config;
