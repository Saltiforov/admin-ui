<template>
  <div>
    <div v-show="config.isLoading" class="loader-overlay">
      <ProgressSpinner class="loader-spinner"/>
    </div>
    <component
        :is="config.pageName"
        :blockList="extractComputedPlaceholders(config.blockList)"
        :data="config.data"
        :isLoading="config.isLoading"
        :startLoading="config.startLoading"
        :stopLoading="config.stopLoading"
        :useFetch="config.useFetch"
    />
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {usePagesConfig} from "@/composables/usePagesConfig.js";
import ProgressSpinner from 'primevue/progressspinner';
import {computed, isRef, ref, unref, watch} from "vue";

const route = useRoute();
const id = route.params.id;

const config = ref({});

watch(() => route.meta.pageType, (newType) => {
  config.value = usePagesConfig(newType, { id });
}, { immediate: true });

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
