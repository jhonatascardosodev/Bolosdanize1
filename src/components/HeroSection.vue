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
          <p class="hero-subtitle mb-8">
            Bolos artesanais e personalizados · Itacoatiara, AM
          </p>
          <v-btn
            color="accent"
            size="large"
            class="mr-4 mb-4 hero-btn"
            to="/bolos"
          >
            Ver bolos personalizados
          </v-btn>
          <v-btn
            color="secondary"
            size="large"
            variant="outlined"
            class="mb-4 hero-btn"
            to="/cardapio"
          >
            Ver cardápio
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
  background: #faf8f7;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(196, 137, 138, 0.06) 0%, transparent 65%);
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
  filter: drop-shadow(0 6px 20px rgba(196, 137, 138, 0.25));
  transition: transform 0.4s ease;
}

.hero-logo:hover {
  transform: scale(1.02);
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-soft);
  max-width: 28rem;
}

.hero-btn {
  min-width: 200px;
}

@media (max-width: 768px) {
  .hero-logo {
    max-width: 250px;
  }

  .hero-subtitle {
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }
}
</style>
