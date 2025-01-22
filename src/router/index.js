import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue"; // Подключаем лейаут
import Products from "@/views/Products.vue";
import Filters from "@/views/Filters.vue";
import Three from "@/views/Three.vue";

const routes = [
    {
        path: "/",
        component: DefaultLayout,
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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
