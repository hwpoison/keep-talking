import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import './index.css'

console.info("[+] Welcome to Keep-Talking by: hwpoison :-)")

createApp(App)
			.use(router)
			.mount('#app')
