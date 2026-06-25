import { DatabaseSync } from 'node:sqlite'
import fs from 'fs'
import path from 'path'
import { createCustomerSchema } from './db/customers.js'

const defaultProducts = [
  {
    name: 'Bolo de Brigadeiro',
    description: 'Delicioso bolo de brigadeiro',
    fullDescription: 'Bolo macio recheado com brigadeiro cremoso e coberto com granulado.',
    price: 120,
    image: null,
    category: 'cardapio',
    available: true,
  },
  {
    name: 'Bolo de Beijinho',
    description: 'Bolo tradicional de beijinho',
    fullDescription: 'Bolo fofo com recheio de beijinho e coco ralado.',
    price: 120,
    image: null,
    category: 'cardapio',
    available: true,
  },
  {
    name: 'Bolo de Doce de Leite',
    description: 'Cremoso bolo de doce de leite',
    fullDescription: 'Bolo especial com camadas de doce de leite cremoso.',
    price: 130,
    image: null,
    category: 'cardapio',
    available: true,
  },
  {
    name: 'Bolo de Leite Ninho',
    description: 'Clássico bolo de leite ninho',
    fullDescription: 'Bolo macio recheado com creme de leite ninho.',
    price: 130,
    image: null,
    category: 'cardapio',
    available: true,
  },
  {
    name: 'Bolo Mousse de Cupuaçu',
    description: 'Exótico mousse de cupuaçu',
    fullDescription: 'Bolo com mousse de cupuaçu, fruto típico da Amazônia.',
    price: 140,
    image: null,
    category: 'cardapio',
    available: true,
  },
  {
    name: 'Bolo Mousse de Maracujá',
    description: 'Refrescante mousse de maracujá',
    fullDescription: 'Bolo com mousse de maracujá azedinho e delicioso.',
    price: 140,
    image: null,
    category: 'cardapio',
    available: true,
  },
  {
    name: 'Bolo Três Leites',
    description: 'Tradicional três leites',
    fullDescription: 'Bolo úmido feito com três tipos de leite, uma delícia cremosa.',
    price: 135,
    image: null,
    category: 'cardapio',
    available: true,
  },
]

function mapRow(row) {
  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    fullDescription: row.full_description,
    price: row.price,
    image: row.image,
    category: row.category,
    available: row.available === 1,
  }
}

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      category TEXT NOT NULL DEFAULT 'cardapio',
      available INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  `)

  try {
    db.exec(`PRAGMA journal_mode = WAL`)
  } catch {
    // WAL pode não estar disponível em alguns ambientes
  }
}

function insertProduct(db, product) {
  const stmt = db.prepare(`
    INSERT INTO products (name, description, full_description, price, image, category, available)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    product.name,
    product.description,
    product.fullDescription || product.description,
    product.price,
    product.image ?? null,
    product.category || 'cardapio',
    product.available === false ? 0 : 1
  )

  return findProductById(db, Number(result.lastInsertRowid))
}

function migrateFromJson(db, jsonFilePath) {
  if (!fs.existsSync(jsonFilePath)) return false

  try {
    const products = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
    if (!Array.isArray(products) || products.length === 0) return false

    const insertWithId = db.prepare(`
      INSERT INTO products (id, name, description, full_description, price, image, category, available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    db.exec('BEGIN')
    try {
      for (const item of products) {
        insertWithId.run(
          item.id,
          item.name,
          item.description,
          item.fullDescription || item.description,
          item.price,
          item.image ?? null,
          item.category || 'cardapio',
          item.available === false ? 0 : 1
        )
      }
      db.exec('COMMIT')
    } catch (error) {
      db.exec('ROLLBACK')
      throw error
    }

    return true
  } catch {
    return false
  }
}

function seedDefaults(db) {
  db.exec('BEGIN')
  try {
    for (const item of defaultProducts) {
      insertProduct(db, item)
    }
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export function initDatabase(dbPath, jsonFilePath) {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const db = new DatabaseSync(dbPath)
  createSchema(db)
  createCustomerSchema(db)

  const count = db.prepare('SELECT COUNT(*) as total FROM products').get().total

  if (count === 0) {
    const migrated = migrateFromJson(db, jsonFilePath)
    if (!migrated) {
      seedDefaults(db)
    }
  }

  return db
}

export function findAllProducts(db, availableOnly = false) {
  const query = availableOnly
    ? 'SELECT * FROM products WHERE available = 1 ORDER BY id ASC'
    : 'SELECT * FROM products ORDER BY id ASC'

  return db.prepare(query).all().map(mapRow)
}

export function findProductsPaginated(db, options = {}) {
  const { availableOnly = false, category, page = 1, limit = 20 } = options
  const safePage = Math.max(1, page)
  const safeLimit = Math.max(1, limit)
  const offset = (safePage - 1) * safeLimit

  const conditions = []
  const params = []

  if (availableOnly) {
    conditions.push('available = 1')
  }

  if (category) {
    conditions.push('category = ?')
    params.push(category)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = db
    .prepare(
      `SELECT * FROM products ${whereClause} ORDER BY id ASC LIMIT ? OFFSET ?`
    )
    .all(...params, safeLimit, offset)
    .map(mapRow)

  const total = db
    .prepare(`SELECT COUNT(*) as total FROM products ${whereClause}`)
    .get(...params).total

  return {
    data: rows,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit) || 1,
  }
}

export function findProductById(db, id) {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  return mapRow(row)
}

export function createProduct(db, product) {
  return insertProduct(db, product)
}

export function updateProduct(db, id, updates) {
  const current = findProductById(db, id)
  if (!current) return null

  const merged = {
    name: updates.name ?? current.name,
    description: updates.description ?? current.description,
    fullDescription: updates.fullDescription ?? current.fullDescription,
    price: updates.price ?? current.price,
    image: updates.image !== undefined ? updates.image : current.image,
    category: updates.category ?? current.category,
    available: updates.available !== undefined ? updates.available : current.available,
  }

  db.prepare(`
    UPDATE products
    SET name = ?,
        description = ?,
        full_description = ?,
        price = ?,
        image = ?,
        category = ?,
        available = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `).run(
    merged.name,
    merged.description,
    merged.fullDescription,
    merged.price,
    merged.image,
    merged.category,
    merged.available ? 1 : 0,
    id
  )

  return findProductById(db, id)
}

export function toggleProductAvailability(db, id) {
  const current = findProductById(db, id)
  if (!current) return null

  return updateProduct(db, id, { available: !current.available })
}

export function deleteProduct(db, id) {
  const current = findProductById(db, id)
  if (!current) return null

  db.prepare('DELETE FROM products WHERE id = ?').run(id)
  return current
}

export function countProducts(db) {
  return db.prepare('SELECT COUNT(*) as total FROM products').get().total
}
