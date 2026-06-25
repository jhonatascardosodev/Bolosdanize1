<template>
  <section class="how-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title mb-3">Como pedir</h2>
          <div class="section-divider mb-4"></div>
          <p class="section-subtitle">Simples, rápido e direto no WhatsApp</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="step in steps"
          :key="step.title"
          cols="12"
          md="4"
          class="mb-4"
        >
          <v-card class="step-card pa-6 text-center h-100" elevation="1" rounded>
            <v-avatar :color="step.color" size="56" class="mb-4">
              <v-icon color="white" size="28">{{ step.icon }}</v-icon>
            </v-avatar>
            <h3 class="step-title mb-2">{{ step.title }}</h3>
            <p class="step-text mb-0">{{ step.text }}</p>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" class="text-center">
          <v-btn color="primary" size="large" rounded to="/cardapio" class="mr-2 mb-2">
            Ver cardápio
          </v-btn>
          <v-btn color="secondary" size="large" variant="outlined" rounded to="/bolos" class="mb-2">
            Montar bolo personalizado
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
const steps = [
  {
    icon: 'mdi-cake-variant',
    color: 'primary',
    title: '1. Escolha',
    text: 'Navegue pelo cardápio ou monte seu bolo personalizado com tamanho e sabores.',
  },
  {
    icon: 'mdi-cart',
    color: 'secondary',
    title: '2. Carrinho',
    text: 'Revise itens, quantidades e preencha seus dados de entrega.',
  },
  {
    icon: 'mdi-whatsapp',
    color: 'success',
    title: '3. WhatsApp',
    text: 'Envie o pedido formatado e finalize a conversa com a confeitaria.',
  },
]
</script>

<style scoped>
.how-section {
  background: #fff;
}

.step-card {
  border: 1px solid rgba(196, 137, 138, 0.15);
}

.step-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--color-text);
}

.step-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text-soft);
}

.mr-2 {
  margin-right: 8px;
}
</style>
