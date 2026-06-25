import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false

  const [salt, hash] = storedHash.split(':')
  const candidate = scryptSync(String(password), salt, 64)
  const expected = Buffer.from(hash, 'hex')

  if (candidate.length !== expected.length) return false

  return timingSafeEqual(candidate, expected)
}
