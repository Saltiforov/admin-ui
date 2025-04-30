<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar" @update:filters="updateQuery"/>
    <CustomDataTable
        title="Products"
        :config="updatedDataTableConfig"
        :total-records="totalRecords"
        :loading="isLoading"
    >
      <template #image="{ data }">
        <div class="image-wrapper">
          <img :src="data.images.length ?  fullImageUrls(data.images)[0] : defaultProductImage" alt="Product image"
               class="table-image h-auto rounded object-contain"/>
        </div>
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
    <Toast/>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
  </div>
</template>

<script setup>
import {computed, ref, watch, watchEffect} from 'vue';
import {deleteProductById, getProductsList} from "@/services/api/product-service.api.js";
import router from "@/router/index.js";
import defaultProductImage from '@/assets/icons/shopping-bag.svg';
import ActionsButtonsBar from "@/components/ActionsButtonsBar/ActionsButtonsBar.vue";
import Button from "primevue/button";
import AsyncTreeSelect from "@/components/UI/AsyncTreeSelect.vue";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import {useRoute} from "vue-router";
import {createQueryString, fullImageUrls} from "@/utils/index.js";
import {useQueryUpdater} from "@/composables/useQueryUpdater.js";
import createDebouncedService from "@/services/debounceService/debounceService.js";
import CustomDataTable from "@/components/DataTable/CustomDataTable.vue";
import {useI18n} from "vue-i18n";
import {useConfirmDelete} from "@/composables/useConfirmDelete.js";
import {
  confirmProductsOptions
} from "@/services/factories/detailsPage/products/uiConfigs/configConfirm.js";
import {dataProductsTableConfig} from "@/services/factories/detailsPage/products/uiConfigs/tableConfig.js";

const route = useRoute()
const products = ref();
const isLoading = ref(true);

const {debounceService} = createDebouncedService();
const {updateQuery} = useQueryUpdater();
const {t} = useI18n();


const productData = ref({});
const toggle = (event, data) => {
  productData.value = data
  menu.value.toggle(event);
};


const menu = ref();
const items = ref([
  {
    label: computed(() => t("menu_popup_title")),
    items: [
      {
        label: computed(() => t("menu_popup_operation_edit")),
        icon: "pi pi-pencil",
        command: () => editProduct(productData.value._id),
      },
      {
        label: computed(() => t("menu_popup_operation_delete")),
        icon: "pi pi-trash",
        command: () => confirmDelete(),
      },
    ],
  },
]);

const totalRecords = ref(0);

const fetchProducts = async () => {
  isLoading.value = true;
  const res = await getProductsList(createQueryString(route.query));
  products.value = res.list
  totalRecords.value = res.count
  timeoutService.setTimeout(() => {
    isLoading.value = false;
  }, 500)
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

const configActionsBar = computed(() => {
  return {
    buttons: [
      {
        component: Button,
        props: {
          label: t('button_new_products'),
          class: 'filter-button',
          icon: 'pi pi-check',
        },
        onClick: () => {
          router.push({
            name: 'ProductCreate',
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
        component: AsyncTreeSelect,
        disablePropsBinding: true,
        name: 'filters',
        props: {
          restOptionsUrl: 'api/admin/filters',
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

watch(() => route.query, () => debounceService(fetchProducts, 500), {immediate: false});

timeoutService.setTimeout(() => {
  isLoading.value = false;
}, 1000)

const updatedDataTableConfig = ref({
  ...dataProductsTableConfig.value,
  value: products.value,
  rows: tableRows.value,
  skip: tableSkip.value,
})

watchEffect(() => {
  updatedDataTableConfig.value = {...updatedDataTableConfig.value, value: products.value};
});

const updatedConfirmOptions = {
  ...confirmProductsOptions,
  confirmMessage: computed(() => t("confirm_delete_message", {name: productData.value.name || "this item"})),
  acceptToastDetail: computed(() => t("confirm_accept_message", {name: productData.value.name || "this item"})),
  acceptAction: () => deleteProduct(productData.value._id),
  data: productData.value,
}

const {confirmDelete} = useConfirmDelete(updatedConfirmOptions)

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
