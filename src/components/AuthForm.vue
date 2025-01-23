<template>
  <div class="card flex justify-center">
    <form class="flex flex-col gap-4 w-full sm:w-64" @submit.prevent="onFormSubmit">
      <div class="field">
        <FloatLabel>
          <InputText
              id="email"
              v-model="formData.email"
              type="email"
              placeholder=" "
              class="w-full"
          />
          <label for="email">Email</label>
        </FloatLabel>
      </div>

      <div class="field">
        <FloatLabel>
          <Password
              id="password"
              v-model="formData.password"
              placeholder=" "
              toggleMask
              feedback="false"
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

const formData = ref({
  email: '',
  password: '',
  confirmPassword: ''
});

defineProps({
  isRegister: {
    type: Boolean,
    default: true
  }
})


const onFormSubmit = () => {
  console.log('Form submitted:', formData.value);
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
