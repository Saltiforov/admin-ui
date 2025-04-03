<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar" @update:filters="updateQuery"/>
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
      <Column field="name" :header="t('table_header_name')" :expander="true" style="width: 34%">
        <template #body="{ node }">
          <Skeleton v-if="loading" width="80%" height="1rem"/>
          <div class="flex" v-else>
            <div class="multiline-truncate">{{ capitalizeNodeName(node, 'uk') || '' }}</div>
            /
            <div class="multiline-truncate">{{ capitalizeNodeName(node, 'ru') || '' }}</div>
          </div>
        </template>
      </Column>

      <Column field="code" :header="t('table_header_code')" style="width: 15%">
        <template #body="{ node }">
          <Skeleton v-if="loading" width="50%" height="1rem"/>
          <span v-else>{{ getNodeFieldValue(node, 'code') }}</span>
        </template>
      </Column>

      <Column field="icon" :header="t('table_header_icon')" style="width: 15%">
        <template #body="{ node }">
          <Skeleton v-if="loading" width="30px" height="30px"/>
          <img
              v-else-if="getNodeFieldValue(node, 'icon')"
              :src="pathBuilder(getNodeFieldValue(node, 'icon'))"
              alt="icon"
              style="width: 30px; height: 30px; object-fit: contain;"
          />
          <span v-else>---</span>
        </template>
      </Column>

      <Column field="description" :header="t('table_header_description')" style="width: 33%">
        <template #body="{ node }">
          <Skeleton v-if="loading" width="90%" height="1rem"/>
          <span class="multiline-truncate" v-else>{{ getNodeFieldValue(node, 'description') }}</span>
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
import {onMounted, onUnmounted, ref, onBeforeMount, watch, computed, unref, isRef} from 'vue';
import eventBus from "../../../eventBus.js";
import {convertDottedFieldKeysToNested, deepClone, deepSearchByCode, pathBuilder} from "@/utils/index.js";
import {
  createFilters, createNewFilterChildNode,
  createNewFilterNode, deleteFilter,
  deleteFilters, updateExistedNode
} from "@/services/api/filters-service.api.js";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";
import ActionsButtonsBar from "@/components/ActionsButtonsBar/ActionsButtonsBar.vue";
import nodeBuilder from "@/services/builder/node-builder-service.js";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import {useQueryUpdater} from "@/composables/useQueryUpdater.js";
import {useRoute} from "vue-router";
import {getPopupConfig} from "@/services/factories/index.js";

import {useI18n} from 'vue-i18n';

const {updateQuery} = useQueryUpdater()

const toast = useToast();
const confirm = useConfirm();
const emit = defineEmits(['filters-updated'])

const {t} = useI18n();

const noResultsMessage = ref('');
const selectedNode = ref();
const cm = ref();
const loading = ref(true);

onMounted(() => {
  if (props.filters && props.filters.length) {
    const nodesCopy = ref(deepClone(props.filters));
    nodes.value = mapFilters(nodesCopy.value);
    originalNodes.value = [...nodes.value];
  }
  eventBus.on("handle-popup-data", onAddFilter);

});

onUnmounted(() => {
  eventBus.off("handle-popup-data", onAddFilter);
});


timeoutService.setTimeout(() => {
  loading.value = false;
}, 1000)

const props = defineProps({
  filters: {
    type: Array,
    required: true,
  }
})

const skeletonNodes = ref(
    Array.from({length: 5}).map((_, i) => ({
      key: `skeleton-${i}`,
      data: {
        name: {uk: "", ru: "",},
        code: "",
        icon: "",
        description: "",
      },
      children: [],
    }))
);

const menuModel = computed(() => [
  {
    label: t("menu_popup_operation_delete"), icon: 'pi pi-fw pi-times', command: () => {
      confirmDelete(activeNode.value)
    }
  }
])

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

const deleteItems = ref([]);

