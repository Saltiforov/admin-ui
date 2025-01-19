import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import fetchPlugin from './plugins/fetch';
import PrimeVue from "primevue/config";
import Noir from "@/presets/Noir.js";
import InputText from 'primevue/inputtext';
const app = createApp(App);

app.use(fetchPlugin);

app.component('InputText', InputText);

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
