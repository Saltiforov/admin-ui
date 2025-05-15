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
import {useRoute, useRouter} from "vue-router";
import FieldsBlock from "@/components/DetailsPage/Blocks/FieldsBlock.vue";
import {createStaticPage, updateExistPageBySlug} from "@/services/api/static-information.js";

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

const route = useRoute();

const detailsPageData = computed(() => {
  return props.data[DETAILS_PAGES.STATIC_INFO_SHIPPING];
});

const lastSegment = computed(() => {
  const segments = route.path.split('/')
  const filtered = segments.filter(Boolean)
  return filtered[filtered.length - 1] || null
})

const pageSlug = computed(() => lastSegment.value)

const router = useRouter()

const fieldsBlockRef = ref(null);

const allData = ref({});

const collectDataFromComponents = async (e) => {
  allData.value = {
    ...fieldsBlockRef.value.getData(),
  };

  if (!detailsPageData.value) {
    await createStaticPage({
      slug: pageSlug.value,
      title: allData.value.title,
      locale: 'uk',
      content: allData.value.content,
    })
  } else {
    await updateExistPageBySlug(pageSlug.value, {
      slug: pageSlug.value,
      title: allData.value.title,
      locale: 'uk',
      content: allData.value.content,
    })
  }


};


</script>

<style scoped>
.page-container {
  position: relative;
}
</style>
