import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  listCustomers,
  findCustomerById,
  addCustomerPoints,
  getCustomerTransactions,
  listPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  findPromotionById,
} from '../db/customers.js'

export function createAdminLoyaltyRouter(db) {
  const router = Router()

  router.get('/customers', authMiddleware, (_req, res) => {
    res.json(listCustomers(db))
  })

  router.get('/customers/:id/transactions', authMiddleware, (req, res) => {
    const customer = findCustomerById(db, Number(req.params.id))
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' })
    }

    res.json(getCustomerTransactions(db, customer.id, 50))
  })

  router.post('/customers/:id/points', authMiddleware, (req, res) => {
    const customer = findCustomerById(db, Number(req.params.id))
    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' })
    }

    const amount = Math.floor(Number(req.body.amount))
    const description = req.body.description?.trim() || 'Ajuste manual pelo admin'

    if (!amount) {
      return res.status(400).json({ error: 'Informe a quantidade de pontos' })
    }

    const updated = addCustomerPoints(db, customer.id, amount, 'admin_adjust', description)
    res.json(updated)
  })

  router.get('/promotions', authMiddleware, (_req, res) => {
    res.json(listPromotions(db))
  })

  router.post('/promotions', authMiddleware, (req, res) => {
    const { title } = req.body
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Título é obrigatório' })
    }

    const promotion = createPromotion(db, {
      title: req.body.title,
      description: req.body.description,
      bonusPoints: Number(req.body.bonusPoints) || 0,
      discountPercent: Number(req.body.discountPercent) || 0,
      minPurchase: Number(req.body.minPurchase) || 0,
      active: req.body.active !== false,
      startsAt: req.body.startsAt || null,
      endsAt: req.body.endsAt || null,
    })

    res.status(201).json(promotion)
  })

  router.put('/promotions/:id', authMiddleware, (req, res) => {
    const updated = updatePromotion(db, Number(req.params.id), {
      title: req.body.title,
      description: req.body.description,
      bonusPoints: req.body.bonusPoints !== undefined ? Number(req.body.bonusPoints) : undefined,
      discountPercent:
        req.body.discountPercent !== undefined ? Number(req.body.discountPercent) : undefined,
      minPurchase: req.body.minPurchase !== undefined ? Number(req.body.minPurchase) : undefined,
      active: req.body.active,
      startsAt: req.body.startsAt,
      endsAt: req.body.endsAt,
    })

    if (!updated) {
      return res.status(404).json({ error: 'Promoção não encontrada' })
    }

    res.json(updated)
  })

  router.delete('/promotions/:id', authMiddleware, (req, res) => {
    const removed = deletePromotion(db, Number(req.params.id))
    if (!removed) {
      return res.status(404).json({ error: 'Promoção não encontrada' })
    }

    res.status(204).send()
  })

  return router
}
