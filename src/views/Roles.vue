<template>
  <div class="">
    <h1>Roles</h1>
    <ActionsButtonsBar :config="configActionsBar"/>
    <CustomDataTable class="mb-4" :config="updatedDataTableConfig">
      <template #filters="{ data }">
        <Checkbox v-model="data.permissions.filters.view" binary/>
      </template>

      <template #products="{ data }">
        <Checkbox v-model="data.permissions.products.view" binary/>
      </template>

      <template #users="{ data }">
        <Checkbox v-model="data.permissions.users.view" binary/>
      </template>

      <template #orders="{ data }">
        <Checkbox v-model="data.permissions.orders.view" binary/>
      </template>
    </CustomDataTable>
    <RoleManagement/>
  </div>
</template>

<script setup>

import CustomDataTable from "@/components/DataTable/CustomDataTable.vue";
import {computed, onMounted, ref} from "vue";
import RoleManagement from "@/components/RoleManagement/RoleManagement.vue";
import router from "@/router/index.js";
import {useRolesStore} from "@/stores/rolesStore.js";
import eventBus from "../../eventBus.js";
import {capitalizeFirstLetter} from "@/utils/index.js";
import {createRoles, getRoles} from "@/services/api/roles-service.js";

const roleStore = useRolesStore();

const rolesTableConfig = ref({
  paginator: true,
  rows: 10,
  skip: 0,
  scrollable: true,
  rowsPerPageOptions: [10, 20, 30, 50],
  tableStyle: 'max-width: 100%; overflow-x: auto; border-radius: 20px',
  class: "custom-table",
  size: 'null',
  columns: [
    {field: 'role_name', header: computed(() => t('title_roles'))},
    {field: 'filters', header: computed(() => t('title_filters')), slotName: 'filters'},
    {field: 'products', header: computed(() => t('title_products')), slotName: 'products'},
    {field: 'users', header: computed(() => t('title_users')), slotName: 'users'},
    {field: 'orders', header: computed(() => t('title_orders')), slotName: 'orders'},
  ]
})

const pages = ['filters', 'products', 'users', 'orders'];

const actions = ['view', 'create', 'update', 'delete'];


const multiSelectConfigs = pages.map(page => ({
  name: page,
  code: page,
  component: 'MultiSelect',
  props: {
    options: [
      {label: 'View', value: `view_${page}`},
      {label: 'Create', value: `create_${page}`},
      {label: 'Update', value: `update_${page}`},
      {label: 'Delete', value: `delete_${page}`},
    ],
    optionLabel: 'label',
    placeholder: capitalizeFirstLetter(page),
    class: 'w-full md:w-56 mb-4',
    required: false
  },
  validators: [
    (value) => (value ? true : `${capitalizeFirstLetter(page)} is required`)
  ]
}));

const updatedDataTableConfig = ref({
  ...rolesTableConfig.value,
  value: roleStore.getAllRoles,
})

const configActionsBar = computed(() => {
  return {
    buttons: [
      {
        component: 'Button',
        props: {
          label: 'Update permissions',
          class: 'filter-button',
          icon: 'pi pi-shield',
        },
        onClick: () => {
          router.push({
            name: 'RoleWorkspace',
            state: {
              mode: 'update'
            }
          });
        }
      },
      {
        component: 'Button',
        props: {
          label: 'Create new role',
          class: 'filter-button',
          icon: 'pi pi-users',
        },
        onClick: () => {
          eventBus.emit("show-popup", {
            title: 'Create role',
            fields: [
              {
                code: "role_name",
                component: "InputText",
                props: {
                  type: "text",
                  placeholder: computed(() => 'Role Name'),
                  style: "width: 100%;",
                  class: "mb-4",
                },
                validators: [
                  (value) => (value ? true : `Role Name is required`)
                ]
              },
              ...multiSelectConfigs,
              {
                name: 'description',
                code: 'description',
                label: computed(() => t("label_description")),
                component: 'TextArea',
                props: {
                  placeholder: computed(() => t("placeholder_enter_description")),
                  class: 'w-full mb-4 md:w-56',
                  rows: "5"
                }
              },
            ],
          })
        }
      },
    ],
  }
})

function transformRoleObject(data) {
  const result = {
    role_name: data.role_name,
    code: data.role_name.toUpperCase(),
    description: data.description,
    permissions: {}
  };

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      const category = {};
      for (const action of actions) {
        category[action] = value.some(item => item.value === `${action}_${key}`);
      }
      result.permissions[key] = category;
    }
  }

  return result;
}

function transformRoleObjectToArray(data) {
  const result = {
    roleName: data.role_name || '',
    code: (data.role_name || '').toUpperCase(),
    description: data.description || '',
    permissions: []
  };

  for (const category of pages) {
    const value = data[category];

    if (Array.isArray(value)) {
      for (const action of actions) {
        const hasPermission = value.some(item => item.value === `${action}_${category}`);
        if (hasPermission) {
          result.permissions.push(`${action}_${category}`);
        }
      }
    }
  }

  return result;
}

onMounted(  () => {
  eventBus.on("handle-popup-data", async (data) => {
    roleStore.addNewRole(transformRoleObject(data))
    await createRoles(transformRoleObjectToArray(data))
  });
})

getRoles()

</script>


<style scoped>
.btn {
  color: black;
}
</style>