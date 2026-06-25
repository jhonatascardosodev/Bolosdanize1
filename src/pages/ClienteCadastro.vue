<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '@/stores/customerAuth'
import { formatPhone } from '@/utils/phone'

const router = useRouter()
const customerAuth = useCustomerAuthStore()

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})
const showPassword = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''

  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.password) {
    error.value = 'Preencha nome, e-mail e senha.'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'A senha deve ter no mínimo 6 caracteres.'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'As senhas não coincidem.'
    return
  }

  const result = await customerAuth.register({
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone.trim(),
    password: form.value.password,
  })

  if (result.ok) {
    router.push('/minha-conta')
    return
  }

  error.value = result.error
}

function updatePhone(value) {
  form.value.phone = formatPhone(value)
}
</script>

<template>
  <div class="auth-page">
    <v-container class="py-10">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="6" lg="5">
          <v-card class="pa-6" elevation="4" rounded="lg">
            <div class="text-center mb-6">
              <v-icon size="48" color="primary" class="mb-3">mdi-star-circle</v-icon>
              <h1 class="text-h5 font-display">Programa de fidelidade</h1>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Cadastre-se e ganhe pontos para desconto nos pedidos
              </p>
            </div>

            <v-alert type="info" variant="tonal" density="compact" class="mb-4">
              Ganhe <strong>50 pontos</strong> de boas-vindas + descontos em cada pedido!
            </v-alert>
            <v-btn color="secondary" variant="outlined" rounded to="/cadastro" class="mb-4">
              Criar conta grátis
            </v-btn>

            <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
              {{ error }}
            </v-alert>

            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="form.name"
                label="Nome completo *"
                variant="outlined"
                class="mb-2"
              />
              <v-text-field
                v-model="form.email"
                label="E-mail *"
                type="email"
                variant="outlined"
                class="mb-2"
              />
              <v-text-field
                :model-value="form.phone"
                label="WhatsApp / Telefone"
                variant="outlined"
                class="mb-2"
                @update:model-value="updatePhone"
              />
              <v-text-field
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Senha *"
                variant="outlined"
                class="mb-2"
              />
              <v-text-field
                v-model="form.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                label="Confirmar senha *"
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
                Criar conta
              </v-btn>
            </v-form>

            <div class="text-center mt-4">
              <span class="text-body-2">Já tem conta?</span>
              <v-btn variant="text" color="primary" to="/login">Entrar</v-btn>
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
