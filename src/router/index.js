import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCustomerAuthStore } from '@/stores/customerAuth'
import { updatePageMeta } from '@/utils/pageMeta'
import { getToken, getCustomerToken } from '@/services/api'

const Home = () => import('../pages/Home.vue')
const Sobre = () => import('../pages/Sobre.vue')
const Bolos = () => import('../pages/Bolos.vue')
const Cardapio = () => import('../pages/Cardapio.vue')
const Contato = () => import('../pages/Contato.vue')
const Login = () => import('../pages/Login.vue')
const Admin = () => import('../pages/Admin.vue')
const ClienteLogin = () => import('../pages/ClienteLogin.vue')
const ClienteCadastro = () => import('../pages/ClienteCadastro.vue')
const ClienteConta = () => import('../pages/ClienteConta.vue')

function isAdminTokenValid() {
  const token = getToken()
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role === 'admin' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

function isCustomerTokenValid() {
  const token = getCustomerToken()
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role === 'customer' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Home' } },
  { path: '/sobre', name: 'Sobre', component: Sobre, meta: { title: 'Sobre' } },
  { path: '/bolos', name: 'Bolos', component: Bolos, meta: { title: 'Bolos' } },
  { path: '/cardapio', name: 'Cardapio', component: Cardapio, meta: { title: 'Cardapio' } },
  { path: '/contato', name: 'Contato', component: Contato, meta: { title: 'Contato' } },
  {
    path: '/cadastro',
    name: 'ClienteCadastro',
    component: ClienteCadastro,
    meta: { title: 'Cadastro', guestCustomerOnly: true },
  },
  {
    path: '/login',
    name: 'ClienteLogin',
    component: ClienteLogin,
    meta: { title: 'Login', guestCustomerOnly: true },
  },
  {
    path: '/minha-conta',
    name: 'ClienteConta',
    component: ClienteConta,
    meta: { title: 'Minha conta', requiresCustomerAuth: true },
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: Login,
    meta: { guestAdminOnly: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAdminAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const customerAuth = useCustomerAuthStore()

  if (to.meta.requiresAdminAuth && !isAdminTokenValid()) {
    authStore.logout()
    return { name: 'AdminLogin' }
  }

  if (to.meta.guestAdminOnly && isAdminTokenValid()) {
    return { name: 'Admin' }
  }

  if (to.meta.requiresCustomerAuth && !isCustomerTokenValid()) {
    customerAuth.logout()
    return { name: 'ClienteLogin', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestCustomerOnly && isCustomerTokenValid()) {
    return { name: 'ClienteConta' }
  }

  return true
})

router.afterEach((to) => {
  if (!to.path.startsWith('/admin')) {
    updatePageMeta(to.name)
  }
})

export default router
