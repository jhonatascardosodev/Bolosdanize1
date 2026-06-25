<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    temporary
    location="right"
    :width="drawerWidth"
    elevation="10"
  >
    <v-card-title class="d-flex justify-space-between align-center pa-4">
      <span class="font-display drawer-title">Carrinho</span>
      <v-btn icon @click="$emit('update:modelValue', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text v-if="items.length === 0" class="text-center py-12">
      <v-icon size="80" color="grey lighten-1" class="mb-4">mdi-cart-off</v-icon>
      <p class="text-h6 mb-2">Seu carrinho está vazio</p>
      <p class="text-body-2 text-grey">Adicione itens do cardápio para começar</p>
    </v-card-text>

    <v-list v-else>
      <v-list-item
        v-for="(item, index) in items"
        :key="`${item.id}-${index}`"
        class="mb-2"
      >
        <v-card class="mb-2" elevation="1">
          <v-card-text>
            <div class="d-flex justify-space-between align-start mb-2">
              <div class="flex-grow-1">
                <h3 class="font-weight-bold mb-1">{{ item.name }}</h3>
                <div v-if="item.size" class="text-caption mb-1">
                  <strong>Tamanho:</strong> {{ item.size }}
                </div>
                <div v-if="item.flavors && item.flavors.length > 0" class="text-caption mb-1">
                  <strong>Sabores:</strong> {{ item.flavors.join(', ') }}
                </div>
                <div v-if="item.birthdayName || item.birthdayAge || item.cakeTheme" class="text-caption mb-1">
                  <div v-if="item.birthdayName">
                    <strong>Nome:</strong> {{ item.birthdayName }}
                  </div>
                  <div v-if="item.birthdayAge">
                    <strong>Idade:</strong> {{ item.birthdayAge }} anos
                  </div>
                  <div v-if="item.cakeTheme">
                    <strong>Tema:</strong> {{ item.cakeTheme }}
                  </div>
                  <div class="text-success mt-1">
                    <small><v-icon size="small">mdi-check-circle</v-icon> Topper incluso</small>
                  </div>
                </div>
                <div class="text-h6 font-weight-bold text-primary">
                  R$ {{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
              <v-btn
                icon
                size="small"
                color="error"
                variant="text"
                @click="$emit('remove-item', index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>

            <div class="d-flex align-center">
              <v-btn
                icon
                size="small"
                :disabled="item.quantity <= 1"
                @click="decreaseQuantity(index)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="mx-4 text-h6">{{ item.quantity }}</span>
              <v-btn
                icon
                size="small"
                :disabled="item.quantity >= 10"
                @click="increaseQuantity(index)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>

    <v-divider v-if="items.length > 0" />

    <v-card-text v-if="items.length > 0">
      <div class="mb-2">
        <div class="d-flex justify-space-between align-center mb-1">
          <span class="text-body-1">Subtotal:</span>
          <span class="text-body-1">R$ {{ subtotal.toFixed(2) }}</span>
        </div>
        <div
          v-if="loyaltyPreview.discount > 0"
          class="d-flex justify-space-between align-center mb-1 text-success"
        >
          <span class="text-body-1">Desconto (pontos):</span>
          <span class="text-body-1">- R$ {{ loyaltyPreview.discount.toFixed(2) }}</span>
        </div>
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-body-1">Taxa de entrega:</span>
          <span class="text-body-1">R$ {{ deliveryFee.toFixed(2) }}</span>
        </div>
        <v-divider class="my-2" />
        <div class="d-flex justify-space-between align-center mb-4">
          <span class="text-h6 font-weight-bold">Total:</span>
          <span class="text-h5 font-weight-bold text-primary">
            R$ {{ total.toFixed(2) }}
          </span>
        </div>
      </div>

      <v-alert
        v-if="customerAuth.isLoggedIn"
        type="info"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        <div class="d-flex align-center justify-space-between flex-wrap gap-2">
          <span>
            <v-icon size="small" class="mr-1">mdi-star-circle</v-icon>
            Você tem <strong>{{ customerAuth.points }} pontos</strong>
          </span>
          <span v-if="loyaltyPreview.pointsEarned > 0" class="text-caption">
            +{{ loyaltyPreview.pointsEarned }} neste pedido
          </span>
        </div>
      </v-alert>

      <v-alert
        v-else
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        <div class="d-flex flex-wrap align-center justify-space-between gap-2">
          <span>Cadastre-se e ganhe pontos de desconto!</span>
          <v-btn size="small" color="primary" variant="outlined" to="/cadastro">Cadastrar</v-btn>
        </div>
      </v-alert>

      <div v-if="customerAuth.isLoggedIn && canUsePoints" class="loyalty-form mb-4">
        <p class="form-label mb-2">Usar pontos</p>
        <v-slider
          v-model="pointsToRedeem"
          :min="0"
          :max="maxRedeemPoints"
          :step="10"
          color="primary"
          hide-details
          class="mb-1"
        />
        <div class="text-caption text-medium-emphasis">
          Resgatando {{ loyaltyPreview.pointsToRedeem }} pts
          <span v-if="loyaltyPreview.discount > 0">
            (− R$ {{ loyaltyPreview.discount.toFixed(2) }})
          </span>
        </div>
      </div>

      <div class="customer-form mb-4">
        <p class="form-label mb-3">Seus dados para o pedido</p>

        <v-text-field
          v-model="customer.name"
          label="Seu nome *"
          variant="outlined"
          density="comfortable"
          :error-messages="errors.name"
          hide-details="auto"
          class="mb-2"
          @blur="persistCustomer"
        />

        <v-text-field
          :model-value="customer.phone"
          label="WhatsApp / Telefone *"
          variant="outlined"
          density="comfortable"
          placeholder="(92) 99999-9999"
          :error-messages="errors.phone"
          hide-details="auto"
          class="mb-2"
          inputmode="tel"
          maxlength="15"
          @update:model-value="updatePhone"
          @blur="persistCustomer"
        />

        <v-text-field
          v-model="customer.address"
          label="Endereço de entrega"
          variant="outlined"
          density="comfortable"
          placeholder="Rua, número, bairro"
          hide-details="auto"
          class="mb-2"
          @blur="persistCustomer"
        />

        <v-textarea
          v-model="customer.notes"
          label="Observações"
          variant="outlined"
          density="comfortable"
          rows="2"
          placeholder="Ex: entregar após 14h, sem amendoim..."
          hide-details="auto"
          @blur="persistCustomer"
        />
      </div>

      <v-btn
        color="success"
        size="large"
        block
        :loading="sending"
        @click="handleFinalize"
        class="mb-2"
      >
        <v-icon start>mdi-whatsapp</v-icon>
        Enviar pedido no WhatsApp
      </v-btn>

      <v-btn
        color="primary"
        variant="outlined"
        size="large"
        block
        rounded
        @click="$emit('update:modelValue', false)"
      >
        Continuar Comprando
      </v-btn>
    </v-card-text>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { buildOrderMessage, openWhatsAppOrder, DELIVERY_FEE } from '@/utils/whatsapp'
import { formatPhone, isValidPhone } from '@/utils/phone'
import { loadCustomer, saveCustomer } from '@/utils/customerStorage'
import { useCustomerAuthStore } from '@/stores/customerAuth'
import { api } from '@/services/api'

const props = defineProps({
  modelValue: Boolean,
  items: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'update:items', 'remove-item', 'order-sent'])

const { mobile } = useDisplay()
const customerAuth = useCustomerAuthStore()
const drawerWidth = computed(() => (mobile.value ? '100%' : 400))

const deliveryFee = DELIVERY_FEE
const sending = ref(false)
const pointsToRedeem = ref(0)
const loyaltyPreview = ref({
  discount: 0,
  pointsToRedeem: 0,
  pointsEarned: 0,
})
const loyaltyRules = ref(null)

const customer = reactive({
  name: '',
  phone: '',
  address: '',
  notes: '',
  email: '',
})

const errors = reactive({
  name: '',
  phone: '',
})

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const maxRedeemPoints = computed(() => customerAuth.points || 0)

const canUsePoints = computed(() => {
  const min = loyaltyRules.value?.minRedeemPoints || 100
  return customerAuth.points >= min
})

const total = computed(() => {
  return Math.max(0, subtotal.value - (loyaltyPreview.value.discount || 0)) + deliveryFee
})

async function refreshLoyaltyPreview() {
  if (!customerAuth.isLoggedIn) {
    loyaltyPreview.value = { discount: 0, pointsToRedeem: 0, pointsEarned: 0 }
    return
  }

  try {
    loyaltyPreview.value = await api.previewLoyalty({
      subtotal: subtotal.value,
      pointsToRedeem: pointsToRedeem.value,
      customerPoints: customerAuth.points,
    })
  } catch {
    loyaltyPreview.value = { discount: 0, pointsToRedeem: 0, pointsEarned: 0 }
  }
}

onMounted(async () => {
  await customerAuth.restoreSession()
  loyaltyRules.value = await api.getLoyaltyRules().catch(() => null)

  const saved = loadCustomer()
  customer.name = customerAuth.customer?.name || saved.name
  customer.phone = formatPhone(customerAuth.customer?.phone || saved.phone || '')
  customer.email = customerAuth.customer?.email || ''
  customer.address = saved.address
  customer.notes = saved.notes

  await refreshLoyaltyPreview()
})

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      await customerAuth.restoreSession()
      if (customerAuth.customer?.name) customer.name = customerAuth.customer.name
      if (customerAuth.customer?.phone) customer.phone = formatPhone(customerAuth.customer.phone)
      if (customerAuth.customer?.email) customer.email = customerAuth.customer.email
      await refreshLoyaltyPreview()
    }
  }
)

