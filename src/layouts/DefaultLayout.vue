<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img class="sidebar-logo__img" src="../assets/logo/sp-balkan-logo.png" alt="">
      </div>
      <ul class="menu">
        <li
            v-for="item in menuItems[0].items"
            :key="item.label"
            class="menu-item"
            :class="{ active: isActiveRoute(item.command) }"
        >
          <div class="menu-link" @click="handleItemClick(item)">
            <i class="menu-icon" :class="item.icon"></i>
            {{ item.label }}
            <span v-if="item.children" class="submenu-arrow">
              <i :class="isSubmenuOpen(item.label) ? 'pi pi-arrow-right' : 'pi pi-arrow-up'"
                 style="font-size: 0.8rem"></i>
            </span>
          </div>

          <ul v-if="item.children && isSubmenuOpen(item.label) && isActiveRoute(item.command)" class="submenu">
            <li
                v-for="child in item.children"
                :key="child.label"
                class="submenu-item"
                :class="{ active: isActiveRoute(child.command) }"
                @click.stop="child.command"
            >
              {{ child.label }}
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="main-container">
      <header class="topbar">
        <h2 class="title-text">{{ activeTab }}</h2>
        <div class="topbar__actions">
          <div class="action__item">
            <Button icon="pi pi-cog" class="settings-btn"/>
          </div>
          <div class="action__item">
            <OverlayBadge value="2">
              <i class="pi pi-bell" style="font-size: 1.7rem"/>
            </OverlayBadge>
          </div>
          <div class="action__item pointer">
            <Avatar
                image="https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"
                @click="router.push('about-user')" class="mr-2" size="large"
                style="background-color: #ece9fc; color: #2a1261"
                shape="circle"/>
          </div>
          <LocaleSwitch></LocaleSwitch>
        </div>
      </header>

      <main class="content">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
import {computed, ref} from "vue";
import LocaleSwitch from "@/components/UI/LocaleSwitch.vue";
import {useI18n} from 'vue-i18n';
import {useAuthStore} from "@/stores/authRole.js";

const router = useRouter();
const route = useRoute();
const {t} = useI18n();
const authStore = useAuthStore();

const openedSubmenus = ref([]);

const toggleSubmenu = (label) => {
  if (openedSubmenus.value.includes(label)) {
    openedSubmenus.value = openedSubmenus.value.filter(l => l !== label)
  } else {
    openedSubmenus.value.push(label)

  }
};

const isSubmenuOpen = (label) => {
  return openedSubmenus.value.includes(label)
};

const handleItemClick = (item) => {
  if (item.children && item.children.length) {
    toggleSubmenu(item.label);

    const firstChild = item.children[0];
    if (firstChild?.command) {
      firstChild.command();
    }
  } else if (item.command) {
    item.command();
  }
};

const menuItems = computed(() => [
  {
    label: "Navigation",
    items: [
      {
        label: t("title_filters"),
        icon: "pi pi-filter",
        command: () => router.push("/filters-configuration"),
        path: '/filters-configuration',
        userAccess: authStore.canManage
      },
      {
        label: t("title_products"),
        icon: "pi pi-shopping-cart",
        command: () => router.push("/products"),
        path: '/products',
        userAccess: authStore.canManage
      },
      {
        label: t("title_users"),
        icon: "pi pi-user",
        command: () => router.push("/users"),
        path: '/users',
        userAccess: authStore.canManage
      },
      {
        label: t("title_orders"),
        icon: "pi pi-clipboard",
        command: () => router.push("/orders"),
        path: '/orders',
        userAccess: authStore.canManage
      },
      {
        label: t("title_roles"),
        icon: "pi pi-id-card",
        command: () => router.push("/roles"),
        path: '/roles',
        userAccess: authStore.canManage
      },
      {
        label: t("title_static_information"),
        icon: "pi pi-list",
        command: () => router.push("/static-information"),
        path: '/static-information',
        userAccess: authStore.canManage,
        children: [
          {
            label: t("static_shipping_and_payment"),
            command: () => router.push("/static-information/shipping-and-payment"),
            userAccess: authStore.canManage
          },
          {
            label: t("static_about_us"),
            command: () => router.push("/static-information/about-us"),
            userAccess: authStore.canManage
          }
        ]
      }
    ],
  }
]);

const isActiveRoute = (command) => {
  const routePath = command.toString().match(/\/[a-z-/]+/i)?.[0];
  return route.path.startsWith(routePath);
};

const activeTab = computed(() => {
  const topLevel = menuItems.value?.[0]?.items ?? [];

  const activeItem = topLevel.find(item => isActiveRoute(item.command));
  if (!activeItem) return "";

  const activeChild = activeItem.children?.find(child => isActiveRoute(child.command));

  return activeChild
      ? `${activeItem.label} / ${activeChild.label}`
      : activeItem.label;
});

</script>


<style scoped>
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 100vh;
}

.sidebar {
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.main-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}

.topbar {
  color: #ADABC4;
  background: white;
  padding: 20px 20px;
  border-bottom-left-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-logo {
  padding: 10px 10px 30px 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.topbar__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 400px;
  width: 100%;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  position: relative;
}

.submenu {
  margin-top: 0.25rem;
  padding-left: 1rem;
}

.submenu-item {
  cursor: pointer;
  font-size: 16px;
}

.submenu-arrow {
  margin-left: auto;
  font-size: 0.8rem;
  transform: rotate(90deg);
}

.menu li {
  position: relative;
  color: #C1C1C1;
  margin: 5px 0px;
  padding: 0.5rem 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.menu li.active {
  color: #1C12EB;
  font-weight: bold;
}

.menu li.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background-color: #1A2795;
  border-radius: 2px;
}

.menu-item {
  font-size: 20px;
  display: flex;
  flex-direction: column;
}

.menu-link {
  display: flex;
  align-items: center;
}

.menu-icon {
  padding: 0 5px;
}

.content {
  min-width: 0;
  flex: 1;
  padding: 3rem;
  overflow-y: auto;
  background: #F5F7FA;
  border-top-left-radius: 15px;
}

.settings-btn {
  background-color: #EBEFF5;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease-in-out;
}

.settings-btn:hover {
  background-color: #d5d0d0 !important;
  border: none !important;
}

.settings-btn:active {
  transform: scale(0.9);
}
</style>
