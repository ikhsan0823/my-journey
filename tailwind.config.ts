import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
        'transparent': 'transparent',
        'bright-blue': '#00abe4',
        'tomb-blue': '#009cd0',
        'light-blue': '#e9f1fa',
        'rainy-day': '#d9e7f6',
        'dark-gray': '#343a40',
        'dark-grayish-blue': '#2b3035',
        'soft-white': '#f5f5f5',
        'light-gray': '#ebebeb',
        'tomato': '#ff6347',
        'light-red': '#ff5233',
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/forms')
  ],
};
export default config;
