import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import swaggerSpec from './swagger.js'
import { config, validateSecurityConfig, safeCompareStrings, isAllowedImage } from './config.js'
import { authMiddleware } from './middleware/auth.js'
import { setupSecurityMiddleware, createUploadsStatic } from './middleware/security.js'
import { createApiLimiter, createLoginLimiter } from './middleware/rateLimit.js'
import {
  initDatabase,
  findAllProducts,
  findProductsPaginated,
  findProductById,
  createProduct,
  updateProduct,
  toggleProductAvailability,
  deleteProduct,
  countProducts,
} from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const securityWarnings = validateSecurityConfig()
securityWarnings.forEach((warning) => console.warn(`[segurança] ${warning}`))

const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'products.json')
const DB_FILE = process.env.DATABASE_PATH || path.join(DATA_DIR, 'bolosdanize.db')
const UPLOADS_DIR = path.join(__dirname, 'uploads')

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

function parseBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'boolean') return value
  return value === 'true' || value === '1'
}

function deleteImageFile(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return

  const filename = path.basename(imagePath)
  const fullPath = path.join(UPLOADS_DIR, filename)

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}

function sanitizeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase()
  if (!config.allowedImageExtensions.has(ext)) {
    return null
  }

  const unique = `${Date.now()}-${cryptoRandomSuffix()}`
  return `${unique}${ext}`
}

function cryptoRandomSuffix() {
  return Math.random().toString(36).slice(2, 10)
}

ensureDirectories()

const db = initDatabase(DB_FILE, DATA_FILE)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (_req, file, cb) => {
    const filename = sanitizeFilename(file.originalname)

    if (!filename) {
      cb(new Error('Tipo de arquivo não permitido'))
      return
    }

    cb(null, filename)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: config.uploadMaxBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (isAllowedImage(file)) {
      cb(null, true)
      return
    }
    cb(new Error('Apenas imagens JPG, PNG, WebP ou GIF são permitidas'))
  },
})

const app = express()
const loginLimiter = createLoginLimiter()
const apiLimiter = createApiLimiter()

setupSecurityMiddleware(app)

app.use('/api', apiLimiter)
app.use('/uploads', createUploadsStatic(UPLOADS_DIR))

if (config.enableSwagger) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Bolos da Nize — API Docs',
  }))

  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec)
  })
}

app.get('/api/health', (_req, res) => {
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

app.post('/api/auth/login', loginLimiter, (req, res) => {
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

app.get('/api/products', (req, res) => {
  const availableOnly = req.query.available === 'true'
  const hasPagination = req.query.page !== undefined || req.query.limit !== undefined

  if (hasPagination) {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(
      config.pagination.maxLimit,
      Math.max(1, Number(req.query.limit) || config.pagination.defaultLimit)
    )

    const result = findProductsPaginated(db, {
      availableOnly,
      category: req.query.category,
      page,
      limit,
    })

    return res.json({
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  }

  res.json(findAllProducts(db, availableOnly))
})

app.get('/api/products/:id', (req, res) => {
  const product = findProductById(db, Number(req.params.id))

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' })
  }

  res.json(product)
})

app.post('/api/products', authMiddleware, upload.single('image'), (req, res) => {
  const { name, description, fullDescription, price, category, available } = req.body

  if (!name?.trim() || !description?.trim()) {
    return res.status(400).json({ error: 'Nome e descrição são obrigatórios' })
  }

  if (name.trim().length > 120 || description.trim().length > 255) {
    return res.status(400).json({ error: 'Texto muito longo' })
  }

  const numericPrice = Number(price)
  if (!numericPrice || numericPrice <= 0 || numericPrice > 99999) {
    return res.status(400).json({ error: 'Preço inválido' })
  }

  const product = createProduct(db, {
    name: name.trim(),
    description: description.trim(),
    fullDescription: (fullDescription?.trim() || description.trim()).slice(0, 2000),
    price: numericPrice,
    category: category === 'personalizado' ? 'personalizado' : 'cardapio',
    available: parseBoolean(available),
    image: req.file ? `/uploads/${req.file.filename}` : null,
  })

  res.status(201).json(product)
})

app.put('/api/products/:id', authMiddleware, upload.single('image'), (req, res) => {
  const id = Number(req.params.id)
  const current = findProductById(db, id)

  if (!current) {
    return res.status(404).json({ error: 'Produto não encontrado' })
  }

  const { name, description, fullDescription, price, category, available, removeImage } = req.body

  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ error: 'Nome inválido' })
  }

  if (price !== undefined) {
    const numericPrice = Number(price)
    if (!numericPrice || numericPrice <= 0 || numericPrice > 99999) {
      return res.status(400).json({ error: 'Preço inválido' })
    }
  }

  const updates = {
    name: name?.trim(),
    description: description?.trim(),
    fullDescription: fullDescription?.trim(),
    price: price !== undefined ? Number(price) : undefined,
    category:
      category === undefined
        ? undefined
        : category === 'personalizado'
          ? 'personalizado'
          : 'cardapio',
    available: available !== undefined ? parseBoolean(available, current.available) : undefined,
  }

  if (req.file) {
    deleteImageFile(current.image)
    updates.image = `/uploads/${req.file.filename}`
  } else if (parseBoolean(removeImage, false)) {
    deleteImageFile(current.image)
    updates.image = null
  }

  const updated = updateProduct(db, id, updates)
  res.json(updated)
})

app.patch('/api/products/:id/toggle', authMiddleware, (req, res) => {
  const product = toggleProductAvailability(db, Number(req.params.id))

  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' })
  }

  res.json(product)
})

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const removed = deleteProduct(db, Number(req.params.id))

  if (!removed) {
    return res.status(404).json({ error: 'Produto não encontrado' })
  }

  deleteImageFile(removed.image)
  res.status(204).send()
})

app.use((err, _req, res, next) => {
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
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

const server = app.listen(config.port, () => {
  console.log(`API rodando em http://localhost:${config.port}`)
  if (config.enableSwagger) {
    console.log(`Swagger UI: http://localhost:${config.port}/api-docs`)
  }
  console.log(`Banco SQLite: ${DB_FILE}`)
  console.log(`Ambiente: ${config.isProduction ? 'production' : 'development'}`)
})

function shutdown(signal) {
  console.log(`\n${signal} recebido. Encerrando servidor...`)
  server.close(() => {
    console.log('Servidor encerrado.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
