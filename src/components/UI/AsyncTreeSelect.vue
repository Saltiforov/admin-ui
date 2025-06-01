<template>
  <div>
    <TreeSelect
        v-bind="props.config"
        v-model="selectedKeys"
        :options="computedOptions"
        :maxSelectedLabels="5"
        display="chip"
        @change="prepareSelectedValue"
    >
      <template #clearicon="{ clearCallback }">
        <i
            class="pi pi-times cursor-pointer icon-centered"
            @click="(e) => handleClear(clearCallback, e)"
        ></i>
      </template>
    </TreeSelect>
  </div>
</template>

<script setup>
import {ref, onMounted, useAttrs, computed} from 'vue';
import nodeBuilder from '@/services/builder/node-builder-service.js';

import app from '@/main';
import {useRoute} from "vue-router";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  filters: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => []
  }
});

const route = useRoute()

const selectedValue = ref([]);
const nodes = ref([]);
const payload = ref([]);

const nodeMapper = (node, key, parentKey, idx) => ({
  key,
  id: node._id,
  label: node.name.en
});

const handleClear = (clearCallback, event) => {
  event.stopPropagation();
  event.preventDefault();

  clearCallback();
  payload.value = [];
  emit('update:modelValue', []);
};

const loadOptions = async () => {
  if (props.config.restOptionsUrl) {
    try {
      const api = app.config.globalProperties.$api;
      const response = await api.get(props.config.restOptionsUrl);
      if (Array.isArray(response.data.list)) {
        nodes.value = nodeBuilder.recursiveNodeBuilder(response.data.list, {mapper: nodeMapper});
      }
    } catch (error) {
      console.error('Error loading options:', error);
    }
  }
};

function findSelectedNodes(nodes, selectedKeys) {
  let result = [];
  for (const node of nodes) {
    if (selectedKeys[node.key]) {
      result.push(node);
    }
    if (node.children && node.children.length > 0) {
      result = result.concat(findSelectedNodes(node.children, selectedKeys));
    }
  }
  return result;
}

const emit = defineEmits(['update:modelValue']);

const prepareSelectedValue = (selectedValue) => {
  if (selectedValue === null) {
    payload.value = [];
    return;
  }
  payload.value = findSelectedNodes(nodes.value, selectedValue).map(item => item.id);
  console.log("payload.value", payload.value)
  emit('update:modelValue', payload.value);
}

const attrs = useAttrs();

const computedOptions = computed(() => {
  return attrs.options ? attrs.options : nodes.value;
});

console.log("ASYNC TREE SELECT", route.query);

const filtersQuery = computed(() => route.query.filters ? route.query.filters : null);

const extractValues = (items, field) => {
  return items?.map(item => item[field]);
};

const getSelectedKeys = (nodes, matchBy) => {
  let selected = {};

  const traverse = (items) => {
    for (const item of items) {
      if (matchBy && matchBy?.includes(item.id)) {
        selected[item.key] = true;
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  };

  traverse(nodes);
  return selected;
};

const searchCriteria = computed(() => extractValues(props.filters, "_id"));

const activeFilters = computed(() => filtersQuery.value || props.modelValue);

const selectedKeys = computed(() => getSelectedKeys(nodes.value, activeFilters.value));

onMounted(() => {
  loadOptions();
});
</script>

<style scoped>
.icon-centered {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #94A3B8;
  width: 24px;
  height: 38px;
}
</style>
