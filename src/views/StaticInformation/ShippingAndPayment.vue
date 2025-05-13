<template>
  <div class="page-container">
    <FieldsBlock
        :config="blockList.fields"
        :data="detailsPageData"
        :errors="fieldsErrors"
        ref="fieldsBlockRef"
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
import {computed, defineProps, ref} from "vue";
import {useRouter} from "vue-router";
import FooterActionBlock from "@/components/DetailsPage/Blocks/FooterActionBlock.vue";
import {mappedFieldsForValidation, handleRequest} from "@/utils/index.js";
import {DETAILS_PAGES} from "@/constants/pages.enum.js";
import {useFormHandler} from "@/composables/useFormHandler.js";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import FieldsBlock from "@/components/DetailsPage/Blocks/FieldsBlock.vue";

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
});

const isEditMode = computed(() => {
  return !!props.data;
})

const detailsPageData = computed(() => {
  return props.data[DETAILS_PAGES.PRODUCTS];
});

const router = useRouter()

const fieldsBlockRef = ref(null);

const allData = ref({});

const collectDataFromComponents = (e) => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
  };
};


</script>

<style scoped>

</style>