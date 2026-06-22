import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../app.js'
import { initDatabase } from '../db.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('GET /api/health responde ok', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bolosdanize-test-'))
  const dbFile = path.join(tmpDir, 'test.db')
  const dataFile = path.join(tmpDir, 'products.json')
  const uploadsDir = path.join(tmpDir, 'uploads')
  fs.mkdirSync(uploadsDir)

  const db = initDatabase(dbFile, dataFile)
  const app = createApp({ db, uploadsDir })
  const server = app.listen(0)

  try {
    const { port } = server.address()
    const response = await fetch(`http://127.0.0.1:${port}/api/health`)
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(body.status, 'ok')
    assert.equal(typeof body.products, 'number')
  } finally {
    await new Promise((resolve) => server.close(resolve))
    db.close()
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
})
