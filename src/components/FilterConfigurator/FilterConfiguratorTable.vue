<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar"/>
    <TreeTable
        class="configurator-table"
        v-model:contextMenuSelection="selectedNode"
        v-model:selectionKeys="selectedKeys"
        autoLayout
        selectionMode="multiple"
        :metaKeySelection="false"
        :value="loading ? skeletonNodes : nodes"
        :loading="loading"
        :paginator="true"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 25]"
        :expanded-keys="expandedKeys"
        contextMenu
        @row-contextmenu="onRowContextMenu"
        @update:expandedKeys="updateExpandedKeys"
        @nodeExpand="onNodeExpand"
        @nodeCollapse="onNodeCollapse"
        @nodeSelect="onNodeSelect"
        @nodeUnselect="onNodeUnselect"
    >
      <Column field="name" header="Name" :expander="true" style="width: 34%">
        <template #body="{ node }">
            <Skeleton v-if="loading" width="80%" height="1rem"/>
          <div class="flex" v-else>
            <div>{{ capitalizeFirstLetter(node.data.name['uk']) || '' }}</div>
            /
            <div>{{ capitalizeFirstLetter(node.data.name['ru']) || '' }}</div>
          </div>
        </template>
      </Column>

      <Column field="code" header="Code" style="width: 15%">
        <template #body="{ node }">
          <Skeleton v-if="loading" width="50%" height="1rem"/>
          <span v-else>{{ node.data.code }}</span>
        </template>
      </Column>

      <Column field="icon" header="Icon" style="width: 15%">
        <template #body="{ node }">
          <Skeleton v-if="loading" width="30px" height="30px"/>
          <img
              v-else-if="node.data.icon"
              :src="pathBuilder(node.data.icon)"
              alt="icon"
              style="width: 30px; height: 30px; object-fit: contain;"
          />
          <span v-else>---</span>
        </template>
      </Column>

      <Column field="description" header="Description" style="width: 33%">
        <template #body="{ node }">
          <Skeleton v-if="loading" width="90%" height="1rem"/>
          <span v-else>{{ node.data.description }}</span>
        </template>
      </Column>

      <Column style="width: 33%">
        <template #body="{ node, level }">
          <div>
            <Button
                v-if="!loading"
                type="button"
                icon="pi pi-ellipsis-v"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                @click="(event) => toggle(event, node, level)"
            />
            <Skeleton v-else width="30px" height="30px"/>
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
import nodeBuilder from "@/services/builder/node-builder-service.js";
import {login} from "@/services/api/auth-serivce.api.js";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";

const toast = useToast();
const confirm = useConfirm();
const emit = defineEmits(['filters-updated'])

const noResultsMessage = ref('');
const selectedNode = ref();
const cm = ref();
const loading = ref(true);

timeoutService.setTimeout(() => {
  loading.value = false;
}, 1000)

const skeletonNodes = ref(
    Array.from({ length: 5 }).map((_, i) => ({
      key: `skeleton-${i}`,
      data: {
        name: { uk: "", ru: "", },
        code: "",
        icon: "",
        description: "",
      },
      children: [],
    }))
);

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
const originalNodes = ref(null);

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

const onNodeSelect = (node) => {
  expandedKeys.value = {...expandedKeys.value, [node.key]: true};
};
const onNodeUnselect = (node) => {
  if (node.key in expandedKeys.value) {
    delete expandedKeys.value[node.key]; // Удаляем ноду из expandedKeys
  }
};

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
  const updatedKeys = {...selectedKeys.value};
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
    {immediate: true}
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
      code: "name.uk",
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
        (value) => /^[a-zA-Z0-9-_]+$/.test(value) || "Code can only contain English letters",
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

  console.log("handleOpenPopup", filter);

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

  console.log("NEW FIlter ", newFilter)
  console.log("NEW FIlter parent", parent)


  if (isInvalidParent(parent)) return;

  if (eventType === "edit") {
    console.log("handleEditFilter")
    handleEditFilter(parent, newFilter);
    return;
  }

  if (!parent) {
    createNode(newFilter);
    show(`${capitalizeFirstLetter(newFilter.name['uk'])} / ${capitalizeFirstLetter(newFilter.name['ru'])} added as a new node `)
    return;
  }

  handleAddChildNode(parent, newFilter);
  show(`${capitalizeFirstLetter(newFilter.name['uk'])} / ${capitalizeFirstLetter(newFilter.name['name.ru'])} added to ${capitalizeFirstLetter(parent.data.name['uk'])} / ${capitalizeFirstLetter(parent.data.name['ru'])} `)
}

const isInvalidParent = (parent) => parent && !parent.key;

const getBasicEntityFilledModel = (item) => {
  console.log("getBasicEntityFilledModel", item);
  return {
    id: item?.data?.id || item?.id,
    name: item?.data?.name || item?.name,
    code: item?.data?.code || item?.code,
    icon: item?.data?.icon || item?.icon || '',
    description: item?.data?.description || item?.description,
  }
}

const handleEditFilter = (parent, newFilter) => {
  const activeFilter = deepSearchByCode(nodes.value, parent?.key);

  if (!activeFilter) return;

  activeFilter.data = {
    ...activeFilter.data,
    ...getBasicEntityFilledModel(newFilter),
  }
  console.log("handleEditFilter activeFilter", activeFilter.data)
  console.log("getBasicEntityFilledModel(newFilter)", getBasicEntityFilledModel(newFilter))
};

const createNode = (newFilter, parent = null) => {
  const newKey = parent ? nodeBuilder.treeNodesPathGenerator(parent) : nodes.value.length.toString();

  const node = {
    key: newKey,
    data: {...getBasicEntityFilledModel(newFilter)},
    children: [],
  }

  if (parent) {
    return node
  } else {
    addedNodes.value++
    nodes.value.push(node);
  }
}

const addedNodes = ref(0)

const mapFiltersForSubmit = (data) => {
  const mapChildren = (children) => {
    return children.map(child => ({
      ...getBasicEntityFilledModel(child),
      children: mapChildren(child.children)
    }));
  };

  return {
    filters: data.map(item => ({
      ...getBasicEntityFilledModel(item),
      children: mapChildren(item.children)
    }))
  };
};

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

const handleAddChildNode = (parent, newFilter) => {
  const activeFilter = deepSearchByCode(nodes.value, parent.key);

  if (!activeFilter) {
    console.error("Active filter not found for parent key:", parent.key);
    return;
  }

  const childNode = createNode(newFilter, parent);
  activeFilter.children.push(childNode);

  expandedKeys.value = {...expandedKeys.value, [parent.key]: true};
};

onMounted(() => {
  eventBus.on("add-filter", onAddFilter);
});

onUnmounted(() => {
  eventBus.off("add-filter", onAddFilter);
});

const activeFilter = ref({});

const toggle = (event, node, level) => {
  activeFilter.value = node;
  menu.value.toggle(event);
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
    console.log("mapFiltersForSubmit", mapFiltersForSubmit(nodes.value))
    await createFilters(mapFiltersForSubmit(nodes.value));
    addedNodes.value = 0;
    // emit('filters-updated');
  }
}

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
        style: {margin: '0 10px'},
        icon: 'pi pi-check',
      },
      onClick: saveFilters,
    },

  ],
  filters: [
    {
      component: 'IconField',
      disablePropsBinding: false,
      name: 'iconField',
      props: {},
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
  ]
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


.filters-empty {
  font-size: 40px;
  display: flex;
  justify-content: center;
  margin: 100px auto;
}
</style>
