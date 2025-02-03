<template>
  <div>
    <Accordion v-if="config.accordion">
      <AccordionTab :header="config.header || 'Загрузка файлов'">
        <div class="upload-files-block mb-12">
          <FileUpload
              ref="uploadRef"
              :name="config.fieldName"
              :url="config.uploadUrl"
              :multiple="config.multiple"
              :auto="config.auto"
              :maxFileSize="config.maxFileSize"
              :custom-upload="config.customUpload"
              @upload="handleUpload"
              @error="handleError"
          />
          <div v-if="!hasUploadedFiles" class="p-3 text-center text-gray-500">
            Drag and drop files to here to upload.
          </div>
        </div>
      </AccordionTab>
    </Accordion>
    <div v-else class="upload-files-block mb-12">
      <div v-if="config?.header" class="mb-4 header-default">
        <h2 class="text-lg font-bold">{{ config.header }}</h2>
      </div>
      <FileUpload
          ref="uploadRef"
          :pt="{
            status: {
              style: 'background-color: green; color: white;'
            }
          }"
          :name="config.fieldName"
          :url="config.uploadUrl"
          :multiple="config.multiple"
          :auto="config.auto"
          :maxFileSize="config.maxFileSize"
          :custom-upload="config.customUpload"
          @upload="handleUpload"
          @error="handleError"
      />
      <div v-if="!hasUploadedFiles" class="p-3 text-center text-gray-500">
        Drag and drop files to here to upload.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
})

const uploadRef = ref(null)
const uploadedFiles = ref([])

function handleUpload(event) {
  console.log('Upload successful:', event)
  if (event.files && event.files.length) {
    uploadedFiles.value.push(...event.files)
  }
}

function handleError(event) {
  console.error('Upload error:', event)
}

const hasUploadedFiles = computed(() => uploadedFiles.value.length > 0)
</script>
