<template>
  <section id="contato" class="contato-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title mb-3">Entre em Contato</h2>
          <div class="section-divider mb-4"></div>
          <p class="section-subtitle">Estamos prontos para tornar seu evento especial</p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="pa-6" elevation="2" rounded>
            <v-row>
              <v-col
                v-for="contact in contacts"
                :key="contact.type"
                cols="12"
                md="6"
                class="mb-4"
              >
                <div class="contact-item d-flex align-center">
                  <v-avatar
                    :color="contact.color"
                    size="60"
                    class="mr-4"
                  >
                    <v-icon size="30" color="white">{{ contact.icon }}</v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="contact-label mb-1">{{ contact.label }}</h3>
                    <a
                      v-if="contact.link"
                      :href="contact.link"
                      target="_blank"
                      class="contact-link"
                    >
                      {{ contact.value }}
                    </a>
                    <span v-else class="contact-value">{{ contact.value }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-6" />

            <div class="text-center">
              <h3 class="font-display mb-4">Horário de funcionamento</h3>
              <div class="horario">
                <p><strong>Segunda a Sexta:</strong> 8h às 18h</p>
                <p><strong>Sábado:</strong> Até meio dia (12h)</p>
                <p><strong>Domingo:</strong> Fechado</p>
              </div>
            </div>

            <v-divider class="my-6" />

            <div class="text-center">
              <h3 class="font-display mb-4">Localização</h3>
              <p class="body-text mb-4">Itacoatiara — Amazonas</p>
              <v-btn
                color="primary"
                rounded
                href="https://wa.me/5592991985973"
                target="_blank"
                class="mr-4 mb-4"
              >
                <v-icon left>mdi-whatsapp</v-icon>
                Falar no WhatsApp
              </v-btn>
              <v-btn
                color="secondary"
                rounded
                outlined
                href="https://www.instagram.com/bolosdanizeoficial"
                target="_blank"
                class="mb-4"
              >
                <v-icon left>mdi-instagram</v-icon>
                Ver Instagram
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const contacts = ref([
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    value: '(92) 99198-5973',
    link: 'https://wa.me/5592991985973',
    icon: 'mdi-whatsapp',
    color: 'green',
  },
  {
    type: 'instagram',
    label: 'Instagram',
    value: '@bolosdanizeoficial',
    link: 'https://www.instagram.com/bolosdanizeoficial',
    icon: 'mdi-instagram',
    color: 'pink',
  },
  {
    type: 'location',
    label: 'Localização',
    value: 'Itacoatiara - AM',
    link: null,
    icon: 'mdi-map-marker',
    color: 'primary',
  },
  {
    type: 'email',
    label: 'Horário',
    value: 'Seg-Sex: 8h-18h',
    link: null,
    icon: 'mdi-clock-outline',
    color: 'accent',
  },
])
</script>

<style scoped>
.contato-section {
  background: #faf8f7;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.contact-label {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.contact-link {
  color: var(--color-text);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: var(--color-accent-dark);
}

.contact-value {
  color: var(--color-text);
  font-size: 1rem;
}

.horario p {
  margin: 8px 0;
  font-size: 0.975rem;
  color: var(--color-text-soft);
}
</style>
