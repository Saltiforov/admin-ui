<template>
  <div>
    <h1>Three</h1>
    <div class="buttons-wrapper">
      <Button label="Add" class="add__filter-button" icon="pi pi-check" @click="addNewFilter"/>
      <Button label="Submit" icon="pi pi-check" @click="saveFilters"/>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="inputCodeValue" @input="onSearch" placeholder="Enter the code, please." />
      </IconField>
    </div>
    <h3 v-if="!nodes.length" class="filters-empty">Filters are missing please add a new one</h3>
    <TreeTable
        v-else
        autoLayout
        :value="nodes"
        :paginator="true"
        :rows="5"
        :expanded-keys="expandedKeys"
        @update:expandedKeys="updateExpandedKeys"
    >
      <Column header="Name" expander style="width: 34%">
        <template #body="{ node }" >
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
              src="@/assets/icons/sport-icon.svg"
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
        <template #body="{ node, level }">
          <div>
            <Button
                type="button"
                icon="pi pi-ellipsis-v"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                @click="(event) => toggle(event,node, level)"
            />
          </div>
        </template>
      </Column>
      <Column field="remove" class="remove-button">
        <template #body="{ node }">
          <Button @click="confirmDelete(node)" icon="pi pi-times" severity="danger" outlined></Button>
        </template>
      </Column>
    </TreeTable>
    <ConfirmDialog />
    <Toast/>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import eventBus from "../../../eventBus.js";
import {deepClone, deepSearchByCode} from "@/utils/index.js";
import {createFilters} from "@/services/api/filters-service.api.js";
import {useToast} from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const toast = useToast();
const confirm = useConfirm();

const nodes = ref([])
const maxMenuDepth = ref(3);

const shouldShowButton = (key, maxDepth = 3) => {
  const levels = key.split('-').length;
  return levels <= maxDepth;
};

const show = (message) => {
  toast.add({severity: 'info', summary: 'Info', detail: message, life: 3000});
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

const deleteNode = (node) => {
  // node.id або code
  nodes.value = nodes.value.filter((item) => item.id !== node.id);
  console.log(nodes.value);
  console.log(node);
};

const confirmDelete = (node) => {
  confirm.require({
    message: `Are you sure you want to delete "${node?.data?.name?.uk || 'this item'}"?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      deleteNode(node)
      toast.add({ severity: 'info', summary: 'Deleted', detail: `The "${node?.data?.name?.uk || 'this item'}" has been deleted`, life: 3000 });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Cancelled', detail: 'Deletion was cancelled', life: 3000 });
    },
  });
};

onMounted(() => {
  const nodesCopy = ref(deepClone(props.filters));

  nodes.value = mapFilters(nodesCopy.value);
  console.log("NODES VALUE", nodes.value)
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
    // {
    //   code: "icon",
    //   component: "FileUpload", // Указываем компонент FileUpload
    //   props: {
    //     accept: "image/svg+xml", // Разрешаем только SVG
    //     placeholder: "Upload SVG File",
    //     style: "width: 100%; margin-bottom: 15px",
    //     mode: "basic"
    //   },
    //   defaultValue: null, // Значение по умолчанию
    //   validators: [
    //     (value) => (value ? true : "SVG file is required"),
    //     (value) =>
    //         value && value.type === "image/svg+xml"
    //             ? true
    //             : "Only SVG files are allowed",
    //   ],
    // },
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

const getRowClass = (node) => {
  return !!node.children?.length;
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

const toggle = (event, node, level) => {
  console.log("toggle node", node)
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

const inputCodeValue = ref('')
const searchResults = ref([]);

const searchByCode = (inputArray, searchCode, expandedKeys = {}) => {
  const result = [];

  const searchNode = (node, parentNode = null) => {
    // Проверяем, совпадает ли код элемента с поисковым
    if (node.data.code.toLowerCase().includes(searchCode.toLowerCase())) {
      // Формируем объект с родителем и найденным элементом, без детей
      const parentWithChild = {
        ...parentNode,
        children: [node] // Добавляем только сам найденный элемент, без его детей
      };

      if (parentNode) {
        // Убедимся, что родитель будет открыт
        expandedKeys[parentNode.key] = true;
        result.push(parentWithChild); // Добавляем родителя с найденным элементом
      } else {
        result.push({ element: node }); // Если родителя нет, добавляем только элемент
      }
    }

    // Рекурсивный вызов для дочерних элементов
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        searchNode(child, node); // Передаем родителя для дочерних элементов
      });
    }
  };

  // Запуск поиска по всем элементам
  inputArray.forEach((item) => {
    searchNode(item);
  });

  return { result, expandedKeys };
};

const onSearch = () => {
  if (inputCodeValue.value.length >= 3) {
    const { result, expandedKeys } = searchByCode(nodes.value, inputCodeValue.value);

    nodes.value = result
    console.log("onSearch", result)
    updateExpandedKeys(expandedKeys)
  } else {
    searchResults.value = [];
  }
};

</script>

<style>
.p-treetable-node-toggle-icon {
  display: inline-block !important;
  visibility: visible !important;
}

.p-treetable-node-toggle-button:focus,
.p-treetable-node-toggle-button:focus-visible,
.p-treetable-node-toggle-button:active {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

button[style*="visibility: hidden"] svg{
  overflow: hidden !important;
}

.no-expander .p-treetable-toggler {
  visibility: hidden !important; /* Скрыть кнопку раскрытия */
}
</style>
<style scoped>
.add__filter-button {
  margin: 0 10px;
}

.p-icon {
  fill: currentColor;
  width: 1em;
  height: 1em;
}

.buttons-wrapper {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
  padding: 25px 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  display: flex;
}

.filters-empty {
  text-align: center;
}
</style>
