<template>
  <div>
    <h1>Products Page</h1>
    <CustomDataTable
        title="Products"
        :data="products"
        :columns="columns"
    ></CustomDataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/services/api/product-service.api.js';

onMounted(() => {
  ProductService.getProductsMini().then((data) => (products.value = data));
});

const products = ref();
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

const columns = [
  { field: 'name', header: 'Name' },
  {
    header: 'Image',
    body: {
      template: {
        name: 'ImageCell',
        render: (props) => {
          return `<img src="https://primefaces.org/cdn/primevue/images/product/${props.data.image}" alt="${props.data.image}" class="w-24 rounded" />`;
        },
      },
    },
  },
  {
    field: 'price',
    header: 'Price',
    body: ({ data }) => {
      return data.price;
    },
  },
  {
    field: 'reviews',
    header: 'Rating',
  },
];
</script>
