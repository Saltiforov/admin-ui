<template>
  <div class="page-container">
    <FieldsBlock
        :config="blockList.fields"
        :data="detailsPageData"
        :errors="fieldsErrors"
        ref="fieldsBlockRef"
    />
    <UploadFilesBlock
        ref="uploadFilesRef"
        :config="blockList.files"
        :data="detailsPageData"
    />
    <DynamicAttrsBlock
        ref="dynamicAttrsRef"
        :config="blockList.dynamicAttrs"
        :data="detailsPageData"
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
import {computed, defineProps, onMounted, onUnmounted, ref} from 'vue';
import {updateProductById, createProduct} from "@/services/api/product-service.api.js";
import UploadFilesBlock from "@/components/DetailsPage/Blocks/UploadFilesBlock.vue";
import DynamicAttrsBlock from "@/components/DetailsPage/Blocks/DynamicAttrsBlock.vue";
import {DETAILS_PAGES} from "@/constants/pages.enum.js";
import FooterActionBlock from "@/components/DetailsPage/Blocks/FooterActionBlock.vue";
import {useRoute, useRouter} from "vue-router";
import eventBus from "../../../../eventBus.js";
import {useFormHandler} from "@/composables/useFormHandler.js";
import {mappedFieldsForValidation} from "@/utils/index.js";
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

const detailsPageData = computed(() => {
  const data = props.data[DETAILS_PAGES.PRODUCTS]
  return {
    ...data,
    discount_uah: data?.discount?.uah || 0,
    discount_usd: data?.discount?.usd || 0,
    price_uah: data?.price?.uah || 0,
    price_usd: data?.price?.usd || 0,
  }
});

const route = useRoute();

console.log("route", route)

const isEditMode = computed(() => !!route.params.id);

const productId = computed(() => detailsPageData.value._id)

const router = useRouter()

const fieldsBlockRef = ref(null);
const uploadFilesRef = ref(null);
const dynamicAttrsRef = ref(null);

const allData = ref({});

const collectDataFromComponents = () => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
    ...dynamicAttrsRef.value.getData(),
    images: uploadFilesRef.value.getData()
  };

  handleProduct()
};


const createNewProduct = async (product) => {
  try {
    await createProduct(product).then(res => {
      const {data} = res
      eventBus.emit("handleImageUpload", data._id)
      router.go(-1);
    })
  } catch (error) {
    console.error('Error in createProduct:', error);
  }
}

const mergeImages = (originalData, newImages) => {
  return Object.assign({}, originalData, {images: newImages.length ? newImages : originalData.images});
};


const {handleSubmit, fieldsErrors} = useFormHandler(
    () => mappedFieldsForValidation(props.blockList?.fields.items),
    () => allData.value
);

const uploadedImages = ref([])

const action = computed(() => {
  return !isEditMode.value
      ? (data) => createNewProduct(data)
      : (data) => {
        updateProductById(productId.value, mergeImages(data, uploadedImages.value))
      }
})

const handleProduct = async () => {
  props.startLoading()
  try {
    await handleSubmit(action.value)
  } catch (error) {
    console.error('Error during product processing:', error);
  } finally {
    timeoutService.setTimeout(() => {
      props.stopLoading()
    }, 1000)
  }
};


onMounted(() => {
  eventBus.on("uploadImages", (response) => {
    uploadedImages.value = response.data.images;
  })
})

onUnmounted(() => {
  eventBus.off("uploadImages")
})
</script>

<style scoped>
.page-container {
  position: relative;
}
</style>
