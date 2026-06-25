<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCustomerAuthStore } from '@/stores/customerAuth'

const router = useRouter()
const route = useRoute()
const customerAuth = useCustomerAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!email.value.trim() || !password.value) {
    error.value = 'Informe e-mail e senha.'
    return
  }

  const result = await customerAuth.login(email.value.trim(), password.value)

  if (result.ok) {
    const redirect = route.query.redirect || '/minha-conta'
    router.push(String(redirect))
    return
  }

  error.value = result.error
}
</script>

<template>
  <div class="auth-page">
    <v-container class="py-10">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <v-card class="pa-6" elevation="4" rounded="lg">
            <div class="text-center mb-6">
              <v-icon size="48" color="primary" class="mb-3">mdi-account-circle</v-icon>
              <h1 class="text-h5 font-display">Entrar na sua conta</h1>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Acesse seus pontos e histórico
              </p>
            </div>

            <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="E-mail"
                type="email"
                variant="outlined"
                class="mb-2"
              />
              <v-text-field
                v-model="password"
                type="password"
                label="Senha"
                variant="outlined"
                class="mb-2"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                rounded
                :loading="customerAuth.loading"
                class="mt-2"
              >
                Entrar
              </v-btn>
            </v-form>

            <div class="text-center mt-4">
              <span class="text-body-2">Ainda não tem conta?</span>
              <v-btn variant="text" color="primary" to="/cadastro">Cadastre-se</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--color-bg, #faf8f7);
}
</style>
