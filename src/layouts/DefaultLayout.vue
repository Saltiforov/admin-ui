<template>
  <div class="layout">
    <aside class="sidebar">
      <h3 class="sidebar-title">Navigation</h3>
      <ul class="menu">
        <li
            v-for="item in menuItems[0].items"
            :key="item.label"
            :class="{ active: isActiveRoute(item.command) }"
            @click="item.command"
        >
          <i :class="item.icon"></i> {{ item.label }}
        </li>
      </ul>
    </aside>
    <main class="content">
      <router-view/>
    </main>
  </div>
</template>


<script setup>
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();

const menuItems = [
  {
    label: "Navigation",
    items: [
      {label: "Filters", icon: "pi pi-filter", command: () => router.push("/filters")},
      {label: "Products", icon: "pi pi-shopping-cart", command: () => router.push("/products")},
    ],
  },
];

// Определяем активный маршрут
const isActiveRoute = (command) => {
  const routePath = command.toString().match(/\/[a-z]+/i)?.[0]; // Получаем маршрут из функции
  return route.path === routePath;
};
</script>


<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  border-right: 1px solid #ddd;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.menu li:hover {
  background-color: #ddd;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.menu li.active {
  background-color: #007bff;
  color: white;
}
</style>

