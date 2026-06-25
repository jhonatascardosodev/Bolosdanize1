import fs from 'fs'
import path from 'path'

const DEFAULT_CONFIG = {
  sizes: [
    { value: '15cm', label: '15 cm', price: 110, serves: '10 a 12 pessoas' },
    { value: '18cm', label: '18 cm', price: 120, serves: '15 pessoas' },
    { value: '20cm', label: '20 cm', price: 140, serves: '30 pessoas' },
    { value: '23cm', label: '23 cm', price: 200, serves: '40 pessoas' },
  ],
  flavors: [
    'Brigadeiro',
    'Beijinho',
    'Cupuaçu',
    'Doce de leite',
    'Leite ninho',
    'Maracujá',
    'Três leites',
  ],
}

export function getCustomCakesPath(dataDir) {
  return path.join(dataDir, 'custom-cakes.json')
}

export function readCustomCakes(dataDir) {
  const filePath = getCustomCakesPath(dataDir)

  if (!fs.existsSync(filePath)) {
    writeCustomCakes(dataDir, DEFAULT_CONFIG)
    return structuredClone(DEFAULT_CONFIG)
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return normalizeCustomCakes(parsed)
  } catch {
    writeCustomCakes(dataDir, DEFAULT_CONFIG)
    return structuredClone(DEFAULT_CONFIG)
  }
}

export function writeCustomCakes(dataDir, config) {
  const filePath = getCustomCakesPath(dataDir)
  const normalized = normalizeCustomCakes(config)
  fs.writeFileSync(filePath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf-8')
  return normalized
}

export function normalizeCustomCakes(config) {
  const sizes = Array.isArray(config?.sizes)
    ? config.sizes
        .map((size) => ({
          value: String(size.value || '').trim(),
          label: String(size.label || '').trim(),
          price: Number(size.price),
          serves: String(size.serves || '').trim(),
        }))
        .filter((size) => size.value && size.label && size.price > 0)
    : DEFAULT_CONFIG.sizes

  const flavors = Array.isArray(config?.flavors)
    ? [...new Set(config.flavors.map((f) => String(f).trim()).filter(Boolean))]
    : DEFAULT_CONFIG.flavors

  return {
    sizes: sizes.length > 0 ? sizes : DEFAULT_CONFIG.sizes,
    flavors: flavors.length > 0 ? flavors : DEFAULT_CONFIG.flavors,
  }
}

export function validateCustomCakesPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Dados inválidos' }
  }

  const normalized = normalizeCustomCakes(body)

  if (normalized.sizes.length === 0) {
    return { ok: false, error: 'Informe ao menos um tamanho' }
  }

  if (normalized.flavors.length === 0) {
    return { ok: false, error: 'Informe ao menos um sabor' }
  }

  return { ok: true, data: normalized }
}
