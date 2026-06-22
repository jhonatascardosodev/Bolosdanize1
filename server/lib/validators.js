export const PRODUCT_CATEGORIES = ['cardapio', 'personalizado']

export function parseBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'boolean') return value
  return value === 'true' || value === '1'
}

export function normalizeCategory(category) {
  return category === 'personalizado' ? 'personalizado' : 'cardapio'
}

export function validatePrice(price) {
  const numericPrice = Number(price)
  return Number.isFinite(numericPrice) && numericPrice > 0 && numericPrice <= 99999
    ? numericPrice
    : null
}

export function validateCreateProduct(body) {
  const { name, description, fullDescription, price, category, available } = body

  if (!name?.trim() || !description?.trim()) {
    return { ok: false, error: 'Nome e descrição são obrigatórios' }
  }

  if (name.trim().length > 120 || description.trim().length > 255) {
    return { ok: false, error: 'Texto muito longo' }
  }

  const numericPrice = validatePrice(price)
  if (!numericPrice) {
    return { ok: false, error: 'Preço inválido' }
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      description: description.trim(),
      fullDescription: (fullDescription?.trim() || description.trim()).slice(0, 2000),
      price: numericPrice,
      category: normalizeCategory(category),
      available: parseBoolean(available),
    },
  }
}

export function validateUpdateProduct(body, current) {
  const { name, description, fullDescription, price, category, available } = body

  if (name !== undefined && !name.trim()) {
    return { ok: false, error: 'Nome inválido' }
  }

  if (price !== undefined && !validatePrice(price)) {
    return { ok: false, error: 'Preço inválido' }
  }

  return {
    ok: true,
    data: {
      name: name?.trim(),
      description: description?.trim(),
      fullDescription: fullDescription?.trim(),
      price: price !== undefined ? Number(price) : undefined,
      category:
        category === undefined ? undefined : normalizeCategory(category),
      available:
        available !== undefined ? parseBoolean(available, current.available) : undefined,
    },
  }
}
