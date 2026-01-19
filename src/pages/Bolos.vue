<template>
  <div class="bolos-page">
    <BolosPersonalizadosSection @add-to-cart="handleAddToCart" />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import BolosPersonalizadosSection from '../components/BolosPersonalizadosSection.vue'

const addToCart = inject('addToCart')

const handleAddToCart = (item) => {
  if (addToCart) {
    addToCart(item)
  }
}
</script>

<style scoped>
.bolos-page {
  min-height: 100vh;
}
</style>