const deleteNodeRecursive = (nodesArray, nodeId, nodeCode) => {
  return nodesArray
      .filter((node) => {
        if (node.id && node.id === nodeId) {
          collectDeletedIds(node);
          return false;
        }
        return node.data.code !== nodeCode;
      })
      .map((node) => ({
        ...node,
        children: deleteNodeRecursive(node.children || [], nodeId, nodeCode),
      }));
};

const collectDeletedIds = (node) => {
  deleteItems.value.push(node.id);
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => collectDeletedIds(child));
  }
};

const onSearch = (event) => {
  const searchCode = event.target.value;
  searchByCodeTopLevel(searchCode);
};

const deleteNode = async (node) => {
  nodes.value = deleteNodeRecursive(nodes.value, node.id, node.data.code);
  await deleteFilter(node.id)
};

const confirmDelete = (node) => {
  confirm.require({
    message: t("confirm_delete_message", {name: node?.data?.name?.uk || 'this item'}),
    header: t('confirm_delete_title'),
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: t('button_text_cancel'),
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: t('button_text_delete'),
      severity: 'danger',
    },
    accept: () => {
      deleteNode(node)
      toast.add({
        severity: 'info',
        summary: t("confirm_accept_message_summary"),
        detail: t("confirm_accept_message", {name: node?.data?.name?.uk || 'this item'}),
        life: 3000
      });
    },
    reject: () => {
      toast.add({
        severity: 'error',
        summary: t("confirm_reject_message_summary"),
        detail: t("confirm_reject_message"),
        life: 3000
      });
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

const items = computed(() => [
  {
    label: t("menu_popup_title"),
    items: [
      {
        label: t("menu_popup_operation_add"),
        icon: "pi pi-plus",
        command: () => handleOpenPopup(activeFilter.value, "add"),
      },
      {
        label: t("menu_popup_operation_edit"),
        icon: "pi pi-pencil",
        command: () => handleOpenPopup(activeFilter.value, "edit"),
      },
    ],
  },
])

const {filterConfiguratorTablePopup} = getPopupConfig('filters', 'filters-popups')

const getNestedValue = (obj, path, defaultValue = "") => {
  return path.split(".").reduce((acc, key) => acc && acc[key] !== undefined ? acc[key] : defaultValue, obj);
};

const updatePopupFields = (filter = null, isEditMode = false) => {
  return filterConfiguratorTablePopup['fields'].map(field => ({
    ...field,
    defaultValue: isEditMode && filter ? getNestedValue(filter.data, field.code, "") : "",
  }));
};

const parentFilterForNode = ref({});
const popupType = ref(null);

const getNodeFieldValue = (node, field, formatter) => {
  if (!node) return '';
  let value = node[field] !== undefined && node[field] !== null ? node[field] : '';
  if (!value && node.data) {
    value = node.data[field];
  }
  return (formatter && typeof formatter === 'function') ? formatter(value) : (value || '');
}

const handleOpenPopup = (filter = null, eventType = "add") => {
  const isEditMode = eventType === "edit";
  const title = isEditMode ? t("edit_filter_popup_title") : t("create_filter_popup_title");

  parentFilterForNode.value = filter;
  popupType.value = eventType;

  eventBus.emit("show-popup", {
    title,
    fields: updatePopupFields(filter, isEditMode),
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


const onAddFilter = async (data) => {


  const newFilter = {
    ...convertDottedFieldKeysToNested(data),
    id: parentFilterForNode.value ? parentFilterForNode.value.id : null
  }

  if (isInvalidParent(parentFilterForNode.value)) return;

  if (popupType.value === "edit") {
    await handleEditFilter(parentFilterForNode.value, newFilter);
    return;
  }

  if (!parentFilterForNode.value) {
    console.log('newFilter', newFilter);
    await createNode(newFilter)
        .then(() => {
          show(`${capitalizeNodeName(newFilter, 'uk')} / ${capitalizeNodeName(newFilter, 'ru')} added as a new node `)
        })
    return;
  }

  await handleAddChildNode(parentFilterForNode.value, newFilter);
  show(`${capitalizeNodeName(newFilter, 'uk')} / ${capitalizeNodeName(newFilter, 'ru')} added to ${capitalizeNodeName(parentFilterForNode, 'uk')} / ${capitalizeNodeName(parentFilterForNode, 'ru')} `)
}

const isInvalidParent = (parent) => parent && !parent.key;

const getBasicEntityFilledModel = (item) => {
  return {
    id: item?.data?.id || item?.id,
    name: item?.data?.name || item?.name,
    code: item?.data?.code || item?.code,
    icon: item?.data?.icon || item?.icon?.objectURL || '',
    description: item?.data?.description || item?.description,
  }
}

const handleEditFilter = async (parent, newFilter) => {
  const activeFilter = deepSearchByCode(nodes.value, parent?.key);

  if (!activeFilter) return;

  activeFilter.data = {
    ...activeFilter.data,
    ...getBasicEntityFilledModel(newFilter),
  }

  const children = parent.children?.map(child => child.id) ?? [];

  await updateExistedNode(newFilter.id, prepareSaveData(newFilter, children));
};

const handleAddChildNode = async (parent, newFilter) => {
  await createChildNode(newFilter, parent)
};

const prepareSaveData = (node, ids) => {
  return {
    ...getBasicEntityFilledModel(node),
    children: ids,
  }
}

const prepareChildSaveData = (node, parent) => {
  const activeFilter = deepSearchByCode(nodes.value, parent.key);
  const newKey = parent ? nodeBuilder.treeNodesPathGenerator(parent) : nodes.value.length.toString();
  const basicChildNode = {
    ...getBasicEntityFilledModel(node),
    children: [],
  }

  activeFilter.children.push({
    key: newKey,
    ...basicChildNode
  });
  expandedKeys.value = {...expandedKeys.value, [parent.key]: true};

  return {
    parent: parent.data.code,
    node: basicChildNode,
  };
}

const createNode = async (newFilter, parent = null) => {
  const newKey = parent ? nodeBuilder.treeNodesPathGenerator(parent) : nodes.value.length.toString();

  const node = {
    key: newKey,
    data: {...getBasicEntityFilledModel(newFilter)},
    children: [],
  }

  addedNodes.value++
  nodes.value.unshift(node);

  const saveData = prepareSaveData(node);
  await createNewFilterNode(saveData)
}

const createChildNode = async (node, parent) => {
  const saveData = prepareChildSaveData(node, parent)
  await createNewFilterChildNode(saveData)
}

const addedNodes = ref(0)

function mapFilters(inputArray) {
  const mapNode = (item, idx, parentKey = "") => {
    const key = parentKey ? `${parentKey}-${idx}` : `${idx}`;

    console.log("mapFilters", item)

    return {
      key: key,
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
          ? item.children.map((child, childIdx) => mapNode(child, childIdx, key))
          : [],
    };
  };

  return inputArray.map((item, idx) => mapNode(item, idx));
}

const activeFilter = ref({});

const toggle = (event, node, level) => {
  activeFilter.value = node;
  menu.value.toggle(event);
};

const capitalizeNodeName = (node, lang = 'uk') => {
  if (!node) return '';

  const name =
      node?.name?.[lang] ||
      node?.data?.name?.[lang] ||
      '';

  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
};

const route = useRoute()

const getSearchQueryValue = computed(() => route.query && route.query.q ? route.query.q : "");

const searchQuery = ref(getSearchQueryValue.value)


const configActionsBar = computed(() => {
  return {
    buttons: [
      {
        component: 'Button',
        props: {
          label: t('button_new_filters'),
          class: 'filter-button',
          icon: 'pi pi-check',
        },
        onClick: addNewFilter,
      },
    ],
    filters: [
      {
        component: 'IconField',
        disablePropsBinding: false,
        name: 'q',
        vModel: searchQuery,
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
              placeholder: t('placeholder_code_search'),
              class: 'w-full',
              onInput: onSearch,
            },
          },
        ],
      },
    ]
  }
})


const searchByCodeTopLevel = (searchCode) => {
  if (searchCode.trim().length >= 3) {

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
