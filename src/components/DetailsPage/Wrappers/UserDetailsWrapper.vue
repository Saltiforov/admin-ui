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
import {useRoute, useRouter} from "vue-router";
import UploadFilesBlock from "@/components/DetailsPage/Blocks/UploadFilesBlock.vue";
import FooterActionBlock from "@/components/DetailsPage/Blocks/FooterActionBlock.vue";
import {mappedFieldsForValidation, handleRequest} from "@/utils/index.js";
import {DETAILS_PAGES} from "@/constants/pages.enum.js";
import {useFormHandler} from "@/composables/useFormHandler.js";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import FieldsBlock from "@/components/DetailsPage/Blocks/FieldsBlock.vue";
import {createUser, createUserById} from "@/services/api/user-service.api.js";

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

const route = useRoute();

const isEditMode = computed(() => !!route.params.id);

const detailsPageData = computed(() => {
  const data = props.data[DETAILS_PAGES.USERS];
  const { address, ...restData } = data || {};
  return {
    ...restData,
    ...address
  }
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

const prepareDataForSubmit = (data) => {
  const {
    street,
    city,
    country,
    postalCode,
    postal_code,
    ...rest
  } = data;

  return {
    ...rest,
    address: {
      street,
      city,
      country,
      postalCode: postalCode ?? postal_code ?? '',
    },
  };
};


const transformedData = computed(() => prepareDataForSubmit(allData.value))


const {
  handleSubmit,
  fieldsErrors,
} = useFormHandler(() => mappedFieldsForValidation(props.blockList?.fields.items), () => allData.value)

const action = computed(() => {
  return !isEditMode.value
      ? () => createUser(transformedData.value)
      : () => createUserById(route.params.id, transformedData.value)
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
