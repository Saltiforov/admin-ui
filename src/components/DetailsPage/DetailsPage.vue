<template>
  <div>
    <FieldsBlock :config="config" :data="data"></FieldsBlock>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import { useDetailsConfig } from "@/composables/useDetailsConfig.js";

const route = useRoute();
const pageType = route.meta.pageType; // например, "products" или "users"
const id = route.params.id;

const { config, data } = useDetailsConfig(pageType, id);

</script>

<style scoped>

</style>