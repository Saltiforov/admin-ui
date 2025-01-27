import app from '@/main';

const routes = {
    filters: '/api/filters'
}
export async function uploadIconForFilter(iconFile, filterCode) {
    const api = app.config.globalProperties.$api;

    try {
        const formData = new FormData();
        formData.append('icon', iconFile);

        const response = await api.post(
            `${routes.filters}/${filterCode}/upload-icon`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return response.data;
    } catch (error) {
        console.error('Error in uploadIconForFilter:', error);
        throw error;
    }
}

export async function createFilters(payload) {
    const api = app.config.globalProperties.$api;

    try {
        const formData = new FormData();

        const processFilters = (filters, parentKey = 'filters') => {
            filters.forEach((filter, index) => {
                const filterKey = `${parentKey}[${index}]`;

                for (const [key, value] of Object.entries(filter)) {
                    if (key === 'icon' && value && value instanceof File) {
                        console.log('VALUE', value);
                        // Если это иконка (файл), добавляем её напрямую
                        formData.append(`${filterKey}[${key}]`, value);
                    } else if (key === 'children' && Array.isArray(value)) {
                        // Если это дочерние элементы, обрабатываем их рекурсивно
                        processFilters(value, `${filterKey}[children]`);
                    } else {
                        // Если это обычное поле, добавляем его
                        formData.append(`${filterKey}[${key}]`, JSON.stringify(value));
                    }
                }
            });
        };

        const logFormData = (formData) => {
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }
        };

        processFilters(payload.filters);

        logFormData(formData);

        const response = await api.post(routes.filters, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }});

        return response.data;
    } catch (error) {
        console.error('Error in createFilters:', error);
        throw error;
    }
}

export async function getFiltersList() {
    const api = app.config.globalProperties.$api;
    try {
        const res = await api.get(routes.filters); // Дожидаемся ответа от API
        return res.data; // Возвращаем данные
    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error; // Пробрасываем ошибку дальше
    }
}