<template>
  <div v-if="actions.length" class="actions-wrapper">
    <div class="flex">
      <div v-for="(item, index) in actions" :key="index">
        <component
            :is="item.component"
            v-bind="item.props"
            :class="item.class"
            :style="item.styles"
            @click="item.onClick"
        >
          <component
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              :is="child.component"
              v-bind="child.props"
          />
        </component>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  actions: {
    type: Object,
    required: false,
  },
});


</script>

<style scoped>
.actions-wrapper {
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