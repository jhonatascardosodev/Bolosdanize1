<template>
  <div class="home-page">
    <HeroSection />
    <HomeHowItWorks />
    <HomeCardapioPreview />
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import HomeHowItWorks from '../components/HomeHowItWorks.vue'
import HomeCardapioPreview from '../components/HomeCardapioPreview.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
