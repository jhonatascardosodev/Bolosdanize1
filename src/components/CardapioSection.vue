<template>
  <section id="cardapio" class="cardapio-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title mb-3">Cardápio</h2>
          <div class="section-divider mb-4"></div>
          <p class="section-subtitle">Confira nossos bolos disponíveis</p>
        </v-col>
      </v-row>

      <v-row v-if="productsStore.loading" justify="center" class="py-12">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="48" />
          <p class="mt-4 text-medium-emphasis">Carregando cardápio...</p>
        </v-col>
      </v-row>

      <v-row v-else-if="productsStore.error">
        <v-col cols="12" class="text-center py-8">
          <v-alert type="error" variant="tonal" class="mx-auto" max-width="500">
            {{ productsStore.error }}
          </v-alert>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col
          v-for="bolo in cardapioProducts"
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
            <v-card-title>
              {{ bolo.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ bolo.description }}
            </v-card-subtitle>
            <v-card-text>
              <div class="price-text">R$ {{ bolo.price.toFixed(2) }}</div>
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
        <v-card-title class="text-h5">
          {{ selectedBolo.name }}
        </v-card-title>
        <v-card-text>
          <p class="lead-text mb-4">{{ selectedBolo.description }}</p>
          <p class="body-text mb-4">{{ selectedBolo.fullDescription }}</p>
          <div class="price-text price-large mb-4">R$ {{ selectedBolo.price.toFixed(2) }}</div>
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
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'

const emit = defineEmits(['add-to-cart'])

const productsStore = useProductsStore()
const { cardapioProducts } = storeToRefs(productsStore)

const showModal = ref(false)
const selectedBolo = ref(null)
const modalQuantity = ref(1)

onMounted(() => {
  productsStore.fetchProducts(true)
})

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
  background-color: #faf8f7;
  min-height: 100vh;
}

.bolo-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(196, 137, 138, 0.1);
}

.bolo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(74, 63, 63, 0.08);
}

.bolo-image {
  position: relative;
  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(74, 63, 63, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bolo-image:hover .overlay {
  opacity: 1;
}

.price-large {
  font-size: 1.75rem;
}
</style>
