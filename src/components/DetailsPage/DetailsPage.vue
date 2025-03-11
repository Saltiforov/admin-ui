<template>
  <div>
    <div v-show="isLoading" class="loader-overlay">
      <ProgressSpinner class="loader-spinner" />
    </div>
    <component
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

const route = useRoute();
const pageType = route.meta.pageType;
const id = route.params.id;

console.log("route.params.id", route.params.id)

const {
  blockList,
  data,
  pageName,
  isLoading,
  stopLoading,
  startLoading,
  useFetch
} = usePagesConfig(pageType, { id });

console.log("usePagesConfig", data, blockList);

</script>

<style scoped>
.loader-spinner {
  width: 50px;
  height: 50px;
}
</style>
