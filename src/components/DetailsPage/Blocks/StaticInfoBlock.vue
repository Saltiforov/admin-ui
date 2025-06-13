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
        <Button label="Добавить секцию" type="button" @click="addNewSection" />
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
            <InputText class="block-pair__input" v-model="section.title" />
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
            <InputText class="block-pair__input" v-model="block.title" />
            <p class="form__title mb-1">{{ t('static_accordion_text') }}:</p>
            <Editor v-model="block.content" />
          </div>

          <div v-else>
            <div class="flex items-center justify-between mb-2 px-5">
              <div class="switch-options-box flex items-center justify-between gap-2  px-3 py-2 rounded bg-gray-100">
                <span class="text-black">Картинка слева</span>
                <ToggleSwitch
                    v-model="block.imagePosition"
                    :trueValue="'right'"
                    :falseValue="'left'"
                />
                <span class="text-black">Картинка справа</span>
              </div>

              <div class="flex items-center gap-2">
                <Checkbox
                    v-model="block.split"
                    :binary="true"
                    inputId="splitCheckbox"
                />
                <label for="splitCheckbox" class="text-black">Отображать пункты списка в две колонки</label>
              </div>
            </div>


            <div
                :class="[
                  'editor-upload-wrapper flex gap-4 items-start w-full',
                  block.imagePosition === 'right' ? 'flex-row' : 'flex-row-reverse'
                ]"
            >
              <div class="flex-1">
                <p class="form__title mb-1">{{ t('static_accordion_text') }}:</p>
                <Editor v-model="block.content" />
              </div>

              <div class="image-content-wrapper w-[300px] flex flex-col justify-between min-h-[300px]">
                <div v-if="block.imagePreview" class="image-preview-wrapper relative w-full h-[300px]">
                  <img
                      :src="block.imagePreview"
                      alt="preview"
                      class="preview-img rounded object-cover w-full h-full"
                  />
                  <div class="remove-image absolute top-2 right-2 cursor-pointer bg-white bg-opacity-75 p-1 rounded-full shadow">
                    <i class="pi pi-times" @click="removeImage(block)" />
                  </div>
                </div>

                <FileUpload
                    mode="basic"
                    name="file"
                    accept="image/*"
                    :maxFileSize="1000000"
                    chooseLabel="Загрузить"
                    @select="event => onImageSelect(event, block)"
                    customUpload
                    class="mt-auto"
                />
              </div>
            </div>
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
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Select from "primevue/select";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Editor from "primevue/editor";
import FileUpload from "primevue/fileupload";
import ToggleSwitch from "primevue/inputswitch";
import Checkbox from "primevue/checkbox";

import { generatePageData } from "@/utils/index.js";

const { t } = useI18n();

const props = defineProps({
  data: { type: Object, required: true },
  config: { type: Object, required: true },
});

const localConfig = ref({});
const pageTitle = ref("");
const selectedDisplayType = ref({});
const isAccordionFields = computed(() => selectedDisplayType.value?.value === "accordion");

const options = [
  { label: t("without_accordion"), value: "plain" },
  { label: t("accordion"), value: "accordion" },
];

const addNewSection = () => {
  localConfig.value.blockSections.push({
    title: "",
    blocks: [{ title: "", content: "", imagePreview: "", imagePosition: "left", split: false }],
  });
};

const addBlockToSection = (idx) => {
  localConfig.value.blockSections[idx].blocks.push({
    title: "",
    content: "",
    imagePreview: "",
    imagePosition: "left",
    split: false,
  });
};

const removeBlock = (sIdx, bIdx) => {
  localConfig.value.blockSections[sIdx].blocks.splice(bIdx, 1);
};

const removeSection = (idx) => {
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
            ? data.content.map((section) => ({
              title: section.title || "",
              blocks: Array.isArray(section.blocks)
                  ? section.blocks.map((block) => ({
                    title: block.title || "",
                    content: block.content || "",
                  }))
                  : [],
            }))
            : [],
      };
    } else {
      localConfig.value = {
        blockSections: [
          {
            title: "",
            blocks: Array.isArray(data.content)
                ? data.content.map((block) => ({
                  title: "",
                  content: block.content || "",
                  imagePreview: block.image || "",
                  imagePosition: block.imagePosition || "left",
                  split: block.split || false,
                }))
                : [],
          },
        ],
      };
    }

    pageTitle.value = data.title || "";
    selectedDisplayType.value = data.accordion
        ? options.find((o) => o.value === "accordion")
        : options.find((o) => o.value === "plain");
  } else {
    localConfig.value = { ...props.config };
  }
}

onMounted(() => applyConfigFromData(props.data));
watch(
    () => props.data,
    (d) => applyConfigFromData(d),
    { deep: true }
);

function getData() {
  const accordion = isAccordionFields.value;

  const content = accordion
      ? localConfig.value.blockSections.map(section => ({
        title: section.title || '',
        blocks: section.blocks.map(block => ({
          title: block.title || '',
          content: block.content || '',
        })),
      }))
      : localConfig.value.blockSections.flatMap(section =>
          section.blocks.map(block => ({
            content: block.content || '',
            image: block.imagePreview || '',
            imagePosition: block.imagePosition || 'left',
            split: !!block.split,
          }))
      );

  return {
    slug: 'about-us', // или другой актуальный
    title: pageTitle.value,
    accordion,
    content,
  };
}

defineExpose({ getData });
</script>

<style scoped>
.static-info-block {
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 0 15px;
}

.image-content-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  height: 100%;
}

.image-preview-wrapper {
  margin-bottom: 8px;
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 6px;
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

.preview-img {
  width: 100%;
  height: 300px;
  display: block;
  object-fit: cover;
  object-position: top; /* 👈 важно */
  border-radius: 6px;
}


.text-black {
  color: black;
  font-size: 16px;
  font-weight: bold;
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

.switch-options-box {
  width: fit-content;
  background-color: #f0f0f0;
  border-radius: 8px;
}
</style>
