/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      sans: ["Open sans", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#20BAF6",
        background: "#11111D",
      },
      /* https://stackoverflow.com/questions/73067312/remove-prose-from-a-child-tailwind-typography */
      typography: {
        DEFAULT: {
          css: {
            pre: false,
            code: false,
            "pre code": false,
            "code::before": false,
            "code::after": false,
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
  ],
};
