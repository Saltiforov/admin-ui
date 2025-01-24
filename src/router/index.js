import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Products from "@/views/Products.vue";
import Filters from "@/views/Filters.vue";
import Three from "@/views/Three.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/views/Auth/Login.vue";
import Register from "@/views/Auth/Register.vue";

function isAuthenticated() {
    return !!localStorage.getItem("token");
}

const routes = [
    {
        path: "/",
        component: DefaultLayout,
        meta: { requiresAuth: true }, // Добавляем защиту для всех дочерних маршрутов
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
                meta: { requiresAuth: true },
            },
            {
                path: "register",
                name: "Register",
                component: Register,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach((to, from, next) => {
//     // Проверяем, нужно ли защищать маршрут
//     if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated()) {
//         // Если маршрут (или его родитель) требует авторизации, но пользователь не авторизован
//         next({ name: "Register" }); // Перенаправляем на страницу логина
//     } else {
//         next(); // Если всё нормально, продолжаем
//     }
// });

export default router;
