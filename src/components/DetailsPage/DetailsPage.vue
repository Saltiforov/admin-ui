<template>
  <div>
    <div v-show="isLoading" class="loader-overlay">
      <ProgressSpinner class="loader-spinner" />
    </div>
    <component
        :is="pageName"
        :blockList="extractComputedPlaceholders(blockList)"
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
import {isRef, unref} from "vue";

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

function extractComputedPlaceholders(config) {
  if (!config?.fields?.items) return config;

  return {
    ...config,
    fields: {
      ...config.fields,
      items: config.fields.items.map(item => {
        if (item?.props?.placeholder && isRef(item.props.placeholder)) {
          return {
            ...item,
            props: {
              ...item.props,
              placeholder: unref(item.props.placeholder),
            },
          };
        }
        return item;
      }),
    },
  };
}
</script>

<style scoped>
.loader-spinner {
  width: 50px;
  height: 50px;
}
.color {
  color: black;
}
</style>
