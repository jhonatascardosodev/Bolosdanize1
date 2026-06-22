import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, resolveImageUrl, normalizeProductsResponse } from '@/services/api'

function mapProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    image: resolveImageUrl(product.image),
  }
}

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref(null)

  const availableProducts = computed(() =>
    products.value.filter((product) => product.available !== false)
  )

  const cardapioProducts = computed(() =>
    availableProducts.value.filter(
      (product) => product.category === 'cardapio' || !product.category
    )
  )

  const averagePrice = computed(() => {
    if (products.value.length === 0) return 0
    const total = products.value.reduce((sum, product) => sum + Number(product.price), 0)
    return total / products.value.length
  })

  async function fetchProducts(availableOnly = false, options = {}) {
    loading.value = true
    error.value = null

    try {
      const data = await api.getProducts(availableOnly, options)
      const { items, pagination: meta } = normalizeProductsResponse(data)
      products.value = items.map(mapProduct)
      pagination.value = meta
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addProduct(product, imageFile = null) {
    const created = await api.createProduct(product, imageFile)
    products.value.push(mapProduct(created))
    return created
  }

  async function updateProduct(id, updates, imageFile = null, removeImage = false) {
    const updated = await api.updateProduct(id, updates, imageFile, removeImage)
    const index = products.value.findIndex((product) => product.id === id)

    if (index !== -1) {
      products.value[index] = mapProduct(updated)
    }

    return updated
  }

  async function deleteProduct(id) {
    await api.deleteProduct(id)
    products.value = products.value.filter((product) => product.id !== id)
  }

  async function toggleAvailable(id) {
    const updated = await api.toggleProduct(id)
    const index = products.value.findIndex((product) => product.id === id)

    if (index !== -1) {
      products.value[index] = mapProduct(updated)
    }

    return updated
  }

  return {
    products,
    loading,
    error,
    pagination,
    availableProducts,
    cardapioProducts,
    averagePrice,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleAvailable,
  }
})
