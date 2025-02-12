<template>
  <div class="card flex justify-center">
    <form class="flex flex-col gap-4 w-full sm:w-64" @submit.prevent="onFormSubmit">

      <div v-for="(field, key) in fullWidthFields" :key="key" class="field">
        <FloatLabel>
          <component
              :is="field.component"
              v-model="formData[key]"
              :mask="field.mask"
              class="w-full"
          />
          <label :for="key">{{ field.label }}</label>
        </FloatLabel>

        <Message
            v-if="errors && errors[key]"
            severity="error"
            size="small"
            variant="simple"
            class="message-error"
        >
          {{ errors[key] }}
        </Message>

      </div>


      <div v-if="optionalFields" class="address-form">
        <div class="field" v-for="(optField, key) in optionalFields" :key="optField.value">
          <FloatLabel>
            <InputText v-model="formData[key]" class="w-full"/>
            <label for="street">{{ optField.label }}</label>
          </FloatLabel>
        </div>
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
import {computed, reactive, ref, watch} from 'vue';
import InputText from 'primevue/inputtext';
import {InputMask} from "primevue";
import Password from 'primevue/password';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import {useRouter} from 'vue-router';
import {useValidation} from "@/composables/useValidation.js";

import {login, register} from "@/services/api/auth-serivce.api.js";

const router = useRouter();

const props = defineProps({
  isRegister: {
    type: Boolean,
    default: true
  }
})

const fieldsConfig = {
  login: {
    username: {
      component: InputText,
      type: String,
      required: true,
      label: "Username",
      validators: [
        (value) => (value ? true : "Username is required"),
        (value) => (value.length >= 3 ? true : "Username must be at least 3 characters"),
      ],
    },
    password: {
      component: Password,
      type: String,
      required: true,
      label: "Password",
      validators: [
        (value) => (value ? true : "Password is required"),
        (value) => (value.length >= 6 ? true : "Password must be at least 6 characters"),
      ],
    },
  },

  register: {
    username: {
      component: InputText,
      type: String,
      required: true,
      label: "Username",
      validators: [
        (value) => (value ? true : "Username is required"),
        (value) => (value.length >= 3 ? true : "Username must be at least 3 characters"),
      ],
    },
    password: {
      component: Password,
      type: String,
      required: true,
      label: "Password",
      validators: [
        (value) => (value ? true : "Password is required"),
        (value) => (value.length >= 6 ? true : "Password must be at least 6 characters"),
      ],
    },
    email: {
      component: InputText,
      type: String,
      required: true,
      label: "Email",
      validators: [
        (value) => (value ? true : "Email is required"),
        (value) => (/\S+@\S+\.\S+/.test(value) ? true : "Invalid email format"),
      ],
    },
    firstName: {
      component: InputText,
      type: String,
      required: true,
      label: "First Name",
      validators: [(value) => (value ? true : "First name is required")],
    },
    lastName: {
      component: InputText,
      type: String,
      required: true,
      label: "Last Name",
      validators: [(value) => (value ? true : "Last name is required")],
    },
    //TODO NEED FIX THIS FIELD ERROR IN BROWSER CONSOLE
    phone: {
      component: InputMask,
      type: String,
      required: false,
      label: "Phone",
      mask: "+380 (99) 999-99-99",
    },
    address: {
      street: {
        component: InputText,
        type: String,
        required: false,
        fullWidth: false,
        label: "Street",
      },
      city: {
        component: InputText,
        type: String,
        required: false,
        fullWidth: false,
        label: "City",
      },
      postalCode: {
        component: InputText,
        type: String,
        required: false,
        fullWidth: false,
        label: "Postal Code",
      },
      country: {
        component: InputText,
        type: String,
        required: false,
        fullWidth: false,
        label: "Country",
      },
    },
  },
};

const authFields = computed(() => {
  return props.isRegister ? fieldsConfig.register : fieldsConfig.login;
})

const optionalFields = computed(() => {
  return props.isRegister ? authFields.value.address : {};
});

const fullWidthFields = computed(() => {
  if (props.isRegister) {
    const {address, ...restRegisterFields} = authFields.value; // Извлекаем address
    return restRegisterFields; // Возвращаем остальные поля без address
  }

  return authFields.value;
});

const formData = ref(
    Object.keys(authFields.value).reduce((acc, key) => {
      addFieldToFormData(acc, key, authFields.value[key]);
      return acc;
    }, {})
);

function addFieldToFormData(acc, key, field) {
  if (typeof field === "object" && field !== null && !Array.isArray(field) && !field.component) {
    Object.keys(field).forEach((subKey) => {
      addFieldToFormData(acc, subKey, field[subKey]);
    });
  } else {
    acc[key] = "";
  }
}

const {isValid, errors, validateFields} = useValidation(authFields.value, formData.value);

const addressKeys = ["street", "city", "postalCode", "country"];

const formatUserData = (data) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (addressKeys.includes(key)) {
      acc.address[key] = value;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {address: {}});
};

const onFormSubmit = async () => {
  validateFields();

  if (!isValid.value) return;

  try {
    const response = props.isRegister
        ? await register(formatUserData(formData.value))
        : await login(formData.value);

    if (response.token) {
      router.push('/filters');
    }
  } catch (error) {
    console.error("Authentication error:", error);
  }
};
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
