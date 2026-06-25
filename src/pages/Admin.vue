<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import ProductImage from '@/components/ProductImage.vue'
import AdminCustomCakes from '@/components/AdminCustomCakes.vue'
import AdminLoyalty from '@/components/AdminLoyalty.vue'

const router = useRouter()
const authStore = useAuthStore()
const productsStore = useProductsStore()
const { mobile } = useDisplay()

const adminTab = ref('products')

const showDialog = ref(false)
const editingProduct = ref(null)
const deleteDialog = ref(false)
const productToDelete = ref(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const imagePreview = ref(null)
const imageFile = ref(null)
const imageRemoved = ref(false)
const saving = ref(false)

const form = ref({
  name: '',
  description: '',
  fullDescription: '',
  price: 0,
  category: 'cardapio',
  available: true,
})

const categoryOptions = [
  { title: 'Cardápio', value: 'cardapio' },
  { title: 'Personalizado', value: 'personalizado' },
]

const stats = computed(() => ({
  total: productsStore.products.length,
  available: productsStore.availableProducts.length,
  averagePrice: productsStore.averagePrice,
}))

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    fullDescription: '',
    price: 0,
    category: 'cardapio',
    available: true,
  }
  imagePreview.value = null
  imageFile.value = null
  imageRemoved.value = false
  editingProduct.value = null
}

const openAddDialog = () => {
  resetForm()
  showDialog.value = true
}

const openEditDialog = (product) => {
  editingProduct.value = product
  form.value = {
    name: product.name,
    description: product.description,
    fullDescription: product.fullDescription || '',
    price: product.price,
    category: product.category || 'cardapio',
    available: product.available !== false,
  }
  imagePreview.value = product.image
  imageFile.value = null
  imageRemoved.value = false
  showDialog.value = true
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showSnackbar('Selecione um arquivo de imagem válido.', 'error')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    showSnackbar('A imagem deve ter no máximo 2MB.', 'error')
    return
  }

  imageFile.value = file
  imageRemoved.value = false

  const reader = new FileReader()
  reader.onload = (loadEvent) => {
    imagePreview.value = loadEvent.target?.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = null
  imageFile.value = null
  imageRemoved.value = true
}

