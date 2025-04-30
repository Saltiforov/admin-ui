import app from '@/main';

const router = {
    roles: '/api/admin/roles'
}

export async function createRoles(roles) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.post(`${router.roles}`, roles);

        return response;

    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
}

export async function getRoles() {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.get(`${router.roles}`);

        return response;

    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
}
