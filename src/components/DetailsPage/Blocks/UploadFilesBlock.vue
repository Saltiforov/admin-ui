<template>
  <div>
    <Accordion v-if="config.accordion || hasEntityImages">
      <AccordionTab :header="config.header || 'Загрузка файлов'">
        <div class="upload-files-block mb-12">
          <FileUpload
              ref="uploadRef"
              :mode="'advanced'"
              :name="config.fieldName"
              :multiple="config.multiple"
              :maxFileSize="config.maxFileSize"
              :customUpload="true"
              @uploader="onCustomUpload"
              @select="onSelect"
          >
            <template #empty>
              <div v-if="uploadedImages.length" class="uploaded-images">
                <div
                    v-for="(img, index) in fullImageUrls"
                    :key="index"
                    class="uploaded-image"
                >
                  <img :src="img" alt="Uploaded image" />
                </div>
              </div>
            </template>
          </FileUpload>
          <div v-if="!hasUploadedFiles && !uploadedImages.length" class="p-3 text-center text-gray-500">
            Drag and drop files to here to upload.
          </div>
        </div>
      </AccordionTab>
    </Accordion>
    <div v-else class="upload-files-block mb-12">
      <div v-if="config?.header" class="mb-4 header-default">
        <h2 class="text-lg font-bold">{{ config.header }}</h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, onMounted, watch} from 'vue';
import FileUpload from 'primevue/fileupload';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import {useRoute} from "vue-router";

export default defineComponent({
  name: 'FileUploadBlock',
  components: {
    FileUpload,
    Accordion,
    AccordionTab
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const uploadRef = ref(null);
    const hasEntityImages = ref(false);
    const selectedFiles = ref<any[]>([]);
    const uploadedImages = ref<string[]>([]);

    const fullImageUrls = computed(() => {
      return uploadedImages.value.map(url => {
        if (/^https?:\/\//.test(url)) {
          return url;
        }
        return 'http://localhost:3000' + url;
      });
    });

    const hasUploadedFiles = computed(() => selectedFiles.value.length > 0);

    function onSelect(event: any) {
      selectedFiles.value = event.files;
      console.log('Selected files:', selectedFiles.value);
    }

    async function onCustomUpload(event: any) {
      try {
        console.log('onCustomUpload triggered', event);
        const formData = new FormData();
        event.files.forEach((file: File) => {
          formData.append('images', file, file.name);
        });

        const entityId = route.params.id;
        const response = await props.config.uploadMethod(entityId, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (Array.isArray(response.data.images)) {
          uploadedImages.value.push(...response.data.images);
        } else if (response.data.path) {
          uploadedImages.value.push(response.data.path);
        }

        selectedFiles.value = [];
        if (uploadRef.value?.clear) {
          uploadRef.value.clear();
        }
      } catch (error: any) {
        console.error('Upload error:', error);
        event.options.error('Upload failed');
      }
    }

    watch(() => props.data, (newData) => {
      console.log('props.data', newData?.images);
      if (newData?.images) {
        uploadedImages.value = [...newData.images];
        hasEntityImages.value = true;
      }
    }, { deep: true, immediate: true });

    return {
      uploadRef,
      selectedFiles,
      uploadedImages,
      hasUploadedFiles,
      hasEntityImages,
      onSelect,
      onCustomUpload,
      fullImageUrls
    };
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
  margin-top: 1rem;
}
.uploaded-image img {
  max-width: 100px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}
</style>
