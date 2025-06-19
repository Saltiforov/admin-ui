<template>
  <div class="page-container">
    <FieldsBlock
        :config="updatedBlocklistFields"
        :data="detailsPageData"
        :errors="fieldsErrors"
        :context-id="detailsPageData.orderNumber"
        ref="fieldsBlockRef"
    />
    <RelatedEntitiesTableBlock
        :config="relatedConfig"
        :data="detailsPageData"
        :total-records="totalRecords"
        ref="relatedEntitiesBlockRef"
        :default-value-popup="selectedPopupData"
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
import {useRoute, useRouter} from "vue-router";
import {capitalizeFirstLetter, mappedFieldsForValidation} from "@/utils/index.js";
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

const route = useRoute()

const selectId = 'relatedEntitiesSelect'

const rawOrderData = computed(() => props.data?.[DETAILS_PAGES.ORDERS]);

const selectedPopupData = computed({
  get: () => dataStore.getSelectedData(selectId).value,
  set: (val) => dataStore.setSelectedData(selectId, val),
})

const selectedUser = ref({})

watch(() => rawOrderData?.value?.region, (newValue) => {
  selectedRegion.value = newValue;
})

const selectedRegion = ref('ua')

const updatedBlocklistFields = computed(() => {
  const blockList = props.blockList?.fields?.items
  if (!blockList) return {}

  const updatedBlocks = blockList.map(block => {
    const clonedBlock = { ...block }

    if (block.blockTitle === "label_shipping_information") {
      if (selectedRegion.value === 'ua') {
        clonedBlock.children = block.children.filter(
            field => field.code === 'country' || field.code === 'city'
        )
      } else if (selectedRegion.value === 'eu') {
        clonedBlock.children = [...block.children]
      }
    }

    if (block.blockTitle === "label_user_information") {
      if (selectedRegion.value === 'eu') {
        clonedBlock.children = block.children
      } else {
        clonedBlock.children = block.children.filter(
            field => field.code !== 'email'
        )
      }
    }

    return clonedBlock
  })

  return {
    items: updatedBlocks
  }
})


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


const shippingInfo = computed(() => {
  if (selectedUser.value?.username) {
    // return getSelectedUserAddress.value;
    return rawOrderData.value?.shippingAddress;
  }
  return rawOrderData.value?.shippingAddress;
});

const detailsPageData = computed(() => {
  const data = rawOrderData.value;
  if (!data || Object.keys(data).length === 0) {
    return {...selectedUser.value, ...selectedUser.value.address} || undefined;
  }

  const {orderStatus, description, customerInfo, ...rest} = data;

  return {
    ...rest,
    ...shippingInfo.value,
    ...customerInfo,
    ...(orderStatus && {
      orderStatus: {
        label: getStatusLabel(orderStatus),
        value: orderStatus
      },
      orderComment: description,
      region: selectedRegion.value,
      ...(selectedRegion.value === 'ua' && {
        country: 'Ukraine'
      }),
    })
  };

});


watch(() => detailsPageData.value, (value) => {

  if (selectedUser.value?.address) return

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

  eventBus.on('remove-selected', (id) => {
    selectedPopupData.value = selectedPopupData.value.filter(item => item.code !== id)
  })

  eventBus.on("handle-popup-data", async ({products}) => {

    console.log(products)

    if (!products || !Array.isArray(products)) return;

    const existingProducts = relatedConfig.value || [];

    const existingIds = existingProducts.map(p => p._id);

    const newProducts = products.filter(item => !existingIds.includes(item.code));

    relatedConfig.value = [
      ...existingProducts,
      ...newProducts.map(product => ({
        ...dataStore.getDataById(selectId, product.code),
        quantity: 1
      }))
    ];
  });

  eventBus.on("select-input-value", async (value) => {
    selectedRegion.value = value
  })

});

onUnmounted(() => {
  eventBus.off("handle-popup-data");
  eventBus.off("select-input-value");
})

const orderId = computed(() => route.params.id)

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
      city: inputData.city,
      ...(selectedRegion.value === 'eu' && {
        street: inputData.street,
        postalCode: inputData.postalCode,
        country: inputData.country,
      }),
    },
    customerInfo: {
      phone: inputData.phone,
      telegramUsername: inputData.telegramUsername,
      firstName: inputData.firstName,
      lastName: inputData.lastName,
      email: inputData.email,
    },
    pricing: inputData.pricing,
    discount: inputData.discount,
    currency: inputData.currency,
    region: inputData.region,
    user: inputData.user,
    deliveryInfo: inputData.deliveryInfo,
    cashOnDelivery: inputData.cashOnDelivery,
    description: inputData.orderComment,
    orderStatus: inputData.orderStatus?.value || 'pending',
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
  return !orderId.value
      ? () => {
        createOrder({...transformedData.value, region: "ua"})
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
