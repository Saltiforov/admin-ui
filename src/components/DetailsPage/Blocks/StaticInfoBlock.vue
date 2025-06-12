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
        <Button label="Добавить секцию" type="button" @click="addNewSection"/>
      </div>
    </div>

    <div class="block-wrapper">
      <div
          v-for="(section, sectionIdx) in localConfig.blockSections"
          :key="sectionIdx"
          class="block-section mb-10 border relative"
      >
        <div
            class="block-section-header"
            :style="{ justifyContent: isAccordionFields ? 'space-between' : 'flex-end' }"
        >
          <div v-if="isAccordionFields" class="input-wrapper">
            <p class="form__title mb-1">{{ t('static_accordion_name') }}:</p>
            <InputText class="block-pair__input" v-model="section.title"/>
          </div>

          <div v-if="sectionIdx !== 0" class="button-wrapper">
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
            class="block-pair relative"
        >
          <div
              v-if="blockIdx !== 0"
              class="close-button"
              @click="removeBlock(sectionIdx, blockIdx)"
              aria-label="Удалить блок"
          >
            <i class="pi pi-times-circle"></i>
          </div>

          <div v-if="isAccordionFields">
            <p class="form__title mb-1">{{ t('static_accordion_heading') }}:</p>
            <InputText class="block-pair__input" v-model="block.title"/>
          </div>

          <div v-if="!isAccordionFields" class="editor-upload-wrapper flex gap-4 items-start">
            <!-- Редактор -->
            <div class="flex-1">
              <p class="form__title mb-1">{{ t('static_accordion_text') }}:</p>
              <Editor v-model="block.content"/>
            </div>

            <div class="image-content-wrapper w-[200px]">
              <div v-if="block.imagePreview" class="image-preview-wrapper relative">
                <img
                    :src="block.imagePreview"
                    alt="preview"
                    class="preview-img rounded"
                />
                <div class="remove-image" @click="removeImage(block)">
                  <i class="pi pi-times"></i>
                </div>
              </div>

              <FileUpload
                  mode="basic"
                  name="file"
                  accept="image/*"
                  :maxFileSize="1000000"
                  chooseLabel="Загрузить"
                  @select="onImageSelect($event, block)"
                  customUpload
              />
            </div>
          </div>

          <div v-else>
            <p class="form__title mb-1">{{ t('static_accordion_text') }}:</p>
            <Editor v-model="block.content"/>
          </div>
        </div>

        <Button
            label="Добавить блок в секцию"
            class="mt-2"
            type="button"
            @click="addBlockToSection(sectionIdx)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from "vue";
import {useI18n} from "vue-i18n";
import Select from "primevue/select";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Editor from "primevue/editor";
import FileUpload from "primevue/fileupload";

import {generatePageData} from "@/utils/index.js";

const {t} = useI18n();

const props = defineProps({
  data: {type: Object, required: true},
  config: {type: Object, required: true}
});

const localConfig = ref({});
const pageTitle = ref("");
const selectedDisplayType = ref({});
const isAccordionFields = computed(() => selectedDisplayType.value?.value === "accordion");

const options = [
  {label: t("without_accordion"), value: "plain"},
  {label: t("accordion"), value: "accordion"}
];

const addNewSection = () => {
  localConfig.value.blockSections.push({
    title: "",
    blocks: [{title: "", content: "", imagePreview: ""}]
  });
};

const addBlockToSection = idx => {
  localConfig.value.blockSections[idx].blocks.push({
    title: "",
    content: "",
    imagePreview: ""
  });
};

const removeBlock = (sIdx, bIdx) => {
  localConfig.value.blockSections[sIdx].blocks.splice(bIdx, 1);
};

const removeSection = idx => {
  localConfig.value.blockSections.splice(idx, 1);
};

function onImageSelect(event, block) {
  const file = event.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    block.imagePreview = reader.result;
  };
  reader.readAsDataURL(file);
}

function removeImage(block) {
  block.imagePreview = "";
}

function applyConfigFromData(data) {
  if (data && typeof data === "object") {
    if (data.accordion) {
      localConfig.value = {
        blockSections: Array.isArray(data.content)
            ? data.content.map(section => ({
              title: section.title || "",
              blocks: Array.isArray(section.blocks)
                  ? section.blocks.map(block => ({
                    title: block.title || "",
                    content: block.content || "",
                  }))
                  : []
            }))
            : []
      };
    } else {
      localConfig.value = {
        blockSections: [
          {
            title: "",
            blocks: Array.isArray(data.content)
                ? data.content.map(block => ({
                  title: "",
                  content: block.content || "",
                  image: block.image || "",
                  imagePosition: block.imagePosition || "left",
                  split: block.split || false,
                }))
                : []
          }
        ]
      };
    }

    pageTitle.value = data.title || "";
    selectedDisplayType.value = data.accordion
        ? options.find(o => o.value === "accordion")
        : options.find(o => o.value === "plain");
  } else {
    localConfig.value = { ...props.config };
  }
}


onMounted(() => applyConfigFromData(props.data));
watch(
    () => props.data,
    d => applyConfigFromData(d),
    {deep: true}
);

/* ─── Экспорт данных наружу ───────────────────────────────────────── */
function getData() {
  return generatePageData(
      "shipping-and-payment",
      isAccordionFields.value,
      pageTitle.value,
      localConfig.value.blockSections
  );
}

defineExpose({getData});
</script>

<style scoped>
/* — базовые стили (сокращены) — */
.static-info-block {
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 0 15px;
}

.image-content-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.image-preview-wrapper {
  margin-bottom: 8px;
}

.display-type {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.block-section {
  background: #fff;
  border: 1px solid #cfcfcf;
  border-radius: 8px;
  padding: 20px;
}

.block-section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 16px;
}

.block-pair {
  background: #fdfdfd;
  border: 1px dashed #c5c5c5;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  color: #6b7280;
}

.image-preview-wrapper {
  position: relative;
  max-width: 200px;
  max-height: 150px;
  overflow: hidden;
  border-radius: 6px;
}

.preview-img {
  max-width: 100%;
  max-height: 150px;
  display: block;
  object-fit: contain;
  border-radius: 6px;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.remove-image:hover {
  background: rgba(255, 0, 0, 0.8);
}
</style>