watch([subtotal, pointsToRedeem], () => {
  refreshLoyaltyPreview()
})

function updatePhone(value) {
  customer.phone = formatPhone(value)
}

function persistCustomer() {
  saveCustomer(customer)
}

function validateCustomer() {
  errors.name = ''
  errors.phone = ''

  if (!customer.name.trim()) {
    errors.name = 'Informe seu nome'
  }

  if (!customer.phone.trim()) {
    errors.phone = 'Informe seu telefone'
  } else if (!isValidPhone(customer.phone)) {
    errors.phone = 'Telefone inválido'
  }

  return !errors.name && !errors.phone
}

async function handleFinalize() {
  if (!validateCustomer()) return

  sending.value = true
  persistCustomer()

  let loyaltyResult = {
    discount: loyaltyPreview.value.discount || 0,
    pointsRedeemed: loyaltyPreview.value.pointsToRedeem || 0,
    pointsEarned: loyaltyPreview.value.pointsEarned || 0,
  }

  if (customerAuth.isLoggedIn && loyaltyPreview.value.pointsToRedeem > 0) {
    try {
      const result = await api.completeLoyaltyOrder({
        subtotal: subtotal.value,
        pointsToRedeem: pointsToRedeem.value,
      })
      customerAuth.updatePoints(result.customer.points)
      loyaltyResult = {
        discount: result.discount,
        pointsRedeemed: result.pointsRedeemed,
        pointsEarned: result.pointsEarned,
      }
    } catch (err) {
      sending.value = false
      errors.phone = err.message || 'Erro ao aplicar pontos'
      return
    }
  } else if (customerAuth.isLoggedIn) {
    try {
      const result = await api.completeLoyaltyOrder({
        subtotal: subtotal.value,
        pointsToRedeem: 0,
      })
      customerAuth.updatePoints(result.customer.points)
      loyaltyResult.pointsEarned = result.pointsEarned
    } catch {
      // segue pedido mesmo se falhar registro de pontos
    }
  }

  const message = buildOrderMessage(props.items, { ...customer }, loyaltyResult)
  openWhatsAppOrder(message)

  emit('order-sent', { ...customer })
  emit('update:modelValue', false)
  pointsToRedeem.value = 0

  sending.value = false
}

const decreaseQuantity = (index) => {
  const newItems = [...props.items]
  if (newItems[index].quantity > 1) {
    newItems[index].quantity--
    emit('update:items', newItems)
  }
}

const increaseQuantity = (index) => {
  const newItems = [...props.items]
  if (newItems[index].quantity < 10) {
    newItems[index].quantity++
    emit('update:items', newItems)
  }
}
</script>

<style scoped>
.drawer-title {
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.customer-form {
  padding: 12px;
  border: 1px solid rgba(196, 137, 138, 0.2);
  border-radius: 12px;
  background: #fff;
}

.loyalty-form {
  padding: 12px;
  border: 1px solid rgba(196, 137, 138, 0.2);
  border-radius: 12px;
  background: #fffaf8;
}
</style>
