<template>
  <div class="about-wrapper">
    <div v-show="isLoading" class="loader-overlay">
      <ProgressSpinner class="loader-spinner"/>
    </div>
    <div class="about_user_image flex justify-center items-center">
      <img class="user-image" :src="user.avatarUrl" alt="">
    </div>
    <div class="about_user_info">
      <div class="flex mb-4">
        <div class="">
          <p class="user-name">{{ userFullName }}</p>
        </div>
        <div class="location flex items-center">
          <i class="pi pi-map-marker location-icon" style="color: #708090"></i>
          <p class="contact-label">{{ user.address.city }}, {{ user.address.country }}</p>
        </div>
      </div>
      <div class="user-contacts">
        <div class="contact">
          <p class="contact-label">{{ t("label_phone") }}:</p>
          <div class="contact-info">
            <InputMask
                id="phone"
                v-model="user.phone"
                mask="+(999) 999-9999"
                placeholder="(999) 999-9999"
                fluid
                :disabled="!isUpdateMode"
            />
          </div>
        </div>
        <div class="contact" v-for="(address, idx) in user.address">
          <p class="contact-label">{{ capitalizeFirstLetter(t(`label_${idx}`)) }}:</p>
          <div class="contact-info">
            <InputText class="w-full" :disabled="!isUpdateMode" v-model="user.address[idx]"/>
          </div>
        </div>
        <div class="contact">
          <p class="contact-label">{{ t("label_email") }}:</p>
          <div class="contact-info">
            <InputText class="w-full" :disabled="!isUpdateMode" v-model="user.email"/>
          </div>
        </div>
        <div class="contact">
          <p class="contact-label">{{ t("label_roles") }}:</p>
          <div class="contact-info">
            <MultiSelect
                v-model="user.roles"
                :options="roles"
                optionLabel="name"
                placeholder="Select Roles"
                :maxSelectedLabels="3"
                :disabled="!isUpdateMode"
                class="w-full md:w-80"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="user-activity">
      <p class="section-title">{{ t("about_user_activity") }}</p>
      <div class="activity-grid">
        <div class="activity-item">
          <p class="contact-label">{{ t("about_user_registration") }}:</p>
          <p class="contact-info">{{ user.userActivity.registrationDate }}</p>
        </div>
        <div class="activity-item">
          <p class="contact-label">{{ t("about_user_last_login") }}:</p>
          <p class="contact-info">{{ user.userActivity.lastLogin }}</p>
        </div>
        <div class="activity-item">
          <p class="contact-label">{{ t("about_user_status") }}:</p>
          <span :class="['status-badge', user.userActivity.status.toLowerCase()]">
            {{ user.userActivity.status }}
          </span>
        </div>
        <div class="activity-item">
          <p class="contact-label">{{ t("about_user_orders") }}:</p>
          <p class="contact-info">{{ user.userActivity.ordersCount }}</p>
        </div>
        <div class="activity-item">
          <p class="contact-label">{{ t("about_user_role") }}:</p>
          <p class="contact-info">{{ user.userActivity.role }}</p>
        </div>
        <div class="activity-item">
          <p class="contact-label">{{ t("about_user_subscriptionLevel") }}:</p>
          <p class="contact-info">{{ user.userActivity.subscriptionLevel }}</p>
        </div>
      </div>
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
            :disabled="isUpdateMode"
            :label="t('button_text_save')"
        />
      </div>
    </div>


  </div>
</template>

<script setup>

import {computed, reactive, ref} from "vue";
import {capitalizeFirstLetter} from "@/utils/index.js";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import {useRouter} from "vue-router";
import {timeoutService} from "@/services/timeoutService/timeoutService.js";
import {useI18n} from 'vue-i18n';
import {useUserStore} from "@/stores/userRole.js";
import RoleManagement from "@/components/RoleManagement/RoleManagement.vue";

const {t} = useI18n();

const router = useRouter()
const authStore = useUserStore();
const isUpdateMode = ref(authStore.canManage);

const isLoading = ref(true);

const user = reactive({
  userName: "SecurityLord",
  firstName: "Jeremy",
  lastName: "Rose",
  email: "jeremy@gmail.com",
  phone: "+38012456789",
  avatarUrl: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
  address: {
    street: "Jeremy Avenue, 88",
    city: "Wellington",
    country: "United States",
    postal_code: "54321",
  },
  roles: [
    {name: "Administrator", code: "ADM"},
    {name: "Moderator", code: "MOD"},
    {name: "Content Manager", code: "CNT"}
  ],
  userActivity: {
    registrationDate: "2024-01-10",
    lastLogin: "2025-04-01 15:32",
    status: "Online",
    ordersCount: 12,
    role: "Admin",
    subscriptionLevel: "Premium",
  }
});

timeoutService.setTimeout(() => {
  isLoading.value = false;
}, 500)

const roles = ref([
  {name: 'Administrator', code: 'ADM'},
  {name: 'Moderator', code: 'MOD'},
  {name: 'Content Manager', code: 'CNT'},
  {name: 'Catalog Manager', code: 'CTG'},
  {name: 'Order Manager', code: 'ORD'},
  {name: 'Customer Support', code: 'CST'},
  {name: 'Accountant', code: 'ACC'},
  {name: 'Analyst', code: 'ANL'},
  {name: 'Warehouse Manager', code: 'WHM'},
  {name: 'Logistics Specialist', code: 'LOG'},
  {name: 'Tech Support', code: 'TSP'},
  {name: 'Security Specialist', code: 'SEC'}
]);

const userFullName = computed(() => {
  return `${user.firstName} ${user.lastName}`
})
</script>


<style scoped>
.user-activity {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  min-width: 100%;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.activity-grid {
  display: grid;
  gap: 10px;
}

.user-action {
  margin: 10px 20px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.status-badge.online {
  background: #d4edda;
  color: #155724;
}

.status-badge.offline {
  background: #f8d7da;
  color: #721c24;
}

.about-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto;
  gap: 15px;
}

.contact {
  display: grid;
  grid-template-columns: 1fr 5fr;
  grid-template-rows: auto;
  gap: 10px;
}

.actions-wrapper {
  height: 100%;
}

.location {
  margin-left: 15px;
}

.user-name {
  font-size: 34px;
}

.contact-label {
  font-size: 18px;
}

.location-icon {
  margin-right: 5px;
}

.contact-info {
  font-size: 18px;
}

.contact {
  margin-bottom: 20px;
  align-items: center;
}

.about-wrapper {
  color: black;
}

.user-image {
  max-width: 350px;
  border-radius: 20px;
  height: 400px;
  object-fit: cover;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
}
</style>