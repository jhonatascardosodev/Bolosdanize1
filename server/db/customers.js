import { calculateEarnedPoints } from '../lib/loyalty.js'

function mapCustomerRow(row) {
  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    points: row.points,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapTransactionRow(row) {
  if (!row) return null

  return {
    id: row.id,
    customerId: row.customer_id,
    amount: row.amount,
    type: row.type,
    description: row.description,
    balanceAfter: row.balance_after,
    createdAt: row.created_at,
  }
}

function mapPromotionRow(row) {
  if (!row) return null

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    bonusPoints: row.bonus_points,
    discountPercent: row.discount_percent,
    minPurchase: row.min_purchase,
    active: row.active === 1,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdAt: row.created_at,
  }
}

export function createCustomerSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      password_hash TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS point_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      balance_after INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      bonus_points INTEGER NOT NULL DEFAULT 0,
      discount_percent REAL NOT NULL DEFAULT 0,
      min_purchase REAL NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      starts_at TEXT,
      ends_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
    CREATE INDEX IF NOT EXISTS idx_point_transactions_customer ON point_transactions(customer_id);
    CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
  `)
}

export function findCustomerByEmail(db, email) {
  const row = db
    .prepare('SELECT * FROM customers WHERE lower(email) = lower(?)')
    .get(email.trim())
  return mapCustomerRow(row)
}

export function findCustomerById(db, id) {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(id)
  return mapCustomerRow(row)
}

export function createCustomer(db, { name, email, phone, passwordHash }) {
  const result = db
    .prepare(
      `INSERT INTO customers (name, email, phone, password_hash)
       VALUES (?, ?, ?, ?)`
    )
    .run(name.trim(), email.trim().toLowerCase(), phone?.trim() || null, passwordHash)

  return findCustomerById(db, Number(result.lastInsertRowid))
}

export function getCustomerPasswordHash(db, id) {
  const row = db.prepare('SELECT password_hash FROM customers WHERE id = ?').get(id)
  return row?.password_hash || null
}

export function listCustomers(db) {
  return db
    .prepare('SELECT * FROM customers ORDER BY created_at DESC')
    .all()
    .map(mapCustomerRow)
}

export function getCustomerTransactions(db, customerId, limit = 30) {
  return db
    .prepare(
      `SELECT * FROM point_transactions
       WHERE customer_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .all(customerId, limit)
    .map(mapTransactionRow)
}

function recordTransaction(db, customerId, amount, type, description) {
  const customer = findCustomerById(db, customerId)
  if (!customer) return null

  const balanceAfter = customer.points + amount

  db.prepare(
    `UPDATE customers SET points = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(balanceAfter, customerId)

  const result = db
    .prepare(
      `INSERT INTO point_transactions (customer_id, amount, type, description, balance_after)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(customerId, amount, type, description || null, balanceAfter)

  return {
    transactionId: Number(result.lastInsertRowid),
    balanceAfter,
  }
}

export function addCustomerPoints(db, customerId, amount, type, description) {
  if (!amount) return findCustomerById(db, customerId)
  return recordTransaction(db, customerId, Math.abs(amount), type, description)
}

export function applyOrderPoints(db, customerId, { pointsToRedeem, subtotal, bonusPoints = 0 }) {
  const customer = findCustomerById(db, customerId)
  if (!customer) return null

  const redeem = Math.max(0, Math.floor(pointsToRedeem || 0))
  const earned = calculateEarnedPoints(subtotal) + Math.max(0, Math.floor(bonusPoints || 0))

  if (redeem > customer.points) return null

  db.exec('BEGIN')
  try {
    if (redeem > 0) {
      recordTransaction(db, customerId, -redeem, 'redeem', 'Desconto no pedido')
    }

    if (earned > 0) {
      recordTransaction(
        db,
        customerId,
        earned,
        'purchase',
        `Pedido de R$ ${Number(subtotal).toFixed(2)}`
      )
    }

    db.exec('COMMIT')
    return findCustomerById(db, customerId)
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export function findActivePromotions(db) {
  const now = new Date().toISOString()
  return db
    .prepare(
      `SELECT * FROM promotions
       WHERE active = 1
         AND (starts_at IS NULL OR starts_at <= ?)
         AND (ends_at IS NULL OR ends_at >= ?)
       ORDER BY created_at DESC`
    )
    .all(now, now)
    .map(mapPromotionRow)
}

export function listPromotions(db) {
  return db
    .prepare('SELECT * FROM promotions ORDER BY created_at DESC')
    .all()
    .map(mapPromotionRow)
}

export function createPromotion(db, data) {
  const result = db
    .prepare(
      `INSERT INTO promotions (title, description, bonus_points, discount_percent, min_purchase, active, starts_at, ends_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      data.title.trim(),
      data.description?.trim() || null,
      data.bonusPoints || 0,
      data.discountPercent || 0,
      data.minPurchase || 0,
      data.active === false ? 0 : 1,
      data.startsAt || null,
      data.endsAt || null
    )

  return findPromotionById(db, Number(result.lastInsertRowid))
}

export function findPromotionById(db, id) {
  const row = db.prepare('SELECT * FROM promotions WHERE id = ?').get(id)
  return mapPromotionRow(row)
}

export function updatePromotion(db, id, data) {
  const current = findPromotionById(db, id)
  if (!current) return null

  db.prepare(
    `UPDATE promotions
     SET title = ?, description = ?, bonus_points = ?, discount_percent = ?,
         min_purchase = ?, active = ?, starts_at = ?, ends_at = ?
     WHERE id = ?`
  ).run(
    data.title?.trim() ?? current.title,
    data.description?.trim() ?? current.description,
    data.bonusPoints ?? current.bonusPoints,
    data.discountPercent ?? current.discountPercent,
    data.minPurchase ?? current.minPurchase,
    data.active === undefined ? (current.active ? 1 : 0) : data.active ? 1 : 0,
    data.startsAt ?? current.startsAt,
    data.endsAt ?? current.endsAt,
    id
  )

  return findPromotionById(db, id)
}

export function deletePromotion(db, id) {
  const current = findPromotionById(db, id)
  if (!current) return null
  db.prepare('DELETE FROM promotions WHERE id = ?').run(id)
  return current
}
