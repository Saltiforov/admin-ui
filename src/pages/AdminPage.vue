<template>
  <div class="about-wrapper">
    <div v-show="isLoading" class="loader-overlay">
      <ProgressSpinner class="loader-spinner"/>
    </div>


    <RoleManagement v-if="authStore.canManage"/>

    <div class="user-actions">
      <div class="actions-wrapper flex justify-end items-end">
        <Button
            class="user-action"
            type="button"
            icon="pi pi-undo"
            :label="t('button_text_cancel')"
            @click="router.go(-1)"
        />
        <Button
            class="user-action"
            type="button"
            icon="pi pi-save"
            :label="t('button_text_save')"
        />
      </div>
    </div>


  </div>
</template>

<script setup>
import {ref} from "vue";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import {useRouter} from "vue-router";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import {useI18n} from 'vue-i18n';
import {useAuthStore} from "@/stores/authRole.js";
import RoleManagement from "@/components/RoleManagement/RoleManagement.vue";

const {t} = useI18n();

const router = useRouter()
const authStore = useAuthStore();
const isUpdateMode = ref(authStore.canManage);

const isLoading = ref(true);

timeoutService.setTimeout(() => {
  isLoading.value = false;
}, 500)

</script>


<style scoped>
.user-action {
  margin: 10px 20px;
}

.about-wrapper {
  display: grid;
  grid-template-rows: auto;
  gap: 15px;
}

.actions-wrapper {
  height: 100%;
}

.about-wrapper {
  color: black;
}

</style>