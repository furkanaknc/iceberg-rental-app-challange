import './styles.css';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app/App.vue';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#root');
