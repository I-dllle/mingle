/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        "modal-appear": {
          "0%": {
            opacity: "0",
            transform: "translate(0, -1rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0, 0)",
          },
        },
      },
      animation: {
        "modal-appear": "modal-appear 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
