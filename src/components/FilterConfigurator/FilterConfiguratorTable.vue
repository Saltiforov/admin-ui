<template>
  <div>
    <h1>Three</h1>
    <Button label="Add" class="add__filter-button" icon="pi pi-check" @click="addNewFilter"/>
    <Button label="Submit" icon="pi pi-check" @click="saveFilters"/>
    <h3 v-if="!nodes.length" class="filters-empty">Filters are missing please add a new one</h3>
    <TreeTable
        v-else
        :value="nodes"
        :paginator="true"
        :rows="5"
        :expanded-keys="expandedKeys"
        @update:expandedKeys="updateExpandedKeys"
    >
      <Column header="Name" :expander="true" style="width: 34%">
        <template #body="{ node }">
          <div>{{ node.data.name['uk'] }}</div>
          /
          <div>{{ node.data.name['ru'] }}</div>
        </template>
      </Column>
      <Column field="code" header="Code" style="width: 15%"></Column>
      <Column field="icon" header="Icon" style="width: 15%">
        <template #body="{ node }">
          <!-- Проверяем, есть ли ссылка на SVG, и выводим её -->
          <img
              v-if="node.data.icon"
              :src="node.data.icon"
              alt="icon"
              style="width: 30px; height: 30px; object-fit: contain;"
          />
          <span v-else>No icon</span>
        </template>
      </Column>
      <Column field="description" header="Description" style="width: 33%"></Column>
      <Column
          style="width: 33%"
      >
        <template #body="{ node }">
          <div>
            <Button type="button" icon="pi pi-ellipsis-v" @click="(event) => toggle(event,node)" aria-haspopup="true"
                    aria-controls="overlay_menu"/>
          </div>
        </template>
      </Column>
    </TreeTable>
    <Toast />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import eventBus from "../../../eventBus.js";
import {deepClone, deepSearchByCode} from "@/utils/index.js";
import {createFilters} from "@/services/api/filters-service.api.js";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const show = (message) => {
  toast.add({ severity: 'info', summary: 'Info', detail: message, life: 3000 });
};
const props = defineProps({
  filters: {
    type: Array,
    required: true,
  }
})

function mapFilters(inputArray) {
  const mapNode = (item, idx, parentKey = "") => {
    // Формируем уникальный ключ для каждого элемента
    const key = parentKey ? `${parentKey}-${item._id}` : item._id;
    return {
      key: idx.toString(),
      id: item._id,
      data: {
        name: {
          uk: item.name.uk,
          ru: item.name.ru,
        },
        code: item.code || "unknown",  // Используем "unknown", если поле не заполнено
        icon: item.icon || "default-icon",  // Если нет иконки, ставим значение по умолчанию
        description: item.description || "Нет описания",  // Если нет описания, ставим значение по умолчанию
      },
      children: item.children && item.children.length
          ? item.children.map((child) => mapNode(child, key))  // Рекурсивно обрабатываем дочерние элементы
          : [],
    };
  };

  return inputArray.map((item, idx) => mapNode(item, idx));
}

const nodes = ref([])

onMounted(() => {
  const nodesCopy = ref(deepClone(props.filters));

  nodes.value = mapFilters(nodesCopy.value);
})


const menu = ref();
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

const generatePopupFields = (filter = null, isEditMode = false) => {
  return [
    {
      code: "name.ua",
      component: "InputText",
      props: {type: "text", placeholder: "Name (UA)", style: "width: 100%; margin-bottom: 15px"},
      defaultValue: isEditMode && filter ? filter.data.name.uk : "",
      validators: [(value) => (value ? true : "Name (UA) is required")],
    },
    {
      code: "name.ru",
      component: "InputText",
      props: {type: "text", placeholder: "Name (RU)", style: "width: 100%; margin-bottom: 15px"},
      defaultValue: isEditMode && filter ? filter.data.name.ru : "",
      validators: [(value) => (value ? true : "Name (RU) is required")],
    },
    {
      code: "code",
      component: "InputText",
      props: {type: "text", placeholder: "Unique Code", style: "width: 100%; margin-bottom: 15px"},
      defaultValue: isEditMode && filter ? filter.data.code : "",
      validators: [
        (value) => (value ? true : "Code is required"),
        (value) => /^[a-zA-Z]+$/.test(value) || "Code can only contain English letters",
      ],
    },
    {
      code: "description",
      component: "InputText",
      props: {type: "text", placeholder: "Description", style: "width: 100%; margin-bottom: 15px"},
      defaultValue: isEditMode && filter ? filter.data.description : "",
      validators: [
        (value) => (value ? true : "Description is required"),
      ],
    },
    {
      code: "icon",
      component: "FileUpload", // Указываем компонент FileUpload
      props: {
        accept: "image/svg+xml", // Разрешаем только SVG
        placeholder: "Upload SVG File",
        style: "width: 100%; margin-bottom: 15px",
        mode: "basic"
      },
      defaultValue: null, // Значение по умолчанию
      validators: [
        (value) => (value ? true : "SVG file is required"),
        (value) =>
            value && value.type === "image/svg+xml"
                ? true
                : "Only SVG files are allowed",
      ],
    },
  ];
};

