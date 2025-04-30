<template>
  <PermissionsController v-if="mode === 'update'"/>
  <CreateRole v-if="mode === 'create'"/>
</template>


<script setup>
import PermissionsController from "@/components/PermissionsController/PermissionsController.vue";
import CreateRole from "@/components/RoleManagement/CreateRole.vue";
import {computed} from "vue";

const mode = computed(() => history.state?.mode ?? 'manage');
</script>


<style scoped></style>