import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { STORAGE_KEYS } from '@/constants'

const STORAGE_KEY = STORAGE_KEYS.CART

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // ignore invalid storage
  }
  return []
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCart())

  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  watch(
    items,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  function addItem(item) {
    const existing = items.value.find(
      (cartItem) =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.flavors) === JSON.stringify(item.flavors) &&
        cartItem.size === item.size &&
        cartItem.birthdayName === item.birthdayName &&
        cartItem.birthdayAge === item.birthdayAge &&
        cartItem.cakeTheme === item.cakeTheme
    )

    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push({ ...item })
    }
  }

  function removeItem(index) {
    items.value.splice(index, 1)
  }

  function updateItems(newItems) {
    items.value = newItems
  }

  function clear() {
    items.value = []
  }

  return {
    items,
    itemCount,
    addItem,
    removeItem,
    updateItems,
    clear,
  }
})
