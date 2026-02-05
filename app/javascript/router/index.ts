import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Ping from '../pages/Ping.vue'
import Products from '../pages/Products.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/ping', component: Ping },
  { path: '/products', component: Products }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
