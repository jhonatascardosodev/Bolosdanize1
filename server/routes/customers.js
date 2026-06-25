import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { customerAuthMiddleware } from '../middleware/customerAuth.js'
import {
  findCustomerByEmail,
  findCustomerById,
  createCustomer,
  getCustomerPasswordHash,
  getCustomerTransactions,
  addCustomerPoints,
} from '../db/customers.js'

function customerResponse(customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    points: customer.points,
    createdAt: customer.createdAt,
  }
}

function signCustomerToken(customer) {
  return jwt.sign(
    { role: 'customer', sub: customer.id, email: customer.email },
    config.jwtSecret,
    { expiresIn: '30d' }
  )
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function createCustomersRouter(db, loginLimiter) {
  const router = Router()

  router.post('/register', loginLimiter, (req, res) => {
    const { name, email, phone, password } = req.body

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido' })
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' })
    }

    if (findCustomerByEmail(db, email)) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado' })
    }

    const passwordHash = hashPassword(password)
    const customer = createCustomer(db, {
      name,
      email,
      phone,
      passwordHash,
    })

    if (config.loyalty.welcomePoints > 0) {
      addCustomerPoints(
        db,
        customer.id,
        config.loyalty.welcomePoints,
        'welcome',
        'Bônus de boas-vindas'
      )
    }

    const updated = findCustomerById(db, customer.id)
    const token = signCustomerToken(updated)

    res.status(201).json({
      token,
      customer: customerResponse(updated),
      welcomePoints: config.loyalty.welcomePoints,
    })
  })

  router.post('/login', loginLimiter, (req, res) => {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' })
    }

    const customer = findCustomerByEmail(db, email)
    if (!customer) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' })
    }

    const hash = getCustomerPasswordHash(db, customer.id)
    if (!verifyPassword(password, hash)) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' })
    }

    const token = signCustomerToken(customer)

    res.json({
      token,
      customer: customerResponse(customer),
    })
  })

  router.get('/me', customerAuthMiddleware, (req, res) => {
    const customer = findCustomerById(db, req.customer.sub)

    if (!customer) {
      return res.status(404).json({ error: 'Cliente não encontrado' })
    }

    res.json(customerResponse(customer))
  })

  router.get('/me/transactions', customerAuthMiddleware, (req, res) => {
    const transactions = getCustomerTransactions(db, req.customer.sub)
    res.json(transactions)
  })

  return router
}
