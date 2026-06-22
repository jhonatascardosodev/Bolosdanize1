import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, clearToken, getToken, isLoggedIn, setToken } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(isLoggedIn())

  async function login(password) {
    try {
      const data = await api.login(password)
      setToken(data.token)
      isAuthenticated.value = true
      return true
    } catch {
      isAuthenticated.value = false
      return false
    }
  }

  function logout() {
    clearToken()
    isAuthenticated.value = false
  }

  function handleUnauthorized() {
    logout()
  }

  function restoreSession() {
    isAuthenticated.value = !!getToken()
  }

  return {
    isAuthenticated,
    login,
    logout,
    restoreSession,
    handleUnauthorized,
  }
})
