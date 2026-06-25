import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'
import { CUSTOM_CAKE_SIZES, CUSTOM_CAKE_FLAVORS } from '@/constants/business.js'

const FALLBACK = {
  sizes: CUSTOM_CAKE_SIZES,
  flavors: CUSTOM_CAKE_FLAVORS,
}

export const useCustomCakesStore = defineStore('customCakes', () => {
  const sizes = ref([...FALLBACK.sizes])
  const flavors = ref([...FALLBACK.flavors])
  const loading = ref(false)
  const error = ref(null)
  const loaded = ref(false)

  async function fetchConfig() {
    if (loaded.value) return

    loading.value = true
    error.value = null

    try {
      const data = await api.getCustomCakes()
      sizes.value = data.sizes || FALLBACK.sizes
      flavors.value = data.flavors || FALLBACK.flavors
      loaded.value = true
    } catch (err) {
      error.value = err.message
      sizes.value = [...FALLBACK.sizes]
      flavors.value = [...FALLBACK.flavors]
    } finally {
      loading.value = false
    }
  }

  async function saveConfig(config) {
    const saved = await api.updateCustomCakes(config)
    sizes.value = saved.sizes
    flavors.value = saved.flavors
    loaded.value = true
    return saved
  }

  function resetLoaded() {
    loaded.value = false
  }

  return {
    sizes,
    flavors,
    loading,
    error,
    loaded,
    fetchConfig,
    saveConfig,
    resetLoaded,
  }
})
