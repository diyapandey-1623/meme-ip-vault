import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00f3ff',
        secondary: '#a855f7',
        cyan: {
          400: '#00f3ff',
          500: '#00d9e8',
          600: '#00bfcc',
        },
      },
      backgroundColor: {
        dark: '#000000',
      },
      borderColor: {
        dark: '#1f2937',
      },
    },
  },
  plugins: [],
}
export default config
