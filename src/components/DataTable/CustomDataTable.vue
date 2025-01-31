<template>
  <ThemeSwitcher/>
  <div class="card">
    <DataTable
        :value="products"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 10rem"
        class="custom-table"
    >
      <Column field="name" header="Name"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
               :alt="slotProps.data.image" class="w-full table-image h-auto rounded object-contain"/>
        </template>
      </Column>
      <Column field="price" header="Price">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.price) }}
        </template>
      </Column>
      <Column field="category" header="Category"></Column>
      <Column field="rating" header="Reviews">
        <template #body="slotProps">
          <Rating :modelValue="slotProps.data.rating" readonly/>
        </template>
      </Column>
      <Column header="Status">
        <template #body="slotProps">
          <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)"/>
        </template>
      </Column>
      <Column header="Details">
        <template #body="slotProps">
          <Button @click="showDetails(slotProps.data.id)">Show details</Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {ProductService} from "@/services/api/product-service.api.js";
import {useRouter} from 'vue-router';

onMounted(() => {
  ProductService.getProductsMini().then((data) => (products.value = data));
});

const router = useRouter()

const showDetails = (id) => {
  router.push({
    name: 'Details',
    params: {id},
  });
}

const products = ref();
const formatCurrency = (value) => {
  return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
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
.table-image {
  width: 150px;
}

.custom-table :deep(table) {
  border-collapse: collapse;
}

.custom-table :deep(th),
.custom-table :deep(td) {
  padding: 36px; /* Внутренний отступ */
}

.card {
  background: white;
  border-radius: 30px !important;
}

.custom-table__header {
  padding: 12px;
}


:deep(.p-datatable-table-container) {
  border-radius: 15px !important;
}
:deep(p-treetable p-component) {
  border-radius: 15px !important;
}

.custom-table__header-title {
  font-weight: 700;
  font-size: 1.50rem;
  line-height: 1.75rem;
}
</style>
