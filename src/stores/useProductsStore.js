import { defineStore } from 'pinia';
import app from '@/main'; // Импортируйте, если у вас глобальный API

const router = {
    products: '/api/products',
}

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],  // Список всех продуктов
        loading: false,
    }),

    actions: {
        async fetchProducts(query = '') {
            this.loading = true;
            try {
                const api = app.config.globalProperties.$api;
                const url = query.length ? `${router.products}${query}` : router.products;
                const response = await api.get(url);

                if (response.status === 200) {
                    this.products = response.data.list; // Сохраняем полный список
                }
            } catch (error) {
                console.error('Ошибка загрузки продуктов:', error);
            } finally {
                this.loading = false;
            }
        },

        getProductById(id) {
            return this.products.find(product => product._id === id);
        },

        clearProducts() {
            this.products = []; // Метод для очистки, если понадобится
        },
    },

    getters: {
        productCount: (state) => state.products.length, // Пример геттера
    },
});
