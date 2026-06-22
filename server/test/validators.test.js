import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseBoolean,
  normalizeCategory,
  validatePrice,
  validateCreateProduct,
  validateUpdateProduct,
} from '../lib/validators.js'

test('parseBoolean converte strings comuns', () => {
  assert.equal(parseBoolean('true'), true)
  assert.equal(parseBoolean('false'), false)
  assert.equal(parseBoolean('1'), true)
  assert.equal(parseBoolean(undefined, false), false)
})

test('normalizeCategory padroniza categoria', () => {
  assert.equal(normalizeCategory('personalizado'), 'personalizado')
  assert.equal(normalizeCategory('cardapio'), 'cardapio')
  assert.equal(normalizeCategory('outro'), 'cardapio')
})

test('validatePrice aceita valores válidos e rejeita inválidos', () => {
  assert.equal(validatePrice('120'), 120)
  assert.equal(validatePrice(0), null)
  assert.equal(validatePrice('abc'), null)
  assert.equal(validatePrice('100000'), null)
})

test('validateCreateProduct exige campos obrigatórios', () => {
  const missing = validateCreateProduct({})
  assert.equal(missing.ok, false)

  const valid = validateCreateProduct({
    name: 'Bolo',
    description: 'Descrição',
    price: '99.9',
  })

  assert.equal(valid.ok, true)
  assert.equal(valid.data.name, 'Bolo')
  assert.equal(valid.data.price, 99.9)
})

test('validateUpdateProduct rejeita nome vazio', () => {
  const result = validateUpdateProduct({ name: '   ' }, { available: true })
  assert.equal(result.ok, false)
})
