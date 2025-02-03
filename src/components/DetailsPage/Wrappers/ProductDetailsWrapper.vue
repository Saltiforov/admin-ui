<template>
  <div class="page-container">
    <FieldsBlock :config="config.fields" :data="data" />
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
import {computed, defineProps, ref, watch} from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import {deepClone} from "@/utils/index.js";

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
  return props.data && props.data._id;  // Предполагаем, что "id" означает наличие данных для редактирования
});

const onSubmit = () => {
  //todo send create product request
  // todo check post or put (u can use route id for this)
  console.log('SUBMIT', props.data);
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
