import { Router } from 'express'
import { getLoyaltyRules, previewLoyalty } from '../lib/loyalty.js'
import { customerAuthMiddleware } from '../middleware/customerAuth.js'
import {
  findCustomerById,
  findActivePromotions,
  applyOrderPoints,
} from '../db/customers.js'

export function createLoyaltyRouter(db) {
  const router = Router()

  router.get('/rules', (_req, res) => {
    res.json(getLoyaltyRules())
  })

  router.post('/preview', (req, res) => {
    const { subtotal, pointsToRedeem, customerPoints } = req.body
    const promotions = findActivePromotions(db)

    res.json(
      previewLoyalty({
        subtotal,
        pointsToRedeem,
        customerPoints,
        activePromotions: promotions,
      })
    )
  })

  router.post('/complete-order', customerAuthMiddleware, (req, res) => {
    const { subtotal, pointsToRedeem } = req.body
    const customer = findCustomerById(db, req.customer.sub)

    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' })
    }

    const promotions = findActivePromotions(db)
    const preview = previewLoyalty({
      subtotal,
      pointsToRedeem,
      customerPoints: customer.points,
      activePromotions: promotions,
    })

    if (preview.pointsToRedeem > customer.points) {
      return res.status(400).json({ error: 'Pontos insuficientes' })
    }

    const updated = applyOrderPoints(db, customer.id, {
      pointsToRedeem: preview.pointsToRedeem,
      subtotal,
      bonusPoints: preview.bonusPoints,
    })

    if (!updated) {
      return res.status(400).json({ error: 'Não foi possível processar os pontos' })
    }

    res.json({
      customer: {
        id: updated.id,
        points: updated.points,
      },
      discount: preview.discount,
      pointsRedeemed: preview.pointsToRedeem,
      pointsEarned: preview.pointsEarned,
      bonusPoints: preview.bonusPoints,
      promotionTitle: preview.promotionTitle,
    })
  })

  return router
}
