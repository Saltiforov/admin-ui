import app from '@/main';

const routes = {
    filters_configuration: '/api/admin/filters-configuration',
    child_filters_configuration: '/api/admin/filter-child-configuration',
    update_node: 'admin/filters-configuration/:id'
}

export async function deleteFilter(id) {
    try {
        const api = app.config.globalProperties.$api;
        const response = await api.delete(`${routes.filters_configuration}/${id}`);

        if (response.status === 200) {
            console.log(`Фильтр с id ${id} успешно удалён`);
        }
    } catch (error) {
        console.error(`Ошибка при удалении фильтра с id ${id}:`, error);
    }
}

export async function createNewFilterNode(payload) {
    const api = app.config.globalProperties.$api;

    const response = await api.post(routes.filters_configuration, payload)

    return response.data;
}

export async function createNewFilterChildNode(payload) {
    const api = app.config.globalProperties.$api;

    const response = await api.put(routes.child_filters_configuration, payload)

    return response.data;
}

export async function updateExistedNode(id, payload) {
    const api = app.config.globalProperties.$api;

    const response = await api.put(`${routes.filters_configuration}/${id}`, payload)

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
