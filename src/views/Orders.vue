<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar" @update:filters="updateQuery"/>
    <CustomDataTable
        title="Orders"
        :config="dataTableConfig"
        :loading="isLoading"
    >
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

import {computed, ref, watch, watchEffect} from "vue";
import {deleteOrderById, getOrdersList} from "@/services/api/orders-service.api.js";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import router from "@/router/index.js";
import {useQueryUpdater} from "@/composables/useQueryUpdater.js";
import {extractFields} from '@/utils/index.js'
import createDebouncedService from "@/services/debounceService/debounceService.js";
import {useRoute} from "vue-router";
import Button from "primevue/button";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

const {updateQuery} = useQueryUpdater();
const {debounceService} = createDebouncedService();


const ordersList = ref([])

const menu = ref();
const items = ref([
  {
    label: 'Operations',
    items: [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => editOrder(orderData.value._id),
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => confirmDelete(orderData.value),
      },
    ],
  },
]);

const confirm = useConfirm();
const toast = useToast();

const orderData = ref(null)

const editOrder = (id) => {
  router.push({
    name: 'OrderDetailsPage',
    params: {id},
  });
}

const toggle = (event, data) => {
  orderData.value = data
  menu.value.toggle(event);
};

const deleteOrder = async (id) => {
  ordersList.value = ordersList.value.filter((item) => item._id !== id);
  await deleteOrderById(id)
}

const route = useRoute()

const configActionsBar = ref({
  buttons: [
    {
      component: 'Button',
      props: {
        label: 'Add new order',
        class: 'filter-button',
        icon: 'pi pi-check',
      },
      onClick: () => {
        router.push({
          name: 'OrderCreate',
        });
      }
    },
  ],
  filters: [
    {
      component: 'IconField',
      disablePropsBinding: false,
      name: 'q',
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
            placeholder: 'Enter the code, please.',
            class: 'w-full',
          },
        },
      ],
    },
    {
      component: 'AsyncTreeSelect',
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
      }
    },
  ],
});

const dataTableConfig = ref({
  value: ordersList.value,
  paginator: true,
  rows: 10,
  skip: 0,
  scrollable: true,
  rowsPerPageOptions: [10, 20, 30, 50],
  tableStyle: 'max-width: 100%; overflow-x: auto; border-radius: 20px',
  class: "custom-table",
  size: 'null',
  columns: [
    {field: 'discount', header: 'Discount'},
    {field: 'orderNumber', header: 'Order Number'},
    {field: 'orderStatus', header: 'Order Status'},
    {field: 'tax', header: 'Tax'},
    {field: 'totalAmount', header: 'Total Amount'},
    {field: 'createdAt', header: 'Created At'},
    {field: 'updatedAt', header: 'Updated At'},
    {field: 'street', header: 'Street', class: 'multiline-truncate'},
    {field: 'city', header: 'City', class: 'multiline-truncate'},
    {field: 'postalCode', header: 'Postal Code', class: 'multiline-truncate'},
    {field: 'country', header: 'Country', class: 'multiline-truncate'},
    {
      field: 'actions',
      header: '',
      slotName: 'actions',
      style: 'width: 5%',
    },
  ]
});

const confirmDelete = (order) => {
  confirm.require({
    message: `Are you sure you want to delete this item?`,
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
      deleteOrder(order._id)
      toast.add({
        severity: 'info',
        summary: 'Deleted',
        detail: `this item has been deleted`,
        life: 3000
      });
    },
    reject: () => {
      toast.add({severity: 'error', summary: 'Cancelled', detail: 'Deletion was cancelled', life: 3000});
    },
  });
};

const fetchOrdersList = async () => {
  ordersList.value = await getOrdersList();
}
fetchOrdersList()

watch(() => route.query, () => debounceService(fetchOrdersList, 500), {immediate: false});

const mappedOrders = computed(() => extractFields(ordersList.value, "shippingAddress"));

const isLoading = ref(true);

timeoutService.setTimeout(() => {
  isLoading.value = false
}, 1000);

console.log("mappedOrders", extractFields(ordersList.value, "shippingAddress"))
console.log("mappedOrders",  ordersList.value)

watchEffect(() => {
  dataTableConfig.value = {...dataTableConfig.value, value: mappedOrders.value};
});

</script>


<style scoped>

</style>