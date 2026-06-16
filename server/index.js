import express from 'express'
import cors from 'cors'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import swaggerSpec from './swagger.js'
import {
  initDatabase,
  findAllProducts,
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

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'bolosdanize-dev-secret'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

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

function authMiddleware(req, res, next) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    jwt.verify(header.slice(7), JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

ensureDirectories()

const db = initDatabase(DB_FILE, DATA_FILE)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${unique}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
      return
    }
    cb(new Error('Apenas imagens são permitidas'))
  },
})

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Bolos da Nize — API Docs',
}))

app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec)
})

app.get('/api/health', (_req, res) => {
  try {
    const total = countProducts(db)
    res.json({
      status: 'ok',
      database: 'sqlite',
      products: total,
    })
  } catch {
    res.status(503).json({ status: 'error', database: 'sqlite' })
  }
})

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' })
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

app.get('/api/products', (req, res) => {
  const availableOnly = req.query.available === 'true'
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

  const numericPrice = Number(price)
  if (!numericPrice || numericPrice <= 0) {
    return res.status(400).json({ error: 'Preço inválido' })
  }

  const product = createProduct(db, {
    name: name.trim(),
    description: description.trim(),
    fullDescription: fullDescription?.trim() || description.trim(),
    price: numericPrice,
    category: category || 'cardapio',
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
    if (!numericPrice || numericPrice <= 0) {
      return res.status(400).json({ error: 'Preço inválido' })
    }
  }

  const updates = {
    name: name?.trim(),
    description: description?.trim(),
    fullDescription: fullDescription?.trim(),
    price: price !== undefined ? Number(price) : undefined,
    category,
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

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Imagem deve ter no máximo 2MB' })
    }
    return res.status(400).json({ error: err.message })
  }

  if (err) {
    return res.status(400).json({ error: err.message || 'Erro na requisição' })
  }

  res.status(500).json({ error: 'Erro interno' })
})

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`)
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`)
  console.log(`Banco SQLite: ${DB_FILE}`)
})
