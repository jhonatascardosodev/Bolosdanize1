import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from '../config.js'

export function setupSecurityMiddleware(app) {
  app.disable('x-powered-by')

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  )

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.corsOrigins.includes(origin)) {
          callback(null, true)
          return
        }

        callback(new Error('Origem não permitida pelo CORS'))
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    })
  )

  app.use(express.json({ limit: config.bodyLimit }))
}

export function createUploadsStatic(uploadsDir) {
  return express.static(uploadsDir, {
    dotfiles: 'deny',
    index: false,
    fallthrough: false,
  })
}
