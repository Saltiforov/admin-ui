<template>
  <div class="buttons-wrapper">
    <div v-if="config" class="grid w-full grid-cols-2 gap-4">
      <ActionsBlock :actions="config.buttons"/>
      <FiltersBlock :filters="config.filters" @update:filters="selectedFilters"/>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ActionsBlock from "@/components/ActionsButtonsBar/ActionsBlock/ActionsBlock.vue";
import FiltersBlock from "@/components/ActionsButtonsBar/FiltersBlock/FiltersBlock.vue";

const props = defineProps({
  config: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(['update:filters']);

const selectedFilters = (filters) => {
  emit("update:filters", filters)
}


</script>

<style scoped>
.buttons-wrapper {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
  padding: 32px 16px;
  margin-bottom: 15px;
  background: white;
  border-radius: 10px;
  display: flex;
}

.no-results-message {
  color: red;
  font-size: 1rem;
  margin-top: 1rem;
}
</style>