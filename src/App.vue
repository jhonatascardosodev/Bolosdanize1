<template>
  <v-app>
    <template v-if="!isAdminRoute">
    <v-app-bar 
      app 
      color="background" 
      elevation="2"
      class="app-bar-custom"
    >
      <div class="app-bar-content">
        <!-- Menu desktop à esquerda -->
        <div v-if="!$vuetify.display.mobile" class="d-flex align-center menu-left">
          <v-btn
            v-for="item in menuItems.slice(0, 2)"
            :key="item.name"
            :to="item.to"
            text
            class="nav-link mx-1"
            active-class="nav-link--active"
          >
            {{ item.title }}
          </v-btn>
        </div>

        <!-- Mobile: menu hambúrguer -->
        <v-app-bar-nav-icon 
          v-if="$vuetify.display.mobile"
          @click="drawer = !drawer"
          class="text-primary"
        />

        <!-- Logo centralizada -->
        <router-link to="/" class="logo-link-center">
          <div class="logo-container">
            <img 
              :src="logo" 
              alt="Bolos da Nize" 
              class="logo-img"
            />
          </div>
        </router-link>

        <!-- Menu desktop à direita -->
        <div v-if="!$vuetify.display.mobile" class="d-flex align-center menu-right">
          <v-btn
            v-for="item in menuItems.slice(2)"
            :key="item.name"
            :to="item.to"
            text
            class="nav-link mx-1"
            active-class="nav-link--active"
          >
            {{ item.title }}
          </v-btn>
          
          <v-btn
            icon
            @click="toggleCart"
            class="ml-2 text-primary"
          >
            <v-badge :content="cartItemCount" :value="cartItemCount > 0" color="accent">
              <v-icon color="primary">mdi-cart</v-icon>
            </v-badge>
          </v-btn>
        </div>

        <!-- Mobile: carrinho à direita -->
        <div v-if="$vuetify.display.mobile" class="d-flex align-center">
          <v-btn
            icon
            @click="toggleCart"
            class="text-primary"
          >
            <v-badge :content="cartItemCount" :value="cartItemCount > 0" color="accent">
              <v-icon color="primary">mdi-cart</v-icon>
            </v-badge>
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
      color="background"
    >
      <v-list nav dense>
        <v-list-item
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          @click="drawer = false"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    </template>

    <v-main :class="{ 'admin-main': isAdminRoute }">
      <router-view />

      <CarrinhoDrawer
        v-if="!isAdminRoute"
        v-model="showCart"
        :items="cart"
        @update:items="cart = $event"
        @remove-item="removeFromCart"
        @order-sent="handleOrderSent"
      />
    </v-main>

    <v-snackbar v-model="orderSnackbar" color="success" timeout="4000">
      Pedido enviado! Finalize a conversa no WhatsApp.
    </v-snackbar>

    <v-footer
      v-if="!isAdminRoute"
      color="primary"
      dark
      padless
    >
      <v-card
        flat
        tile
        width="100%"
        class="text-center"
      >
        <v-card-text class="py-4 footer-text">
          <p class="mb-0">
            © {{ new Date().getFullYear() }} Bolos da Nize · Confeitaria artesanal · Itacoatiara, AM
          </p>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import CarrinhoDrawer from './components/CarrinhoDrawer.vue'
import logo from './assets/logo solo 1.png'

const route = useRoute()
const drawer = ref(false)
const showCart = ref(false)
const cart = ref([])
const orderSnackbar = ref(false)

const menuItems = [
  { title: 'Início', to: '/', name: 'Home' },
  { title: 'Sobre', to: '/sobre', name: 'Sobre' },
  { title: 'Bolos personalizados', to: '/bolos', name: 'Bolos' },
  { title: 'Cardápio', to: '/cardapio', name: 'Cardapio' },
  { title: 'Contato', to: '/contato', name: 'Contato' },
]

const cartItemCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const toggleCart = () => {
  showCart.value = !showCart.value
}

const handleAddToCart = (item) => {
  const existingItem = cart.value.find(cartItem => 
    cartItem.id === item.id && 
    JSON.stringify(cartItem.flavors) === JSON.stringify(item.flavors)
  )

  if (existingItem) {
    existingItem.quantity += item.quantity
  } else {
    cart.value.push({ ...item })
  }
  
  showCart.value = true
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const handleOrderSent = () => {
  cart.value = []
  orderSnackbar.value = true
}

// Provide para compartilhar funções com páginas
provide('addToCart', handleAddToCart)
</script>

<style scoped>
.nav-link {
  color: var(--color-text-soft) !important;
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.04em !important;
}

.nav-link--active {
  color: var(--color-accent-dark) !important;
  font-weight: 600 !important;
}

.footer-text {
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  opacity: 0.95;
}

.white--text {
  color: white !important;
}

.app-bar-custom {
  background: #faf8f7 !important;
  border-bottom: 1px solid rgba(196, 137, 138, 0.2);
  padding: 0 !important;
}

.app-bar-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  gap: 16px;
}

.menu-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logo-link-center {
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 2;
  position: relative;
}

.logo-container {
  background: white;
  padding: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(212, 165, 165, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container:hover {
  box-shadow: 0 6px 20px rgba(212, 165, 165, 0.5);
  transform: scale(1.05);
}

.logo-img {
  max-height: 60px;
  height: auto;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  display: block;
}

.menu-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  grid-column: 3;
}

@media (max-width: 960px) {
  .app-bar-content {
    grid-template-columns: auto auto 1fr;
  }
  
  .menu-left {
    display: none;
  }
  
  .logo-link-center {
    grid-column: 2;
    margin: 0 auto;
  }
  
  .menu-right {
    grid-column: 3;
  }
}

@media (max-width: 768px) {
  .logo-img {
    max-height: 45px;
  }
  
  .logo-container {
    padding: 6px 12px;
  }
  
  .app-bar-content {
    padding: 8px 12px;
  }
}
</style>
