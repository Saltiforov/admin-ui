<template>
  <div>
    <DataTable
        :value="config.value"
        :paginator="config.paginator"
        :rows="config.rows"
        :rowsPerPageOptions="config.rowsPerPageOptions"
        :tableStyle="config.tableStyle"
        :class="config.class"
        :scrollable="config.scrollable"
    >
      <!-- Динамическое создание колонок -->
      <template v-for="col in config.columns" :key="col.field">
        <Column
            :field="col.field"
            :header="col.header"
            :style="col.style"
            :sortable="col.sortable"
        >

          <!-- Использование слота для кастомного контента -->
          <template v-if="col.slotName" v-slot:body="slotProps">
            <slot :name="col.slotName" :data="slotProps.data"></slot>
          </template>


          <!-- Для стандартных колонок просто отображаем данные -->
          <template v-else v-slot:body="slotProps">
            {{ slotProps.data[col.field] }}
          </template>
        </Column>
      </template>
    </DataTable>
  </div>
</template>


<script setup>

import { defineProps } from 'vue';

defineProps({
  config: {
    type: Object,
    required: true,
  },
});

</script>

<style scoped>
/* Стили для таблицы */
</style>
