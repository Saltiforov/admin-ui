<template>
  <div class="footer-action-block mt-12">
    <Button
        v-for="(action, index) in actions"
        :key="index"
        :label="action.label"
        :class="action.class"
        @click="handleAction(action)"
    />


  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  }
});

const isEditMode = computed(() => {
  return !!props.data;
})

const actions = computed(() => {
  if (!props.config) {
    return [
      { label: 'Cancel1', type: 'cancel', actionEventName: 'cancel' },
      { label: 'Save', type: 'save', actionEventName: 'submit' }
    ];
  }

  return props.config[isEditMode.value ? 'edit' : 'create'] || [];
});

const emit = defineEmits(['submit', 'cancel']);

function handleAction(action) {
  emit(`${action.actionEventName}`);
}
</script>

<style scoped>
.footer-action-block {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>
