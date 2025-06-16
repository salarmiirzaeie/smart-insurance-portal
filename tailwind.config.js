/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // مهم: به جای 'media'، 'class' بگذاریم

  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // مسیر فایل‌ها
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
