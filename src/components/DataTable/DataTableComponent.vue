<template>
  <ThemeSwitcher />
  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
        <!-- Для изображения или других кастомных компонентов, рендерим через body -->
        <template v-if="col.body" #body="slotProps">
          <!-- Используем компонент ImageCell и передаем данные -->
          <component :is="col.body" :data="slotProps.data" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import {ProductService} from "@/services/api/product-service.api.js";

onMounted(() => {
  ProductService.getProductsMini().then((data) => (products.value = data));
});

const ImageCell = {
  props: ['data'],
  template: `
    <img :src="'https://primefaces.org/cdn/primevue/images/product/' + data.image"
         :alt="data.image"
         class="w-24 rounded" />
  `,
};

const products = ref();
const columns = [
  { field: 'code', header: 'Code' },
  { field: 'name', header: 'Name' },
  { field: 'category', header: 'Category' },
  { field: 'quantity', header: 'Quantity' },
  {
    header: 'Image',
    body: 'ImageCell' // Указываем имя компонента для изображения
  },
];

</script>
