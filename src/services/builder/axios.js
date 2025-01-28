import axios from 'axios';

export class Fetch {
    constructor(baseURL, defaultHeaders = {}) {
        console.log('constructor', baseURL)
        this.instance = axios.create({
            baseURL,
            headers: defaultHeaders,
        });

        this.instance.interceptors.request.use(config => {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log("Authorization header set:", config.headers.Authorization);
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });
    }

    /**
     * GET запрос
     */
    get(url, params = {}, config = {}) {
        return this.instance.get(url, { params, ...config });
    }

    /**
     * POST запрос
     */
    post(url, data = {}, config = {}) {
        return this.instance.post(url, data, config);
    }

    /**
     * PUT запрос
     */
    put(url, data = {}, config = {}) {
        return this.instance.put(url, data, config);
    }

    /**
     * DELETE запрос
     */
    delete(url, config = {}) {
        return this.instance.delete(url, config);
    }

    /**
     * Установка новых заголовков
     */
    setHeaders(headers) {
        Object.assign(this.instance.defaults.headers, headers);
    }
}
