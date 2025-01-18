import axios from 'axios';

export class Fetch {
    constructor(baseURL, defaultHeaders = {}) {
        console.log('constructor', baseURL)
        this.instance = axios.create({
            baseURL,
            headers: defaultHeaders,
        });
    }

    /**
     * GET запрос
     * @param {string} url - Конечная точка API
     * @param {Object} params - Query параметры
     * @param {Object} config - Дополнительная конфигурация
     * @returns {Promise} - Результат запроса
     */
    get(url, params = {}, config = {}) {
        return this.instance.get(url, { params, ...config });
    }

    /**
     * POST запрос
     * @param {string} url - Конечная точка API
     * @param {Object} data - Тело запроса
     * @param {Object} config - Дополнительная конфигурация
     * @returns {Promise} - Результат запроса
     */
    post(url, data = {}, config = {}) {
        return this.instance.post(url, data, config);
    }

    /**
     * PUT запрос
     * @param {string} url - Конечная точка API
     * @param {Object} data - Тело запроса
     * @param {Object} config - Дополнительная конфигурация
     * @returns {Promise} - Результат запроса
     */
    put(url, data = {}, config = {}) {
        return this.instance.put(url, data, config);
    }

    /**
     * DELETE запрос
     * @param {string} url - Конечная точка API
     * @param {Object} config - Дополнительная конфигурация
     * @returns {Promise} - Результат запроса
     */
    delete(url, config = {}) {
        return this.instance.delete(url, config);
    }

    /**
     * Установка новых заголовков
     * @param {Object} headers - Дополнительные заголовки
     */
    setHeaders(headers) {
        Object.assign(this.instance.defaults.headers, headers);
    }
}