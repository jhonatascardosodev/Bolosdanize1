const API_BASE = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'bolosdanize-token'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  const token = getToken()

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))

  if (response.status === 401) {
    clearToken()
    const error = new Error(data.error || 'Sessão expirada. Faça login novamente.')
    error.status = 401
    throw error
  }

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição')
  }

  return data
}

export function normalizeProductsResponse(data) {
  if (Array.isArray(data)) {
    return { items: data, pagination: null }
  }

  return {
    items: data.data || [],
    pagination: data.pagination || null,
  }
}

export const api = {
  login(password) {
    return request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
  },

  getProducts(availableOnly = false, { page, limit, category } = {}) {
    const params = new URLSearchParams()
    if (availableOnly) params.set('available', 'true')
    if (page) params.set('page', String(page))
    if (limit) params.set('limit', String(limit))
    if (category) params.set('category', category)

    const query = params.toString()
    return request(`/products${query ? `?${query}` : ''}`)
  },

  createProduct(product, imageFile) {
    const formData = new FormData()

    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    if (imageFile) {
      formData.append('image', imageFile)
    }

    return request('/products', {
      method: 'POST',
      body: formData,
    })
  },

  updateProduct(id, product, imageFile, removeImage = false) {
    const formData = new FormData()

    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    if (imageFile) {
      formData.append('image', imageFile)
    }

    if (removeImage) {
      formData.append('removeImage', 'true')
    }

    return request(`/products/${id}`, {
      method: 'PUT',
      body: formData,
    })
  },

  toggleProduct(id) {
    return request(`/products/${id}/toggle`, { method: 'PATCH' })
  },

  deleteProduct(id) {
    return request(`/products/${id}`, { method: 'DELETE' })
  },
}

export function resolveImageUrl(imagePath) {
  if (!imagePath) return null
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath
  }
  return imagePath
}
