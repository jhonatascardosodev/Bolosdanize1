<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''

  if (!password.value.trim()) {
    error.value = 'Digite a senha de acesso.'
    return
  }

  loading.value = true

  const success = await authStore.login(password.value)

  loading.value = false

  if (success) {
    router.push('/admin')
    return
  }

  error.value = 'Senha incorreta. Tente novamente.'
}
</script>

<template>
  <div class="login-page">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <v-card class="login-card pa-6" elevation="8" rounded="lg">
            <div class="text-center mb-6">
              <v-icon size="48" color="primary" class="mb-3">mdi-shield-lock</v-icon>
              <h1 class="text-h5 font-destaque">Área Administrativa</h1>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Bolos da Nize
              </p>
            </div>

            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                color="primary"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                rounded
                :loading="loading"
                class="mt-2"
              >
                Entrar
              </v-btn>
            </v-form>

            <div class="text-center mt-4">
              <v-btn variant="text" to="/" color="secondary">
                Voltar ao site
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #ffffff 50%, #f5f0eb 100%);
}

.login-card {
  border: 1px solid rgba(212, 165, 165, 0.3);
}

.font-destaque {
  font-family: 'Playfair Display', serif;
}
</style>
