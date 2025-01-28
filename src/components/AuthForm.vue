<template>
  <div class="card flex justify-center">
    <form class="flex flex-col gap-4 w-full sm:w-64" @submit.prevent="onFormSubmit">
      <div class="field">
        <FloatLabel>
          <InputText
              v-model="formData.username"
              class="w-full"
          />
          <label for="email">Username</label>
        </FloatLabel>
      </div>

      <div class="field">
        <FloatLabel>
          <Password
              :feedback="false"
              v-model="formData.password"
              class="w-full"
          />
          <label for="password">Password</label>
        </FloatLabel>
      </div>

      <div class="field" v-if="isRegister">
        <FloatLabel>
          <Password
              id="confirm-password"
              v-model="formData.confirmPassword"
              placeholder=" "
              toggleMask
              feedback="false"
              class="w-full"
          />
          <label for="confirm-password">Confirm Password</label>
        </FloatLabel>
      </div>

      <div class="submit-button">
        <Button
            type="submit"
            :label="isRegister ? 'Register' : 'Login'"
            severity="secondary"
            class="w-full mt-2"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import {login} from "@/services/api/auth-serivce.api.js";
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  username: '',
  password: '',
});

defineProps({
  isRegister: {
    type: Boolean,
    default: true
  }
})


const onFormSubmit = async () => {
  console.log('Form submitted:', formData.value);
  await login(formData.value).then(res => {
    if (res.token) {
      router.push('/three');
    }
  })
};
</script>

<style scoped>
:deep(.p-inputtext) {
  width: 100%;
}
:deep(.p-password) {
  width: 100%;
}
:deep(.p-button) {
  width: 100%;
}

.field {
  margin-bottom: 1.7rem;
}
.card {
  max-width: 400px;
}
.submit-button {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
