/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}', // Укажите пути к вашим файлам
    ],
    theme: {
        extend: {}, // Добавьте кастомизацию, если нужно
    },
    plugins: [
        require('tailwindcss-primeui'), // Подключаем плагин для интеграции с PrimeVue
    ],
};
