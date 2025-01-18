import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import fetchPlugin from './plugins/fetch';
import PrimeVue from "primevue/config";
import Noir from "@/presets/Noir.js";

const app = createApp(App);

app.use(fetchPlugin);
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
