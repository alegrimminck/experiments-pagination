import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Ping from '../pages/Ping.vue'
import ProductsPagination from '../pages/ProductsPagination.vue'
import ProductsInfinitePagination from '../pages/ProductsInfinitePagination.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/ping', component: Ping },
  { path: '/products/pagination', component: ProductsPagination },
  { path: '/products/infinite', component: ProductsInfinitePagination }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
