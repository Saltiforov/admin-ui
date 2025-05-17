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
        <InputText class="page-title w-full" v-model="pageTitle" />
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
            <InputText class="block-pair__input" v-model="section.title" />
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
            <InputText class="block-pair__input" v-model="block.blockTitle" />
          </div>

          <div>
            <p class="form__title mb-1">{{ t('static_accordion_text') }}:</p>
            <Editor v-model="block.blockContent" />
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
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import { generatePageData } from "@/utils/index.js";

const { t } = useI18n();

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
  { label: t("without_accordion"), value: "plain" },
  { label: t("accordion"), value: "accordion" },
];

const addNewSection = () => {
  localConfig.value.blockSections.push({
    title: "",
    blocks: [{ blockTitle: "", blockContent: "" }],
  });
};

const addBlockToSection = (sectionIdx) => {
  localConfig.value.blockSections[sectionIdx].blocks.push({
    blockTitle: "",
    blockContent: "",
  });
};

const removeBlock = (sectionIdx, blockIdx) => {
  localConfig.value.blockSections[sectionIdx].blocks.splice(blockIdx, 1);
};

const removeSection = (sectionIdx) => {
  localConfig.value.blockSections.splice(sectionIdx, 1);
};

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

onMounted(() => {
  if (props.data && typeof props.data === 'object') {
    localConfig.value = {
      blockSections: Array.isArray(props.data.content)
          ? props.data.content.map(section => ({
            title: section.title || "",
            blocks: Array.isArray(section.blocks)
                ? section.blocks.map(block => ({
                  blockTitle: block.blockTitle || "",
                  blockContent: block.blockContent || "",
                }))
                : [],
          }))
          : [],
    };

    pageTitle.value = props.data.slug || "";
    selectedDisplayType.value = props.data.accordion
        ? options.find(opt => opt.value === "accordion")
        : options.find(opt => opt.value === "plain");
  } else {
    localConfig.value = {...props.config}
  }
});
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
}

.block-pair__input {
  margin-bottom: 12px;
  width: 100%;
}

.block-pair {
  position: relative;
}

.block-pair-action {
  margin: 26px 12px;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
  transition: color 0.4s;
}

.close-button:hover {
  color: #ef4444;
}

.block-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.input-wrapper {
  flex: 1;
}

.button-wrapper {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
