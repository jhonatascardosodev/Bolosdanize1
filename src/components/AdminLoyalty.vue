<template>
  <div>
    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="customers">Clientes</v-tab>
      <v-tab value="promotions">Promoções</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="customers">
        <v-card elevation="2">
          <v-card-title>Clientes cadastrados</v-card-title>
          <v-divider />
          <v-card-text v-if="loadingCustomers" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" />
          </v-card-text>
          <v-table v-else-if="customers.length > 0" density="comfortable">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Pontos</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in customers" :key="client.id">
                <td>{{ client.name }}</td>
                <td>{{ client.email }}</td>
                <td>{{ client.phone || '—' }}</td>
                <td>
                  <v-chip color="primary" size="small">{{ client.points }} pts</v-chip>
                </td>
                <td class="text-end">
                  <v-btn size="small" color="secondary" @click="openPointsDialog(client)">
                    Ajustar pontos
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-card-text v-else class="text-center py-8 text-medium-emphasis">
            Nenhum cliente cadastrado ainda.
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="promotions">
        <v-card elevation="2" class="mb-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Promoções ativas</span>
            <v-btn color="primary" size="small" prepend-icon="mdi-plus" @click="openPromoDialog()">
              Nova promoção
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text v-if="promotions.length === 0" class="text-center py-6">
            Nenhuma promoção cadastrada.
          </v-card-text>
          <v-list v-else>
            <v-list-item v-for="promo in promotions" :key="promo.id">
              <v-list-item-title>
                {{ promo.title }}
                <v-chip size="x-small" :color="promo.active ? 'success' : 'grey'" class="ml-2">
                  {{ promo.active ? 'Ativa' : 'Inativa' }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle>
                +{{ promo.bonusPoints }} pts bônus
                <span v-if="promo.minPurchase > 0"> · mín. R$ {{ promo.minPurchase }}</span>
              </v-list-item-subtitle>
              <template #append>
                <v-btn icon="mdi-pencil" size="small" variant="text" @click="openPromoDialog(promo)" />
                <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="removePromo(promo)" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-window-item>
    </v-window>

    <v-dialog v-model="pointsDialog" max-width="400">
      <v-card>
        <v-card-title>Ajustar pontos</v-card-title>
        <v-card-text>
          <p class="mb-3">{{ selectedClient?.name }} — saldo: {{ selectedClient?.points }} pts</p>
          <v-text-field
            v-model.number="pointsAmount"
            label="Pontos (+ ou -)"
            type="number"
            variant="outlined"
            hint="Use número negativo para remover pontos"
            persistent-hint
          />
          <v-text-field v-model="pointsDescription" label="Motivo" variant="outlined" class="mt-2" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="pointsDialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="savingPoints" @click="savePoints">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="promoDialog" max-width="500">
      <v-card>
        <v-card-title>{{ editingPromo ? 'Editar promoção' : 'Nova promoção' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="promoForm.title" label="Título *" variant="outlined" class="mb-2" />
          <v-textarea v-model="promoForm.description" label="Descrição" variant="outlined" rows="2" class="mb-2" />
          <v-text-field
            v-model.number="promoForm.bonusPoints"
            label="Pontos bônus"
            type="number"
            min="0"
            variant="outlined"
            class="mb-2"
          />
          <v-text-field
            v-model.number="promoForm.minPurchase"
            label="Compra mínima (R$)"
            type="number"
            min="0"
            variant="outlined"
            class="mb-2"
          />
          <v-switch v-model="promoForm.active" label="Promoção ativa" color="success" hide-details />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="promoDialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="savingPromo" @click="savePromo">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">{{ snackbarText }}</v-snackbar>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { api } from '@/services/api'

const tab = ref('customers')
const customers = ref([])
const promotions = ref([])
const loadingCustomers = ref(true)

const pointsDialog = ref(false)
const selectedClient = ref(null)
const pointsAmount = ref(0)
const pointsDescription = ref('')
const savingPoints = ref(false)

const promoDialog = ref(false)
const editingPromo = ref(null)
const savingPromo = ref(false)
const promoForm = reactive({
  title: '',
  description: '',
  bonusPoints: 0,
  minPurchase: 0,
  active: true,
})

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

function notify(text, color = 'success') {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

async function loadData() {
  loadingCustomers.value = true
  try {
    customers.value = await api.getAdminCustomers()
    promotions.value = await api.getPromotions()
  } catch (err) {
    notify(err.message, 'error')
  } finally {
    loadingCustomers.value = false
  }
}

function openPointsDialog(client) {
  selectedClient.value = client
  pointsAmount.value = 0
  pointsDescription.value = ''
  pointsDialog.value = true
}

async function savePoints() {
  if (!selectedClient.value || !pointsAmount.value) return

  savingPoints.value = true
  try {
    await api.addCustomerPointsAdmin(
      selectedClient.value.id,
      pointsAmount.value,
      pointsDescription.value || 'Ajuste manual'
    )
    notify('Pontos atualizados!')
    pointsDialog.value = false
    await loadData()
  } catch (err) {
    notify(err.message, 'error')
  } finally {
    savingPoints.value = false
  }
}

function openPromoDialog(promo = null) {
  editingPromo.value = promo
  promoForm.title = promo?.title || ''
  promoForm.description = promo?.description || ''
  promoForm.bonusPoints = promo?.bonusPoints || 0
  promoForm.minPurchase = promo?.minPurchase || 0
  promoForm.active = promo?.active !== false
  promoDialog.value = true
}

async function savePromo() {
  if (!promoForm.title.trim()) {
    notify('Informe o título da promoção', 'error')
    return
  }

  savingPromo.value = true
  try {
    const payload = { ...promoForm }
    if (editingPromo.value) {
      await api.updatePromotion(editingPromo.value.id, payload)
    } else {
      await api.createPromotion(payload)
    }
    notify('Promoção salva!')
    promoDialog.value = false
    await loadData()
  } catch (err) {
    notify(err.message, 'error')
  } finally {
    savingPromo.value = false
  }
}

async function removePromo(promo) {
  if (!confirm(`Excluir promoção "${promo.title}"?`)) return

  try {
    await api.deletePromotion(promo.id)
    notify('Promoção removida')
    await loadData()
  } catch (err) {
    notify(err.message, 'error')
  }
}

onMounted(loadData)
</script>
