import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App,
    {
        onExpand() {
            console.log('expand')
        }
    }).use(store).use(router).use(ElementPlus).mount('#app')

