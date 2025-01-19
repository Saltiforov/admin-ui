<template>
  <Accordion :value="[]" multiple>
    <AccordionPanel
        v-for="filter in filters"
        :key="filter._id"
        :value="filter._id"
    >
      <AccordionHeader>
        <div class="header-container">
          {{ filter.name.ru }} / {{ filter.name.uk }}
          <Button
              icon="pi pi-ellipsis-v"
              class="p-button-rounded p-button-text options-button"
              @click="showContextMenu(filter)"
          />
        </div>
      </AccordionHeader>

      <AccordionContent>
        <p v-if="!filter.children || filter.children.length === 0" class="m-0">
          No child filters available.
        </p>
        <AccordionComponent v-else :filters="filter.children" @add="onAddFilter" />
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<script setup>
import { ref } from 'vue';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import Button from 'primevue/button';

// Импорт шины событий
import eventBus from '../../eventBus.js';

defineProps({
  filters: {
    type: Array,
    required: true,
  },
});

const showContextMenu = (filter) => {
  console.log('Showing context menu for:', filter);

  // Вызываем событие через шину
  eventBus.emit('show-popup', {
    title: 'Add Filter',
    parentFilter: filter,
    fields: [
      {
        code: 'name.ua',
        component: 'InputText',
        props: { type: 'text', placeholder: 'Name (UA)' },
        validators: [(value) => (value ? true : 'Name (UA) is required')],
      },
      {
        code: 'name.ru',
        component: 'InputText',
        props: { type: 'text', placeholder: 'Name (RU)' },
        validators: [(value) => (value ? true : 'Name (RU) is required')],
      },
      {
        code: 'code',
        component: 'InputText',
        props: { type: 'text', placeholder: 'Unique Code' },
        validators: [
          (value) => (value ? true : 'Code is required'),
          (value) => /^[a-zA-Z]+$/.test(value) || 'Code can only contain English letters',
        ],
      },
    ],
  });
};

const onAddFilter = (newFilter) => {
  console.log('Filter added:', newFilter);
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.options-button {
  margin-left: auto;
}
</style>