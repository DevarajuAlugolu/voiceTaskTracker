/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-body": "#020617",
        "bg-elevated": "#020817",
        "bg-soft": "#050816",
      },
      boxShadow: {
        "soft-elevated": "0 18px 45px rgba(15,23,42,0.8)",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};