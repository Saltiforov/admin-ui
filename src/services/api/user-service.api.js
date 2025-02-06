import app from '@/main';

const routes = {
    userList: '/api/users'
}

export async function getUserList() {
    const api =  app.config.globalProperties.$api;
    try {
        const res = await api.get(routes.userList)
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

