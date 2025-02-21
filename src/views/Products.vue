<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar"/>
    <CustomDataTable
        title="Products"
        :config="dataTableConfig"
        :loading="isLoading"
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
import AsyncTreeSelect from "@/components/UI/AsyncTreeSelect.vue";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";

const confirm = useConfirm();
const toast = useToast();

const inputCodeValue = ref('');
const noResultsMessage = ref('');

const onSearch = () => {
  console.log('onSearch', inputCodeValue.value);
};
const onChangeFilter = (val) => {
  console.log('onChangeFilter', val);
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
  const res = await getProductsList()
  products.value = res.list
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
  filters: [
    {
      component: AsyncTreeSelect,
      disablePropsBinding: true,
      name: 'filters',
      props: {
        restOptionsUrl: 'api/filters',
        placeholder: 'Select filters, please',
        selectionMode: 'multiple',
        class: 'w-full product-input md:w-56',
        required: false,
        showClear: true,
        fullWidth: true,
        'onUpdate:modelValue': onChangeFilter,
      }
    },
    {
      component: 'IconField',
      disablePropsBinding: false,
      name: 'iconField',
      props: {},
      children: [
        {
          component: 'InputIcon',
          props: {
            class: 'pi pi-search',
          },
        },
        {
          component: 'InputText',
          props: {
            vModel: inputCodeValue,
            placeholder: 'Enter the code, please.',
            onInput: onSearch,
          },
        },
      ],
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
      slotName: 'image',
    },
    {field: 'price', header: 'Price', sortable: true},
    {field: 'description', header: 'Description'},
    {field: 'category', header: 'Category'},
    {field: 'availability', header: 'Availability', slotName: 'availability'},
    {
      field: 'actions',
      header: '',
      slotName: 'actions',
      style: 'width: 10%',
    },
  ],
});

watchEffect(() => {
  dataTableConfig.value = { ...dataTableConfig.value, value: products.value };
});

// const isLoading = computed(() => !products.value);
const isLoading = ref(true);

timeoutService.setTimeout(() => {
  isLoading.value = false;
},1000)

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
