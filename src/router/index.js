import { createRouter, createWebHistory } from "vue-router";

// Импорты компонентов для маршрутов
import Products from "@/views/Products.vue";
import Filters from "@/views/Filters.vue";

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
];

// Создание экземпляра маршрутизатора
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;