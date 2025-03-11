import {defineStore} from 'pinia';
import app from '@/main'; // Импортируйте, если у вас глобальный API

export const useDataStore = defineStore('dataStore', {
    state: () => ({
        data: [],
        loading: false,
        totalCount: 0,
        currentPage: 1,
        selectedData: [],
    }),

    actions: {
        async fetchData(route, params = {}) {
            this.loading = true;
            try {
                const api = app.config.globalProperties.$api;
                const response = await api.get(route, params);

                if (response.status === 200) {
                    this.totalCount = response.data.count;
                    this.data = this.currentPage === 1 ? response.data.list : [...this.data, ...response.data.list];
                }

                if (this.data.length < this.totalCount) {
                    this.currentPage++;
                }

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                this.loading = false;
            }
        },

        loadMoreData(route, params = {}) {
            if (this.data.length < this.totalCount && !this.loading) {
                this.fetchData(route, params);
            }
        },

        getDataById(id) {
            return this.data.find(data => data._id === id);
        },

        setSelectedData(data) {
            this.selectedData = data;
        },


        clearData() {
            this.data = []; // Очистить данные
            this.totalCount = 0;
            this.currentPage = 1;
        },

    },

    getters: {
        getData: (state) => state.data,
        isLoading: (state) => state.loading,
        getCurrentPage: (state) => state.currentPage,
        getTotalCount: (state) => state.totalCount,
        getSelectedData: (state) => state.selectedData,
    },
});
