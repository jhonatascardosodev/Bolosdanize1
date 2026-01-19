<template>
  <div class="cardapio-page">
    <CardapioSection @add-to-cart="handleAddToCart" />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import CardapioSection from '../components/CardapioSection.vue'

const addToCart = inject('addToCart')

const handleAddToCart = (item) => {
  if (addToCart) {
    addToCart(item)
  }
}
</script>

<style scoped>
.cardapio-page {
  min-height: 100vh;
}
</style>
