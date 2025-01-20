<template>
  <Dialog
      v-model:visible="isVisible"
      :header="popupConfig?.title || 'Form'"
      :modal="true"
      :closable="true"
      class="p-fluid"
  >
    <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4 w-full">
      <div
          v-for="field in popupConfig?.fields"
          :key="field.code"
          class="flex flex-col gap-1"
      >
        <component
            :is="field.component"
            v-model="formValues[field.code]"
            v-bind="field.props"
        />
        <Message
            v-if="errors[field.code]"
            severity="error"
            size="small"
            variant="simple"
        >
          {{ errors[field.code] }}
        </Message>
      </div>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" icon="pi pi-times" @click="closePopup" />
        <Button label="Submit" icon="pi pi-check" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import eventBus from '../../eventBus';

const isVisible = ref(false);
const popupConfig = reactive({});
const formValues = reactive({});
const errors = reactive({});

// Слушаем событие шины
eventBus.on('show-popup', (config) => {
  console.log('eventBus show-popup', config);
  isVisible.value = true;
  Object.assign(popupConfig, config);

  // Инициализируем значения формы
  config.fields.forEach((field) => {
    formValues[field.code] = field.defaultValue || '';
    errors[field.code] = null;
  });

  console.log('popupConfig', popupConfig);
});

// Сабмит формы
const onFormSubmit = () => {
  let isValid = true;

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

  if (isValid) {
    eventBus.emit('add-filter', { newFilter: formValues, parent: popupConfig.parent });
    closePopup();
  }
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
</style>