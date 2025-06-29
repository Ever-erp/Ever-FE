/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1E4C92",
        subBrand: "#789FD2",
        highlight: "#60A5FA",
        disabled: "#E3EAF6",
        gray: {
          100: "#F7F8FA",
          150: "#EFF1F5",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        positive: "#B8D4FF",
        negative: "#FFD6D6",
        commonSchedule: "#A594F9",
        classSchedule: "#A2D2DF",
        personalSchedule: "#F0C1E1",
        white: "#FFFFFF",
        warning: "#F43F5E",
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', "Arial", "sans-serif"],
      },
      screens: {
        "3xl": "2560px", // 예: 1920px 이상부터 3xl
      },
    },
  },
  plugins: [],
};
