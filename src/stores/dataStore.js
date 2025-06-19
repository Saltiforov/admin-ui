import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import app from '@/main' // Глобальный доступ к API

export const useDataStore = defineStore('dataStore', () => {
    const data = reactive({})
    const loading = reactive({})
    const totalCount = reactive({})
    const currentPage = reactive({})
    const selectedData = reactive({})

    async function fetchData(selectId, route, params = {}) {
        if (!data[selectId]) {
            data[selectId] = []
            totalCount[selectId] = 0
            currentPage[selectId] = 1
        }

        loading[selectId] = true

        try {
            const api = app.config.globalProperties.$api
            const response = await api.get(route, params)

            if (response.status === 200 || response.status === 201) {
                const list = response.data.list || response.data
                totalCount[selectId] = response.data.count
                data[selectId] =
                    currentPage[selectId] === 1
                        ? list
                        : [...data[selectId], ...list]
            }

            if (data[selectId].length < totalCount[selectId]) {
                currentPage[selectId]++
            }
        } catch (error) {
            console.error(`Ошибка загрузки данных для ${selectId}:`, error)
        } finally {
            loading[selectId] = false
        }
    }

    function loadMoreData(selectId, route, params = {}) {
        if (
            data[selectId]?.length < totalCount[selectId] &&
            !loading[selectId]
        ) {
            fetchData(selectId, route, params)
        }
    }

    function getDataById(selectId, id) {
        return data[selectId]?.find((item) => item._id === id)
    }

    function setSelectedData(selectId, item) {
        selectedData[selectId] = item
    }

    function removeSelectedData(selectId, id) {
        if (Array.isArray(selectedData[selectId])) {
            selectedData[selectId] = selectedData[selectId].filter(
                (selected) => selected.code !== id
            )
        }
    }

    function clearData(selectId) {
        data[selectId] = []
        totalCount[selectId] = 0
        currentPage[selectId] = 1
    }

    const getOptions = (selectId) => computed(() => data[selectId] || [])
    const isLoading = (selectId) => computed(() => loading[selectId] || false)
    const getCurrentPage = (selectId) =>
        computed(() => currentPage[selectId] || 1)
    const getTotalCount = (selectId) =>
        computed(() => totalCount[selectId] || 0)
    const getSelectedData = (selectId) =>
        computed(() => selectedData[selectId] || [])

    return {
        // state
        data,
        loading,
        totalCount,
        currentPage,
        selectedData,

        // actions
        fetchData,
        loadMoreData,
        getDataById,
        setSelectedData,
        removeSelectedData,
        clearData,

        // getters
        getOptions,
        isLoading,
        getCurrentPage,
        getTotalCount,
        getSelectedData,
    }
})
