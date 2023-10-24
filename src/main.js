import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import "../public/css/style.css";
import "../public/css/bootstrap.min.css";
import "../public/css/font-awesome.min.css" 
import "../public/css/elegant-icons.css";
import "../public/css/flaticon.css";
import "../public/css/nice-select.css";
import "../public/css/slicknav.min.css";
import "../public/css/style.css";



createApp(App).use(store).use(router).mount('#app')
