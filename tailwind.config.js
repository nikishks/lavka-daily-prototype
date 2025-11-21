/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Расширяем стандартные шрифты Tailwind
      fontFamily: {
        // 'sans' - используем для основного текста
        sans: ['Yandex Sans Text', 'sans-serif'],
        // 'display' - новая утилита для крупных заголовков (например, "ГОТОВКА — ВСЁ.")
        display: ['Yandex Sans Display', 'sans-serif'], 
      },
      // Дополнительные цвета, чтобы соответствовать прототипу
      colors: {
        'app-blue': '#247AEB', // Яркий синий цвет для текста "ВСЕ"
        'app-dark': '#1F1F1F', // Темный цвет для основного текста "ГОТОВКА"
        'app-bg': '#F5F9FF', // Светло-голубой фон карточки
      }
    },
  },
  plugins: [],
}