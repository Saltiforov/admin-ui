<template>
  <div>
    <div v-if="isLoading" class="loader-container">
      <ProgressSpinner class="loader-spinner" />
    </div>
    <component
        v-else
        :is="pageName"
        :config="config"
        :data="data"
        :isLoading="isLoading"
        :startLoading="startLoading"
        :stopLoading="stopLoading"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useDetailsConfig } from "@/composables/useDetailsConfig.js";
import ProgressSpinner from 'primevue/progressspinner';

const route = useRoute();
const pageType = route.meta.pageType; // например, "products" или "users"
const id = route.params.id;

console.log(" route.params.id", id)

const { config, data, pageName, isLoading, stopLoading, startLoading } = useDetailsConfig(pageType, id);
</script>

<style scoped>
.loader-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  margin-top: 35%;
}
.loader-spinner {
  width: 50px;
  height: 50px;
}
</style>
