import { config } from '../config.js'

export function getLoyaltyRules() {
  return {
    welcomePoints: config.loyalty.welcomePoints,
    pointsPerReal: config.loyalty.pointsPerReal,
    pointsPerRealDiscount: config.loyalty.pointsPerRealDiscount,
    minRedeemPoints: config.loyalty.minRedeemPoints,
    maxDiscountPercent: config.loyalty.maxDiscountPercent,
  }
}

export function calculateEarnedPoints(subtotal) {
  const amount = Number(subtotal) || 0
  return Math.floor(amount * config.loyalty.pointsPerReal)
}

export function calculateDiscountFromPoints(pointsToRedeem, subtotal) {
  const points = Math.max(0, Math.floor(Number(pointsToRedeem) || 0))
  const orderSubtotal = Number(subtotal) || 0

  if (points < config.loyalty.minRedeemPoints || orderSubtotal <= 0) {
    return { discount: 0, pointsUsed: 0 }
  }

  const maxByPercent =
    orderSubtotal * (config.loyalty.maxDiscountPercent / 100)
  const discountFromPoints = points / config.loyalty.pointsPerRealDiscount
  const discount = Math.min(discountFromPoints, maxByPercent, orderSubtotal)
  const pointsUsed = Math.floor(discount * config.loyalty.pointsPerRealDiscount)

  return {
    discount: Math.round(discount * 100) / 100,
    pointsUsed,
  }
}

export function previewLoyalty({ subtotal, pointsToRedeem, customerPoints, activePromotions = [] }) {
  const rules = getLoyaltyRules()
  const safeBalance = Math.max(0, Math.floor(customerPoints || 0))
  const requested = Math.max(0, Math.floor(Number(pointsToRedeem) || 0))
  const cappedRedeem = Math.min(requested, safeBalance)

  const { discount, pointsUsed } = calculateDiscountFromPoints(cappedRedeem, subtotal)
  let bonusPoints = 0
  let promotionTitle = null

  for (const promo of activePromotions) {
    if (promo.minPurchase && subtotal < promo.minPurchase) continue

    if (promo.bonusPoints > 0) {
      bonusPoints += promo.bonusPoints
      promotionTitle = promo.title
    }
  }

  const earnedBase = calculateEarnedPoints(subtotal)
  const pointsEarned = earnedBase + bonusPoints

  return {
    rules,
    subtotal: Number(subtotal) || 0,
    discount,
    pointsToRedeem: pointsUsed,
    pointsEarned,
    bonusPoints,
    promotionTitle,
    totalAfterDiscount: Math.max(0, (Number(subtotal) || 0) - discount),
    newBalance: safeBalance - pointsUsed + pointsEarned,
  }
}
