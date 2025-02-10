<template>
  <div>
    <div v-if="isLoading" class="loader-container">
      <ProgressSpinner class="loader-spinner" />
    </div>
    <component
        v-else
        :is="pageName"
        :blockList="blockList"
        :data="data"
        :isLoading="isLoading"
        :startLoading="startLoading"
        :stopLoading="stopLoading"
        :useFetch="useFetch"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { usePagesConfig } from "@/composables/usePagesConfig.js";
import ProgressSpinner from 'primevue/progressspinner';
import {DETAILS_PAGES} from "@/constants/pages.enum.js";

const route = useRoute();
const pageType = route.meta.pageType; // например, "products" или "users"
const id = route.params.id;

const {
  blockList,
  data,
  pageName,
  isLoading,
  stopLoading,
  startLoading,
  useFetch
} = usePagesConfig(pageType, { id });
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
