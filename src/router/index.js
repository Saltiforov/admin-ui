import { createRouter, createWebHistory } from "vue-router";

// Импорты компонентов для маршрутов
import Products from "@/views/Products.vue";
import Filters from "@/views/Filters.vue";
import Three from "@/views/Three.vue";

// Определение маршрутов
const routes = [
    {
        path: "/",
        redirect: "/filters", // Перенаправление с корневого пути на /filters
    },
    {
        path: "/products",
        name: "Products",
        component: Products,
    },
    {
        path: "/filters",
        name: "Filters",
        component: Filters,
    },
    {
        path: "/three",
        name: "Three",
        component: Three,
    },

];

// Создание экземпляра маршрутизатора
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;