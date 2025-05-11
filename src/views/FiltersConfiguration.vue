<template>
  <FilterConfiguratorWrapper
      @filters-updated="filtersUpdated"
      :filters="filters"
  />
</template>

<script setup>
import { getFiltersList } from "@/services/api/filters-service.api.js";
import {onMounted, ref} from "vue";


const error = ref(null)
const filters = ref([])

const fetchFiltersList = async () => {
  const response = await getFiltersList();
  filters.value = response.list || [];
};

const resetCache = () => {
  fetchFiltersList();
};

const filtersUpdated = () => resetCache()

onMounted(() => {
  fetchFiltersList();
});

</script>
