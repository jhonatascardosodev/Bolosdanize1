<template>
  <section id="bolos" class="bolos-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title mb-3">Bolos Personalizados</h2>
          <div class="section-divider mb-4"></div>
          <p class="section-subtitle">Cobertos e confeitados em chantilly</p>
          <p class="tip-text">Você pode escolher o mesmo sabor duas vezes</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6" class="mb-6">
          <v-card class="pa-6" elevation="2" rounded>
            <h3 class="card-heading mb-4">Tamanhos disponíveis</h3>
            <v-radio-group v-model="selectedSize" class="mb-4">
              <v-radio
                v-for="size in sizes"
                :key="size.value"
                :label="`${size.label} - R$ ${size.price.toFixed(2)} (${size.serves})`"
                :value="size.value"
                color="primary"
              />
            </v-radio-group>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="pa-6" elevation="2" rounded>
            <h3 class="card-heading mb-4">Escolha os 2 sabores</h3>
            <p class="mb-4 helper-text">
              Selecione 2 sabores para seu bolo (pode escolher o mesmo sabor duas vezes)
            </p>
            
            <!-- Seleção de primeiro sabor -->
            <div class="mb-4">
              <v-select
                v-model="selectedFlavor1"
                :items="flavors"
                label="1º Sabor"
                color="primary"
                variant="outlined"
                hide-details
              />
            </div>

            <!-- Seleção de segundo sabor -->
            <div class="mb-4">
              <v-select
                v-model="selectedFlavor2"
                :items="flavors"
                label="2º Sabor (pode ser o mesmo)"
                color="primary"
                variant="outlined"
                hide-details
              />
            </div>

            <!-- Visualização dos sabores selecionados -->
            <v-alert
              v-if="selectedFlavor1 || selectedFlavor2"
              type="info"
              variant="tonal"
              class="mb-4"
              density="compact"
            >
              <strong>Sabores escolhidos:</strong>
              <div class="mt-2">
                <v-chip v-if="selectedFlavor1" color="primary" class="mr-2 mb-2">
                  {{ selectedFlavor1 }}
                </v-chip>
                <v-chip v-if="selectedFlavor2" color="primary">
                  {{ selectedFlavor2 }}
                </v-chip>
              </div>
            </v-alert>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <v-card class="pa-6 mb-6" elevation="2" rounded>
            <h3 class="card-heading mb-4">Informações do topper</h3>
            
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="birthdayName"
                  label="Nome para o bolo"
                  placeholder="Ex: Maria"
                  variant="outlined"
                  :rules="[v => !!v || 'Nome é obrigatório']"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="birthdayAge"
                  type="number"
                  label="Idade"
                  placeholder="Ex: 10"
                  min="0"
                  max="120"
                  variant="outlined"
                  :rules="[v => (v !== null && v !== undefined && v !== '') || 'Idade é obrigatória']"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="cakeTheme"
                  label="Tema do bolo"
                  placeholder="Ex: Princesa, Super-herói, etc"
                  variant="outlined"
                  :rules="[v => !!v || 'Tema é obrigatório']"
                  required
                />
              </v-col>
            </v-row>
            
            <v-alert
              type="info"
              variant="tonal"
              class="mt-4"
              density="compact"
              color="primary"
            >
              <v-icon class="mr-2">mdi-information</v-icon>
              <span>O topper está incluso no bolo! 🎉</span>
            </v-alert>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-center">
          <v-text-field
            v-model.number="quantity"
            type="number"
            label="Quantidade"
            min="1"
            max="10"
            class="quantity-input"
            style="max-width: 200px; margin: 0 auto;"
            variant="outlined"
          />
          
          <div class="total-price mb-4 mt-4">
            <div v-if="selectedSizeData" class="mb-2">
              <p class="mb-1">Subtotal: R$ {{ (selectedSizeData.price * quantity).toFixed(2) }}</p>
              <p class="mb-1 text-grey-darken-1">
                <small>Taxa de entrega: R$ {{ deliveryFee.toFixed(2) }}</small>
              </p>
            </div>
            <div class="mt-3">
              <span class="price-text">Total: R$ {{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <v-btn
            color="primary"
            size="large"
            rounded
            :disabled="!canAddToCart"
            @click="addToCart"
            class="px-8"
          >
            <v-icon left>mdi-cart-plus</v-icon>
            Adicionar ao Carrinho
          </v-btn>

          <p v-if="!canAddToCart" class="error-text mt-4">
            Por favor, preencha todos os campos: tamanho, 2 sabores e informações do topper
          </p>
        </v-col>
      </v-row>

      <!-- Informações adicionais -->
      <v-row class="mt-6">
        <v-col cols="12" md="6" class="mx-auto">
          <v-alert
            type="success"
            variant="tonal"
            class="mb-4"
            color="secondary"
          >
            <div class="d-flex align-center">
              <v-icon class="mr-3">mdi-information</v-icon>
              <div>
                <strong>Trabalhamos com 50% de entrada no ato da encomenda</strong>
              </div>
            </div>
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-center">
          <p class="text-body-1 text-grey-darken-1 mb-2">
            <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
            Aceitamos encomendas com antecedência mínima de 2 dias
          </p>
          <p class="text-body-1 text-grey-darken-1 mb-2">
            <v-icon size="small" class="mr-1">mdi-truck-delivery</v-icon>
            O pedido será entregue em 2 dias
          </p>
          <p class="text-body-1 text-grey-darken-1">
            <v-icon size="small" class="mr-1">mdi-cash</v-icon>
            Taxa de entrega: R$ {{ deliveryFee.toFixed(2) }} (fixa)
          </p>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { DELIVERY_FEE } from '@/constants'
import { useCustomCakesStore } from '@/stores/customCakes'

const emit = defineEmits(['add-to-cart'])

const customCakesStore = useCustomCakesStore()
const { sizes, flavors } = storeToRefs(customCakesStore)

const selectedSize = ref(null)
const selectedFlavor1 = ref(null)
const selectedFlavor2 = ref(null)
const quantity = ref(1)
const birthdayName = ref('')
const birthdayAge = ref(null)
const cakeTheme = ref('')
const deliveryFee = DELIVERY_FEE

const selectedSizeData = computed(() => {
  return sizes.find(s => s.value === selectedSize.value)
})

const totalPrice = computed(() => {
  if (!selectedSizeData.value) return 0
  return (selectedSizeData.value.price * quantity.value) + deliveryFee
})

const canAddToCart = computed(() => {
  return selectedSize.value && 
         selectedFlavor1.value && 
         selectedFlavor2.value &&
         birthdayName.value &&
         birthdayAge.value !== null &&
         birthdayAge.value !== '' &&
         cakeTheme.value
})

const addToCart = () => {
  if (!canAddToCart.value) return

  const flavorsArray = [selectedFlavor1.value, selectedFlavor2.value]

  emit('add-to-cart', {
    id: `personalizado-${Date.now()}`,
    name: 'Bolo Personalizado',
    size: selectedSize.value,
    flavors: flavorsArray,
    price: selectedSizeData.value.price,
    quantity: quantity.value,
    birthdayName: birthdayName.value || null,
    birthdayAge: birthdayAge.value || null,
    cakeTheme: cakeTheme.value || null,
  })

  // Reset form
  selectedSize.value = null
  selectedFlavor1.value = null
  selectedFlavor2.value = null
  quantity.value = 1
  birthdayName.value = ''
  birthdayAge.value = null
  cakeTheme.value = ''
}

onMounted(() => {
  customCakesStore.fetchConfig()
})
</script>

<style scoped>
.bolos-section {
  background: #faf8f7;
  min-height: 100vh;
}

.card-heading {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.tip-text {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
  margin-top: 0.5rem;
}

.helper-text {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.55;
}

.total-price {
  color: var(--color-text);
}

.error-text {
  color: #c45c5c;
  font-size: 0.875rem;
}
</style>
