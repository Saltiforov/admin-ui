<template>
  <div class="page-container">
    <FieldsBlock
        :config="blockList.fields"
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

const rawOrderData = computed(() => props.data?.[DETAILS_PAGES.ORDERS]);

const selectId = 'relatedEntitiesSelect'

const selectedUser = ref({})

// watch(() => rawOrderData.value, (newValue, oldValue) => {
//   selectedUser.value = newValue.user;
// })

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

const getSelectedUserAddress = computed(() => selectedUser.value?.address || {})

const shippingInfo = computed(() => {
  if (selectedUser.value?.username) {
    // return getSelectedUserAddress.value;
    return rawOrderData.value?.shippingAddress;
  }
  return rawOrderData.value?.shippingAddress;
});

const userSelectOptions = computed(() => {
  if (!selectedUser.value?.username) {
    return {
      label: rawOrderData.value?.user?.username,
      code: rawOrderData.value?.user?._id
    };
  }
  return {
    label: selectedUser.value.username,
    code: selectedUser.value._id
  };
});

const paymentMethodOptions = computed(() => {
  const method = rawOrderData.value?.paymentMethod
  return {
    label: method === 'false' ? paymentMethodLabels['cash_on_delivery'] : paymentMethodLabels['send_sms'],
    value: method === 'false' ? 'cash_on_delivery' : 'send_sms'
  }
})

const paymentMethodLabels = {
  'send_sms': 'Відправити SMS по вказаних данних',
  'cash_on_delivery': 'Накладений платіж'
}

const orderUserFirstName = computed(() => {
  if (!selectedUser.value?.username) return rawOrderData.value?.customerInfo.firstName
  return selectedUser.value.firstName
})

const orderUserLastName = computed(() => {
  if (!selectedUser.value?.username) return rawOrderData.value?.customerInfo?.lastName
  return selectedUser.value.lastName
})

const orderUserEmail = computed(() => {
  if (!selectedUser.value?.username) return rawOrderData.value?.customerInfo?.email
  return selectedUser.value.email
})

const orderUserPhone = computed(() => {
  if (!selectedUser.value?.username) return rawOrderData.value?.customerInfo?.phone
  return selectedUser.value.phone
})

const orderUserTelegramUsername = computed(() => {
  if (!selectedUser.value?.username) return rawOrderData.value?.user?.telegramUsername ? rawOrderData.value?.user?.telegramUsername : rawOrderData.value?.customerInfo.telegramUsername
  return selectedUser.value.telegramUsername ? selectedUser.value?.telegramUsername : ''
})


const detailsPageData = computed(() => {
  const data = rawOrderData.value;
  if (!data || Object.keys(data).length === 0) {
    return {...selectedUser.value, ...selectedUser.value.address} || undefined;
  }

  const {orderStatus, description, ...rest} = data;

  return {
    ...rest,
    ...shippingInfo.value,
    paymentMethod: paymentMethodOptions.value,
    ...(orderStatus && {
      orderStatus: {
        label: getStatusLabel(orderStatus),
        value: orderStatus
      },
      orderComment: description,
      userSelect: userSelectOptions.value,
      firstName: orderUserFirstName.value,
      lastName: orderUserLastName.value,
      phone: orderUserPhone.value,
      telegramUsername: orderUserTelegramUsername.value,
      email: orderUserEmail,
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
  eventBus.on("handle-popup-data", async ({products}) => {
    if (!products || !Array.isArray(products)) return;

    const existingProducts = relatedConfig.value || [];
    const existingCodes = existingProducts.map(p => p.code);

    const newProducts = products.filter(item => !existingCodes.includes(item.code));

    relatedConfig.value = [
      ...existingProducts,
      ...newProducts.map(product => ({
        ...dataStore.getDataById(selectId, product.code),
        quantity: 1
      }))
    ];
  });

  eventBus.on("orderUserSelected", async (user) => {
    selectedUser.value = user;
  })

});

onUnmounted(() => {
  eventBus.off("handle-popup-data", (data) => {
    console.log("RelatedEntitiesBlock OrderDetailsWrapper", data);
  });
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
      street: inputData.street,
      city: inputData.city,
      postalCode: inputData.postalCode,
      country: inputData.country,
    },
    customerInfo: {
      phone: inputData.phone,
      telegramUsername: inputData.telegramUsername,
      firstName: selectedUser.value.firstName,
      lastName: selectedUser.value.lastName,
    },
    pricing: inputData.pricing,
    discount: inputData.discount,
    currency: inputData.currency,
    region: inputData.region,
    user: selectedUser.value,
    deliveryInfo: inputData.deliveryInfo,
    promoCode: inputData.promoCode,
    sms: inputData.sms,
    cashOnDelivery: inputData.cashOnDelivery,
    description: inputData.orderComment,
    paymentMethod: inputData.paymentMethod?.value,
    orderStatus: inputData.orderStatus?.value || 'pending',
    orderNumber: inputData.orderNumber,
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
