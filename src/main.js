import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";

// axios.defaults.baseURL = 'http://agendador.soluciona.inf.br:8081/'
axios.defaults.baseURL = 'http://localhost:8081/'
axios.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).token;
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createApp(App).use(router).mount('#app')
