import app from '@/main';

const router = {
    static_pages: 'api/admin/static-pages'
}

export async function createStaticPage(payload) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.post(`${router.static_pages}`, payload);

        return response;

    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
}
