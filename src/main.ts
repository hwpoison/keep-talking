import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './index.css'

console.log("[+] Welcome to Keep-Talking (by:hwpoison) :-)")

createApp(App).use(router).mount('#app')