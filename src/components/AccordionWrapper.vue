<template>
  <div class="accordion__wrapper">
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    <AccordionComponent
        :filters="localFilters"
        @handlePopover="handlePopover"
    />
  </div>

</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import eventBus from "../../eventBus.js";
import { deepSearchByCode, deepClone } from "@/utils/index.js";

const props = defineProps({
  filters: {
    type: Array,
    required: true,
  },
});

const activeFilter = ref({});
const menu = ref();

let localFilters = ref([]);

const items = ref([
  {
    items: [
      {
        label: "Add",
        icon: "pi pi-refresh",
        command: () => handleOpenPopup(activeFilter.value, "add"),
      },
      {
        label: "Edit",
        icon: "pi pi-upload",
        command: () => handleOpenPopup(activeFilter.value, "edit"),
      },
    ],
  },
]);

const handlePopover = (event, filter) => {
  activeFilter.value = filter;
  menu.value.toggle(event);
}

const handleOpenPopup = (filter, eventType = "add") => {
  console.log(
    "handleOpenPopup",
    filter,)
  eventBus.emit("show-popup", {
    title: "Add Filter",
    parentFilter: filter,
    eventType,
    fields: [
      {
        code: "name.ua",
        component: "InputText",
        props: { type: "text", placeholder: "Name (UA)" },
        validators: [(value) => (value ? true : "Name (UA) is required")],
      },
      {
        code: "name.ru",
        component: "InputText",
        props: { type: "text", placeholder: "Name (RU)" },
        validators: [(value) => (value ? true : "Name (RU) is required")],
      },
      {
        code: "code",
        component: "InputText",
        props: { type: "text", placeholder: "Unique Code" },
        validators: [
          (value) => (value ? true : "Code is required"),
          (value) => /^[a-zA-Z]+$/.test(value) || "Code can only contain English letters",
        ],
      },
    ],
  });
};

const onAddFilter = (options) => {
  const { parent, newFilter } = options;

  const activeFilter = deepSearchByCode(localFilters.value, parent.code);
  if (activeFilter) {
    const obj = {
      children: [],
      code: newFilter.code,
      name: { ru: newFilter['name.ru'], uk: newFilter['name.ua'] },
      parentId: parent?.id,
    };

    activeFilter.children.push(obj)
  }
};

onMounted(() => {
  localFilters.value = deepClone(props.filters);
  eventBus.on("add-filter", onAddFilter);
});

onUnmounted(() => {
  eventBus.off("add-filter", onAddFilter);
});
</script>