<template>
  <section id="bolos" class="bolos-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title font-destaque mb-4">Bolos Personalizados</h2>
          <div class="divider mx-auto mb-4"></div>
          <p class="subtitle">Cobertos e confeitados em chantilly</p>
          <p class="text-caption text-grey">💡 Dica: Você pode escolher o mesmo sabor 2 vezes!</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6" class="mb-6">
          <v-card class="pa-6" elevation="2" rounded>
            <h3 class="mb-4 font-destaque text-h5">Tamanhos Disponíveis</h3>
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
            <h3 class="mb-4 font-destaque text-h5">Escolha os 2 Sabores</h3>
            <p class="mb-4 text-caption">
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
            <h3 class="mb-4 font-destaque text-h6">Informações do Topper do Bolo</h3>
            
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
              <span class="text-h5 font-weight-bold">Total: R$ {{ totalPrice.toFixed(2) }}</span>
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
            Taxa de entrega: R$ 10,00 (fixa)
          </p>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['add-to-cart'])

const sizes = [
  { value: '15cm', label: '15 cm', price: 110, serves: '10 a 12 pessoas' },
  { value: '18cm', label: '18 cm', price: 120, serves: '15 pessoas' },
  { value: '20cm', label: '20 cm', price: 140, serves: '30 pessoas' },
  { value: '23cm', label: '23 cm', price: 200, serves: '40 pessoas' },
]

const flavors = [
  'Brigadeiro',
  'Beijinho',
  'Cupuaçu',
  'Doce de leite',
  'Leite ninho',
  'Maracujá',
  'Três leites',
]

const selectedSize = ref(null)
const selectedFlavor1 = ref(null)
const selectedFlavor2 = ref(null)
const quantity = ref(1)
const birthdayName = ref('')
const birthdayAge = ref(null)
const cakeTheme = ref('')
const deliveryFee = 10 // Taxa de entrega fixa

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
    deliveryFee: deliveryFee,
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
</script>

<style scoped>
.bolos-section {
  background: linear-gradient(135deg, #FDF2F8 0%, #ffffff 100%);
  min-height: 100vh;
}

.section-title {
  font-size: 3rem;
  color: #4b2c2c;
  font-weight: 600;
}

.subtitle {
  font-size: 1.1rem;
  color: #4b2c2c;
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #D4A5A5, #9CAF88);
  border-radius: 2px;
}

.total-price {
  color: #4b2c2c;
}

.error-text {
  color: #d32f2f;
  font-size: 0.9rem;
}

.font-destaque {
  font-family: 'Playfair Display', serif;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style>
