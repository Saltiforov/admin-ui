import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Products from "@/views/Products.vue";
import Filters from "@/views/Filters.vue";
import Three from "@/views/Three.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/views/Auth/Login.vue";
import Register from "@/views/Auth/Register.vue";

function isAuthenticated() {
    return !!localStorage.getItem("authToken");
}

const routes = [
    {
        path: "/",
        component: DefaultLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: "",
                redirect: "/filters",
            },
            {
                path: "products",
                name: "Products",
                component: Products,
            },
            {
                path: "filters",
                name: "Filters",
                component: Filters,
            },
            {
                path: "three",
                name: "Three",
                component: Three,
            },
        ],
    },
    {
        path: "/auth",
        component: AuthLayout,
        children: [
            {
                path: "login",
                name: "Login",
                component: Login,
            },
            {
                path: "register",
                name: "Register",
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuth = isAuthenticated();

    if (isAuth && to.path.startsWith("/auth")) {
        next({ path: "/three" });
    } else if (!isAuth && to.matched.some((record) => record.meta.requiresAuth)) {
        next({ path: "/auth/login" });
    } else {
        next();
    }
});

export default router;
