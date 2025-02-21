<template>
  <div class="page-container">
    <FieldsBlock
        :config="blockList.fields"
        :data="data"
        :errors="fieldsErrors"
        @update:formData="handleFormDataUpdate"
    />
    <UploadFilesBlock
        :config="blockList.files"
        :data="data"
    />
    <FooterActionBlock
        :config="blockList.footerActions"
        :data="data"
    />

    <!-- Лоадер, который отображается поверх содержимого при загрузке -->
    <div v-if="isLoading" class="loader-overlay">
      <!-- Можно использовать любой компонент лоадера, например, из PrimeVue -->
      <ProgressSpinner class="loader-spinner" />
    </div>
  </div>
</template>

<script setup>
import ProgressSpinner from "primevue/progressspinner";
import {defineProps} from "vue";

const props = defineProps({
  // SEPARETE FROM blockList add dynamic render for every key in blockList
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
  }
});

</script>



<style scoped>

</style>
