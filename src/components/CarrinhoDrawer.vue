<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    temporary
    location="right"
    width="400"
    elevation="10"
  >
    <v-card-title class="d-flex justify-space-between align-center pa-4">
      <span class="font-destaque text-h5">🛒 Carrinho</span>
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

      <v-btn
        color="success"
        size="large"
        block
        rounded
        @click="$emit('finalize-order')"
        class="mb-2"
      >
        <v-icon left>mdi-whatsapp</v-icon>
        Finalizar Pedido no WhatsApp
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
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  items: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'update:items', 'remove-item', 'finalize-order'])

const deliveryFee = 10 // Taxa de entrega fixa

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const total = computed(() => {
  return subtotal.value + deliveryFee
})

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
.font-destaque {
  font-family: 'Playfair Display', serif;
}
</style>
