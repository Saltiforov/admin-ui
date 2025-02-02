import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import fetchPlugin from './plugins/fetch';
import PrimeVue from "primevue/config";
import Noir from "@/presets/Noir.js";
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import FileUpload from "primevue/fileupload";
import Rating from 'primevue/rating';
import Select from 'primevue/select';
import RadioButton from 'primevue/radiobutton';
import TextArea from 'primevue/textarea';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import AppState from './plugins/appState.js';

const app = createApp(App);
import router from "./router";
app.use(AppState);
app.use(fetchPlugin);
app.use(ToastService);
app.use(ConfirmationService);

app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Checkbox', Checkbox);
app.component('MultiSelect', MultiSelect);
app.component('Button', Button);
app.component('Tag', Tag);
app.component('TextArea', TextArea);
app.component('FileUpload', FileUpload);
app.component('RadioButton', RadioButton);
app.component('Select', Select);
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
