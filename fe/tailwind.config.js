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
        "modal-slide-up": {
          "0%": {
            opacity: "0",
            transform: "translate(0, 10px) scale(0.98)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0, 0) scale(1)",
          },
        },
        "backdrop-fade": {
          "0%": {
            opacity: "0",
            backdropFilter: "blur(0px)",
          },
          "100%": {
            opacity: "1",
            backdropFilter: "blur(4px)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "modal-appear": "modal-appear 0.2s ease-out",
        "modal-slide-up": "modal-slide-up 0.25s ease-out",
        "backdrop-fade": "backdrop-fade 0.25s ease-out",
        "fade-in": "fade-in 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
