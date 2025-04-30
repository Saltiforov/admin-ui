<template>
  <CustomDataTable class="mb-4" :config="updatedDataTableConfig">
    <template #role_name="{ data }">
      {{ data.role_name }}
    </template>

    <template v-for="category in categories" :key="category" v-slot:[`header-${category}`]>
      <div class="w-full">
        <div class="action-header-title action-title mb-2">{{ capitalizeFirstLetter(category) }}</div>
        <div class="grid justify-center grid-cols-4 gap-2 w-full">
        <span v-for="(action, key) in actions" :key="action" v-tooltip.top="action" class="action-title">
          {{ capitalizeFirstLetter(key) }}
        </span>
        </div>
      </div>
    </template>

    <template
        v-for="category in categories
    "
        :key="category"
        v-slot:[category]="{ data }"
    >

      <div class="grid grid-cols-4 gap-2">
        <div
            v-for="(action, key) in actions"
            :key="`${category}-${key}`"
            class="flex justify-center gap-1"
        >
          <Checkbox v-model="data.permissions[category][key]"
                    :id="`${data.role_name}-${category}-${key}`"
                    binary
          />
        </div>
      </div>
    </template>
  </CustomDataTable>
</template>


<script setup>

import CustomDataTable from "@/components/DataTable/CustomDataTable.vue";
import {ref} from "vue";
import {capitalizeFirstLetter} from "@/utils/index.js";
import { useRolesStore } from "@/stores/rolesStore.js";

const categories = ['filters', 'products', 'users', 'orders']

const actions = {
  view: 'Просмотр записи, возможность видеть данные, но не редактировать их.',
  create: 'Создание новой записи или элемента.',
  edit: 'Редактирование существующей записи или элемента.',
  delete: 'Удаление записи или элемента из системы.',
};

const roleStore = useRolesStore();

const updatedDataTableConfig = ref({
  showGridlines: true,
  columns: [
    {field: 'role_name', header: 'Role', slotName: 'role_name'},
    {field: 'filters', header: '', slotName: 'filters', headerSlotName: "filters"},
    {field: 'products', header: ' ', slotName: 'products', headerSlotName: "products"},
    {field: 'users', header: '', slotName: 'users', headerSlotName: "users"},
    {field: 'orders', header: '', slotName: 'orders', headerSlotName: "orders"},
  ],
  value: roleStore.getAllRoles,
});


</script>


<style scoped>
.action-title {
  text-align: center;
}

.action-header-title {
  font-size: 18px;
  font-weight: bold;
}
</style>