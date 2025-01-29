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
      <Column header="Image" >
        <template #body="slotProps">
          <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" @click="goToDetails(slotProps.data)" :alt="slotProps.data.image" class="w-24 rounded" />
        </template>
      </Column>
      <Column field="rating" header="Reviews">
        <template #body="slotProps">
          <Rating :modelValue="slotProps.data.rating" readonly />
        </template>
      </Column>

      <template #footer>
        {{ footerText ? footerText : `In total there are ${data.length} items.` }}
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

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


const router = useRouter();

const goToDetails = (data) => {
  console.log("goToDetails", data)
  router.push({ name: 'ProductDetails', params: data });
}

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
