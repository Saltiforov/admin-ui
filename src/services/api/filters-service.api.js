import app from '@/main';

const routes = {
    filters: '/api/filters'
}

export async function createFilters(payload) {
    const api = app.config.globalProperties.$api;
    api.post(routes.filters, payload).then(res => {
        return res.data;
    }).catch(error => {
        console.error('Error in createFilters:', error);
        throw error;
    })
}

export async function getFiltersList() {
    const api = app.config.globalProperties.$api;
    api.get(routes.filters).then(res => {
        return res.data;
    }).catch(error => {
        console.error('Error in createFilters:', error);
        throw error;
    })
}