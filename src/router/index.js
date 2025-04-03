import {createRouter, createWebHistory} from "vue-router";
import {useUserStore} from "@/stores/userRole.js";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Products from "@/views/Products.vue";
import FiltersConfiguration from "@/views/FiltersConfiguration.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/views/Auth/Login.vue";
import DetailsPage from "@/components/DetailsPage/DetailsPage.vue";
import Users from "@/views/Users.vue";
import SignUp from "@/views/Auth/SignUp.vue";
import Orders from "@/views/Orders.vue";
import AboutUser from "@/views/AboutUser.vue";

function isAuthenticated() {
    return !!localStorage.getItem("authToken");
}


const routes = [
    {
        path: "/",
        component: DefaultLayout,
        meta: {requiresAuth: true},
        children: [
            {
                path: "",
                redirect: "/filters-configuration",
            },
            {
                path: "about-user",
                name: "User",
                component: AboutUser,
            },
            {
                path: "products",
                name: "Products",
                meta: {requiresRole: ["Admin", "Manager", "Supervisor"]},
                component: Products,
            },
            {
                path: "orders",
                name: "Orders",
                component: Orders,
            },
            {
                path: "/orders/new",
                meta: {pageType: 'orders'},
                name: "OrderCreate",
                component: DetailsPage,
            },
            {
                path: "orders/:id",
                meta: {pageType: 'orders'},
                name: "OrderDetailsPage",
                component: DetailsPage,
            },
            {
                path: "/products/new", // Статический маршрут для создания нового продукта
                meta: {pageType: 'products'},
                name: "ProductCreate",
                component: DetailsPage, // Компонент для создания продукта
            },
            {
                path: "products/:id", // Динамический путь для деталей продукта
                meta: {pageType: 'products'},
                name: "DetailsPage", // Название маршрута для страницы продукта
                component: DetailsPage, // Компонент для страницы продукта
            },
            {
                path: "filters-configuration",
                name: "Filters-configuration",
                component: FiltersConfiguration,
            },
            {
                path: "users",
                name: "Users",
                component: Users,
            },
            {
                path: "users/:id",
                meta: {pageType: 'users'},
                name: "UsersDetails",
                component: DetailsPage,
            },

            {
                path: "/users/new",
                meta: {pageType: 'users'},
                name: "UserCreate",
                component: DetailsPage,
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
                meta: {pageType: 'login'},
                component: Login,
            },
            {
                path: "signup",
                name: "Signup",
                meta: {pageType: 'signup'},
                component: SignUp,
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
    const authStore = useUserStore();
    authStore.setUserRole('Admin');
    const userRole = authStore.userRole;

    if (isAuth && to.path.startsWith("/auth")) {
        next({path: "/filters-configuration"});
    } else if (!isAuth && to.matched.some((record) => record.meta.requiresAuth)) {
        next({path: "/auth/login"});
    } else if (to.meta.requiresRole && !to.meta.requiresRole.includes(userRole)) {
        next({ path: "/filters-configuration" });
    } else {
        next();
    }
});

export default router;
