<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerAuthStore } from '@/stores/customerAuth'

const router = useRouter()
const customerAuth = useCustomerAuthStore()

const transactions = ref([])
const rules = ref(null)
const loading = ref(true)

onMounted(async () => {
  if (!customerAuth.isLoggedIn) {
    const restored = await customerAuth.restoreSession()
    if (!restored) {
      router.push('/login')
      return
    }
  }

  try {
    rules.value = await customerAuth.fetchRules()
    transactions.value = await customerAuth.fetchTransactions()
  } finally {
    loading.value = false
  }
})

function handleLogout() {
  customerAuth.logout()
  router.push('/')
}

function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function transactionLabel(type) {
  const labels = {
    welcome: 'Boas-vindas',
    purchase: 'Compra',
    redeem: 'Resgate',
    admin_adjust: 'Ajuste',
    promotion: 'Promoção',
  }
  return labels[type] || type
}
</script>

<template>
  <div class="account-page py-10">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="10">
          <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-6">
            <div>
              <h1 class="text-h4 font-display mb-1">Minha conta</h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Olá, {{ customerAuth.customer?.name }}
              </p>
            </div>
            <v-btn color="error" variant="outlined" @click="handleLogout">Sair</v-btn>
          </div>

          <v-row class="mb-6">
            <v-col cols="12" md="4">
              <v-card class="pa-5 points-card" elevation="2">
                <v-icon color="primary" class="mb-2">mdi-star-circle</v-icon>
                <div class="text-h3 font-weight-bold text-primary">
                  {{ customerAuth.points }}
                </div>
                <div class="text-body-2 text-medium-emphasis">pontos disponíveis</div>
              </v-card>
            </v-col>
            <v-col cols="12" md="8">
              <v-card class="pa-5 h-100" elevation="2">
                <h2 class="text-h6 mb-3">Como funcionam os pontos</h2>
                <ul class="rules-list" v-if="rules">
                  <li>Ganhe <strong>{{ rules.pointsPerReal }} ponto</strong> a cada R$ 1 em pedidos</li>
                  <li>
                    Resgate a partir de <strong>{{ rules.minRedeemPoints }} pontos</strong>
                  </li>
                  <li>
                    <strong>{{ rules.pointsPerRealDiscount }} pontos</strong> = R$ 1 de desconto
                  </li>
                  <li>Desconto máximo de {{ rules.maxDiscountPercent }}% por pedido</li>
                </ul>
                <v-btn color="primary" rounded to="/cardapio" class="mt-3">
                  Fazer pedido
                </v-btn>
              </v-card>
            </v-col>
          </v-row>

          <v-card elevation="2">
            <v-card-title>Histórico de pontos</v-card-title>
            <v-divider />

            <v-card-text v-if="loading" class="text-center py-8">
              <v-progress-circular indeterminate color="primary" />
            </v-card-text>

            <v-card-text v-else-if="transactions.length === 0" class="text-center py-8">
              <p class="text-medium-emphasis mb-0">Nenhuma movimentação ainda.</p>
            </v-card-text>

            <v-list v-else lines="two">
              <v-list-item v-for="item in transactions" :key="item.id">
                <v-list-item-title>
                  {{ transactionLabel(item.type) }}
                  <span
                    :class="item.amount >= 0 ? 'text-success' : 'text-error'"
                    class="font-weight-bold ml-2"
                  >
                    {{ item.amount >= 0 ? '+' : '' }}{{ item.amount }} pts
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.description || '—' }} · Saldo: {{ item.balanceAfter }} ·
                  {{ formatDate(item.createdAt) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.account-page {
  min-height: 100vh;
  background: var(--color-bg, #faf8f7);
}

.points-card {
  border-left: 4px solid var(--color-accent, #c4898a);
}

.rules-list {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--color-text-soft);
  line-height: 1.8;
}
</style>
