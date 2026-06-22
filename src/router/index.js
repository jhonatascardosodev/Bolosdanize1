import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Sobre from '../pages/Sobre.vue'
import Bolos from '../pages/Bolos.vue'
import Cardapio from '../pages/Cardapio.vue'
import Contato from '../pages/Contato.vue'
import Login from '../pages/Login.vue'
import Admin from '../pages/Admin.vue'
import { useAuthStore } from '@/stores/auth'
import { updatePageMeta } from '@/utils/pageMeta'
import { getToken } from '@/services/api'

function isTokenValid() {
  const token = getToken()
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' },
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: Sobre,
    meta: { title: 'Sobre' },
  },
  {
    path: '/bolos',
    name: 'Bolos',
    component: Bolos,
    meta: { title: 'Bolos' },
  },
  {
    path: '/cardapio',
    name: 'Cardapio',
    component: Cardapio,
    meta: { title: 'Cardapio' },
  },
  {
    path: '/contato',
    name: 'Contato',
    component: Contato,
    meta: { title: 'Contato' },
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

  if (to.meta.requiresAuth && !isTokenValid()) {
    authStore.logout()
    return { name: 'AdminLogin' }
  }

  if (to.meta.guestOnly && isTokenValid()) {
    return { name: 'Admin' }
  }

  return true
})

router.afterEach((to) => {
  if (!to.path.startsWith('/admin')) {
    updatePageMeta(to.name)
  }
})

export default router
