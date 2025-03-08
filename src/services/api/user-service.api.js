import app from '@/main';

const router = {
    userList: '/api/users'
}

export async function getUserList(query = {}) {
    const api =  app.config.globalProperties.$api;
    try {

        const url =  `${router.userList}${query}`;

        const res = await api.get(url)
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

