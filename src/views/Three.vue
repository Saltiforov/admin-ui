<template>
  <FilterConfiguratorWrapper></FilterConfiguratorWrapper>
</template>

<script setup>
import { getFiltersList } from "@/services/api/filters-service.api.js";
import {onMounted, ref} from "vue";


const error = ref(null)
// как сделать кєш данных на юай на 5 минут и кнопку reset чтобы обновить их
const filters = ref([])
// example for using api routes
const fetchFiltersList = async () => {
  try {
    const response = await getFiltersList();
    filters.value = response?.data || []; // Сохраняем данные из ответа
  } catch (err) {
    error.value = 'Ошибка загрузки пользователей';
  }
};
onMounted(() => {
  fetchFiltersList();
});

</script>
