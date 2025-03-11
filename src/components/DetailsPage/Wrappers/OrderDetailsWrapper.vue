<template>
  <div class="page-container">
    <FieldsBlock
        :config="blockList.fields"
        :data="detailsPageData"
        :errors="errors"
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
        @click="collectDataFromComponents"
    />
  </div>
</template>

<script setup>
import {computed, defineProps, onMounted, onUnmounted, reactive, ref} from 'vue';
import {DETAILS_PAGES} from "@/constants/pages.enum.js";
import FooterActionBlock from "@/components/DetailsPage/Blocks/FooterActionBlock.vue";
import {createOrder, updateOrderById} from "@/services/api/orders-service.api.js";
import RelatedEntitiesTableBlock from "@/components/DetailsPage/Blocks/RelatedEntitiesTableBlock.vue";
import eventBus from "../../../../eventBus.js";
import {useDataStore} from "@/stores/dataStore.js";
import {storeToRefs} from "pinia";

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

const totalRecords = computed(() => dataStore.getTotalCount)

const relatedConfig = reactive({
  ...props.blockList?.relatedConfig,
  value: []
});

const deleteRelatedEntitiesItem = (item) => {
  const index = relatedConfig.value.findIndex(el => el._id === item._id);
  if (index !== -1) {
    relatedConfig.value.splice(index, 1);
  }
}


onMounted(async () => {
  eventBus.on("handle-popup-data", async ({products}) => {
    relatedConfig.value = products
        .map(product => product.code)
        .map(code => {
          return {...dataStore.getDataById(code), quantity: 1}
        });
  });
});

onUnmounted(() => {
  eventBus.off("handle-popup-data", (data) => {
    console.log("RelatedEntitiesBlock OrderDetailsWrapper", data);
  });
})

const detailsPageData = computed(() => props.data[DETAILS_PAGES.ORDERS]);

const isEditMode = computed(() => !!detailsPageData.value);

const orderId = computed(() => detailsPageData.value._id)



const fieldsBlockRef = ref(null);
const relatedEntitiesBlockRef = ref(null);

const allData = ref({});

function transformOrderData(inputData) {
  return {
    products: Object.values(inputData.products).map(p => {
      const { quantity, ...productWithoutQuantity } = p;
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
    orderStatus: inputData.orderStatus || 'pending', // Если нет статуса, ставим 'pending'
    orderNumber: inputData.orderNumber
  };
}

const collectDataFromComponents = async (e) => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
    products: {...relatedEntitiesBlockRef.value.getData()},
  };
  // handleOrder()
  await createOrder(transformOrderData(allData.value))
  console.log("collectDataFromComponents", );
};

const fieldsErrors = ref(null);


const handleOrder = async () => {
  props.startLoading()

  if (!isEditMode.value) {
    console.log("createNewProduct")
    return;
  }

  updateOrderById(orderId.value, allData.value)
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            props.stopLoading()
          }, 1000)
        }
      })
};


</script>

<style scoped>
.page-container {
  position: relative;
}
</style>
