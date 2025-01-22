<template>
  <div class="card">
    <DataTable :value="data" :tableStyle="tableStyle">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">{{ title }}</span>
          <Button icon="pi pi-refresh" rounded raised @click="onRefresh" />
        </div>
      </template>

      <Column v-for="column in columns" :key="column.field || column.header" :field="column.field" :header="column.header">
        <template v-if="column.body" #body="slotProps">
          <component :is="column.body" :data="slotProps.data" />
        </template>
      </Column>

      <template #footer>
        {{ footerText ? footerText : `In total there are ${data.length} items.` }}
      </template>
    </DataTable>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Data Table',
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  tableStyle: {
    type: String,
    default: 'min-width: 50rem',
  },
  footerText: {
    type: String,
    default: null,
  },
  refreshHandler: {
    type: Function,
    default: null,
  },
});

const onRefresh = () => {
  if (props.refreshHandler) {
    props.refreshHandler();
  }
};
</script>

<style scoped>
.card {
  margin: 1rem 0;
}
</style>
