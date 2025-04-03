<template>
  <div>
    <DataTable
        v-model:rows="config.rows"
        v-model:first="config.skip"
        :loading="loading"
        :lazy="config.lazy"
        :value="loading ? placeholderRows : config.value"
        :paginator="config.paginator"
        :rows="config.rows"
        :total-records="totalRecords"
        :rowsPerPageOptions="config.rowsPerPageOptions"
        :tableStyle="config.tableStyle"
        :class="config.class"
        :scrollable="config.scrollable"
        :size="config.size"
    >
      <template v-for="col in config.columns" :key="col.field">
        <Column
            :field="col.field"
            :header="col.header"
            :style="col.style"

            :sortable="col.sortable"
        >

          <template v-slot:body="slotProps">
            <div class="fixed-row" :class="col.class">
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

import {computed, defineProps, watch} from 'vue';
import {useQueryUpdater} from "@/composables/useQueryUpdater.js";

const { updateQuery } = useQueryUpdater();


const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  totalRecords: {
    type: Number,
    required: true,
  },
});

const placeholderRows = computed(() => {

  return Array.from({ length: props.config.rows || 5 }, () =>
      Object.fromEntries(props.config?.columns.map(col => [col.field, ""]))
  );
});

console.log("props DataTable", props.config);

watch(
    () => [props.config.rows, props.config.skip],
    ([limit, skip]) => {
      updateQuery({limit, skip});
    },
    {immediate: false}
);

</script>

<style scoped>
.fixed-ro {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
