<template>
  <Select
      v-model="internalValue"
      :options="options"
      :placeholder="placeholder"
      :option-label="optionLabel"
      :option-value="optionValue"
      :multiple="multiple"
      :filter="filter"
      :clearable="clearable"
      class="select-input"
      @update:modelValue="onUpdate"
  />
</template>

<script setup>
import {computed} from "vue";
import eventBus from "../../../../eventBus.js";

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array, null],
    default: null,
  },
  options: {
    type: Array,
    required: true,
    default: () => [{ label: "🇺🇦 UA", value: "ua" }],
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  optionValue: {
    type: String,
    default: 'value',
  },
  placeholder: {
    type: String,
    default: 'Выберите значение',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  filter: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function onUpdate(value) {
  emit('update:modelValue', value)
  eventBus.emit('select-input-value', value)
}
</script>

<style scoped>
.select-input {
  min-width: 200px;
}
</style>
