<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar"/>
    <h3 v-if="!nodes.length" class="filters-empty">Filters are missing please add a new one</h3>
    <TreeTable
        class="configurator-table"
        v-else
        v-model:contextMenuSelection="selectedNode"
        v-model:selectionKeys="selectedKeys"
        autoLayout
        selectionMode="none"
        :metaKeySelection="false"
        :value="nodes"
        :loading="loading"
        :paginator="true"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 25]"
        :expanded-keys="expandedKeys"
        contextMenu
        @click="onRowClick"
        @row-contextmenu="onRowContextMenu"
        @update:expandedKeys="updateExpandedKeys"
        @nodeExpand="onNodeExpand"
        @nodeCollapse="onNodeCollapse"
    >
      <Column header="Name" :expander="true" style="width: 34%">
        <template #body="{ node }">
          <div>{{ capitalizeFirstLetter(node.data.name['uk']) }}</div>
          /
          <div>{{ capitalizeFirstLetter(node.data.name['ru']) }}</div>
        </template>
      </Column>
      <Column field="code" header="Code" style="width: 15%"></Column>
      <Column field="icon" header="Icon" style="width: 15%">
        <template #body="{ node }">
          <img
              v-if="node.data.icon"
              :src="pathBuilder(node.data.icon)"
              alt="icon"
              style="width: 30px; height: 30px; object-fit: contain;"
          />
          <span v-else>---</span>
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
    </TreeTable>
    <ContextMenu ref="cm" :model="menuModel" @hide="selectedNode = null"/>
    <ConfirmDialog/>
    <Toast/>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref, onBeforeMount, watch, computed} from 'vue';
import eventBus from "../../../eventBus.js";
import {deepClone, deepSearchByCode, pathBuilder} from "@/utils/index.js";
import {createFilters, deleteFilters} from "@/services/api/filters-service.api.js";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import ActionsButtonsBar from "@/components/ActionsButtonsBar/ActionsButtonsBar.vue";

const toast = useToast();
const confirm = useConfirm();
const emit = defineEmits(['filters-updated'])

const noResultsMessage = ref('');
const selectedNode = ref();
const cm = ref();
const loading = ref(false);

const menuModel = ref(
    [
      {
        label: 'Delete', icon: 'pi pi-fw pi-times', command: () => {
          confirmDelete(activeNode.value)
        }
      }
    ]
);

const nodes = ref([])
const maxMenuDepth = ref(3);
const originalNodes = ref(null); // Копия исходного массива nodes

const shouldShowButton = (key, maxDepth = 3) => {
  const levels = key.split('-').length;
  return levels <= maxDepth;
};

const activeNode = ref(null);
const onRowContextMenu = (event) => {
  activeNode.value = event.node;
  cm.value.show(event.originalEvent);
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
    const key = parentKey ? `${parentKey}-${idx}` : `${idx}`;

    return {
      key: key, // Теперь ключ создается правильно
      id: item._id,
      data: {
        name: {
          uk: item.name.uk,
          ru: item.name.ru,
        },
        code: item.code || "unknown",
        icon: item.icon,
        description: item.description || "Нет описания",
      },
      children: item.children && item.children.length
          ? item.children.map((child, childIdx) => mapNode(child, childIdx, key)) // Передаем текущий key как parentKey
          : [],
    };
  };

  return inputArray.map((item, idx) => mapNode(item, idx));
}


const deleteItems = ref([]);

const deleteNodeRecursive = (nodesArray, nodeId, nodeCode) => {
  return nodesArray
      .filter((node) => {
        if (node.id && node.id === nodeId) {
          collectDeletedIds(node); // Рекурсивно собираем ID всех вложенных элементов
          return false; // Удаляем текущий узел
        }
        return node.data.code !== nodeCode; // Удаляем по code без записи в deleteItems
      })
      .map((node) => ({
        ...node,
        children: deleteNodeRecursive(node.children || [], nodeId, nodeCode),
      }));
};

// Функция для сбора всех ID удаляемых элементов
const collectDeletedIds = (node) => {
  deleteItems.value.push(node.id); // Записываем текущий ID
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => collectDeletedIds(child)); // Рекурсивно записываем ID всех потомков
  }
};

const onSearch = (event) => {
  const searchCode = event.target.value;
  searchByCodeTopLevel(searchCode);
};

const deleteNode = async (node) => {
  nodes.value = deleteNodeRecursive(nodes.value, node.id, node.data.code);
  console.log("deleteItems", deleteItems.value)
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
      toast.add({
        severity: 'info',
        summary: 'Deleted',
        detail: `The "${node?.data?.name?.uk || 'this item'}" has been deleted`,
        life: 3000
      });
    },
    reject: () => {
      toast.add({severity: 'error', summary: 'Cancelled', detail: 'Deletion was cancelled', life: 3000});
    },
  });
};

const onRowClick = (node) => {
  console.log("onRowClick", node);
}

const selectedKeys = ref({});

const addSelectedKeysRecursively = (node) => {
  selectedKeys.value[node.key] = true;

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => addSelectedKeysRecursively(child));
  }
};

const onNodeExpand = (node) => {
  addSelectedKeysRecursively(node);
};

const onNodeCollapse = (node) => {
  const updatedKeys = { ...selectedKeys.value };
  updatedKeys[node.key] = false;
  selectedKeys.value = updatedKeys;
};



