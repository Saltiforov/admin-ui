<template>
  <Dialog
      v-model:visible="isVisible"
      :header="popupConfig?.title || 'Form'"
      :modal="true"
      :closable="true"
      :style="{ width: '40rem' }"
      class="p-fluid"
  >
    <form @submit.prevent="onFormSubmit" class="flex items-center flex-col gap-4 w-full">
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
        <Button label="Cancel" icon="pi pi-times" @click="closePopup"/>
        <Button label="Submit" icon="pi pi-check" type="submit"/>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import {reactive, ref} from 'vue';
import eventBus from '../../eventBus';

const isVisible = ref(false);
const iconPath = ref('');
const popupConfig = reactive({});
const formValues = reactive({});
const errors = reactive({});

// Слушаем событие шины
eventBus.on('show-popup', (config) => {
  isVisible.value = true;
  Object.assign(popupConfig, config);

  // Инициализируем значения формы
  config.fields.forEach((field) => {
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
  console.log('Valid data popupConfig: STARt', popupConfig);
  let isValid = true;
  console.log("onFormSubmit", popupConfig);
  popupConfig.fields.forEach((field) => {
    errors[field.code] = null;

    if (field.validators) {
      for (const validator of field.validators) {
        const validationResult = validator(formValues[field.code]);
        if (validationResult !== true) {
          errors[field.code] = validationResult;
          isValid = false;
          break;
        }
      }
    }
  });
  console.log("onFormSubmit", isValid);

  console.log("formValues", formValues)

  if (isValid) {
    eventBus.emit("add-filter", {
      newFilter: formValues,
      parent: popupConfig.parentFilter,
      eventType: popupConfig.eventType,
    });
    closePopup();
  }
  console.log('Valid data popupConfig: END', popupConfig);

};

// Закрытие попапа
const closePopup = () => {
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
  width: 16rem;
}
.message-error {
  margin-bottom: 10px;
}
</style>
