<template>
  <section id="cardapio" class="cardapio-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title font-destaque mb-4">Cardápio</h2>
          <div class="divider mx-auto mb-4"></div>
          <p class="subtitle">Confira nossos bolos disponíveis</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="bolo in bolos"
          :key="bolo.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="bolo-card"
            elevation="2"
            rounded
            hover
            @click="openBoloModal(bolo)"
          >
            <div class="bolo-image">
              <v-img
                :src="bolo.image || 'https://via.placeholder.com/300x200?text=Bolo'"
                height="200"
                cover
              >
                <div class="overlay">
                  <v-btn color="white" rounded>
                    Ver Detalhes
                  </v-btn>
                </div>
              </v-img>
            </div>
            <v-card-title class="font-destaque">
              {{ bolo.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ bolo.description }}
            </v-card-subtitle>
            <v-card-text>
              <div class="price">R$ {{ bolo.price.toFixed(2) }}</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                rounded
                @click.stop="addToCart(bolo)"
              >
                <v-icon left>mdi-cart-plus</v-icon>
                Adicionar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showModal" max-width="600">
      <v-card v-if="selectedBolo">
        <v-img
          :src="selectedBolo.image || 'https://via.placeholder.com/600x400?text=Bolo'"
          height="300"
          cover
        />
        <v-card-title class="font-destaque text-h4">
          {{ selectedBolo.name }}
        </v-card-title>
        <v-card-text>
          <p class="text-h6 mb-4">{{ selectedBolo.description }}</p>
          <p class="mb-4">{{ selectedBolo.fullDescription }}</p>
          <div class="price-large mb-4">R$ {{ selectedBolo.price.toFixed(2) }}</div>
        </v-card-text>
        <v-card-actions>
          <v-text-field
            v-model="modalQuantity"
            type="number"
            label="Quantidade"
            min="1"
            max="10"
            style="max-width: 150px;"
            class="mr-4"
          />
          <v-spacer />
          <v-btn text @click="showModal = false">Fechar</v-btn>
          <v-btn
            color="primary"
            @click="addToCartFromModal"
          >
            Adicionar ao Carrinho
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-to-cart'])

const bolos = ref([
  {
    id: 1,
    name: 'Bolo de Brigadeiro',
    description: 'Delicioso bolo de brigadeiro',
    fullDescription: 'Bolo macio recheado com brigadeiro cremoso e coberto com granulado.',
    price: 120,
    image: null,
  },
  {
    id: 2,
    name: 'Bolo de Beijinho',
    description: 'Bolo tradicional de beijinho',
    fullDescription: 'Bolo fofo com recheio de beijinho e coco ralado.',
    price: 120,
    image: null,
  },
  {
    id: 3,
    name: 'Bolo de Doce de Leite',
    description: 'Cremoso bolo de doce de leite',
    fullDescription: 'Bolo especial com camadas de doce de leite cremoso.',
    price: 130,
    image: null,
  },
  {
    id: 4,
    name: 'Bolo de Leite Ninho',
    description: 'Clássico bolo de leite ninho',
    fullDescription: 'Bolo macio recheado com creme de leite ninho.',
    price: 130,
    image: null,
  },
  {
    id: 5,
    name: 'Bolo Mousse de Cupuaçu',
    description: 'Exótico mousse de cupuaçu',
    fullDescription: 'Bolo com mousse de cupuaçu, fruto típico da Amazônia.',
    price: 140,
    image: null,
  },
  {
    id: 6,
    name: 'Bolo Mousse de Maracujá',
    description: 'Refrescante mousse de maracujá',
    fullDescription: 'Bolo com mousse de maracujá azedinho e delicioso.',
    price: 140,
    image: null,
  },
  {
    id: 7,
    name: 'Bolo Três Leites',
    description: 'Tradicional três leites',
    fullDescription: 'Bolo úmido feito com três tipos de leite, uma delícia cremosa.',
    price: 135,
    image: null,
  },
])

const showModal = ref(false)
const selectedBolo = ref(null)
const modalQuantity = ref(1)

const openBoloModal = (bolo) => {
  selectedBolo.value = bolo
  modalQuantity.value = 1
  showModal.value = true
}

const addToCart = (bolo) => {
  emit('add-to-cart', {
    ...bolo,
    quantity: 1,
  })
}

const addToCartFromModal = () => {
  if (selectedBolo.value) {
    emit('add-to-cart', {
      ...selectedBolo.value,
      quantity: modalQuantity.value,
    })
    showModal.value = false
    modalQuantity.value = 1
  }
}
</script>

<style scoped>
.cardapio-section {
  background-color: #ffffff;
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

.bolo-card {
  height: 100%;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.bolo-card:hover {
  transform: translateY(-5px);
}

.bolo-image {
  position: relative;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bolo-image:hover .overlay {
  opacity: 1;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #D4A5A5;
  font-family: 'Playfair Display', serif;
}

.price-large {
  font-size: 2rem;
  font-weight: 700;
  color: #D4A5A5;
  font-family: 'Playfair Display', serif;
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
