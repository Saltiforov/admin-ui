<template>
  <div v-if="filters.length" class="filters-wrapper">
    <div class="filters-content">
      <div class="filter" v-for="(filter, index) in filters" :key="index">
        <component
            class="w-full"
            :is="filter.component"
            v-bind="filter.disablePropsBinding ? {} : (filter.props || {})"
            :config="filter.props"
            :class="filter.class"
            :modelValue="route.query[filter.name]"
            @update:modelValue="updateFilter($event, filter.name)"
        >
          <component
              v-for="(child, childIndex) in filter.children"
              :key="childIndex"
              :is="child.component"
              v-bind="child.props"
              :modelValue="route.query[filter.name]"
              @update:modelValue="updateFilter($event, filter.name)"
          />
        </component>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps, ref} from 'vue';
import {useRoute} from "vue-router";

const route = useRoute()

const emit = defineEmits(['update:filters']);
const props = defineProps({
  filters: {
    type: Object,
    required: false,
  },
});

const formData = ref({})

const updateFilter = (value, name) => {
  formData.value[name] = value;
  emit('update:filters', {...formData.value}); // Передаем обновленный объект
};


</script>

<style scoped>
.filters-wrapper {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
  padding: 32px 16px;
  margin-bottom: 15px;
  background: white;
  border-radius: 10px;
}

.filters-content {
  display: grid;
  flex-wrap: wrap;
  gap: 12px;
}
</style>