<template>
  <div>
    <DataTable
        v-model:rows="config.rows"
        v-model:first="config.skip"
        :pt="config.pt"
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
        :show-gridlines="config.showGridlines"
    >
      <template v-for="col in config.columns" :key="col.field">
        <Column
            :field="col.field"
            :header="col.header"
            :style="col.style"
            :sortable="col.sortable"
        >
          <template v-if="col.headerSlotName" v-slot:header>
            <slot :name="`header-${col.headerSlotName}`" />
          </template>

          <template v-slot:body="slotProps">
            <div :class="[fixedRow && 'fixed-row', col.class]">
              <Skeleton v-if="loading" width="80%" height="16px" />
              <slot
                  v-else-if="col.slotName"
                  :name="col.slotName"
                  :data="slotProps.data"
              ></slot>
              <span v-else>{{ getDisplayValue(slotProps.data[col.field]) }}</span>
            </div>
          </template>
        </Column>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, defineProps, watch } from 'vue'
import { useQueryUpdater } from '@/composables/useQueryUpdater.js'

const { updateQuery } = useQueryUpdater()

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
  fixedRow: {
    type: Boolean,
    default: true,
  },
})

function getDisplayValue(value) {
  return value === 0 || !!value ? value : '---'
}

const placeholderRows = computed(() => {
  return Array.from({ length: props.config.rows || 5 }, () =>
      Object.fromEntries(props.config?.columns.map(col => [col.field, '']))
  )
})

watch(
    () => [props.config.rows, props.config.skip],
    ([limit, skip]) => {
      updateQuery({ limit, skip })
    },
    { immediate: false }
)
</script>

<style scoped>
.fixed-row {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
