import { Router } from 'express'
import { countProducts } from '../db.js'
import { config } from '../config.js'

export function createHealthRouter(db) {
  const router = Router()

  router.get('/health', (_req, res) => {
    try {
      const total = countProducts(db)
      res.json({
        status: 'ok',
        database: 'sqlite',
        products: total,
        environment: config.isProduction ? 'production' : 'development',
      })
    } catch {
      res.status(503).json({ status: 'error', database: 'sqlite' })
    }
  })

  return router
}
