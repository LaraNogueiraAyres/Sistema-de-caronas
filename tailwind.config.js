/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        border: "var(--border)",
        destructive: {
          DEFAULT: "var(--destructive)",
          hover: "var(--destructive-hover)", // Agora acessível via 'bg-destructive-hover'
        },
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
  plugins: [],
};