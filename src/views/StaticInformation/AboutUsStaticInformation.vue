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
import {computed, defineProps, onMounted, onUnmounted, reactive, ref, watch} from 'vue';
import {DETAILS_PAGES} from "@/constants/pages.enum.js";
import FooterActionBlock from "@/components/DetailsPage/Blocks/FooterActionBlock.vue";
import {createOrder, updateOrderById} from "@/services/api/orders-service.api.js";
import RelatedEntitiesTableBlock from "@/components/DetailsPage/Blocks/RelatedEntitiesTableBlock.vue";
import {useDataStore} from "@/stores/dataStore.js";
import {useRoute, useRouter} from "vue-router";
import {capitalizeFirstLetter, mappedFieldsForValidation} from "@/utils/index.js";
import {useFormHandler} from "@/composables/useFormHandler.js";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import FieldsBlock from "@/components/DetailsPage/Blocks/FieldsBlock.vue";
import {createStaticPage} from "@/services/api/static-information.js";

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

const isEditMode = computed(() => {
  return !!props.data;
})

const detailsPageData = computed(() => {
  return props.data[DETAILS_PAGES.PRODUCTS];
});

const router = useRouter()

const fieldsBlockRef = ref(null);

const allData = ref({});

const collectDataFromComponents = async (e) => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
  };

  await createStaticPage({
    slug: 'about-us',
    title: "About Us",
    locale: 'uk',
    content: allData.value.description,
  })

  console.log("collectDataFromComponents", allData.value);
};


</script>

<style scoped>
.page-container {
  position: relative;
}
</style>
