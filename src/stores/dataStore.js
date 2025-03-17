import { defineStore } from 'pinia';
import app from '@/main'; // Импорт глобального API

export const useDataStore = defineStore('dataStore', {
    state: () => ({
        data: {}, // Данные хранятся под ключами
        loading: {}, // Состояние загрузки для каждого запроса
        totalCount: {}, // Общее количество записей по ключу
        currentPage: {}, // Текущая страница по ключу
        selectedData: {}, // Выбранные данные по ключу
    }),

    actions: {
        async fetchData(selectId, route, params = {}) {
            if (!this.data[selectId]) {
                this.data[selectId] = [];
                this.totalCount[selectId] = 0;
                this.currentPage[selectId] = 1;
            }

            this.loading[selectId] = true;
            try {
                const api = app.config.globalProperties.$api;
                const response = await api.get(route, params);

                if (response.status === 200) {
                    this.totalCount[selectId] = response.data.count;
                    this.data[selectId] = this.currentPage[selectId] === 1
                        ? response.data.list
                        : [...this.data[selectId], ...response.data.list];
                }

                if (this.data[selectId].length < this.totalCount[selectId]) {
                    this.currentPage[selectId]++;
                }

            } catch (error) {
                console.error(`Ошибка загрузки данных для ${selectId}:`, error);
            } finally {
                this.loading[selectId] = false;
            }
        },

        loadMoreData(selectId, route, params = {}) {
            if (this.data[selectId]?.length < this.totalCount[selectId] && !this.loading[selectId]) {
                this.fetchData(selectId, route, params);
            }
        },

        getDataById(selectId, id) {
            return this.data[selectId]?.find(item => item._id === id);
        },

        setSelectedData(selectId, data) {
            this.selectedData[selectId] = data;
        },

        clearData(selectId) {
            this.data[selectId] = [];
            this.totalCount[selectId] = 0;
            this.currentPage[selectId] = 1;
        },
    },

    getters: {
        getOptions: (state) => (selectId) => state.data[selectId] || [],
        isLoading: (state) => (selectId) => state.loading[selectId] || false,
        getCurrentPage: (state) => (selectId) => state.currentPage[selectId] || 1,
        getTotalCount: (state) => (selectId) => state.totalCount[selectId] || 0,
        getSelectedData: (state) => (selectId) => state.selectedData[selectId] || [],
    },
});