// Todo написать константу которая будет разрешать добавления на уровень вложености в ребенка
// Todo когда открытый узел сделать так чтобы его было лучше видно

const onAdvancedUpload = (event) => {
  console.log('event.target', event)
  const file = event.files[0];
  if (file) {
    console.log("File selected: newNodeFilter", newNodeFilter);
    newNodeFilter.filters[0].icon = file; // Сохраняем файл во временную переменную
    newNodeFilter.filters[0].children[0].icon = file; // Сохраняем файл во временную переменную
    console.log("File selected:", file);
  }

  console.log('newNodeFilter', newNodeFilter);
}

const handleOpenPopup = (filter = null, eventType = "add") => {
  const isEditMode = eventType === "edit";
  const title = isEditMode ? "Edit Filter" : "Add Filter";

  eventBus.emit("show-popup", {
    title,
    parentFilter: filter,
    eventType,
    fields: generatePopupFields(filter, isEditMode),
  })
}

const addNewFilter = () => {
  handleOpenPopup(null, "addNewNode");
};

const expandedKeys = ref({});

const updateExpandedKeys = (keys) => {
  expandedKeys.value = Object.fromEntries(
      Object.entries(keys).filter(([key]) => key !== 'value')
  );
};


const onAddFilter = (options) => {
  const {parent, newFilter, eventType} = options;

  console.log("onAddFilter", options);
  console.log("onAddFilter", parent);

  if (isInvalidParent(parent)) {
    console.error("Parent key is invalid:", parent);
    return;
  }

  if (eventType === "edit") {
    handleEditFilter(parent, newFilter);
    return;
  }

  if (!parent) {
    handleAddRootNode(newFilter);
    show(`${newFilter['name.ua']} / ${newFilter['name.ru']} added as a new node `)
    return;
  }

  handleAddChildNode(parent, newFilter);
  show(`${newFilter['name.ua']} / ${newFilter['name.ru']} added to ${parent.data.name['uk']} / ${parent.data.name['ru']} `)
}

const isInvalidParent = (parent) => parent && !parent.key;

const handleEditFilter = (parent, newFilter) => {
  const activeFilter = deepSearchByCode(nodes.value, parent?.key);
  if (!activeFilter) return;

  activeFilter.data.name.uk = newFilter['name.ua'];
  activeFilter.data.name.ru = newFilter['name.ru'];
  activeFilter.data.code = newFilter.code;
  activeFilter.data.description =
      newFilter.description || activeFilter.data.description;

  console.log("Updated activeFilter", activeFilter);
};

const handleAddRootNode = (newFilter) => {
  const newKey = nodes.value.length.toString();
  const nodeData = {
    key: newKey,
    data: {
      name: {
        uk: newFilter['name.ua'],
        ru: newFilter['name.ru'],
      },
      code: newFilter.code,
      description: newFilter.description,
      icon: "25kb",
    },
    children: [],
  }

  nodes.value.push(nodeData);

  console.log("Added new root node", nodes.value);
};


const handleAddChildNode = (parent, newFilter) => {
  const activeFilter = deepSearchByCode(nodes.value, parent.key);

  if (!activeFilter) {
    console.error("Active filter not found for parent key:", parent.key);
    return;
  }

  const childNode = createChildNode(parent, newFilter);
  activeFilter.children.push(childNode);

  expandedKeys.value = {...expandedKeys.value, [parent.key]: true};

};

const createChildNode = (parent, newFilter) => {
  return {
    key: pathGenerator(parent),
    data: {
      name: {
        uk: newFilter['name.ua'],
        ru: newFilter['name.ru'],
      },
      code: newFilter.code,
      icon: "25kb",
      description: "Папка с проектом на Vue.js",
    },
    children: [],
  };
};

onMounted(() => {
  eventBus.on("add-filter", onAddFilter);
});

onUnmounted(() => {
  eventBus.off("add-filter", onAddFilter);
});

const activeFilter = ref({});

const toggle = (event, node) => {
  activeFilter.value = node;
  menu.value.toggle(event);
};

const mapFiltersForSubmit = (data) => {
  const mapChildren = (children) => {
    return children.map(child => ({
      name: child.data.name,
      code: child.data.code,
      icon: child.data.icon || '',
      description: child.data.description,
      children: mapChildren(child.children) // рекурсивно обрабатываем детей
    }));
  };

  return {
    filters: data.map(item => ({
      name: item.data.name,
      code: item.data.code,
      icon: item.data.icon || '', // по умолчанию пустая строка
      description: item.data.description,
      children: mapChildren(item.children) // обрабатываем детей рекурсивно
    }))
  };
};


const saveFilters = async () => {
  await createFilters(mapFiltersForSubmit(nodes.value));
}

const pathGenerator = (parent) => {
  const children = parent.children || [];

  if (children.length === 0) {
    const newIndex = 0;
    return `${parent.key}-${newIndex}`;
  }

  const lastChild = children[children.length - 1];

  const lastKeyParts = lastChild.key.split('-');
  const lastIndex = parseInt(lastKeyParts.pop(), 10);

  return `${parent.key}-${lastIndex + 1}`;
};


</script>


<style scoped>
.add__filter-button {
  margin: 0 10px;
}

.filters-empty {
  text-align: center;
}
</style>
