import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { config, safeCompareStrings } from '../config.js'

export function createAuthRouter(loginLimiter) {
  const router = Router()

  router.post('/login', loginLimiter, (req, res) => {
    const { password } = req.body

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Senha é obrigatória' })
    }

    if (!safeCompareStrings(password, config.adminPassword)) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    const token = jwt.sign({ role: 'admin' }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    })

    res.json({
      token,
      expiresIn: config.jwtExpiresIn,
    })
  })

  return router
}
