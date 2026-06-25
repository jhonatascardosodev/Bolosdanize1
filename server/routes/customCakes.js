import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  readCustomCakes,
  writeCustomCakes,
  validateCustomCakesPayload,
} from '../lib/customCakes.js'

export function createCustomCakesRouter(dataDir) {
  const router = Router()

  router.get('/', (_req, res) => {
    res.json(readCustomCakes(dataDir))
  })

  router.put('/', authMiddleware, (req, res) => {
    const validation = validateCustomCakesPayload(req.body)

    if (!validation.ok) {
      return res.status(400).json({ error: validation.error })
    }

    const saved = writeCustomCakes(dataDir, validation.data)
    res.json(saved)
  })

  return router
}
