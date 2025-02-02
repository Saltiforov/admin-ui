<template>
  <div>
    <CustomDataTable
        title="Products"
        :config="dataTableConfig"
    >
      <template #header="{ data }">
        <Button @click="addNewProduct(data)"> Add new product </Button>
      </template>
      <template #image="{ data }">
        <img :src="`https://primefaces.org/cdn/primevue/images/product/${data.image}`" alt="Product image"
             class="w-full table-image h-auto rounded object-contain"/>
      </template>
      <template style="width: 5%" #actions="{ data }">
        <Button class="action-button"  @click="editProduct(data._id)"> <i class="pi pi-pencil" style="font-size: 1rem"></i> </Button>
        <Button class="action-button"  @click="confirmDelete(data)"> <i class="pi pi-trash" style="font-size: 1rem"></i> </Button>
      </template>
    </CustomDataTable>
    <ConfirmDialog/>
  </div>
</template>

<script setup>
import {ref, watchEffect} from 'vue';
import {deleteProductById, getProductsList} from "@/services/api/product-service.api.js";
import { useToast } from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import router from "@/router/index.js";

const confirm = useConfirm();
const toast = useToast();


const products = ref();

const fetchProducts = async () => {
  products.value = await getProductsList()
}
fetchProducts()

const editProduct = (id) => {
  router.push({
    name: 'DetailsPage',
    params: {id},
  });
};

const deleteProduct = async (id) => {
  products.value = products.value.filter((item) => item._id !== id);
  await deleteProductById(id)
};

const addNewProduct = (data) => {
}


const dataTableConfig = ref({
  value: products.value,
  paginator: true,
  rows: 5,
  rowsPerPageOptions: [5, 10, 20, 50],
  tableStyle: "min-width: 50rem",
  class: "custom-table",
  columns: [
    {field: 'name', header: 'Name'},
    {
      field: 'image',
      header: 'Image',
      slotName: 'image',  // Указываем имя слота
    },
    {field: 'price', header: 'Price'},
    {field: 'description', header: 'Description'},
    {field: 'category', header: 'Category'},
    {field: 'availability', header: 'Availability'},
    {
      field: 'actions',
      header: '',
      slotName: 'actions',  // Указываем имя слота
      style: 'width: 10%',
    },
  ],
});

watchEffect(() => {
  dataTableConfig.value = { ...dataTableConfig.value, value: products.value };
});

const confirmDelete = (product) => {
  console.log(confirm.require)
  confirm.require({
    message: `Are you sure you want to delete "${product.name || 'this item'}"?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      deleteProduct(product._id)
      toast.add({
        severity: 'info',
        summary: 'Deleted',
        detail: `The "${product.name || 'this item'}" has been deleted`,
        life: 3000
      });
    },
    reject: () => {
      toast.add({severity: 'error', summary: 'Cancelled', detail: 'Deletion was cancelled', life: 3000});
    },
  });
};

</script>

<style scoped>

.custom-table :deep(table) {
  border-collapse: collapse;
}

.custom-table :deep(th),
.custom-table :deep(td) {
  padding: 36px !important; /* Внутренний отступ */
}

.action-button {
  margin: 0 10px;
}

.products-page__title {
  font-size: 20px;
  padding: 10px;
}
</style>
