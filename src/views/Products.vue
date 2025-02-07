<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar"/>
    <CustomDataTable
        title="Products"
        :config="dataTableConfig"
    >
      <template #image="{ data }">
        <img :src="data.image ? data.image : defaultProductImage" alt="Product image"
             class="table-image h-auto rounded object-contain"/>
      </template>
      <template #availability="{ data }">
        <i v-if="data.availability" class="pi pi-check" style="color: #575669FF"></i>
        <span v-else>---</span>
      </template>
      <template style="width: 5%" #actions="{ data }">
        <Button
            type="button"
            icon="pi pi-ellipsis-v"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            @click="(event) => toggle(event, data)"
        />
        <div>
        </div>
      </template>
    </CustomDataTable>
    <ConfirmDialog/>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
  </div>
</template>

<script setup>
import {computed, ref, watchEffect} from 'vue';
import {deleteProductById, getProductsList} from "@/services/api/product-service.api.js";
import { useToast } from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import router from "@/router/index.js";
import defaultProductImage from '@/assets/icons/shopping-bag.svg';
import ActionsButtonsBar from "@/components/ActionsButtonsBar/ActionsButtonsBar.vue";
import Button from "primevue/button";

const confirm = useConfirm();
const toast = useToast();

const inputCodeValue = ref('');
const noResultsMessage = ref('');

const addNewFilter = () => {
  console.log('Add new filter');
};
const saveFilters = () => {
  console.log('Save filters');
};
const onSearch = () => {
  console.log('Search', inputCodeValue.value);
};


const productData = ref({});
const toggle = (event, data) => {
  productData.value = data
  menu.value.toggle(event);
};


const menu = ref();
const items = ref([
  {
    label: 'Operations',
    items: [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => editProduct(productData.value._id),
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => confirmDelete(productData.value),
      },
    ],
  },
]);

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

const addNewProduct = () => {
  router.push({
    name: 'ProductCreate',
  });
}

const configActionsBar = ref({
  buttons: [
    {
      component: Button,
      props: {
        label: 'Add new product',
        class: 'filter-button',
        icon: 'pi pi-check',
      },
      onClick: addNewProduct
    },
  ],
});

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
    {field: 'availability', header: 'Availability', slotName: 'availability'},
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
