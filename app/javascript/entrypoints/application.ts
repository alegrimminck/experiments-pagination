import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from '../pages/App.vue'
import { router } from '../router'

const app = createApp(App)
app.use(router)
app.use(VueQueryPlugin)
app.mount('#app')
