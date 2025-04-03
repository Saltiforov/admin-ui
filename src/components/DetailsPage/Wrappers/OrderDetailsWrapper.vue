<template>
  <div class="page-container">
    <FieldsBlock
        :config="blockList.fields"
        :data="detailsPageData"
        :errors="fieldsErrors"
        ref="fieldsBlockRef"
    />
    <RelatedEntitiesTableBlock
        :config="relatedConfig"
        :data="detailsPageData"
        :total-records="totalRecords"
        ref="relatedEntitiesBlockRef"
        @handle-delete="deleteRelatedEntitiesItem"
    />

    <FooterActionBlock
        :config="blockList.footerActions"
        :data="detailsPageData"
        @submit="collectDataFromComponents"
        @cancel="router.go(-1)"
    />
  </div>
</template>

<script setup>
import {computed, defineProps, onMounted, onUnmounted, reactive, ref, watch} from 'vue';
import {DETAILS_PAGES} from "@/constants/pages.enum.js";
import FooterActionBlock from "@/components/DetailsPage/Blocks/FooterActionBlock.vue";
import {createOrder, updateOrderById} from "@/services/api/orders-service.api.js";
import RelatedEntitiesTableBlock from "@/components/DetailsPage/Blocks/RelatedEntitiesTableBlock.vue";
import eventBus from "../../../../eventBus.js";
import {useDataStore} from "@/stores/dataStore.js";
import {useRouter} from "vue-router";
import {mappedFieldsForValidation} from "@/utils/index.js";
import {useFormHandler} from "@/composables/useFormHandler.js";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";

const props = defineProps({
  blockList: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  startLoading: {
    type: Function,
    required: true,
  },
  stopLoading: {
    type: Function,
    required: true,
  },
  useFetch: {
    type: Function,
    required: false,
  }
});

const dataStore = useDataStore();

const router = useRouter()

const selectId = 'relatedEntitiesSelect'

const totalRecords = computed(() => dataStore.getTotalCount(selectId))

const getStatusLabel = (status) => {
  const statusMap = {
    pending: "Pending",
    completed: "Completed",
    canceled: "Canceled",
    shipped: "Shipped",
    delivered: "Delivered",
    confirmed: "Confirmed",
  };
  return statusMap[status] || "Unknown";
};

const detailsPageData = computed(() => {
  const data = props.data[DETAILS_PAGES.ORDERS];

  if (!data || Object.keys(data).length === 0) {
    return undefined;
  }

  const {shippingAddress, orderStatus, ...rest} = data;

  return {
    ...rest,
    ...shippingAddress,
    ...(orderStatus && {
      orderStatus: {
        label: getStatusLabel(orderStatus),
        value: orderStatus
      }
    })
  };
});


watch(() => detailsPageData.value, (value) => {
  relatedConfig.value = value.products?.map(item => {
    return {
      ...item.product,
      quantity: item.quantity,
    }
  });
  const selectedData = value.products?.map(item => {
    return {
      label: item.product?.name,
      code: item.product?._id,
    }
  })
  dataStore.setSelectedData(selectId, selectedData)
})

const relatedConfig = reactive({
  ...props.blockList?.relatedConfig,
  value: [],
});

const deleteRelatedEntitiesItem = (item) => {
  const index = relatedConfig.value.findIndex(el => el._id === item._id);
  if (index !== -1) {
    relatedConfig.value.splice(index, 1);
  }
}

onMounted(async () => {
  eventBus.on("handle-popup-data", async ({products}) => {
    if (!products) return;
    const existingProducts = relatedConfig.value
    const existingCodes = existingProducts.map(p => p._id)
    const newProducts = products.filter(item => !existingCodes.includes(item.code));
    relatedConfig.value = [
      ...existingProducts,
      ...newProducts.map(product => ({
        ...dataStore.getDataById(selectId, product.code),
        quantity: 1
      }))
    ];
  });
});

onUnmounted(() => {
  eventBus.off("handle-popup-data", (data) => {
    console.log("RelatedEntitiesBlock OrderDetailsWrapper", data);
  });
})


const isEditMode = computed(() => !!detailsPageData.value);

const orderId = computed(() => detailsPageData.value._id)

const fieldsBlockRef = ref(null);
const relatedEntitiesBlockRef = ref(null);

const allData = ref({});

function prepareDataForSubmit(inputData) {
  return {
    products: Object.values(inputData.products).map(p => {
      const {quantity, ...productWithoutQuantity} = p;
      return {
        product: productWithoutQuantity,
        quantity: quantity
      };
    }),
    shippingAddress: {
      street: inputData.street,
      city: inputData.city,
      postalCode: inputData.postalCode,
      country: inputData.country
    },
    totalAmount: inputData.totalAmount,
    discount: inputData.discount || 0, // Если нет скидки, ставим 0
    tax: inputData.tax || 0, // Если нет налога, ставим 0
    orderStatus: inputData.orderStatus?.value || 'pending', // Если нет статуса, ставим 'pending'
    orderNumber: inputData.orderNumber
  };
}

const collectDataFromComponents = (e) => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
    products: {...relatedEntitiesBlockRef.value.getData()},
  };
  handleOrder()
};

const transformedData = computed(() => prepareDataForSubmit(allData.value))

const {
  handleSubmit,
  fieldsErrors,
} = useFormHandler(() => mappedFieldsForValidation(props.blockList?.fields.items), () => allData.value)

const action = computed(() => {
  return !isEditMode.value
      ? () => {
        createOrder(transformedData.value)
        router.go(-1)
      }
      : () => updateOrderById(orderId.value, transformedData.value)
})

const handleOrder = async () => {
  try {
    await handleSubmit(action.value)
    props.startLoading()
  } catch (error) {
    console.error('Error during order processing:', error);
  } finally {
    timeoutService.setTimeout(() => {
      props.stopLoading()
    }, 1000)
  }
};


</script>

<style scoped>
.page-container {
  position: relative;
}
</style>
