import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import fetchPlugin from './plugins/fetch';

const app = createApp(App);
app.use(fetchPlugin);
export default app;

app.mount('#app');
