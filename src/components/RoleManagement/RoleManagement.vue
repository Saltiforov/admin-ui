<template>
  <div class="roles-wrapper">
    <h3 class="role-title">{{ t("roles_management_title") }}</h3>
    <IconField class="mb-4">
      <InputIcon class="pi pi-search"/>
      <InputText class="w-full " v-model="roleSearch" :placeholder="t('placeholder_search')"/>
    </IconField>
    <div :style="{ overflowY: users.length >= 6 ? 'scroll' : 'hidden' }" class="roles-content">
      <div v-for="user in searchedRoles" :key="user.id" class="user">
        <p>{{ user.name }}</p>
        <MultiSelect optionLabel="name" @change="updateRole(user)" v-model="user.roles" :options="roles"></MultiSelect>
      </div>
      <p v-show="!searchedRoles.length">{{ t("roles_management_failed_search") }}</p>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';

const { t } = useI18n();

const roleSearch = ref('')

const searchedRoles = computed(() => {
  if (!roleSearch.value) return users.value;
  return users.value.filter((item) => item.name.toLowerCase().includes(roleSearch.value.toLowerCase()));
});

const roles = [
  { name: 'Admin', code: 'AD' },
  { name: 'Moderator', code: 'MD' },
  { name: 'Editor', code: 'ED' },
  { name: 'Viewer', code: 'VW' },
  { name: 'User', code: 'UR' },
  { name: 'Manager', code: 'MG' },
  { name: 'Support', code: 'SP' },
  { name: 'Developer', code: 'DV' },
  { name: 'Tester', code: 'TS' },
  { name: 'Guest', code: 'GT' }
];

const users = ref([
  {id: 1, name: 'Алексей', roles: [{name: 'Admin', code: 'AD'},{name: 'Developer', code: 'DV'},]},
  {id: 2, name: 'Мария', roles: [{name: 'Moderator', code: 'MD'}]},
  {id: 3, name: 'Иван', roles: [{name: 'Editor', code: 'ED'}]},
  {id: 3, name: 'Иван', roles: [{name: 'Manager', code: 'MG'}]},
  {id: 3, name: 'Иван', roles: [{name: 'Manager', code: 'MG'}]},
]);

const updateRole = (user) => {
  console.log("updateRole", user)
};
</script>

<style scoped>
.roles-wrapper {
  color: black;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.roles-content {
  height: 350px;
  overflow-y: scroll;
}

.role-title {
  text-align: center;
  padding: 0 10px 10px 10px;
  font-size: 20px;
  position: sticky;
}

.user {
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}
</style>
