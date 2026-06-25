import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  api,
  setCustomerToken,
  clearCustomerToken,
  getCustomerToken,
} from '@/services/api'

export const useCustomerAuthStore = defineStore('customerAuth', () => {
  const customer = ref(null)
  const loading = ref(false)
  const rules = ref(null)

  const isLoggedIn = computed(() => !!customer.value && !!getCustomerToken())
  const points = computed(() => customer.value?.points ?? 0)

  async function fetchRules() {
    if (rules.value) return rules.value
    rules.value = await api.getLoyaltyRules()
    return rules.value
  }

  async function restoreSession() {
    if (!getCustomerToken()) return false

    try {
      customer.value = await api.getCustomerProfile()
      return true
    } catch {
      clearCustomerToken()
      customer.value = null
      return false
    }
  }

  async function register(payload) {
    loading.value = true
    try {
      const data = await api.registerCustomer(payload)
      setCustomerToken(data.token)
      customer.value = data.customer
      return { ok: true, welcomePoints: data.welcomePoints }
    } catch (err) {
      return { ok: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    try {
      const data = await api.loginCustomer(email, password)
      setCustomerToken(data.token)
      customer.value = data.customer
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    clearCustomerToken()
    customer.value = null
  }

  async function refreshProfile() {
    if (!getCustomerToken()) return
    customer.value = await api.getCustomerProfile()
  }

  async function fetchTransactions() {
    return api.getCustomerTransactions()
  }

  function updatePoints(newPoints) {
    if (customer.value) {
      customer.value = { ...customer.value, points: newPoints }
    }
  }

  return {
    customer,
    loading,
    rules,
    isLoggedIn,
    points,
    fetchRules,
    restoreSession,
    register,
    login,
    logout,
    refreshProfile,
    fetchTransactions,
    updatePoints,
  }
})
