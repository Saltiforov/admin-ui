<template>
  <div class="page-container">
    <FieldsBlock
        :config="config.fields"
        :data="data"
        :errors="fieldsErrors"
        @update:formData="handleFormDataUpdate"
    />
    <UploadFilesBlock :config="config.files" :data="data" />
    <DynamicAttrsBlock :config="config.dynamicAttrs" :data="data" />
    <FooterActionBlock :config="config.footerActions" :data="data" @submit="onSubmit" />

    <!-- Лоадер, который отображается поверх содержимого при загрузке -->
    <div v-if="isLoading" class="loader-overlay">
      <!-- Можно использовать любой компонент лоадера, например, из PrimeVue -->
      <ProgressSpinner class="loader-spinner" />
    </div>
  </div>
</template>

<script setup>
import {computed, defineProps, onMounted, ref, watch} from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import {createProduct, updateProductById} from "@/services/api/product-service.api.js";

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
  }
});

const isEditMode = computed(() => {
  return !!props.data;  // Предполагаем, что "id" означает наличие данных для редактирования
});


const productData = ref(null);

onMounted(() => {
  console.log("onMounted", props.config);
})

const fieldsErrors = ref(null);

const validateForm = () => {
  if (isEditMode && !productData.value) {
    return;
  }
  const requiredFields = props.config.fields.items.filter(field => field.props?.required);

  const invalidFields = requiredFields.filter(field => {
    const value = productData.value?.[field.name];
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

const formatOptionsForSubmit = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.map(item => item.name);
  }

  if (typeof data === "object" && data.name) {
    return [data.name];
  }

  return [];
};

const createNewProduct = async (product) => {
  try {
    const data = {
      ...product,
      tags: formatOptionsForSubmit(product.tags),
      deliveryOptions: formatOptionsForSubmit(product.deliveryOptions),
    }
    await createProduct(data)
  } catch (error) {
    console.error('Error in createProduct:', error);
  }
}



const handleFormDataUpdate = (newFormData) => {
  productData.value = newFormData;
};



const onSubmit = async (action) => {

  if ( !validateForm() ) return;

  if (!isEditMode.value) {
    await createNewProduct(productData.value);
    return;
  }

  await updateProductById(props.data._id, productData.value)



  //todo send create product request
  // todo check post or put (u can use route id for this)
  console.log('onSubmit', action);
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
