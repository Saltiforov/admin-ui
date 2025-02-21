<template>
  <div>
    <DataTable
        :loading="loading"
        :value="loading ? placeholderRows : config.value"
        :paginator="config.paginator"
        :rows="config.rows"
        :rowsPerPageOptions="config.rowsPerPageOptions"
        :tableStyle="config.tableStyle"
        :class="config.class"
        :scrollable="config.scrollable"
    >
      <template v-for="col in config.columns" :key="col.field">
        <Column
            :field="col.field"
            :header="col.header"
            :style="col.style"
            :sortable="col.sortable"
        >

          <template v-slot:body="slotProps">
            <div class="fixed-row">
              <Skeleton v-if="loading" width="80%" height="16px" />
              <slot v-else-if="col.slotName" :name="col.slotName" :data="slotProps.data"></slot>
              <span v-else>{{ slotProps.data[col.field] }}</span>
            </div>
          </template>

        </Column>
      </template>
    </DataTable>
  </div>
</template>


<script setup>

import {computed, defineProps} from 'vue';

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  }
});

const placeholderRows = computed(() => {
  return Array.from({ length: props.config.rows || 5 }, () =>
      Object.fromEntries(props.config.columns.map(col => [col.field, ""]))
  );
});

</script>

<style scoped>
.fixed-row {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
