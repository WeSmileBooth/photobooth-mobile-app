import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import lottie from 'vue3-lottie'
import './style.css'


createApp(App)
  .use(createPinia())
  .use(router)
  .use(lottie)
  .mount('#app')