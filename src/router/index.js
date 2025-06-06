import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/authRole.js";

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import Products from "@/views/Products.vue";
import FiltersConfiguration from "@/views/FiltersConfiguration.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Login from "@/views/Auth/Login.vue";
import DetailsPage from "@/components/DetailsPage/DetailsPage.vue";
import Users from "@/views/Users.vue";
import SignUp from "@/views/Auth/SignUp.vue";
import Orders from "@/views/Orders.vue";
import AboutUser from "@/pages/AboutUser.vue";
import AdminPage from "@/pages/AdminPage.vue";
import Roles from "@/views/Roles.vue";
import RoleWorkspace from "@/pages/RoleWorkspace.vue";
import StaticInformationLayout from "@/views/StaticInformation/StaticInformationLayout.vue";
import ShippingAndPayment from "@/views/StaticInformation/ShippingAndPayment.vue";
import AboutUsStaticInformation from "@/views/StaticInformation/AboutUsStaticInformation.vue";
import StaticInformation from "@/pages/StaticInformation.vue";

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
                path: "admin-page",
                name: "AdminPage",
                meta: {requiresRole: ["Admin", "Manager", "Supervisor"]},
                component: AdminPage,
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
                path: "static-information-test",
                name: "StaticInformationTest",
                component: StaticInformation,
            },

            {
                path: "roles",
                name: "Roles",
                component: Roles,
            },
            {
                path: "static-information",
                name: "StaticInformation",
                component: StaticInformationLayout,
                children: [
                    {
                        path: "shipping-and-payment",
                        name: "ShippingAndPayment",
                        meta: {pageType: 'shipping-and-payment'},
                        component: DetailsPage,
                    },
                    {
                        path: "about-us",
                        name: "AboutUsStaticInformation",
                        meta: {pageType: 'about-us'},
                        component: DetailsPage,
                    },
                    {
                        path: "new-arrivals",
                        name: "NewArrivalsStatic",
                        meta: {pageType: 'new-arrivals'},
                        component: DetailsPage,
                    },
                    {
                        path: "delivery-and-payment-product",
                        name: "DeliveryAndPaymentProduct",
                        meta: {pageType: 'delivery-and-payment-product'},
                        component: DetailsPage,
                    },
                ]
            },

            {
                path: "role-workspace",
                name: "RoleWorkspace",
                component: RoleWorkspace,
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
    const authStore = useAuthStore();
    authStore.setUserRole('Admin');
    const userRole = authStore.userRole;

    if (isAuth && to.path.startsWith("/auth")) {
        next({path: "/filters-configuration"});
    } else if (!isAuth && to.matched.some((record) => record.meta.requiresAuth)) {
        next({path: "/auth/login"});
    } else if (to.meta.requiresRole && !to.meta.requiresRole.includes(userRole)) {
        next({path: "/filters-configuration"});
    } else {
        next();
    }
});

export default router;
