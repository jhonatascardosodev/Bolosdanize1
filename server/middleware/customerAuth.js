import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export function customerAuthMiddleware(req, res, next) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Faça login para continuar' })
  }

  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret)

    if (payload.role !== 'customer' || !payload.sub) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    req.customer = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' })
  }
}
