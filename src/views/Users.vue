<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar"/>
    <CustomDataTable
        title="Users"
        :config="dataTableConfig"
        :loading="isLoading"
    >
    </CustomDataTable>
  </div>
</template>

<script setup>
import {computed, ref, watchEffect} from "vue";
import {getUserList} from "@/services/api/user-service.api.js";
import {mapObject} from "@/utils/index.js";
import ActionsButtonsBar from "@/components/ActionsButtonsBar/ActionsButtonsBar.vue";
import Button from "primevue/button";
import router from "@/router/index.js";
import CustomDataTable from "@/components/DataTable/CustomDataTable.vue";
import { timeoutService } from "@/services/timeoutService/timeoutService.js";

const users = ref([])
const fetchUsers = async () => {
  users.value = await getUserList()
}
fetchUsers()


const dataTableConfig = ref({
  value: [],
  paginator: true,
  rows: 5,
  scrollable: true,
  rowsPerPageOptions: [5, 10, 20, 50],
  tableStyle: 'max-width: 100%; overflow-x: auto; border-radius: 20px',
  class: "custom-table",
  columns: [
    { field: 'username', header: 'Username' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'roles', header: 'Roles',},
    { field: 'last_interaction', header: 'Last Interaction' },
    { field: 'createdAt', header: 'Created At' },
    { field: 'updatedAt', header: 'Updated At' },
    { field: 'street', header: 'Street' },
    { field: 'city', header: 'City' },
    { field: 'postalCode', header: 'Postal Code' },
    { field: 'country', header: 'Country' }
  ]
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
  filters: [],
});

const mappedUsers = computed(() => {
  return users.value.map(user => {
    const mappedUser = mapObject(user);

    if (mappedUser.address && typeof mappedUser.address === "object") {
      const { address, ...rest } = mappedUser;
      return {
        ...rest,
        ...mapObject(address)
      };
    }

    return mappedUser;
  });
});

watchEffect(() => {
  dataTableConfig.value.value = mappedUsers.value;
});

// const isLoading = computed(() => !users.value.length)
const isLoading = ref(true);

timeoutService.setTimeout(() => {
  isLoading.value = false
}, 1000);


</script>


<style scoped>

</style>