<template>
  <div>
    <v-card elevation="2">
      <v-card-title class="pa-4">
        <span class="text-h6">Bolos personalizados</span>
      </v-card-title>
      <v-card-subtitle class="px-4 pb-2">
        Edite tamanhos, preços e sabores exibidos na página de bolos personalizados.
      </v-card-subtitle>

      <v-divider />

      <v-card-text class="pa-4">
        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
          {{ error }}
        </v-alert>

        <h3 class="text-subtitle-1 font-weight-bold mb-3">Tamanhos</h3>
        <v-table density="compact" class="mb-6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
              <th>Preço</th>
              <th>Rendimento</th>
              <th class="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(size, index) in form.sizes" :key="size.value || index">
              <td>
                <v-text-field
                  v-model="size.value"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </td>
              <td>
                <v-text-field
                  v-model="size.label"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </td>
              <td>
                <v-text-field
                  v-model.number="size.price"
                  type="number"
                  min="1"
                  density="compact"
                  variant="outlined"
                  hide-details
                  prefix="R$"
                />
              </td>
              <td>
                <v-text-field
                  v-model="size.serves"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </td>
              <td class="text-end">
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  :disabled="form.sizes.length <= 1"
                  @click="removeSize(index)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          prepend-icon="mdi-plus"
          class="mb-6"
          @click="addSize"
        >
          Adicionar tamanho
        </v-btn>

        <h3 class="text-subtitle-1 font-weight-bold mb-3">Sabores</h3>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <v-chip
            v-for="(flavor, index) in form.flavors"
            :key="`${flavor}-${index}`"
            closable
            color="primary"
            variant="tonal"
            @click:close="removeFlavor(index)"
          >
            {{ flavor }}
          </v-chip>
        </div>

        <div class="d-flex gap-2 flex-wrap align-center">
          <v-text-field
            v-model="newFlavor"
            label="Novo sabor"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 240px;"
            @keyup.enter="addFlavor"
          />
          <v-btn color="secondary" variant="outlined" @click="addFlavor">
            Adicionar sabor
          </v-btn>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="primary" :loading="saving" @click="save">
          Salvar configuração
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar" color="success" timeout="2500">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useCustomCakesStore } from '@/stores/customCakes'

const customCakesStore = useCustomCakesStore()

const form = reactive({
  sizes: [],
  flavors: [],
})

const newFlavor = ref('')
const saving = ref(false)
const error = ref('')
const snackbar = ref(false)
const snackbarText = ref('')

function syncForm() {
  form.sizes = customCakesStore.sizes.map((size) => ({ ...size }))
  form.flavors = [...customCakesStore.flavors]
}

function addSize() {
  form.sizes.push({
    value: '',
    label: '',
    price: 0,
    serves: '',
  })
}

function removeSize(index) {
  form.sizes.splice(index, 1)
}

function addFlavor() {
  const value = newFlavor.value.trim()
  if (!value) return
  if (!form.flavors.includes(value)) {
    form.flavors.push(value)
  }
  newFlavor.value = ''
}

function removeFlavor(index) {
  form.flavors.splice(index, 1)
}

async function save() {
  error.value = ''
  saving.value = true

  try {
    await customCakesStore.saveConfig({
      sizes: form.sizes,
      flavors: form.flavors,
    })
    snackbarText.value = 'Configuração salva com sucesso!'
    snackbar.value = true
    syncForm()
  } catch (err) {
    error.value = err.message || 'Erro ao salvar configuração.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await customCakesStore.fetchConfig()
  syncForm()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
