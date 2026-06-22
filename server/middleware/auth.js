import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret)

    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}
