<template>
  <FilterConfiguratorWrapper v-if="filters.length" :filters="filters"></FilterConfiguratorWrapper>
  <button @click="resetCache">reset</button>
</template>

<script setup>
import { getFiltersList } from "@/services/api/filters-service.api.js";
import {onMounted, ref} from "vue";


const error = ref(null)
const filters = ref([])

const cacheDuration = 5 * 60 * 1000;
const cacheKey = "filtersCache";
const cacheTimestampKey = "filtersCacheTimestamp";

const fetchFiltersList = async () => {
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

  if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < cacheDuration) {
    console.log("Используем кешированные данные");
    filters.value = JSON.parse(cachedData);
  } else {
    console.log("Запрашиваем новые данные");
    try {
      const response = await getFiltersList();
      filters.value = response || [];

      localStorage.setItem(cacheKey, JSON.stringify(filters.value));
      localStorage.setItem(cacheTimestampKey, Date.now().toString());

      console.log("fetchFiltersList", filters.value);
    } catch (err) {
      error.value = 'Ошибка загрузки пользователей';
    }
  }
};

const resetCache = () => {
  localStorage.removeItem(cacheKey);
  localStorage.removeItem(cacheTimestampKey);
  fetchFiltersList();
};

onMounted(() => {
  fetchFiltersList();
});

</script>
