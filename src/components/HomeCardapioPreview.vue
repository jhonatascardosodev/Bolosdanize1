<template>
  <section class="preview-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title mb-3">Destaques do cardápio</h2>
          <div class="section-divider mb-4"></div>
          <p class="section-subtitle">Alguns dos nossos bolos artesanais</p>
        </v-col>
      </v-row>

      <v-row v-if="loading" justify="center" class="py-8">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="40" />
        </v-col>
      </v-row>

      <v-row v-else-if="previewItems.length > 0">
        <v-col
          v-for="bolo in previewItems"
          :key="bolo.id"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card class="preview-card h-100" elevation="2" rounded :to="`/cardapio`">
            <ProductImage :src="bolo.image" :alt="bolo.name" height="160" />
            <v-card-title class="text-body-1">{{ bolo.name }}</v-card-title>
            <v-card-text class="pt-0">
              <div class="price-text">R$ {{ bolo.price.toFixed(2) }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else justify="center">
        <v-col cols="12" md="8" class="text-center">
          <p class="text-body-1 text-medium-emphasis mb-4">
            Estamos preparando novidades para o cardápio. Enquanto isso, monte um bolo personalizado!
          </p>
          <v-btn color="primary" rounded to="/bolos">Ver bolos personalizados</v-btn>
        </v-col>
      </v-row>

      <v-row v-if="previewItems.length > 0" class="mt-6">
        <v-col cols="12" class="text-center">
          <v-btn color="primary" variant="outlined" rounded to="/cardapio">
            Ver cardápio completo
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, normalizeProductsResponse } from '@/services/api'
import ProductImage from '@/components/ProductImage.vue'

const previewItems = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getProducts(true, { page: 1, limit: 4, category: 'cardapio' })
    const { items } = normalizeProductsResponse(data)
    previewItems.value = items.map((product) => ({
      ...product,
      price: Number(product.price),
    }))
  } catch {
    previewItems.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.preview-section {
  background: var(--color-bg, #faf8f7);
}

.preview-card {
  border: 1px solid rgba(196, 137, 138, 0.12);
  transition: transform 0.25s ease;
  text-decoration: none;
}

.preview-card:hover {
  transform: translateY(-2px);
}
</style>
