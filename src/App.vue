<template>
  <v-app>
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
            class="text-primary mx-1"
            active-class="font-weight-bold"
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
            class="text-primary mx-1"
            active-class="font-weight-bold"
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

    <v-main>
      <router-view />
      
      <CarrinhoDrawer
        v-model="showCart"
        :items="cart"
        @update:items="cart = $event"
        @remove-item="removeFromCart"
        @finalize-order="finalizeOrder"
      />
    </v-main>

    <v-footer
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
        <v-card-text class="py-4">
          <p class="mb-0">
            © {{ new Date().getFullYear() }} Bolos da Nize - Confeitaria Artesanal | Itacoatiara - AM
          </p>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useRouter } from 'vue-router'
import CarrinhoDrawer from './components/CarrinhoDrawer.vue'
import logo from './assets/logo solo 1.png'

const router = useRouter()
const drawer = ref(false)
const showCart = ref(false)
const cart = ref([])

const menuItems = [
  { title: 'Início', to: '/', name: 'Home' },
  { title: 'Sobre', to: '/sobre', name: 'Sobre' },
  { title: 'Bolos Personalizados', to: '/bolos', name: 'Bolos' },
  { title: 'Cardápio', to: '/cardapio', name: 'Cardapio' },
  { title: 'Contato', to: '/contato', name: 'Contato' },
]

const cartItemCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})

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

const finalizeOrder = () => {
  const message = formatWhatsAppMessage()
  const whatsappNumber = '5592991985973'
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

const formatWhatsAppMessage = () => {
  let message = '🍰 *PEDIDO - BOLOS DA NIZE*\n\n'
  
  cart.value.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    if (item.size) {
      message += `   📏 Tamanho: ${item.size}\n`
    }
    if (item.flavors && item.flavors.length > 0) {
      message += `   🎂 Sabores: ${item.flavors.join(', ')}\n`
    }
    if (item.birthdayName) {
      message += `   👤 Nome: ${item.birthdayName}\n`
    }
    if (item.birthdayAge) {
      message += `   🎂 Idade: ${item.birthdayAge} anos\n`
    }
    if (item.cakeTheme) {
      message += `   🎨 Tema: ${item.cakeTheme}\n`
    }
    if (item.birthdayName || item.birthdayAge || item.cakeTheme) {
      message += `   ✅ Topper incluso\n`
    }
    message += `   ✨ Quantidade: ${item.quantity}\n`
    message += `   💰 Valor: R$ ${item.price.toFixed(2)}\n\n`
  })
  
  const subtotal = cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 10
  const total = subtotal + deliveryFee
  
  message += `Subtotal: R$ ${subtotal.toFixed(2)}\n`
  message += `Taxa de entrega: R$ ${deliveryFee.toFixed(2)}\n`
  message += `*Total: R$ ${total.toFixed(2)}*\n\n`
  message += 'Aguardo confirmação! 😊'
  
  return message
}

// Provide para compartilhar funções com páginas
provide('addToCart', handleAddToCart)
</script>

<style scoped>
.font-destaque {
  font-family: 'Playfair Display', serif;
}

.white--text {
  color: white !important;
}

.app-bar-custom {
  background: linear-gradient(135deg, #ffffff 0%, #FDF2F8 100%) !important;
  border-bottom: 2px solid #E8B4B8;
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
