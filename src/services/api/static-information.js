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

export async function getStaticPageBySlug(slug) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.get(`${router.static_pages}/${slug}`);

        return response.data;

    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
}

export async function updateExistPageBySlug(slug, payload) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.put(`${router.static_pages}/${slug}`, payload);

        return response.data;

    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
}
