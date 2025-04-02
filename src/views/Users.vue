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
import {useI18n} from "vue-i18n";

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
    {field: 'username', header: computed(() => t('table_header_username')), class: 'multiline-truncate'},
    {field: 'firstName', header: computed(() => t('table_header_first_name')), style: 'width: 15%',},
    {field: 'lastName', header: computed(() => t('table_header_last_name')), style: 'width: 15%'},
    {field: 'email', header: computed(() => t('table_header_email')), class: 'multiline-truncate'},
    {field: 'phone', header: computed(() => t('table_header_phone')), class: 'multiline-truncate'},
    {field: 'roles', header: computed(() => t('table_header_roles')),},
    {field: 'last_interaction', header: computed(() => t('table_header_last_interaction'))},
    {field: 'createdAt', header: computed(() => t('table_header_created_at'))},
    {field: 'updatedAt', header: computed(() => t('table_header_updated_at'))},
    {field: 'street', header: computed(() => t('table_header_street')), class: 'multiline-truncate'},
    {field: 'city', header: computed(() => t('table_header_city')), class: 'multiline-truncate'},
    {field: 'postalCode', header: computed(() => t('table_header_postal_code')), class: 'multiline-truncate'},
    {field: 'country', header: computed(() => t('table_header_country')), class: 'multiline-truncate'}
  ]
});

const {t} = useI18n();

const configActionsBar = computed(() => {
  return {
    buttons: [
      {
        component: 'Button',
        props: {
          label: t('button_new_users'),
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
              placeholder: t('placeholder_code_search'),
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
          placeholder: t('placeholder_filters_select'),
          selectionMode: 'multiple',
          class: 'w-full product-input md:w-56',
          required: false,
          showClear: true,
          fullWidth: true,
        }
      },
    ],

  }
})

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