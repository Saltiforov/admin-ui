<template>
  <div>
    <div class="container">
      <div class="form-content form-grid">
        <div
            v-for="(field, index) in config.fields"
            :key="field.name"
            class="form-group"
            :class="getColumnClass(index, config.fields.length)"
        >
          <p class="form__title">{{ field.label }}:</p>

          <component
              :is="field.type"
              v-bind="field.props"
              v-model="formData[field.name]"
              v-if="!field.slot"
          >
            <template v-slot:default>
              <slot :name="field.slot" :data="formData" />
            </template>
          </component>
        </div>
      </div>

      <div class="form-details__button">
        <Button @click="saveForm">Save</Button>
      </div>
    </div>
  </div>
</template>


<script setup>

  import {ref} from "vue";

  const formData = ref({})

  defineProps({
    data: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    }
  })

  const getColumnClass = (index, totalFields) => {
    if (totalFields === 4) {
      return index % 2 === 0 ? 'col-span-1' : 'col-span-1';
    }
    if (totalFields === 3) {
      return index === 2 ? 'col-span-2' : 'col-span-1';
    }
    return 'col-span-1'; // Для случаев с 1 или 2 полями
  };

  const saveForm = () => {
    console.log('Form data saved:', formData.value);
  };

</script>

<style scoped>
.container {
  max-width: 1230px;
  padding: 0 15px;
  margin: 0 auto;
}

/* Грид для двух колонок */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 колонки */
  gap: 24px 32px;
  align-items: start;
  max-width: 1200px;
}

/* Группировка заголовка и инпута */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Если нужно растянуть блок на всю ширину */
.full-width {
  grid-column: span 2;
}
</style>