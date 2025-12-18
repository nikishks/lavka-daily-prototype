/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Делаем Yandex Sans Display основным шрифтом во всём приложении
        sans: ['Yandex Sans Display', 'sans-serif'],
        // Оставляем утилиту 'display' на случай, если захотите использовать её отдельно
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
