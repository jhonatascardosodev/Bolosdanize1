<template>
  <section id="sobre" class="sobre-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title mb-3">Sobre Nós</h2>
          <div class="section-divider mb-6"></div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-8">
        <v-col cols="12" md="10">
          <p class="text-center lead-text mb-6">
            Somos uma confeitaria artesanal especializada em criar bolos únicos e deliciosos 
            com muito carinho e dedicação desde 2020.
          </p>
          <p class="text-center body-text mb-8">
            Localizada em Itacoatiara - AM, a Bolos da Nize transforma momentos especiais 
            em memórias doces através de nossos bolos personalizados e artesanais.
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="stat in stats"
          :key="stat.label"
          cols="6"
          md="3"
          class="text-center"
        >
          <v-card
            class="stat-card pa-6"
            elevation="2"
            rounded
          >
            <div class="stat-value mb-2">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  { value: '2020', label: 'Fundação' },
  { value: '5+', label: 'Anos de Experiência' },
  { value: '500+', label: 'Bolos Produzidos' },
  { value: '100%', label: 'Artesanal' },
])
</script>

<style scoped>
.sobre-section {
  background-color: #faf8f7;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.section-title {
  /* usa estilos globais */
}

.stat-card {
  background: #faf8f7;
  border: 1px solid rgba(196, 137, 138, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(74, 63, 63, 0.06);
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--color-accent-dark);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 1.85rem;
  }
}
</style>
