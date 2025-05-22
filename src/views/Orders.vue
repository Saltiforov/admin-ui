<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar" @update:filters="updateQuery"/>
    <CustomDataTable
        title="Orders"
        :config="updatedDataTableConfig"
        :totalRecords="totalRecords"
        :loading="isLoading"
    >
      <template #status="{ data }">
          <span :style="getStatusStyle(data.orderStatus)">
            {{ capitalizeFirstLetter(data.orderStatus) }}
          </span>
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
import {computed, ref, watch, watchEffect} from "vue";
import {deleteOrderById, getOrdersList} from "@/services/api/orders-service.api.js";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import router from "@/router/index.js";
import {useQueryUpdater} from "@/composables/useQueryUpdater.js";
import {capitalizeFirstLetter, extractFields} from '@/utils/index.js'
import createDebouncedService from "@/services/debounceService/debounceService.js";
import {useRoute} from "vue-router";
import Button from "primevue/button";
import {useI18n} from "vue-i18n";
import {useConfirmDelete} from "@/composables/useConfirmDelete.js";
import {confirmOrderOptions} from "@/services/factories/detailsPage/orders/uiConfigs/confirmOptions.js";
import {dataOrderTableConfig} from "@/services/factories/detailsPage/orders/uiConfigs/tableConfig.js";
import CustomDataTable from "@/components/DataTable/CustomDataTable.vue";

const {updateQuery} = useQueryUpdater();
const {debounceService} = createDebouncedService();
const route = useRoute()
const pizza = ref([true])
const {t} = useI18n();

const ordersList = ref([])

const isLoading = ref(true);

const menu = ref();
const items = ref([
  {
    label: computed(() => t("menu_popup_title")),
    items: [
      {
        label: computed(() => t("menu_popup_operation_edit")),
        icon: "pi pi-pencil",
        command: () => editOrder(orderData.value._id),
      },
      {
        label: computed(() => t("menu_popup_operation_delete")),
        icon: "pi pi-trash",
        command: () => confirmDelete(),
      },
    ],
  },
]);

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

const configActionsBar = computed(() => {
  return {
    buttons: [
      {
        component: 'Button',
        props: {
          label: t('button_new_orders'),
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
              placeholder: t('placeholder_code_search'),
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
          restOptionsUrl: 'api/admin/filters-configuration',
          placeholder: t('placeholder_filters_select'),
          selectionMode: 'multiple',
          class: 'w-full product-input md:w-56',
          required: false,
          showClear: true,
          fullWidth: true,
        }
      },
    ],
  }
})

const tableRows = ref(route.query.limit ? parseInt(route.query.limit) : 10);
const tableSkip = ref(route.query.skip ? parseInt(route.query.skip) : 0);

const updatedDataTableConfig = ref({
  ...dataOrderTableConfig.value,
  value: ordersList.value,
  rows: tableRows.value,
  skip: tableSkip.value,
})

const updatedConfirmOrderOptions = {
  ...confirmOrderOptions,
  confirmMessage: computed(() => t("confirm_delete_message", {name: orderData.value.name || "this item"})),
  acceptToastDetail: computed(() => t("confirm_accept_message", {name: orderData.value.name || "this item"})),
  acceptAction: () => deleteOrder(orderData.value._id),
  data: computed(() => orderData.value),
};

const {confirmDelete} = useConfirmDelete(updatedConfirmOrderOptions)

const totalRecords = ref(0)

const fetchOrdersList = async () => {
  isLoading.value = true;
  const response = await getOrdersList();
  ordersList.value = response.list
  totalRecords.value = response.count
  timeoutService.setTimeout(() => {
    isLoading.value = false;
  }, 500)
}

fetchOrdersList()

watch(() => route.query, () => debounceService(fetchOrdersList, 500), {immediate: false});

const mappedOrders = computed(() => extractFields(ordersList.value, "shippingAddress"));


timeoutService.setTimeout(() => {
  isLoading.value = false
}, 1000);

watchEffect(() => {
  updatedDataTableConfig.value = {...updatedDataTableConfig.value, value: mappedOrders.value};
});

const statusColorMap = {
  pending: '#facc15',
  processing: '#3b82f6',
  confirmed: '#06b6d4',
  shipped: '#64748b',
  in_transit: '#0ea5e9',
  out_for_delivery: '#f97316',
  delivered: '#22c55e',
  delayed: '#f43f5e',
  failed: '#dc2626',
  canceled: '#e11d48',
  returned: '#3b82f6',
  refunded: '#10b981',
  on_hold: '#eab308',
  awaiting_payment: '#fb923c',
  awaiting_fulfillment: '#7c3aed'
};


const getStatusStyle = (status) => {
  const normalized = status.toLowerCase().replace(/\s+/g, '_');
  const backgroundColor = statusColorMap[normalized] || '#e2e3e5';
  return {
    backgroundColor,
    color: 'rgba(0,0,0,0.87)',
    padding: '4px 8px',
    borderRadius: '8px',
    display: 'inline-block',
  };
};
</script>


<style scoped></style>