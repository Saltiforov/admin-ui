<template>
  <div>
    <h1>Products Page</h1>
    <CustomDataTable
        title="Products"
        :data="products"
        :columns="columns"
    ></CustomDataTable>

    <DataTableComponent
        title="Products"
        :data="products"
        :columns="columns">
    </DataTableComponent>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/services/api/product-service.api.js';
import DataTableComponent from "@/components/DataTable/DataTableComponent.vue";

onMounted(() => {
  ProductService.getProductsMini()
      .then((data) => (products.value = data))
      // .then((data) => (products.value = data.map(product => {
      //   return {
      //     ...product,
      //     image: `https://primefaces.org/cdn/primevue/images/product/${product.image}`
      //   }
      // })))

});

const products = ref();
console.log(products.value);
const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warn';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
};

// Компонент для отображения изображения
const ImageComponent = {
  props: ['data'],
  template: `
    <div v-html="'<img src=https://primefaces.org/cdn/primevue/images/product/' + data.image + ' alt=' + data.image + ' class=w-24 rounded />'"></div>
  `,
};

// Компонент для отображения рейтинга
const RatingComponent = {
  props: ['data'],
  template: '<Rating :modelValue="data.rating" readonly />',
};

const columns = ref([
  { field: 'name', header: 'Name' },
  {
    field: 'price',
    header: 'Price',
    body: ({ data }) => `$${data.price}`,
  },
  {
    header: 'Image',
    body: ImageComponent, // Передаем компонент для отображения изображения
  },
  {
    field: 'rating',
    header: 'Reviews',
    body: RatingComponent, // Передаем компонент для отображения рейтинга
  },
]);





</script>
