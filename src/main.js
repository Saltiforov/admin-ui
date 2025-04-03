import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import fetchPlugin from './plugins/fetch';
import AsyncTreeSelect from '@/components/UI/AsyncTreeSelect.vue';
import PrimeVue from "primevue/config";
import Noir from "@/presets/Noir.js";
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import IconField from "primevue/iconfield";
import FileUpload from "primevue/fileupload";
import Rating from 'primevue/rating';
import Select from 'primevue/select';
import RadioButton from 'primevue/radiobutton';
import TextArea from 'primevue/textarea';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import MultiSelect from 'primevue/multiselect';
import TreeSelect from 'primevue/treeselect';
import Checkbox from 'primevue/checkbox';
import Password from 'primevue/password';
import ToggleSwitch from 'primevue/toggleswitch';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import AppState from './plugins/appState.js';

import {createPinia} from "pinia";


const app = createApp(App);
const pinia = createPinia();

import router from "./router";
import InputIcon from "primevue/inputicon";
import i18n from "@/i18n/index.js";

app.use(pinia);
app.use(i18n);
app.use(AppState);
app.use(fetchPlugin);
app.use(ToastService);
app.use(ConfirmationService);


app.component('ToggleSwitch', ToggleSwitch);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('InputNumber', InputNumber);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('Checkbox', Checkbox);
app.component('MultiSelect', MultiSelect);
app.component('Select', Select);
app.component('TreeSelect', TreeSelect);
app.component('AsyncTreeSelect', AsyncTreeSelect);
app.component('Button', Button);
app.component('Tag', Tag);
app.component('TextArea', TextArea);
app.component('FileUpload', FileUpload);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false,
        }
    }
});
export default app;

window.t = (key, params = {}) => i18n.global.t(key, params);

const api = app.config.globalProperties.$api;

api.instance.interceptors?.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem('authToken');

            app.config.globalProperties.$router.push('/auth/login').catch(() => {});

            console.log("Redirecting to login due to 403 error");

            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

app.mount('#app');