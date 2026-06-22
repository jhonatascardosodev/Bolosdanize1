import rateLimit from 'express-rate-limit'
import { config } from '../config.js'

export function createLoginLimiter() {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.loginMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Muitas tentativas de login. Tente novamente em alguns minutos.',
    },
  })
}

export function createApiLimiter() {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.apiMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Muitas requisições. Aguarde um momento.',
    },
  })
}
