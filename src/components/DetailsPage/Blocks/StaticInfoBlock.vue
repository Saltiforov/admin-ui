<template>
  <div class="static-info-block">
    <div class="display-type">
      <div>
        <p class="form__title mb-1">{{ t("display_type_label") }}:</p>
        <Select
            class="w-full"
            v-model="selectedDisplayType"
            :options="options"
            optionLabel="label"
            placeholder="Select a Display Type"
        />
      </div>
      <div>
        <p class="form__title mb-1">{{ t("static_page_title") }}:</p>
        <InputText class="page-title w-full" v-model="pageTitle"/>
      </div>
      <div class="block-pair-action">
        <Button
            type="button"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            label="Добавить секцию"
            @click="addNewSection"
        />
      </div>
    </div>

    <div class="block-wrapper">
      <div
          v-for="(section, sectionIdx) in localConfig.blockSections"
          :key="sectionIdx"
          class="block-section mb-10 border relative"
      >
        <div :style="{ justifyContent: isAccordionFields ? 'space-between' : 'flex-end' }" class="block-section-header">
          <div v-if="isAccordionFields" class="input-wrapper">
            <p class="form__title mb-1">{{ t('static_accordion_name') }}:</p>
            <InputText class="block-pair__input" v-model="section.title"/>
          </div>

          <div class="button-wrapper" v-if="sectionIdx !== 0">
            <Button
                icon="pi pi-trash"
                class="p-button-danger p-button-sm"
                @click="removeSection(sectionIdx)"
                label="Удалить секцию"
            />
          </div>
        </div>

        <div
            v-for="(block, blockIdx) in section.blocks"
            :key="blockIdx"
            class="block-pair relative mb-6"
        >
          <div
              v-if="blockIdx !== 0"
              @click="removeBlock(sectionIdx, blockIdx)"
              class="close-button"
              aria-label="Удалить блок"
          >
            <i class="pi pi-times-circle"></i>
          </div>

          <div>
            <p class="form__title mb-1">{{ t('static_accordion_heading') }}:</p>
            <InputText class="block-pair__input" v-model="block.title"/>
          </div>

          <div>
            <p class="form__title mb-1">{{ t('static_accordion_text') }}:</p>
            <Editor v-model="block.content"/>
          </div>
        </div>

        <Button
            type="button"
            label="Добавить блок в секцию"
            class="mt-2"
            @click="addBlockToSection(sectionIdx)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from "primevue/select";
import {computed, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import Button from "primevue/button";
import {generatePageData} from "@/utils/index.js";

const {t} = useI18n();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    required: true,
  },
});

const localConfig = ref({});

const pageTitle = ref("");

const selectedDisplayType = ref({});

const isAccordionFields = computed(() => selectedDisplayType?.value["value"] === "accordion");

const options = [
  {label: t("without_accordion"), value: "plain"},
  {label: t("accordion"), value: "accordion"},
];

const addNewSection = () => {
  localConfig.value.blockSections.push({
    title: "",
    blocks: [{title: "", content: ""}],
  });
};

const addBlockToSection = (sectionIdx) => {
  localConfig.value.blockSections[sectionIdx].blocks.push({
    title: "",
    content: "",
  });
};

const removeBlock = (sectionIdx, blockIdx) => {
  localConfig.value.blockSections[sectionIdx].blocks.splice(blockIdx, 1);
};

const removeSection = (sectionIdx) => {
  localConfig.value.blockSections.splice(sectionIdx, 1);
};

console.log("")

const getData = () => {
  const result = generatePageData(
      "shipping-and-payment",
      isAccordionFields.value,
      pageTitle.value,
      localConfig.value.blockSections
  );
  return result;
};

defineExpose({
  getData,
});

function applyConfigFromData(data) {
  if (data && typeof data === 'object') {
    localConfig.value = {
      blockSections: Array.isArray(data.content)
          ? data.content.map(section => ({
            title: section.title || "",
            blocks: Array.isArray(section.blocks)
                ? section.blocks.map(block => ({
                  title: block.title || "",
                  content: block.content || "",
                }))
                : [],
          }))
          : [],
    };

    pageTitle.value = data.title || "";

    selectedDisplayType.value = data.accordion
        ? options.find(opt => opt.value === "accordion")
        : options.find(opt => opt.value === "plain");
  } else {
    localConfig.value = {...props.config};
  }
}

onMounted(() => {
  applyConfigFromData(props.data);
});

watch(
    () => props.data,
    (newData) => {
      applyConfigFromData(newData);
    },
    {immediate: false, deep: true}
);

</script>

<style scoped>

.static-info-block {
  max-width: 1200px;
  padding: 0 15px;
  margin: 0 auto 24px;
}

.display-type {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 20px;
  border: 1px solid #dcdcdc;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.block-section {
  position: relative;
  border: 1px solid #cfcfcf;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 40px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.block-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 16px;
}

.input-wrapper {
  flex: 1;
}

.button-wrapper {
  flex-shrink: 0;
  white-space: nowrap;
}

.block-pair {
  position: relative;
  padding: 16px;
  border-radius: 6px;
  background-color: #fdfdfd;
  border: 1px dashed #c5c5c5;
  margin-bottom: 24px;
}

.block-pair__input {
  margin-bottom: 12px;
  width: 100%;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
  font-size: 18px;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #e63946;
}

.form__title {
  font-weight: 700;
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
  color: #222222;
}

.block-pair {
  position: relative;
  padding: 16px;
  border-radius: 6px;
  background-color: #fdfdfd;
  border: 1px dashed #c5c5c5;
  margin-bottom: 32px;
}

.block-pair-action {
  margin: 26px 12px;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;
}

.mt-2 {
  margin-top: 16px;
}
</style>

