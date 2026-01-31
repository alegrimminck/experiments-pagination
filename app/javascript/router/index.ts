import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Ping from '../pages/Ping.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/ping', component: Ping }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
