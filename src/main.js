import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'semantic-ui-css/semantic.min.css'
import naive from 'naive-ui'
import 'remixicon/fonts/remixicon.css'


createApp(App).use(router).use(naive).mount('#app')