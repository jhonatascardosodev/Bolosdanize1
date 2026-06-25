<template>
  <section id="cardapio" class="cardapio-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-6">
          <h2 class="section-title mb-3">Cardápio</h2>
          <div class="section-divider mb-4"></div>
          <p class="section-subtitle">Confira nossos bolos disponíveis</p>
          <p class="tip-text">Todos com opção de topper decorado com tema</p>
        </v-col>
      </v-row>

      <v-row v-if="!productsStore.loading && productsStore.cardapioProducts.length > 0" class="mb-4">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            label="Buscar bolo"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            placeholder="Nome ou descrição..."
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="priceRange"
            :items="priceOptions"
            item-title="label"
            item-value="value"
            label="Faixa de preço"
            variant="outlined"
            density="comfortable"
            hide-details
          />
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

      <v-row v-else-if="productsStore.cardapioProducts.length === 0" justify="center" class="py-12">
        <v-col cols="12" sm="8" md="6" class="text-center">
          <v-icon size="72" color="primary" class="mb-4" style="opacity: 0.4">
            mdi-cake-variant-outline
          </v-icon>
          <p class="text-h6 mb-2">Cardápio em atualização</p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Em breve teremos fotos e novos sabores por aqui. Enquanto isso, fale conosco pelo WhatsApp.
          </p>
          <v-btn color="primary" rounded to="/contato">Falar conosco</v-btn>
        </v-col>
      </v-row>

      <v-row v-else-if="filteredProducts.length === 0" justify="center" class="py-12">
        <v-col cols="12" sm="8" class="text-center">
          <p class="text-h6 mb-2">Nenhum bolo encontrado</p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Tente outro termo de busca ou limpe os filtros.
          </p>
          <v-btn variant="outlined" color="primary" @click="clearFilters">Limpar filtros</v-btn>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col
          v-for="bolo in filteredProducts"
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
              <ProductImage :src="bolo.image" :alt="bolo.name" height="200">
                <div class="image-overlay">
                  <v-chip v-if="mobile" size="small" color="white" class="touch-hint">
                    Toque para ver
                  </v-chip>
                  <v-btn v-else color="white" rounded size="small">Ver detalhes</v-btn>
                </div>
              </ProductImage>
            </div>
            <v-card-title>{{ bolo.name }}</v-card-title>
            <v-card-subtitle>{{ bolo.description }}</v-card-subtitle>
            <v-card-text>
              <div class="price-text">R$ {{ bolo.price.toFixed(2) }}</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" rounded @click.stop="openBoloModal(bolo)">
                <v-icon start>mdi-cart-plus</v-icon>
                Adicionar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row
        v-if="!hasFilters && canLoadMore && !productsStore.loading"
        justify="center"
        class="mt-6"
      >
        <v-col cols="12" class="text-center">
          <v-btn
            color="primary"
            variant="outlined"
            rounded
            :loading="productsStore.loadingMore"
            @click="loadMore"
          >
            Carregar mais bolos
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showModal" :fullscreen="mobile" :max-width="mobile ? undefined : 640">
      <v-card v-if="selectedBolo">
        <ProductImage
          :src="selectedBolo.image"
          :alt="selectedBolo.name"
          height="280"
          :show-label="false"
        />
        <v-card-title class="text-h5">{{ selectedBolo.name }}</v-card-title>
        <v-card-text>
          <p class="lead-text mb-4">{{ selectedBolo.description }}</p>
          <p class="body-text mb-4">{{ selectedBolo.fullDescription }}</p>
          <div class="price-text price-large mb-4">R$ {{ selectedBolo.price.toFixed(2) }}</div>

          <v-divider class="mb-4" />

          <h3 class="modal-heading mb-3">Topper com decoração</h3>
          <p class="helper-text mb-4">
            Informe os dados para o topper do bolo (tema, nome e idade).
          </p>

          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="topper.name"
                label="Nome no bolo *"
                placeholder="Ex: Maria"
                variant="outlined"
                density="comfortable"
                :error-messages="topperErrors.name"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.number="topper.age"
                type="number"
                label="Idade *"
                placeholder="Ex: 10"
                min="0"
                max="120"
                variant="outlined"
                density="comfortable"
                :error-messages="topperErrors.age"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="topper.theme"
                label="Tema da decoração *"
                placeholder="Ex: Princesa, Futebol..."
                variant="outlined"
                density="comfortable"
                :error-messages="topperErrors.theme"
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-alert type="info" variant="tonal" density="compact" color="primary" class="mt-2">
            <v-icon size="small" class="mr-1">mdi-information</v-icon>
            Topper com tema incluso na decoração
          </v-alert>

          <v-text-field
            v-model="modalQuantity"
            type="number"
            label="Quantidade"
            min="1"
            max="10"
            class="mt-4"
            style="max-width: 150px;"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-card-text>
        <v-card-actions class="flex-wrap pa-4 gap-2">
          <v-spacer />
          <v-btn variant="text" @click="closeModal">Fechar</v-btn>
          <v-btn color="primary" @click="addToCartFromModal">
            <v-icon start>mdi-cart-plus</v-icon>
            Adicionar ao carrinho
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useDisplay } from 'vuetify'
import { useProductsStore } from '@/stores/products'
import ProductImage from '@/components/ProductImage.vue'

