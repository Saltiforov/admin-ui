<template>
  <div class="page-container">
    <FieldsBlock
        :config="blockList.fields"
        :data="detailsPageData"
        :errors="fieldsErrors"
        ref="fieldsBlockRef"
    />
    <UploadFilesBlock
        :config="blockList.files"
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
import {computed, defineProps, ref} from "vue";
import {useRouter} from "vue-router";
import UploadFilesBlock from "@/components/DetailsPage/Blocks/UploadFilesBlock.vue";
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
  handleUser()
};


const {
  handleSubmit,
  fieldsErrors,
} = useFormHandler(() => mappedFieldsForValidation(props.blockList?.fields.items), () => allData.value)

const action = computed(() => {
  return !isEditMode.value
      // ? () => createUser(transformedData.value)
      // : () => updateUserById(orderId.value, transformedData.value)
})

const handleUser = async () => {
  props.startLoading()

  try {
    await handleSubmit(action.value)
  } catch (error) {
    console.error('Error during user processing:', error);
  } finally {
    timeoutService.setTimeout(() => {
      props.stopLoading()
    }, 1000)
  }
};


</script>


<style scoped>

</style>
