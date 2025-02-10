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
    <FooterActionBlock :config="blockList.footerActions" :data="detailsPageData" @submit="collectDataFromComponents"/>

    <div v-if="isLoading" class="loader-overlay">
      <ProgressSpinner class="loader-spinner"/>
    </div>
  </div>
</template>

<script setup>
import {computed, defineProps, onMounted, ref, watch} from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import {createProduct, updateProductById} from "@/services/api/product-service.api.js";
import {login} from "@/services/api/auth-serivce.api.js";
import UploadFilesBlock from "@/components/DetailsPage/Blocks/UploadFilesBlock.vue";
import DynamicAttrsBlock from "@/components/DetailsPage/Blocks/DynamicAttrsBlock.vue";
import {DETAILS_PAGES} from "@/constants/pages.enum.js";


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
  return !!detailsPageData.data;
});

const fieldsBlockRef = ref(null);
const uploadFilesRef = ref(null);
const dynamicAttrsRef = ref(null);

const allData = ref({});

console.log('blockList', props.blockList);

const collectDataFromComponents = () => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
    ...dynamicAttrsRef.value.getData(),
  };
  console.log("collectDataFromChildren", allData.value);
  onSubmit()
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

const emit = defineEmits(['productUpdated'])

const onSubmit = async () => {
  props.startLoading()

  // if ( !validateForm() ) return;

  if (!isEditMode.value) {
    await createNewProduct(allData.value);
    return;
  }

  updateProductById(detailsPageData._id, allData.value)
      .then((res) => {
        if (res.status === 200) {
          console.log("updateProductById", res)
          props.useFetch()
          props.stopLoading()
        }
      })
};
</script>

<style scoped>
.page-container {
  position: relative; /* для абсолютного позиционирования overlay внутри */
}

/* Стили для overlay лоадера */
.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000; /* поверх всего контента */
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8); /* полупрозрачный фон */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Дополнительные стили для лоадера, если требуется */
.loader-spinner {
  width: 50px;
  height: 50px;
}
</style>
