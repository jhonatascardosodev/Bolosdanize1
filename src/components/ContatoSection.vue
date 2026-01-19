<template>
  <section id="contato" class="contato-section py-12 md:py-16">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mb-8">
          <h2 class="section-title font-destaque mb-4">Entre em Contato</h2>
          <div class="divider mx-auto mb-4"></div>
          <p class="subtitle">Estamos prontos para tornar seu evento especial!</p>
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
                    <h3 class="mb-1 font-weight-bold">{{ contact.label }}</h3>
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
              <h3 class="mb-4 font-destaque">Horário de Funcionamento</h3>
              <div class="horario">
                <p><strong>Segunda a Sexta:</strong> 8h às 18h</p>
                <p><strong>Sábado:</strong> Até meio dia (12h)</p>
                <p><strong>Domingo:</strong> Fechado</p>
              </div>
            </div>

            <v-divider class="my-6" />

            <div class="text-center">
              <h3 class="mb-4 font-destaque">Localização</h3>
              <p class="mb-4">Itacoatiara - Amazonas</p>
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
  background: linear-gradient(135deg, #FDF2F8 0%, #ffffff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.section-title {
  font-size: 3rem;
  color: #4b2c2c;
  font-weight: 600;
}

.subtitle {
  font-size: 1.1rem;
  color: #4b2c2c;
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #D4A5A5, #9CAF88);
  border-radius: 2px;
}

.contact-item {
  padding: 10px;
}

.contact-link {
  color: #4b2c2c;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #D4A5A5;
}

.contact-value {
  color: #4b2c2c;
  font-size: 1.1rem;
}

.horario p {
  margin: 8px 0;
  font-size: 1.1rem;
  color: #4b2c2c;
}

.font-destaque {
  font-family: 'Playfair Display', serif;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style>
