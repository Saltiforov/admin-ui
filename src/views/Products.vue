<template>
  <div>
    <CustomDataTable
        title="Products"
        :data="products"
    ></CustomDataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/services/api/product-service.api.js';

onMounted(() => {
  ProductService.getProductsMini()
      .then((data) => (products.value = data))
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

</script>

<style scoped>
.products-page__title {
  font-size: 20px;
  padding: 10px;
}
</style>
