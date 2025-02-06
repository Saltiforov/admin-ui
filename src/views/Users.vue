<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar"/>
    <CustomDataTable
        title="Users"
        :config="dataTableConfig"
    >
      <template #roles="{ data }">
        <p v-if="data.roles.length"> {{ data.roles }} </p>
        <p v-else>---</p>
      </template>
    </CustomDataTable>
  </div>
</template>

<script setup>
import {ref, watchEffect} from "vue";
import {getUserList} from "@/services/api/user-service.api.js";
import ActionsButtonsBar from "@/components/ActionsButtonsBar/ActionsButtonsBar.vue";
import Button from "primevue/button";
import router from "@/router/index.js";

const users = ref([])


const fetchUsers = async () => {
  users.value = await getUserList()
}
fetchUsers()

const dataTableConfig = ref({
  value: [],
  paginator: true,
  rows: 5,
  rowsPerPageOptions: [5, 10, 20, 50],
  tableStyle: "min-width: 50rem; border-radius: 20px",
  class: "custom-table",
  columns: [
    {field: 'last_interaction', header: 'Last Interaction'},
    {field: 'username', header: 'Username'},
    {field: 'password', header: 'Password'},
    {field: 'roles', header: 'Roles', slotName: 'roles'},
  ],
});

const configActionsBar = ref({
  buttons: [
    {
      component: Button,
      props: {
        label: 'Add new user',
        class: 'filter-button',
        icon: 'pi pi-user-plus',
      },
      onClick: () => router.push({
        name: 'UserCreate',
      }),
    },
  ],
});

watchEffect(() => {
  dataTableConfig.value.value = users.value;
});

</script>


<style scoped>

</style>