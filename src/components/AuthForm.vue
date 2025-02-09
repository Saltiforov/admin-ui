<template>
  <div class="card flex justify-center">
    <form class="flex flex-col gap-4 w-full sm:w-64" @submit.prevent="onFormSubmit">
      <div class="field">
        <FloatLabel>
          <InputText
              v-model="formData.username"
              class="w-full"
          />
          <label for="username">Username</label>
        </FloatLabel>
      </div>


      <div class="field" v-if="isRegister">
        <FloatLabel>
          <InputText
              v-model="formData.email"
              class="w-full"
          />
          <label for="email">Email</label>
        </FloatLabel>
      </div>
      <div class="field" v-if="isRegister">
        <FloatLabel>
          <InputText
              v-model="formData.firstName"
              class="w-full"
          />
          <label for="firstName">First Name</label>
        </FloatLabel>
      </div>
      <div class="field" v-if="isRegister">
        <FloatLabel>
          <InputText
              v-model="formData.lastName"
              class="w-full"
          />
          <label for="lastName">Last Name</label>
        </FloatLabel>
      </div>
      <div class="field" v-if="isRegister">
        <label class="m" for="phone">Phone</label>
        <InputMask id="phone" v-model="formData.phone" mask="+380 (99) 999-99-99" placeholder="+380 (__) ___-__-__"
                   fluid/>
      </div>

      <div v-if="isRegister" class="address-form">
        <div class="field">
          <FloatLabel>
            <InputText v-model="formData['address'].street"  class="w-full"/>
            <label for="street">Street</label>
          </FloatLabel>
        </div>

        <div class="field">
          <FloatLabel>
            <InputText v-model="formData['address'].city" class="w-full"/>
            <label for="city">City</label>
          </FloatLabel>
        </div>

        <div class="field">
          <FloatLabel>
            <InputText v-model="formData['address'].postalCode" class="w-full"/>
            <label for="postalCode">Postal Code</label>
          </FloatLabel>
        </div>

        <div class="field">
          <FloatLabel>
            <InputText v-model="formData['address'].country" class="w-full"/>
            <label for="country">Country</label>
          </FloatLabel>
        </div>
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

<!--      <div class="field" v-if="isRegister">-->
<!--        <FloatLabel>-->
<!--          <Password-->
<!--              id="confirm-password"-->
<!--              v-model="formData.confirmPassword"-->
<!--              placeholder=" "-->
<!--              toggleMask-->
<!--              feedback="false"-->
<!--              class="w-full"-->
<!--          />-->
<!--          <label for="confirm-password">Confirm Password</label>-->
<!--        </FloatLabel>-->
<!--      </div>-->

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
import {ref, watch} from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import { login, register} from "@/services/api/auth-serivce.api.js";
import {useRouter} from 'vue-router';

const router = useRouter();


const props = defineProps({
  isRegister: {
    type: Boolean,
    default: true
  }
})


const formData = ref(getInitialFormData(props.isRegister));

watch(() => props.isRegister, (newVal) => {
  formData.value = getInitialFormData(newVal);
});

function getInitialFormData(isRegister) {
  const baseData = {
    username: '',
    password: '',
  };

  if (isRegister) {
    return {
      ...baseData,
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: '',
      },
      roles: []
    };
  }

  return baseData;
}

const onFormSubmit = async () => {
  console.log('Form submitted:', formData.value);

  try {
    const response = props.isRegister
        ? await register(formData.value)
        : await login(formData.value);

    if (response.token) {
      router.push('/filters');
    }
  } catch (error) {
    console.error("Authentication error:", error);
  }
};

// const onFormSubmit = async () => {
//   console.log('Form submitted:', formData.value);
//   await login(formData.value).then(res => {
//     if (res.token) {
//       router.push('/filters');
//     }
//   })
// };
</script>

<style scoped>

.address-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px; /* Отступы между полями */
  max-width: 600px;
}

.field {
  display: flex;
  flex-direction: column;
}

/* Для мобильных устройств - одна колонка */
@media (max-width: 480px) {
  .address-form {
    grid-template-columns: 1fr;
  }
}

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
  margin-bottom: 1rem;
}

.card {
  max-width: 600px;
}

.submit-button {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
