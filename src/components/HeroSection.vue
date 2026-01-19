<template>
  <section id="hero" class="hero-section">
    <v-container fluid class="hero-container">
      <v-row align="center" justify="center" class="min-h-screen">
        <v-col cols="12" class="text-center d-flex flex-column align-center justify-center">
          <div class="mb-6 hero-logo-wrapper">
            <img 
              :src="logo" 
              alt="Bolos da Nize" 
              class="hero-logo"
            />
          </div>
          <p class="hero-subtitle text-h5 mb-8">
            Bolos Artesanais e Personalizados em Itacoatiara - AM
          </p>
          <v-btn
            color="accent"
            size="large"
            rounded
            class="mr-4 mb-4"
            to="/bolos"
          >
            Ver Bolos Personalizados
          </v-btn>
          <v-btn
            color="secondary"
            size="large"
            rounded
            outlined
            class="mb-4"
            to="/cardapio"
          >
            Ver Cardápio
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import logo from '../assets/logo solo 1.png'
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #ffffff 0%, #FDF2F8 50%, #ffffff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(232, 180, 184, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.hero-container {
  padding: 80px 20px;
  position: relative;
  z-index: 1;
  width: 100%;
}

.hero-logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}

.hero-logo {
  max-width: 500px;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
  filter: drop-shadow(0 8px 24px rgba(212, 165, 165, 0.4));
  transition: transform 0.3s ease;
  animation: logoFloat 3s ease-in-out infinite;
}

.hero-logo:hover {
  transform: scale(1.05);
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hero-subtitle {
  color: #4b2c2c;
  font-weight: 400;
}

.font-destaque {
  font-family: 'Playfair Display', serif;
}

@media (max-width: 768px) {
  .hero-logo {
    max-width: 250px;
  }
  
  .hero-subtitle {
    font-size: 1.25rem !important;
  }
}
</style>
