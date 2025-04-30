import app from '@/main';

const router = {
    users: '/api/admin/users'
}

export async function getUserList(query = {}) {
    const api =  app.config.globalProperties.$api;
    try {

        const url =  `${router.users}${query}`;

        const res = await api.get(url)
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
export async function createUsers(users) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.post(`${router.users}`, users);

        return response;

    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
}

export async function createUserById(userId) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.post(`${router.users}/${userId}`);

        return response;

    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
}

export async function createUserRoleById(userId, roles) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.post(`${router.users}/${userId}`, roles);

        return response;

    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
}


export async function deleteUserById(userId) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.delete(`${router.users}/${userId}`);

        return response;

    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
}