watch(() => selectedKeys.value, () => {
  console.log("selectedKeys.value", selectedKeys.value);
});


onMounted(() => {
  if (props.filters && props.filters.length) {
    const nodesCopy = ref(deepClone(props.filters));
    nodes.value = mapFilters(nodesCopy.value);
    originalNodes.value = [...nodes.value];
  }
});

watch(
    () => props.filters,
    (newFilters) => {
      if (newFilters && newFilters.length) {
        const nodesCopy = ref(deepClone(newFilters));
        nodes.value = mapFilters(nodesCopy.value);
        originalNodes.value = [...nodes.value];
      }
    },
    {immediate: true} // Запускаем при первой загрузке
);


const menu = ref();
const items = ref([
  {
    label: 'Operations',
    items: [
      {
        label: "Add",
        icon: "pi pi-plus",
        command: () => handleOpenPopup(activeFilter.value, "add"),
      },
      {
        label: "Edit",
        icon: "pi pi-pencil",
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
      component: "TextArea",
      props: {type: "text", placeholder: "Description", style: "width: 100%; margin-bottom: 15px"},
      defaultValue: isEditMode && filter ? filter.data.description : "",
      validators: [
        (value) => (value ? true : "Description is required"),
      ],
    },
    {
      code: "icon",
      component: "FileUpload",
      props: {
        accept: "image/svg+xml",
        placeholder: "Upload SVG File",
        style: "width: 100%; margin-bottom: 15px",
        mode: "basic",
      },
      defaultValue: null
    },
  ];
};

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
    show(`${capitalizeFirstLetter(newFilter['name.ua'])} / ${capitalizeFirstLetter(newFilter['name.ru'])} added as a new node `)
    return;
  }

  handleAddChildNode(parent, newFilter);
  show(`${capitalizeFirstLetter(newFilter['name.ua'])} / ${capitalizeFirstLetter(newFilter['name.ru'])} added to ${capitalizeFirstLetter(parent.data.name['uk'])} / ${capitalizeFirstLetter(parent.data.name['ru'])} `)
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

const addedNodes = ref(0)

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
      icon: newFilter.icon || '',
    },
    children: [],
  }

  addedNodes.value++
  nodes.value.push(nodeData);

  console.log("handleAddRootNode", newFilter)
  console.log("Added new root node",addedNodes.value);
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
      icon: newFilter.icon,
      description: newFilter.description,
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

const capitalizeFirstLetter = (value) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};


const saveFilters = async () => {
  if (deleteItems.value.length > 0 && addedNodes.value === 0) {
    await deleteFilters(deleteItems.value);
    return;
  }

  if (nodes.value.length > 0) {
    await createFilters(mapFiltersForSubmit(nodes.value));
    addedNodes.value = 0;
    emit('filters-updated');
  }
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

const configActionsBar = ref({
  buttons: [
    {
      component: 'Button',
      props: {
        label: 'Add',
        class: 'filter-button',
        icon: 'pi pi-check',
      },
      onClick: addNewFilter,
    },
    {
      component: 'Button',
      props: {
        label: 'Submit',
        class: 'filter-button',
        style: { margin: '0 10px' },
        icon: 'pi pi-check',
      },
      onClick: saveFilters,
    },
    {
      component: 'IconField',
      props: {
        class: 'filter-button',
      },
      children: [
        {
          component: 'InputIcon',
          props: {
            class: 'pi pi-search',
          },
        },
        {
          component: 'InputText',
          props: {
            vModel: inputCodeValue,
            placeholder: 'Enter the code, please.',
            onInput: onSearch,
          },
        },
      ],
    },
  ],
});


const searchByCodeTopLevel = (searchCode) => {
  if (searchCode.trim().length >= 3) {
    console.log("originalNodes", originalNodes.value);

    nodes.value = originalNodes.value.filter((node) =>
        node.data.code.toLowerCase().includes(searchCode.toLowerCase())
    );

    if (nodes.value.length === 0) {
      noResultsMessage.value = "No codes found. Try another query.";
      nodes.value = [...originalNodes.value];
    } else {
      noResultsMessage.value = '';
      const keysObject = nodes.value.reduce((acc, node) => {
        acc[node.key] = true;
        return acc;
      }, {});

    }

  } else if (searchCode.trim() === "") {
    nodes.value = [...originalNodes.value];
    noResultsMessage.value = '';
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

.no-results-message {
  color: #d9534f;
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
  text-align: center;
}

button[style*="visibility: hidden"] svg {
  overflow: hidden !important;
}

.no-expander .p-treetable-toggler {
  visibility: hidden !important; /* Скрыть кнопку раскрытия */
}
</style>
<style scoped>
.filter-button {
  margin: 0 10px;
}

.p-icon {
  fill: currentColor;
  width: 1em;
  height: 1em;
}

.buttons-wrapper {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
  padding: 32px 16px;
  margin-bottom: 15px;
  background: white;
  border-radius: 10px;
  display: flex;
}

.configurator-table {
  background: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
  border-radius: 4px;
}

:deep(.p-treetable .p-component .configurator-table) {
  border-radius: 15px !important;
}


.filters-empty {
  font-size: 40px;
  display: flex;
  justify-content: center;
  margin: 100px auto;
}
</style>
