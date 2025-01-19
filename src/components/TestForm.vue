<template>
  <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-80">
    <!-- Динамическая генерация полей -->
    <div
        v-for="field in formConfig"
        :key="field.name"
        class="flex flex-col gap-1"
    >
      <component
          :is="field.component"
          v-model="formValues[field.code]"
          v-bind="field.props"
          @upload="field.events?.upload"
          @error="field.events?.error"
      >
      </component>
      <Message
          v-if="field.error"
          severity="error"
          size="small"
          variant="simple"
      >
        {{ field.error }}
      </Message>
    </div>

    <!-- Кнопка сабмита -->
    <Button type="submit" severity="secondary" label="Submit" />
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import Message from 'primevue/message';
import Button from 'primevue/button';
import { createFilters } from "@/services/api/filters-service.api.js";

// Конфигурация формы
const formConfig = ref([
  {
    code: 'name_ua',
    component: InputText,
    props: {
      type: 'text',
      placeholder: 'UA Name',
    },
    error: null,
    validators: [
      (value) => (value ? true : 'UA Name is required'),
    ],
  },
  {
    code: 'name_ru',
    component: InputText,
    props: {
      type: 'text',
      placeholder: 'RU Name',
    },
    error: null,
    validators: [
      (value) => (value ? true : 'RU Name is required'),
    ],
  },
  {
    code: 'code',
    component: InputText,
    props: {
      type: 'text',
      placeholder: 'Unique Code',
    },
    error: null,
    validators: [
      (value) => (value ? true : 'Code is required'),
      (value) =>
          /^[a-zA-Z]+$/.test(value) ||
          'Code can only contain English letters',
    ],
  },
]);

// Инициализация данных формы
const formValues = reactive({
  'name_ru': '',
  'name_ua': '',
  code: '',
  parentId: null,
  children: []
});

const onFormSubmit = async () => {

  let isValid = true;

  formConfig.value.forEach((field) => {
    field.error = null;

    if (field.validators) {
      for (const validator of field.validators) {
        const result = validator(formValues[field.code]);
        if (result !== true) {
          field.error = result;
          isValid = false;
          break;
        }
      }
    }
  });

  if (isValid) {
    console.log('Valid data:', formValues);

    const payload = {
      name: {
        uk: formValues.name_ua,
        ru: formValues.name_ru
      },
      code: formValues.code,
      parentId: formValues.parentId,
      children: formValues.children,
    }

    await createFilters(payload)
    console.log('payload', payload);
  } else {
    console.error('Validation failed');
  }
};
</script>

<style scoped>
.icon-preview {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}
</style>