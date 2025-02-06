<template>
  <div class="page-container">
    <FieldsBlock
        :config="config.fields"
        :data="data"
        :errors="fieldsErrors"
        ref="fieldsBlockRef"
    />
    <UploadFilesBlock
        ref="uploadFilesRef"
        :config="config.files"
        :data="data"
    />
    <DynamicAttrsBlock
        ref="dynamicAttrsRef"
        :config="config.dynamicAttrs"
        :data="data"
    />
    <FooterActionBlock :config="config.footerActions" :data="data" @submit="collectDataFromComponents"/>

    <!-- Лоадер, который отображается поверх содержимого при загрузке -->
    <div v-if="isLoading" class="loader-overlay">
      <!-- Можно использовать любой компонент лоадера, например, из PrimeVue -->
      <ProgressSpinner class="loader-spinner"/>
      {{ allData }}
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


const props = defineProps({
  config: {
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
  }
});

const isEditMode = computed(() => {
  return !!props.data;  // Предполагаем, что "id" означает наличие данных для редактирования
});

const fieldsBlockRef = ref(null);
const uploadFilesRef = ref(null);
const dynamicAttrsRef = ref(null);

const allData = ref({});

const collectDataFromComponents = () => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
    ...dynamicAttrsRef.value.getData(),
  };
  console.log("collectDataFromChildren", allData.value);
  onSubmit()
};


onMounted(() => {
  console.log("onMounted", props.config);
})

const fieldsErrors = ref(null);

const validateForm = () => {
  if (isEditMode && !allData.value) {
    return;
  }
  const requiredFields = props.config.fields.items.filter(field => field.props?.required);

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

const onSubmit = async () => {
  props.startLoading()

  // if ( !validateForm() ) return;

  if (!isEditMode.value) {
    await createNewProduct(allData.value);
    return;
  }

  updateProductById(props.data._id, allData.value)
      .then((res) => {
        if (res.status === 200) props.stopLoading()
      })
};

watch(
    () => props.data,
    (newFilters) => {
      console.log('ON DATA CHANGE', newFilters)
    }
);

watch(
    () => props.isLoading,
    (isLoading) => {
      console.log('ON DATA CHANGE isLoading', isLoading)
    }
);

console.log('props', props);
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
