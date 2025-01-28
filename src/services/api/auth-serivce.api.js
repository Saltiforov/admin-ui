import app from '@/main';

const routes = {
    userList: '/api/login'
}

export async function login(payload) {
    const api = app.config.globalProperties.$api;

    return api.post(routes.userList, payload)
        .then(response => {
            if (response.data && response.data.token) {
                localStorage.setItem("authToken", response.data.token);
                console.log("Token saved:", response.data.token);
            } else {
                console.warn("No token received from backend.");
            }
            return response.data;
        })
        .catch(error => {
            console.error("Login error:", error);
            throw error;
        });
}

