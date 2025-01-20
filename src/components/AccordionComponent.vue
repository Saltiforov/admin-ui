<template>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  <Accordion v-if="filters" :value="[]" multiple>
    <AccordionPanel
        v-for="filter in filters"
        :key="filter._id"
        :value="filter._id"
    >
      <AccordionHeader>
        <div class="header-container">
          {{ filter.name.ru }} / {{ filter.name.uk }}
          <!--          <Button-->
          <!--              icon="pi pi-ellipsis-v"-->
          <!--              class="p-button-rounded p-button-text options-button"-->
          <!--              @click.stop="showContextMenu(filter)"-->
          <!--          />-->
          <Button type="button" icon="pi pi-ellipsis-v" @click.stop="(event) => toggle(event, filter)" aria-haspopup="true" aria-controls="overlay_menu" />
        </div>
      </AccordionHeader>
      <AccordionContent>
        <p v-if="!filter.children || filter.children.length === 0" class="m-0">
          No child filters available.
        </p>
        <AccordionComponent v-else :filters="filter.children"/>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<script setup>
import {reactive, ref, watch, onMounted} from 'vue';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import Button from 'primevue/button';
import Menu from "primevue/menu";

// Импорт шины событий
import eventBus from '../../eventBus.js';

const props = defineProps({
  filters: {
    type: Array,
    required: true,
  },
});

const showContextMenu = (filter, eventType = 'add') => {
  console.log('Showing context menu for:', filter);

  // Вызываем событие через шину
  eventBus.emit('show-popup', {
    title: 'Add Filter',
    parentFilter: filter,
    eventType,
    fields: [
      {
        code: 'name.ua',
        component: 'InputText',
        props: {type: 'text', placeholder: 'Name (UA)'},
        validators: [(value) => (value ? true : 'Name (UA) is required')],
      },
      {
        code: 'name.ru',
        component: 'InputText',
        props: {type: 'text', placeholder: 'Name (RU)'},
        validators: [(value) => (value ? true : 'Name (RU) is required')],
      },
      {
        code: 'code',
        component: 'InputText',
        props: {type: 'text', placeholder: 'Unique Code'},
        validators: [
          (value) => (value ? true : 'Code is required'),
          (value) => /^[a-zA-Z]+$/.test(value) || 'Code can only contain English letters',
        ],
      },
    ],
  });
};
const filterOption = ref({});
const menu = ref();

const items = ref([
  {
    items: [
      {
        label: 'Add',
        icon: 'pi pi-refresh',
        command: () => showContextMenu(filterOption.value,  'add'),
      },
      {
        label: 'Edit',
        icon: 'pi pi-upload',
        command: () => showContextMenu(filterOption.value,  'edit'),
      }
    ]
  }
]);

const toggle = (event, filter) => {
  filterOption.value = filter;
  menu.value.toggle(event);
};

function deepClone(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
        Object.entries(obj)
            .map(([key, value]) => [key, deepClone(value)]),
    );
  }

  return obj;
}

let localFilters = ref({});
// console.log("localFilters", localFilters)

onMounted(() => {
  localFilters = deepClone(props.filters);
  // console.log("localFilters", localFilters)
})

// import { toRaw } from 'vue';
//
// onMounted(() => {
//   localFilters = deepClone(toRaw(props.filters));
// });


// const onAddFilter = (newFilter) => {
//   console.log('Filter added:', newFilter);
// };

const onAddFilter = (options) => {
  const {parent, newFilter} = options;
  console.log('Parent:', parent);
  console.log('newFilter:', newFilter);
  console.log('Filter added:', newFilter);
  if (parent) {
   const obj = {
      children: [],
      code: newFilter.code,
      createdAt: '2021-09-22T12:00:00.000Z',
      name: { ru: newFilter['name.ru'], uk: newFilter['name.ua'] },
      parentId: null,
      updatedAt: '2021-09-22T12:00:00.000Z',
      _v: 0,
      _id: '614000000000000000000000',
    };
    parent.children.push(obj);
  }
  console.log("LocalFilters", localFilters)
};

eventBus.on('add-filter', onAddFilter);


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