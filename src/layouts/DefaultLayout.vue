<template>
  <div class="layout">
    <!-- Боковое меню -->
    <aside class="sidebar">
      <ul class="menu">
        <li
            v-for="item in menuItems[0].items"
            :key="item.label"
            class="menu-item"
            :class="{ active: isActiveRoute(item.command) }"
            @click="item.command"
        >
          <i class="menu-icon" :class="item.icon"></i> {{ item.label }}
        </li>
      </ul>
    </aside>

    <div class="main-container">
      <!-- Верхний бар -->
      <header class="topbar">
        <h2>Overview</h2>
        <div class="topbar__actions">
          <div class="action__item">
            <IconField>
              <InputIcon class="pi pi-search"/>
              <InputText class="topbar--input"  placeholder="Enter the code, please."/>
            </IconField>
          </div>
          <div class="action__item">
            <Button icon="pi pi-cog" class="settings-btn"/>
          </div>
          <div class="action__item">
            <OverlayBadge value="2" >
              <i class="pi pi-bell" style="font-size: 1.7rem"/>
            </OverlayBadge>
          </div>
          <div class="action__item">
            <Avatar label="V" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle"/>
          </div>
        </div>
      </header>

      <!-- Контент -->
      <main class="content">
        <router-view/>
      </main>
    </div>
  </div>
</template>


<script setup>
import {useRouter, useRoute} from "vue-router";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";

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
  display: grid;
  grid-template-columns: 250px 1fr; /* Сайдбар фиксированный, контент адаптивный */
  grid-template-rows: 100vh; /* Высота на весь экран */
}

/* Боковое меню */
.sidebar {
  border-right: 1px solid #ddd;
  box-shadow: 0px 0 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* Основной контейнер для топбара и контента */
.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Верхний бар */
.topbar {
  color: #ADABC4;
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


/* Контент */
.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.topbar__actions {
  display: flex;
  align-items: center;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.topbar--input {
  border-radius: 20px;
}

.action__item {
  margin: 0 20px;
}

.settings-btn {
  background-color: #EBEFF5; /* Темный фон */
  border: none;
  width: 48px; /* Квадратная кнопка */
  height: 48px;
  border-radius: 50%; /* Делаем круглую */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease-in-out;
}

.settings-btn:hover {
  background-color: #d5d0d0 !important; /* Чуть светлее при наведении */
  border: none !important;
}

.settings-btn:active {
  transform: scale(0.9); /* Анимация при нажатии */
}


.menu li {
  position: relative;
  color: #C1C1C1;
  margin: 5px 0px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.menu li.active {
  color: #1C12EB; /* Цвет текста активного элемента */
  font-weight: bold; /* Делаем активный элемент жирным */
}

.menu li.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px; /* Ширина полоски */
  height: 100%;
  background-color: #007bff; /* Цвет полоски */
  border-radius: 2px; /* Закругление краёв */
}

.menu-item {
  font-size: 18px;
}

.menu-icon {
  padding: 0 5px;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

</style>

