/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alvesBlue: "#3B447B",
        alvesBlueDark: "#2C315E",
        alvesTeal: "#07ABA0",
        alvesTealDark: "#008B85",
        alvesRed: "#D9534F",
      },
      borderRadius: { xl2: "1rem" },
    },
  },
  plugins: [],
};
