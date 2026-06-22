<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="whatsapp-fab"
    aria-label="Falar no WhatsApp"
    title="Falar no WhatsApp"
  >
    <v-icon color="white" size="28">mdi-whatsapp</v-icon>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { WHATSAPP_NUMBER } from '@/utils/whatsapp'

const message = 'Olá! Vim pelo site e gostaria de fazer um pedido. 🍰'

const whatsappUrl = computed(() => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
})
</script>

<style scoped>
.whatsapp-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25d366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
}

.whatsapp-fab:hover {
  transform: scale(1.06);
  box-shadow: 0 6px 24px rgba(37, 211, 102, 0.5);
}

@media (max-width: 768px) {
  .whatsapp-fab {
    right: 16px;
    bottom: 16px;
    width: 52px;
    height: 52px;
  }
}
</style>
