<template>
  <section id="sobre" class="sobre-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title font-destaque mb-4">Sobre Nós</h2>
          <div class="divider mx-auto"></div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-8">
        <v-col cols="12" md="10">
          <p class="text-center text-h6 mb-6">
            Somos uma confeitaria artesanal especializada em criar bolos únicos e deliciosos 
            com muito carinho e dedicação desde 2020.
          </p>
          <p class="text-center mb-8">
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
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.section-title {
  font-size: 3rem;
  color: #4b2c2c;
  font-weight: 600;
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #D4A5A5, #9CAF88);
  border-radius: 2px;
}

.stat-card {
  background: linear-gradient(135deg, #FDF2F8 0%, #ffffff 100%);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #D4A5A5;
  font-family: 'Playfair Display', serif;
}

.stat-label {
  font-size: 1rem;
  color: #4b2c2c;
  font-weight: 500;
}

.font-destaque {
  font-family: 'Playfair Display', serif;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
}
</style>
