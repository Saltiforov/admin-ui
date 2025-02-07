<template>
    <TreeSelect
        v-model="selectedValue"
        :options="computedOptions"
        :maxSelectedLabels="3"
        display="chip"
        @change="prepareSelectedValue"
    />
</template>

<script setup>
import { ref, onMounted, useAttrs, computed } from 'vue';
import nodeBuilder from '@/services/builder/node-builder-service.js';

import app from '@/main';

const props = defineProps({
  config: {
    type: Object,
    required: true,
  }
});

const selectedValue = ref([]);
const nodes = ref([]);
const payload = ref([]);

const nodeMapper = (node, key, parentKey, idx) => ({
  key,
  id: node._id,
  label: node.name.ru
});

const loadOptions = async () => {
  if (props.config.restOptionsUrl) {
    try {
      const api = app.config.globalProperties.$api;
      const response = await api.get(props.config.restOptionsUrl);
      if (Array.isArray(response.data)) {
        nodes.value = nodeBuilder.recursiveNodeBuilder(response.data, { mapper: nodeMapper });
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


const prepareSelectedValue = () => {
  payload.value = findSelectedNodes(nodes.value, selectedValue.value).map(item => item.id);
  emit('update:modelValue', payload.value);
}

const attrs = useAttrs();

const computedOptions = computed(() => {
  return attrs.options ? attrs.options : nodes.value;
});

onMounted(() => {
  loadOptions();
});
</script>

<style scoped>
/* Добавьте стили при необходимости */
</style>
