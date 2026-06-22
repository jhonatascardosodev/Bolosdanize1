import crypto from 'crypto'

const isProduction = process.env.NODE_ENV === 'production'

const DEFAULT_SECRETS = {
  JWT_SECRET: 'bolosdanize-dev-secret',
  ADMIN_PASSWORD: 'admin123',
}

export const config = {
  port: Number(process.env.PORT) || 3001,
  isProduction,
  jwtSecret: process.env.JWT_SECRET || DEFAULT_SECRETS.JWT_SECRET,
  adminPassword: process.env.ADMIN_PASSWORD || DEFAULT_SECRETS.ADMIN_PASSWORD,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  enableSwagger: process.env.ENABLE_SWAGGER === 'true' || !isProduction,
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    loginMax: Number(process.env.RATE_LIMIT_LOGIN_MAX) || 5,
    apiMax: Number(process.env.RATE_LIMIT_API_MAX) || 120,
  },
  pagination: {
    defaultLimit: Number(process.env.PAGINATION_DEFAULT_LIMIT) || 20,
    maxLimit: Number(process.env.PAGINATION_MAX_LIMIT) || 100,
  },
  uploadsCacheMaxAge: isProduction ? '7d' : 0,
  bodyLimit: '100kb',
  uploadMaxBytes: 2 * 1024 * 1024,
  allowedImageExtensions: new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']),
  allowedImageMimeTypes: new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ]),
}

function parseCorsOrigins(value) {
  if (value) {
    return value.split(',').map((origin) => origin.trim()).filter(Boolean)
  }

  return [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ]
}

export function validateSecurityConfig() {
  const warnings = []

  if (config.isProduction) {
    if (
      !process.env.JWT_SECRET ||
      config.jwtSecret === DEFAULT_SECRETS.JWT_SECRET ||
      config.jwtSecret.length < 32
    ) {
      throw new Error(
        'Em produção, defina JWT_SECRET com pelo menos 32 caracteres aleatórios no .env'
      )
    }

    if (
      !process.env.ADMIN_PASSWORD ||
      config.adminPassword === DEFAULT_SECRETS.ADMIN_PASSWORD ||
      config.adminPassword.length < 8
    ) {
      throw new Error(
        'Em produção, defina ADMIN_PASSWORD com pelo menos 8 caracteres no .env'
      )
    }

    if (config.corsOrigins.some((origin) => origin.includes('localhost'))) {
      warnings.push('CORS_ORIGINS ainda inclui localhost em produção')
    }
  } else {
    if (config.jwtSecret === DEFAULT_SECRETS.JWT_SECRET) {
      warnings.push('Usando JWT_SECRET padrão (apenas desenvolvimento)')
    }
    if (config.adminPassword === DEFAULT_SECRETS.ADMIN_PASSWORD) {
      warnings.push('Usando ADMIN_PASSWORD padrão (apenas desenvolvimento)')
    }
  }

  return warnings
}

export function safeCompareStrings(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))

  if (left.length !== right.length) {
    crypto.timingSafeEqual(left, left)
    return false
  }

  return crypto.timingSafeEqual(left, right)
}

export function isAllowedImage(file) {
  const ext = file.originalname
    ? file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase()
    : ''

  return (
    config.allowedImageMimeTypes.has(file.mimetype) &&
    config.allowedImageExtensions.has(ext)
  )
}
