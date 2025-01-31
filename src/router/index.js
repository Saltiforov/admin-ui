import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Products from "@/views/Products.vue";
import Filters from "@/views/Filters.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/views/Auth/Login.vue";
import ProductDetails from "@/components/Products/ProductDetails.vue";
import Details from "@/components/Products/Details.vue";
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
            // {
            //     path: "products/:id", // Динамический путь для деталей продукта
            //     name: "ProductDetails", // Название маршрута для страницы продукта
            //     component: ProductDetails, // Компонент для страницы продукта
            // },
            {
                path: "products/:id", // Динамический путь для деталей продукта
                name: "Details", // Название маршрута для страницы продукта
                component: Details, // Компонент для страницы продукта
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
