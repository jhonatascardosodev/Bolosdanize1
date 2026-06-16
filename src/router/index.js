import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Sobre from '../pages/Sobre.vue'
import Bolos from '../pages/Bolos.vue'
import Cardapio from '../pages/Cardapio.vue'
import Contato from '../pages/Contato.vue'
import Login from '../pages/Login.vue'
import Admin from '../pages/Admin.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: Sobre,
  },
  {
    path: '/bolos',
    name: 'Bolos',
    component: Bolos,
  },
  {
    path: '/cardapio',
    name: 'Cardapio',
    component: Cardapio,
  },
  {
    path: '/contato',
    name: 'Contato',
    component: Contato,
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'AdminLogin' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'Admin' }
  }

  return true
})

export default router
