import multer from 'multer'
import { config } from '../config.js'

export function createErrorHandler() {
  return (err, _req, res, next) => {
    if (err.message === 'Origem não permitida pelo CORS') {
      return res.status(403).json({ error: 'Origem não permitida' })
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Imagem deve ter no máximo 2MB' })
      }

      return res.status(400).json({ error: 'Upload inválido' })
    }

    if (err) {
      const message = config.isProduction ? 'Erro na requisição' : err.message
      return res.status(400).json({ error: message || 'Erro na requisição' })
    }

    next()
  }
}

export function createNotFoundHandler() {
  return (_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' })
  }
}