const saveProduct = async () => {
  if (!form.value.name.trim()) {
    showSnackbar('Informe o nome do produto.', 'error')
    return
  }

  if (!form.value.description.trim()) {
    showSnackbar('Informe a descrição curta.', 'error')
    return
  }

  if (Number(form.value.price) <= 0) {
    showSnackbar('Informe um preço válido.', 'error')
    return
  }

  const productData = {
    name: form.value.name.trim(),
    description: form.value.description.trim(),
    fullDescription: form.value.fullDescription.trim() || form.value.description.trim(),
    price: Number(form.value.price),
    category: form.value.category,
    available: form.value.available,
  }

  saving.value = true

  try {
    if (editingProduct.value) {
      await productsStore.updateProduct(
        editingProduct.value.id,
        productData,
        imageFile.value,
        imageRemoved.value
      )
      showSnackbar('Produto atualizado com sucesso!')
    } else {
      await productsStore.addProduct(productData, imageFile.value)
      showSnackbar('Produto adicionado com sucesso!')
    }

    showDialog.value = false
    resetForm()
  } catch (err) {
    showSnackbar(err.message || 'Erro ao salvar produto.', 'error')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (product) => {
  productToDelete.value = product
  deleteDialog.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  try {
    await productsStore.deleteProduct(productToDelete.value.id)
    showSnackbar('Produto removido com sucesso!')
  } catch (err) {
    showSnackbar(err.message || 'Erro ao remover produto.', 'error')
  }

  deleteDialog.value = false
  productToDelete.value = null
}

const toggleAvailable = async (product) => {
  try {
    const updated = await productsStore.toggleAvailable(product.id)
    showSnackbar(
      updated.available ? 'Produto disponibilizado.' : 'Produto indisponibilizado.'
    )
  } catch (err) {
    showSnackbar(err.message || 'Erro ao alterar status.', 'error')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}

onMounted(async () => {
  try {
    await productsStore.fetchProducts()
  } catch (err) {
    if (err.status === 401) {
      authStore.handleUnauthorized()
      router.push('/admin/login')
      return
    }
    showSnackbar('Erro ao carregar produtos. Verifique se o servidor está rodando.', 'error')
  }
})
</script>

<template>
  <div class="admin-page">
    <v-container fluid class="pa-4 pa-md-6">
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex flex-wrap align-center justify-space-between gap-4">
            <div>
              <h1 class="text-h4 font-destaque mb-1">Painel Administrativo</h1>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Gerencie produtos e imagens do cardápio
              </p>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <v-btn color="secondary" variant="outlined" to="/" prepend-icon="mdi-home">
                Ver site
              </v-btn>
              <v-btn color="error" variant="outlined" prepend-icon="mdi-logout" @click="handleLogout">
                Sair
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4" elevation="2">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="48" class="mr-4">
                <v-icon color="white">mdi-cake-variant</v-icon>
              </v-avatar>
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.total }}</div>
                <div class="text-caption text-medium-emphasis">Total de produtos</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4" elevation="2">
            <div class="d-flex align-center">
              <v-avatar color="secondary" size="48" class="mr-4">
                <v-icon color="white">mdi-check-circle</v-icon>
              </v-avatar>
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.available }}</div>
                <div class="text-caption text-medium-emphasis">Disponíveis</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="stat-card pa-4" elevation="2">
            <div class="d-flex align-center">
              <v-avatar color="accent" size="48" class="mr-4">
                <v-icon color="white">mdi-currency-usd</v-icon>
              </v-avatar>
              <div>
                <div class="text-h4 font-weight-bold">R$ {{ stats.averagePrice.toFixed(0) }}</div>
                <div class="text-caption text-medium-emphasis">Preço médio</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-tabs v-model="adminTab" color="primary" class="mb-4">
        <v-tab value="products">Produtos do cardápio</v-tab>
        <v-tab value="custom">Bolos personalizados</v-tab>
        <v-tab value="loyalty">Fidelidade</v-tab>
      </v-tabs>

      <v-window v-model="adminTab">
        <v-window-item value="products">
      <v-row>
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title class="d-flex flex-wrap align-center justify-space-between gap-3 pa-4">
              <span class="text-h6">Produtos</span>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
                Adicionar produto
              </v-btn>
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-0">
              <v-table v-if="!mobile && productsStore.products.length > 0">
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Preço</th>
                    <th>Categoria</th>
                    <th>Status</th>
                    <th class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in productsStore.products" :key="product.id">
                    <td>
                      <div class="admin-table-thumb">
                        <ProductImage
                          :src="product.image"
                          :alt="product.name"
                          height="48"
                          :show-label="false"
                          compact
                          :icon-size="22"
                        />
                      </div>
                    </td>
                    <td class="font-weight-medium">{{ product.name }}</td>
                    <td class="text-truncate" style="max-width: 200px;">
                      {{ product.description }}
                    </td>
                    <td>R$ {{ Number(product.price).toFixed(2) }}</td>
                    <td>
                      <v-chip size="small" :color="product.category === 'cardapio' ? 'primary' : 'secondary'">
                        {{ product.category === 'cardapio' ? 'Cardápio' : 'Personalizado' }}
                      </v-chip>
                    </td>
                    <td>
                      <v-switch
                        :model-value="product.available !== false"
                        color="success"
                        hide-details
                        density="compact"
                        @update:model-value="toggleAvailable(product)"
                      />
                    </td>
                    <td class="text-end">
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        variant="text"
                        color="primary"
                        @click="openEditDialog(product)"
                      />
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="confirmDelete(product)"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <div v-else-if="mobile && productsStore.products.length > 0" class="pa-4 d-flex flex-column gap-3">
                <v-card
                  v-for="product in productsStore.products"
                  :key="product.id"
                  variant="outlined"
                  class="admin-product-card"
                >
                  <v-card-text>
                    <div class="d-flex gap-3 align-start mb-3">
                      <div class="admin-thumb">
                        <ProductImage
                          :src="product.image"
                          :alt="product.name"
                          height="72"
                          :show-label="false"
                          compact
                          :icon-size="28"
                        />
                      </div>
                      <div class="flex-grow-1">
                        <div class="font-weight-bold mb-1">{{ product.name }}</div>
                        <div class="text-caption text-medium-emphasis mb-2">
                          {{ product.description }}
                        </div>
                        <div class="d-flex flex-wrap gap-2 align-center">
                          <span class="text-primary font-weight-bold">
                            R$ {{ Number(product.price).toFixed(2) }}
                          </span>
                          <v-chip size="x-small" :color="product.category === 'cardapio' ? 'primary' : 'secondary'">
                            {{ product.category === 'cardapio' ? 'Cardápio' : 'Personalizado' }}
                          </v-chip>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex align-center justify-space-between">
                      <v-switch
                        :model-value="product.available !== false"
                        color="success"
                        hide-details
                        density="compact"
                        label="Disponível"
                        @update:model-value="toggleAvailable(product)"
                      />
                      <div>
                        <v-btn
                          icon="mdi-pencil"
                          size="small"
                          variant="text"
                          color="primary"
                          @click="openEditDialog(product)"
                        />
                        <v-btn
                          icon="mdi-delete"
                          size="small"
                          variant="text"
                          color="error"
                          @click="confirmDelete(product)"
                        />
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <div v-else-if="productsStore.products.length === 0" class="text-center pa-8">
                <v-icon size="64" color="grey-lighten-1">mdi-cake-variant-outline</v-icon>
                <p class="text-h6 mt-4">Nenhum produto cadastrado</p>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Adicione seu primeiro produto com imagem
                </p>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
                  Adicionar produto
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
        </v-window-item>

        <v-window-item value="custom">
          <v-row>
            <v-col cols="12">
              <AdminCustomCakes />
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="loyalty">
          <v-row>
            <v-col cols="12">
              <AdminLoyalty />
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>

    <v-dialog v-model="showDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="pa-4">
          {{ editingProduct ? 'Editar produto' : 'Novo produto' }}
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" class="text-center">
              <div class="image-upload-area mb-4">
                <v-avatar v-if="imagePreview" size="120" rounded="lg" class="mb-3">
                  <v-img v-if="typeof imagePreview === 'string' && imagePreview.startsWith('data:')" :src="imagePreview" cover />
                  <ProductImage
                    v-else
                    :src="imagePreview"
                    alt="Preview"
                    height="120"
                    :show-label="false"
                    compact
                    :icon-size="40"
                  />
                </v-avatar>
                <v-avatar v-else size="120" rounded="lg" color="grey-lighten-3" class="mb-3">
                  <v-icon size="48" color="grey">mdi-camera-plus</v-icon>
                </v-avatar>

                <div class="d-flex justify-center gap-2 flex-wrap">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-upload"
                    @click="$refs.fileInput.click()"
                  >
                    {{ imagePreview ? 'Trocar imagem' : 'Enviar imagem' }}
                  </v-btn>
                  <v-btn
                    v-if="imagePreview"
                    color="error"
                    variant="text"
                    size="small"
                    prepend-icon="mdi-delete"
                    @click="removeImage"
                  >
                    Remover
                  </v-btn>
                </div>

                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  @change="handleImageUpload"
                />

                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  JPG, PNG ou WebP — máximo 2MB
                </p>
              </div>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Nome do produto"
                variant="outlined"
                color="primary"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.description"
                label="Descrição curta"
                variant="outlined"
                color="primary"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.fullDescription"
                label="Descrição completa"
                variant="outlined"
                color="primary"
                rows="3"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.price"
                label="Preço (R$)"
                type="number"
                min="0"
                step="0.01"
                variant="outlined"
                color="primary"
                prefix="R$"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="form.category"
                :items="categoryOptions"
                item-title="title"
                item-value="value"
                label="Categoria"
                variant="outlined"
                color="primary"
              />
            </v-col>

            <v-col cols="12">
              <v-switch
                v-model="form.available"
                label="Produto disponível no cardápio"
                color="success"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveProduct" :loading="saving">
            {{ editingProduct ? 'Salvar' : 'Adicionar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="pa-4">Confirmar exclusão</v-card-title>
        <v-card-text class="pa-4 pt-0">
          Tem certeza que deseja excluir
          <strong>{{ productToDelete?.name }}</strong>?
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteProduct">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%);
}

.font-destaque {
  font-family: var(--font-display);
}

.stat-card {
  border-left: 4px solid var(--color-accent, #c4898a);
}

.image-upload-area {
  padding: 16px;
  border: 2px dashed #e8b4b8;
  border-radius: 12px;
  background: #fdf2f8;
}

.admin-thumb {
  width: 72px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
}

.admin-table-thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
}

.admin-product-card {
  border-color: rgba(196, 137, 138, 0.25) !important;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}
</style>