const emit = defineEmits(['add-to-cart'])

const productsStore = useProductsStore()
const { mobile } = useDisplay()

const PAGE_SIZE = 8
const currentPage = ref(1)
const searchQuery = ref('')
const priceRange = ref('all')
const allLoaded = ref(false)
const showModal = ref(false)
const selectedBolo = ref(null)
const modalQuantity = ref(1)
const topper = reactive({
  name: '',
  age: null,
  theme: '',
})
const topperErrors = reactive({
  name: '',
  age: '',
  theme: '',
})

const priceOptions = [
  { label: 'Todos os preços', value: 'all' },
  { label: 'Até R$ 150', value: 'ate150' },
  { label: 'R$ 150 a R$ 200', value: '150-200' },
  { label: 'Acima de R$ 200', value: 'acima200' },
]

const hasFilters = computed(
  () => Boolean(searchQuery.value.trim()) || priceRange.value !== 'all'
)

const filteredProducts = computed(() => {
  let list = productsStore.cardapioProducts
  const query = searchQuery.value.trim().toLowerCase()

  if (query) {
    list = list.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.fullDescription || '').toLowerCase().includes(query)
    )
  }

  if (priceRange.value === 'ate150') {
    list = list.filter((product) => product.price <= 150)
  } else if (priceRange.value === '150-200') {
    list = list.filter((product) => product.price > 150 && product.price <= 200)
  } else if (priceRange.value === 'acima200') {
    list = list.filter((product) => product.price > 200)
  }

  return list
})

const canLoadMore = computed(() => {
  const meta = productsStore.pagination
  return meta ? meta.page < meta.totalPages : false
})

watch([searchQuery, priceRange], async () => {
  if (hasFilters.value && !allLoaded.value) {
    await productsStore.fetchAllCardapio()
    allLoaded.value = true
  }
})

onMounted(() => {
  productsStore.fetchCardapioPage(1, PAGE_SIZE)
})

function clearFilters() {
  searchQuery.value = ''
  priceRange.value = 'all'
}

async function loadMore() {
  currentPage.value += 1
  await productsStore.fetchCardapioPage(currentPage.value, PAGE_SIZE, true)
}

function resetTopper() {
  topper.name = ''
  topper.age = null
  topper.theme = ''
  topperErrors.name = ''
  topperErrors.age = ''
  topperErrors.theme = ''
}

function resetModal() {
  modalQuantity.value = 1
  resetTopper()
}

function closeModal() {
  showModal.value = false
  resetModal()
}

function validateTopper() {
  topperErrors.name = ''
  topperErrors.age = ''
  topperErrors.theme = ''

  if (!topper.name.trim()) topperErrors.name = 'Informe o nome'
  if (topper.age === null || topper.age === '' || topper.age < 0) {
    topperErrors.age = 'Informe a idade'
  }
  if (!topper.theme.trim()) topperErrors.theme = 'Informe o tema'

  return !topperErrors.name && !topperErrors.age && !topperErrors.theme
}

function openBoloModal(bolo) {
  selectedBolo.value = bolo
  resetModal()
  showModal.value = true
}

function addToCartFromModal() {
  if (!selectedBolo.value || !validateTopper()) return

  emit('add-to-cart', {
    ...selectedBolo.value,
    quantity: modalQuantity.value,
    birthdayName: topper.name.trim(),
    birthdayAge: topper.age,
    cakeTheme: topper.theme.trim(),
  })
  closeModal()
}
</script>

<style scoped>
.cardapio-section {
  background-color: var(--color-bg, #faf8f7);
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

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(74, 63, 63, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.bolo-card:hover .image-overlay {
  opacity: 1;
}

@media (hover: none) {
  .image-overlay {
    opacity: 1;
    background: linear-gradient(to top, rgba(74, 63, 63, 0.55) 0%, transparent 50%);
    align-items: flex-end;
    padding-bottom: 12px;
  }

  .touch-hint {
    font-weight: 600;
  }
}

.price-large {
  font-size: 1.75rem;
}

.modal-heading {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-text);
}

.tip-text {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.helper-text {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.55;
}

.gap-2 {
  gap: 8px;
}
</style>
