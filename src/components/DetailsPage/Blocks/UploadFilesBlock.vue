<template>
  <div>
    <Accordion v-if="config.accordion || hasEntityImages" v-model:value="isAccordionOpen">
      <AccordionPanel value="0">
        <AccordionHeader>{{ config.header || "Загрузка файлов" }}</AccordionHeader>
        <AccordionContent>
          <div class="upload-files-block mb-12">
            <FileUpload
                ref="uploadRef"
                mode="advanced"
                :name="config.fieldName"
                :multiple="config.multiple"
                :maxFileSize="config.maxFileSize"
                v-bind="config.props"
                :show-upload-button="useEditMode"
                :customUpload="true"
                @uploader="onCustomUpload"
                @select="onSelect"
            >
              <template #empty>
                <div v-if="uploadedImages.length" class="uploaded-images">
                  <div v-for="(img, index) in fullImageUrls(uploadedImages)" :key="index" class="uploaded-image">
                    <img :src="img" alt="Uploaded image"/>
                    <button class="delete-btn" @click="removeImage(index)">✖</button>
                  </div>
                </div>
              </template>
            </FileUpload>
            <div v-if="!hasUploadedFiles && !uploadedImages.length" class="p-3 text-center text-gray-500">
              Drag and drop files to here to upload.
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <div v-else class="upload-files-block mb-12">
      <div v-if="config?.header" class="mb-4 header-default">
        <h2 class="text-lg font-bold">{{ config.header }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watchEffect, onMounted} from "vue";
import {useRoute} from "vue-router";
import FileUpload from "primevue/fileupload";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import eventBus from "../../../../eventBus.js";
import {fullImageUrls} from "@/utils/index.js";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const route = useRoute();
const uploadRef = ref(null);
const isAccordionOpen = ref("0"); // Управляем аккордеоном вручную
const hasEntityImages = ref(false);
const selectedFiles = ref([]);
const uploadedImages = ref([]);

const hasUploadedFiles = computed(() => selectedFiles.value.length > 0);

const useEditMode = computed(() => !!route.params.id);

function onSelect(event) {
  selectedFiles.value = event.files;
}

const entityId = computed(() => route.params.id || '');

const uploadFiles = async (files, id) => {
  try {
    const response = await props.config.uploadMethod(id, files, {
      headers: {"Content-Type": "multipart/form-data"},
    });

    eventBus.emit("uploadImages", response)

    if (Array.isArray(response.data.images)) {
      uploadedImages.value = response.data.images;
    } else if (response.data.path) {
      uploadedImages.value.push(response.data.path);
    }

    selectedFiles.value = [];
    if (uploadRef.value?.clear) {
      uploadRef.value.clear();
    }

  } catch (error) {
    console.error("Upload error:", error);
  }
}

const getData = () => {
  return [...uploadedImages.value];
};

defineExpose({
  getData
});

function onCustomUpload(event) {
  const formData = new FormData();
  event.files.forEach((file) => {
    formData.append("images", file, file.name);
  });

  uploadFiles(formData, entityId.value);
}

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

onMounted(() => {
  eventBus.on("handleImageUpload", (id) => {
    const formData = new FormData();
    selectedFiles.value.forEach((file) => {
      formData.append("images", file, file.name);
    });
    uploadFiles(formData, id);
  });
})


watchEffect(() => {
  if (props.data?.images) {
    isAccordionOpen.value = '0'
    uploadedImages.value = [...props.data.images];
    hasEntityImages.value = true;
  } else {
    isAccordionOpen.value = '1'
  }
});
</script>

<style scoped>
.upload-files-block {
  margin-bottom: 1rem;
}

.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.uploaded-image {
  position: relative;
  display: inline-block;
}

.uploaded-image img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 18px;
  padding: 5px;
}

.delete-btn {
  outline: none;
  position: absolute;
  border-radius: 50%;
  top: 10px;
  right: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  width: 20px;
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

button:hover {
  border-color: white;
}
</style>
