import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#111217',
        'surface': '#1A1C22',
        'border': '#2A2D35',
        'accent-blue': '#009DFF',
        'accent-teal': '#3CA3A8',
      },
      fontFamily: {
        'heading': ['Inter', 'Roboto Mono', 'sans-serif'],
        'body': ['IBM Plex Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'industrial': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 15px rgba(0, 157, 255, 0.5)',
      },
      borderRadius: {
        'sm': '2px',
      },
    },
  },
  plugins: [],
};

export default config; 