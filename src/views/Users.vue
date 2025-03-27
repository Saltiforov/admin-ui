<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar" @update:filters="updateQuery"/>
    <CustomDataTable
        title="Users"
        :config="dataTableConfig"
        :loading="isLoading"
    >
    </CustomDataTable>
  </div>
</template>

<script setup>
import {computed, ref, watch, watchEffect} from "vue";
import {getUserList} from "@/services/api/user-service.api.js";
import {createQueryString, extractFields} from "@/utils/index.js";
import ActionsButtonsBar from "@/components/ActionsButtonsBar/ActionsButtonsBar.vue";
import router from "@/router/index.js";
import CustomDataTable from "@/components/DataTable/CustomDataTable.vue";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import {useQueryUpdater} from "@/composables/useQueryUpdater.js";
import {useRoute} from "vue-router";
import createDebouncedService from "@/services/debounceService/debounceService.js";

const {updateQuery} = useQueryUpdater();

const route = useRoute()

const {debounceService} = createDebouncedService();

const users = ref([])

const fetchUsers = async () => {
  users.value = await getUserList(createQueryString(route.query))
}
fetchUsers()


const dataTableConfig = ref({
  value: users.value,
  paginator: true,
  rows: 10,
  skip: 0,
  scrollable: true,
  size: 'null',
  rowsPerPageOptions: [10, 20, 30, 50],
  tableStyle: 'max-width: 100%; overflow-x: auto; border-radius: 20px',
  class: "custom-table",
  columns: [
    {field: 'username', header: 'Username', class: 'multiline-truncate'},
    {field: 'firstName', header: 'First Name', style: 'width: 15%',},
    {field: 'lastName', header: 'Last Name', style: 'width: 15%'},
    {field: 'email', header: 'Email', class: 'multiline-truncate'},
    {field: 'phone', header: 'Phone', class: 'multiline-truncate'},
    {field: 'roles', header: 'Roles',},
    {field: 'last_interaction', header: 'Last Interaction'},
    {field: 'createdAt', header: 'Created At'},
    {field: 'updatedAt', header: 'Updated At'},
    {field: 'street', header: 'Street', class: 'multiline-truncate'},
    {field: 'city', header: 'City', class: 'multiline-truncate'},
    {field: 'postalCode', header: 'Postal Code', class: 'multiline-truncate'},
    {field: 'country', header: 'Country', class: 'multiline-truncate'}
  ]
});

const configActionsBar = ref({
  buttons: [
    {
      component: 'Button',
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
  filters: [
    {
      component: 'IconField',
      disablePropsBinding: false,
      name: 'q',
      props: {},
      children: [
        {
          component: 'InputIcon',
          props: {
            class: 'pi pi-search',

          },
        },
        {
          component: 'InputText',
          props: {
            placeholder: 'Enter the code, please.',
            class: 'w-full',
          },
        },
      ],
    },
    {
      component: 'AsyncTreeSelect',
      disablePropsBinding: true,
      name: 'filters',
      props: {
        restOptionsUrl: 'api/filters',
        placeholder: 'Select filters, please',
        selectionMode: 'multiple',
        class: 'w-full product-input md:w-56',
        required: false,
        showClear: true,
        fullWidth: true,
      }
    },
  ],

});

const mappedUsers = computed(() => extractFields(users.value, "address"));

watch(() => route.query, () => debounceService(fetchUsers, 500), {immediate: false});

watchEffect(() => {
  dataTableConfig.value = {...dataTableConfig.value, value: mappedUsers.value};
});


const isLoading = ref(true);

timeoutService.setTimeout(() => {
  isLoading.value = false
}, 1000);


</script>


<style scoped>

</style>