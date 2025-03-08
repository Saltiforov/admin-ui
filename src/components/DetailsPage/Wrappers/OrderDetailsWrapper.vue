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
import {updateOrderById} from "@/services/api/orders-service.api.js";
import RelatedEntitiesTableBlock from "@/components/DetailsPage/Blocks/RelatedEntitiesTableBlock.vue";
import eventBus from "../../../../eventBus.js";
import {getProductById, getProductsList} from "@/services/api/product-service.api.js";
import AsyncMultiSelect from "@/components/UI/AsyncMultiSelect.vue";
import {useProductsStore} from "@/stores/useProductsStore.js";
import {storeToRefs} from "pinia";

const selectedOptions = ref([])

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

const relatedConfig = reactive({
  ...props.blockList?.relatedConfig,
  value: []
});

const store = useProductsStore();
const { products, loading } = storeToRefs(store);

onMounted(async () => {
  await store.fetchProducts();

  eventBus.on("handle-popup-data", async({ products }) => {

    console.log("handle-popup-data", products)

    relatedConfig.value = products
        .map(product => product.code)
        .map(code => {
          return store.getProductById(code)
        });



  });
});

onUnmounted(() => {
  eventBus.off("handle-popup-data", (data) => {
    console.log("RelatedEntitiesBlock OrderDetailsWrapper", data);
  });
})

const detailsPageData = computed(() => {
  return props.data[DETAILS_PAGES.PRODUCTS];
});

console.log("ORDER DETAILS WRAPPER ", detailsPageData.value);

const isEditMode = computed(() => {
  return !!detailsPageData.value;
});

const fieldsBlockRef = ref(null);
const uploadFilesRef = ref(null);
const dynamicAttrsRef = ref(null);

const orderId = computed(() => detailsPageData.value._id)

const allData = ref({});

function transformOrderData(inputData) {
  return {
    user: "ObjectId", // Здесь должен быть реальный ObjectId пользователя
    products: [], // Список товаров, пока пустой, так как их нет в входных данных
    shippingAddress: {
      street: inputData.street,
      city: inputData.city,
      postalCode: String(inputData.postalCode), // Преобразуем в строку, если необходимо
      country: inputData.country
    },
    totalAmount: inputData.totalAmount,
    discount: inputData.discount,
    tax: inputData.tax,
    orderStatus: inputData.orderStatus[0]?.value || "pending", // Достаём значение статуса
    orderNumber: Math.floor(Math.random() * 1000000) // Генерируем случайный номер заказа
  };
}

const collectDataFromComponents = (e) => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
  };
  handleOrder()
  console.log("collectDataFromComponents", transformOrderData(allData.value));
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
