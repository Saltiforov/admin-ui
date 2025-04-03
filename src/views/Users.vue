<template>
  <div>
    <ActionsButtonsBar :config="configActionsBar" @update:filters="updateQuery"/>
    <CustomDataTable
        title="Users"
        :config="dataTableConfig"
        :loading="isLoading"
    >
      <template style="width: 5%" #actions="{ data }">
        <Button
            type="button"
            icon="pi pi-ellipsis-v"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            @click="(event) => toggle(event, data)"
        />
        <div>
        </div>
      </template>
    </CustomDataTable>
    <ConfirmDialog/>
    <Toast/>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
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
import Button from "primevue/button";
import {useConfirmDelete} from "@/composables/useConfirmDelete.js";

const {updateQuery} = useQueryUpdater();
const {debounceService} = createDebouncedService();

const {t} = useI18n();
const route = useRoute()

const users = ref([])



const userData = ref({});
const toggle = (event, data) => {
  userData.value = data
  menu.value.toggle(event);
};

const menu = ref();
const items = ref([
  {
    label: computed(() => t("menu_popup_title")),
    items: [
      {
        label: computed(() => t("menu_popup_operation_edit")),
        icon: "pi pi-pencil",
        command: () => updateUser(userData.value._id),
      },
      {
        label: computed(() => t("menu_popup_operation_delete")),
        icon: "pi pi-trash",
        command: () => confirmDelete(),
      },
    ],
  },
]);

const updateUser = (id) => {
  router.push({
    name: 'UsersDetails',
    params: {id},
  });
}

const deleteUser =  (id) => {
  users.value = users.value.filter((item) => item._id !== id);
};


const confirmOptions = {
  confirmMessage: computed(() => t("confirm_delete_message", { name: userData.value.name || "this item" })),
  confirmHeader: computed(() => t("confirm_delete_title")),
  rejectLabel: computed(() => t("button_text_cancel")),
  acceptLabel: computed(() => t("button_text_delete")),
  acceptAction: () => deleteUser(userData.value._id),
  acceptToastSummary: computed(() => t("confirm_accept_message_summary")),
  acceptToastDetail: computed(() => t("confirm_accept_message", { name: userData.value.name || "this item" })),
  rejectToastSummary: computed(() => t("confirm_reject_message_summary")),
  rejectToastDetail: computed(() => t("confirm_reject_message")),
  data: userData.value,
};

const {confirmDelete} = useConfirmDelete(confirmOptions)

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
    {field: 'country', header: computed(() => t('table_header_country')), class: 'multiline-truncate'},
    {
      field: 'actions',
      header: '',
      slotName: 'actions',
      style: 'width: 10%',
    },
  ]
});


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