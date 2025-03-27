import app from '@/main';

const routes = {
    filters: '/api/filters',
    filters_configuration: '/api/filters-configuration',
    child_filters_configuration: '/api/filter-child-configuration',
    update_node: '/filters-configuration/:id'
}

export async function deleteFilter(id) {
    try {
        const api = app.config.globalProperties.$api;
        //filters
        const response = await api.delete(`/api/filters/${id}`);

        if (response.status === 200) {
            console.log(`Фильтр с id ${id} успешно удалён`);
        }
    } catch (error) {
        console.error(`Ошибка при удалении фильтра с id ${id}:`, error);
    }
}

export async function deleteFilters(ids) {
    try {
        const api = app.config.globalProperties.$api;
        const response = await api.delete(`/api/filters`, {
            data: { ids: ids }
        });

        if (response.status === 200) {
            console.log(`Фильтр с id ${ids} успешно удалён`);
        }
    } catch (error) {
        console.error(`Ошибка при удалении фильтра с id ${ids}:`, error);
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
                        console.log('createFilters', value);
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

export async function createNewFilterNode(payload) {
    const api = app.config.globalProperties.$api;
    const parsedPayload = Array.isArray(payload) ? payload : [payload];

    const response = await api.post(routes.filters_configuration, { filters: parsedPayload })

    return response.data;
}

export async function createNewFilterChildNode(payload) {
    const api = app.config.globalProperties.$api;

    const response = await api.put(routes.child_filters_configuration, payload)

    return response.data;
}

export async function updateExistedNode(id, payload) {
    const api = app.config.globalProperties.$api;

    const response = await api.put(`/api/filters-configuration/${id}`, payload)

    return response.data;
}

export async function getFiltersList() {
    const api = app.config.globalProperties.$api;
    try {
        const res = await api.get(routes.filters_configuration); // Дожидаемся ответа от API
        return res.data; // Возвращаем данные
    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error; // Пробрасываем ошибку дальше
    }
}
