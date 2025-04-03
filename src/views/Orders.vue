<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar" @update:filters="updateQuery"/>
    <CustomDataTable
        title="Orders"
        :config="updatedDataTableConfig"
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
import {useI18n} from "vue-i18n";
import {useConfirmDelete} from "@/composables/useConfirmDelete.js";
import {confirmOrderOptions} from "@/services/factories/detailsPage/orders/uiConfigs/confirmOptions.js";
import {dataOrderTableConfig} from "@/services/factories/detailsPage/orders/uiConfigs/tableConfig.js";

const {updateQuery} = useQueryUpdater();
const {debounceService} = createDebouncedService();
const route = useRoute()

const {t} = useI18n();

const ordersList = ref([])

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
          restOptionsUrl: 'api/filters',
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

const updatedDataTableConfig = ref({
  ...dataOrderTableConfig.value,
  value: ordersList.value,
})

const updatedConfirmOrderOptions = {
  ...confirmOrderOptions,
  confirmMessage: computed(() => t("confirm_delete_message", {name: orderData.value.name || "this item"})),
  acceptToastDetail: computed(() => t("confirm_accept_message", {name: orderData.value.name || "this item"})),
  acceptAction: () => deleteOrder(orderData.value._id),
  data: orderData.value,
};

const {confirmDelete} = useConfirmDelete(updatedConfirmOrderOptions)

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

watchEffect(() => {
  updatedDataTableConfig.value = {...updatedDataTableConfig.value, value: mappedOrders.value};
});
</script>


<style scoped></style>