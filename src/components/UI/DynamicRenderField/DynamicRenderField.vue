<template>
  <RenderWrapper />
</template>

<script setup>
import { h, defineComponent } from 'vue'

const props = defineProps({
  field: Object,
  modelValue: [String, Number, Object, Boolean],
  disabled: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const RenderWrapper = defineComponent({
  name: 'RenderWrapper',
  setup() {
    return () =>
        props.field.render({
          modelValue: props.modelValue,
          'onUpdate:modelValue': (value) => emit('update:modelValue', value),
          disabled: props.disabled,
          ...props.field.props
        })
  }
})
</script>
