<template>
  <AsyncMultiSelect
      class="select-order-user"
      rest-options-url="api/admin/users"
      select-id="orderUser"
      :multiple="false"
      placeholder="Select User"
      style="margin-bottom: 15px; background: #fff;"
      @update:model-value="chooseUser"
  />
</template>

<script setup>
import AsyncMultiSelect from "@/components/UI/AsyncMultiSelect.vue";

import {useDataStore} from "@/stores/dataStore.js";
import eventBus from "../../../../eventBus.js";

const { data: usersList } = useDataStore()

const chooseUser = (selected) => {
  const selectedUser = usersList['orderUser'].find(user => user._id === selected.code);
  eventBus.emit('orderUserSelected', selectedUser)
}
</script>


<style scoped>
.select-order-user {
  color: #2c3e50;
}
</style>