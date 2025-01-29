import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import fetchPlugin from './plugins/fetch';
import PrimeVue from "primevue/config";
import Noir from "@/presets/Noir.js";
import InputText from 'primevue/inputtext';
import FileUpload from "primevue/fileupload";
import Rating from 'primevue/rating';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App);
import router from "./router";

app.use(fetchPlugin);
app.use(ToastService);
app.use(ConfirmationService);

app.component('InputText', InputText);
app.component('FileUpload', FileUpload);
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

app.mount('#app');
