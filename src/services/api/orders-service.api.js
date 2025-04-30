import app from '@/main'

const router = {
    orders: '/api/admin/orders',
}

export async function getOrdersList() {
    try {
        const api = app.config.globalProperties.$api;

        const response = await api.get(router.orders);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error;
    }
}

export async function getOrderById(id) {
    try {
        const api = app.config.globalProperties.$api;

        const response = await api.get(`${router.orders}/${id}`);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error;
    }
}

export async function updateOrderById(id, payload) {
    try {
        const api = app.config.globalProperties.$api;

        const response = await api.put(`${router.orders}/${id}`, payload);

        if (response.status === 200) {
            return response;
        }

    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error;
    }
}

export async function deleteOrderById(id) {
    try {
        const api = app.config.globalProperties.$api;

        const response = await api.delete(`${router.orders}/${id}`);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error;
    }
}

export async function createOrder(payload) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.post(`${router.orders}`, payload);

        return response;

    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
}

