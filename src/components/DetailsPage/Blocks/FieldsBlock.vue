<template>
  <div class="fields-block mb-12">
    <div v-if="config?.header" class="mb-4 header-default">
      <h2 class="text-lg font-bold">{{ config.header }}</h2>
    </div>

    <div class="container">
      <div class="form-content grid grid-cols-2 gap-6">
        <template v-for="field in baseFields" :key="field.name">
          <div class="form-group">
            <p class="form__title">{{ field.label }}:</p>
            <component class="w-full" :is="field.type" v-bind="field.props" v-model="formData[field.name]" />
          </div>
        </template>

        <template v-for="(group, index) in optionFieldGroups" :key="`group-${index}`">
          <div class="form-group col-span-2 flex items-center gap-6">
            <div v-for="field in group" :key="field.name">
              <p class="form__title">{{ field.label }}:</p>
              <component class="w-full" :is="field.type" v-bind="field.props" v-model="formData[field.name]" />
            </div>
          </div>
        </template>

        <template v-for="field in textAreaFields" :key="field.name">
          <div class="form-group col-span-2">
            <p class="form__title">{{ field.label }}:</p>
            <component class="w-full" :is="field.type" v-bind="field.props" v-model="formData[field.name]" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    required: true,
  }
});

const formData = ref({});

onMounted(() => {
  props.config.items.forEach((field) => {
    if (field.code && props?.data?.[field?.code]) {
      formData.value[field.code] =
          props.data[field.code] !== undefined ? props.data[field.code] : "";
    }
  });
});

const baseFields = computed(() => {
  return props.config.items.filter(f => !["Checkbox", "Rating", "TextArea"].includes(f.type));
});

const optionFieldGroups = computed(() => {
  const { groups, currentGroup } = props.config.items.reduce(
      (acc, field) => {
        if (field.type === "Checkbox" || field.type === "Rating") {
          acc.currentGroup.push(field);
        } else if (acc.currentGroup.length) {
          acc.groups.push(acc.currentGroup);
          acc.currentGroup = [];
        }
        return acc;
      },
      { groups: [], currentGroup: [] }
  );

  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  return groups;
});

const textAreaFields = computed(() => {
  return props.config.items.filter(f => f.type === "TextArea");
});
</script>
