<template>
  <Dialog
      :draggable="false"
      v-model:visible="isVisible"
      :header="popupConfig?.title || 'Form'"
      :modal="true"
      :closable="true"
      :style="{ width: '40rem' }"
      class="p-fluid"
  >
    <form @submit.prevent="onFormSubmit">
      <div
          v-for="field in popupConfig?.fields"
          :key="field.code"
          class="flex flex-col gap-1"
      >
        <component
            :is="field.component"
            v-model="formValues[field.code]"
            v-bind="field.props"
            @select="handleFileUpload(field, $event)"
        />
        <Message
            v-if="errors[field.code]"
            severity="error"
            size="small"
            variant="simple"
            class="message-error"
        >
          {{ errors[field.code] }}
        </Message>
      </div>
      <div class="image-wrapper">
        <img v-if="iconPath" :src="iconPath" alt="Image" class="uploaded-image"
             style="filter: grayscale(100%)"/>
      </div>
      <div class="form-buttons">
        <Button :label="t('button_text_cancel')" icon="pi pi-times" @click="closePopup"/>
        <Button :label="t('button_text_submit')" icon="pi pi-check" type="submit"/>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import {reactive, ref, unref} from 'vue';
import eventBus from '../../eventBus';
import {useI18n} from "vue-i18n";

const isVisible = ref(false);
const iconPath = ref('');
const popupConfig = reactive({});
const formValues = reactive({});
const errors = reactive({});

const {t} = useI18n();

// Слушаем событие шины
eventBus.on('show-popup', (config) => {
  isVisible.value = true;
  Object.assign(popupConfig, config);

  console.log("eventBus.on", config);

  // Инициализируем значения формы
  config.fields.forEach((field) => {
    console.log('field', field);
    formValues[field.code] = field.defaultValue || '';
    errors[field.code] = null;
  });
});

const handleFileUpload = (field, event) => {
  const file = event?.files[0];

  if (field.code === "icon" && file) {
    formValues[field.code] = file;

    // Проверяем формат файла
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        iconPath.value = reader.result; // Сохраняем base64
      };
      reader.readAsDataURL(file);
    } else {
      errors[field.code] = "Only SVG files are allowed.";
    }
  }
};

// Сабмит формы
const onFormSubmit = () => {
  let isValid = true;
  popupConfig.fields.forEach((field) => {
    errors[field.code] = null;


    if (field.validators) {
      for (const validator of field.validators) {

        const validationResult = unref(validator(formValues[field.code]));
        if (validationResult !== true) {
          errors[field.code] = validationResult;
          isValid = false;
          break;
        }
      }
    }
  });


  if (isValid) {

    eventBus.emit("handle-popup-data", formValues);
    iconPath.value = null
    setTimeout(() => {
      closePopup();
    })
  }
};

const closePopup = () => {
  console.log('closePopup')
  isVisible.value = false;
};
</script>

<style scoped>
.p-dialog .p-fluid {
  width: 100%;
  max-width: 400px;
}

.image-wrapper {
  display: flex;
  justify-content: center;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.uploaded-image {
  width: 8rem;
}

.message-error {
  margin-bottom: 10px;
}
</style>
