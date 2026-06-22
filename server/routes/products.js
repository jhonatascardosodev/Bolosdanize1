import { Router } from 'express'
import { config } from '../config.js'
import { authMiddleware } from '../middleware/auth.js'
import { deleteImageFile } from '../lib/files.js'
import { parseBoolean, validateCreateProduct, validateUpdateProduct } from '../lib/validators.js'
import {
  findAllProducts,
  findProductsPaginated,
  findProductById,
  createProduct,
  updateProduct,
  toggleProductAvailability,
  deleteProduct,
} from '../db.js'

export function createProductsRouter({ db, upload, uploadsDir }) {
  const router = Router()

  router.get('/', (req, res) => {
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

  router.get('/:id', (req, res) => {
    const product = findProductById(db, Number(req.params.id))

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json(product)
  })

  router.post('/', authMiddleware, upload.single('image'), (req, res) => {
    const validation = validateCreateProduct(req.body)

    if (!validation.ok) {
      return res.status(400).json({ error: validation.error })
    }

    const product = createProduct(db, {
      ...validation.data,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    })

    res.status(201).json(product)
  })

  router.put('/:id', authMiddleware, upload.single('image'), (req, res) => {
    const id = Number(req.params.id)
    const current = findProductById(db, id)

    if (!current) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    const validation = validateUpdateProduct(req.body, current)

    if (!validation.ok) {
      return res.status(400).json({ error: validation.error })
    }

    const updates = { ...validation.data }

    if (req.file) {
      deleteImageFile(current.image, uploadsDir)
      updates.image = `/uploads/${req.file.filename}`
    } else if (parseBoolean(req.body.removeImage, false)) {
      deleteImageFile(current.image, uploadsDir)
      updates.image = null
    }

    const updated = updateProduct(db, id, updates)
    res.json(updated)
  })

  router.patch('/:id/toggle', authMiddleware, (req, res) => {
    const product = toggleProductAvailability(db, Number(req.params.id))

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json(product)
  })

  router.delete('/:id', authMiddleware, (req, res) => {
    const removed = deleteProduct(db, Number(req.params.id))

    if (!removed) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    deleteImageFile(removed.image, uploadsDir)
    res.status(204).send()
  })

  return router
}
