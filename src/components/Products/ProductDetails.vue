<template>
  <div>
    <h1>Product Details</h1>
    <div v-if="product">
      <p><strong>Code:</strong> {{ product.code }}</p>
      <p><strong>Name:</strong> {{ product.name }}</p>
      <p><strong>Category:</strong> {{ product.category }}</p>
      <p><strong>Quantity:</strong> {{ product.quantity }}</p>
      <img :src="'https://primefaces.org/cdn/primevue/images/product/' + product.image" alt="Product Image" />
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);

onMounted(async () => {
  route.params;
  console.log('currentProduct', route.params);
});
</script>
