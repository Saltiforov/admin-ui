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
        @click="collectDataFromComponents"
    />
  </div>
</template>

<script setup>
import {computed, defineProps, ref} from 'vue';
import {createProduct, updateProductById} from "@/services/api/product-service.api.js";
import UploadFilesBlock from "@/components/DetailsPage/Blocks/UploadFilesBlock.vue";
import DynamicAttrsBlock from "@/components/DetailsPage/Blocks/DynamicAttrsBlock.vue";
import {DETAILS_PAGES} from "@/constants/pages.enum.js";
import FooterActionBlock from "@/components/DetailsPage/Blocks/FooterActionBlock.vue";

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
  return props.data[DETAILS_PAGES.PRODUCTS];
});

const isEditMode = computed(() => {
  return !!detailsPageData.value;
});

const productId = computed(() => detailsPageData.value._id)

const fieldsBlockRef = ref(null);
const uploadFilesRef = ref(null);
const dynamicAttrsRef = ref(null);

const allData = ref({});


const collectDataFromComponents = (e) => {
  console.log("collectDataFromComponents", e)
  allData.value = {
    ...fieldsBlockRef.value.getData(),
    ...dynamicAttrsRef.value.getData(),
  };
  handleProduct()
};

const fieldsErrors = ref(null);

const validateForm = () => {
  if (isEditMode && !allData.value) {
    return;
  }
  const requiredFields = props.blockList.fields.items.filter(field => field.props?.required);

  const invalidFields = requiredFields.filter(field => {
    const value = allData.value?.[field.name];
    return value === undefined || value === null || value === "";
  });

  if (invalidFields.length) {
    fieldsErrors.value = invalidFields.reduce((acc, field) => {
      acc[field.code] = `${field.label || field.code} is required`;
      return acc;
    }, {});
    return false;
  }
  fieldsErrors.value = {}
  return true;
};


const createNewProduct = async (product) => {
  props.startLoading()
  try {
    const res = await createProduct(product)
    if (res.status === 201 || res.status === 200) props.stopLoading()
  } catch (error) {
    console.error('Error in createProduct:', error);
  }
}

const handleProduct = async () => {
  props.startLoading()

  // if ( !validateForm() ) return;

  if (!isEditMode.value) {
    await createNewProduct(allData.value);
    return;
  }

  updateProductById(productId.value, allData.value)
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
