import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { config, validateSecurityConfig } from './config.js'
import { initDatabase } from './db.js'
import { createPaths } from './lib/paths.js'
import { ensureDirectories } from './lib/files.js'
import { createApp } from './app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const securityWarnings = validateSecurityConfig()
securityWarnings.forEach((warning) => console.warn(`[segurança] ${warning}`))

const paths = createPaths(__dirname)
ensureDirectories(paths.dataDir, paths.uploadsDir)

const db = initDatabase(paths.dbFile, paths.dataFile)
const app = createApp({ db, uploadsDir: paths.uploadsDir })

const server = app.listen(config.port, () => {
  console.log(`API rodando em http://localhost:${config.port}`)

  if (config.enableSwagger) {
    console.log(`Swagger UI: http://localhost:${config.port}/api-docs`)
  }

  console.log(`Banco SQLite: ${paths.dbFile}`)
  console.log(`Ambiente: ${config.isProduction ? 'production' : 'development'}`)
})

function shutdown(signal) {
  console.log(`\n${signal} recebido. Encerrando servidor...`)
  server.close(() => {
    console.log('Servidor encerrado.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

export { app, db, paths }
