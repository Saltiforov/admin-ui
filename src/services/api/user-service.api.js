import app from '@/main';

const routes = {
    userList: '/api/users'
}

export async function getUserList() {
    const api =  app.config.globalProperties.$api;
    return api.get(routes.userList).catch(error => {
        console.log('error', error)
    })
}