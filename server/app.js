import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'
import { config } from './config.js'
import { setupSecurityMiddleware, createUploadsStatic } from './middleware/security.js'
import { createApiLimiter, createLoginLimiter } from './middleware/rateLimit.js'
import { createErrorHandler, createNotFoundHandler } from './middleware/errorHandler.js'
import { createUploader } from './lib/upload.js'
import { createHealthRouter } from './routes/health.js'
import { createAuthRouter } from './routes/auth.js'
import { createProductsRouter } from './routes/products.js'

import { createCustomCakesRouter } from './routes/customCakes.js'

export function createApp({ db, uploadsDir, dataDir }) {
  const app = express()
  const loginLimiter = createLoginLimiter()
  const apiLimiter = createApiLimiter()
  const upload = createUploader(uploadsDir)

  setupSecurityMiddleware(app)

  app.use('/api', apiLimiter)
  app.use('/uploads', createUploadsStatic(uploadsDir))

  if (config.enableSwagger) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Bolos da Nize — API Docs',
    }))

    app.get('/api-docs.json', (_req, res) => {
      res.json(swaggerSpec)
    })
  }

  app.use('/api', createHealthRouter(db))
  app.use('/api/auth', createAuthRouter(loginLimiter))
  app.use('/api/products', createProductsRouter({ db, upload, uploadsDir }))
  app.use('/api/custom-cakes', createCustomCakesRouter(dataDir))

  app.use(createErrorHandler())
  app.use(createNotFoundHandler())

  return app
}
