<template>
  <div class="layout">
    <aside class="sidebar">
      <h3 class="sidebar-title">Navigation</h3>
      <Menu :model="menuItems" />
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const menuItems = [
  {
    label: "Navigation",
    items: [
      { label: "Filters", icon: "pi pi-filter", command: () => router.push("/filters") },
      { label: "Products", icon: "pi pi-shopping-cart", command: () => router.push("/products") },
      { label: "Three", icon: "pi pi-shopping-cart", command: () => router.push("/three") },
    ],
  },
];
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

.sidebar-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}
</style>
