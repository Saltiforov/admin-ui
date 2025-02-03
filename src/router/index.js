import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Products from "@/views/Products.vue";
import Filters from "@/views/Filters.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/views/Auth/Login.vue";
import DetailsPage from "@/components/DetailsPage/DetailsPage.vue";

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
                path: "/products/new", // Статический маршрут для создания нового продукта
                meta: { pageType: 'products' },
                name: "ProductCreate",
                component: DetailsPage, // Компонент для создания продукта
            },
            {
                path: "products/:id", // Динамический путь для деталей продукта
                meta: { pageType: 'products' },
                name: "DetailsPage", // Название маршрута для страницы продукта
                component: DetailsPage, // Компонент для страницы продукта
            },
            {
                path: "filters",
                name: "Filters",
                component: Filters,
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
        next({ path: "/filters" });
    } else if (!isAuth && to.matched.some((record) => record.meta.requiresAuth)) {
        next({ path: "/auth/login" });
    } else {
        next();
    }
});

export default router;
