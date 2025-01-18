import { Fetch } from '../services/builder/axios.js';

export default {
    install(app) {
        // Создаём экземпляр Fetch с базовым URL и заголовками
        console.log('import.meta.env.BASIC_API_URL', import.meta.env)
        const api = new Fetch(import.meta.env.VITE_BASIC_API_URL, {
            'Content-Type': 'application/json',
        });

        // Регистрируем $api как глобальное свойство
        app.config.globalProperties.$api = api;

        // Также можем предоставить API через provide/inject (опционально)
        app.provide('$api', api);
    },
};