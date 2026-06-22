import path from 'path'

export function createPaths(serverDir) {
  const dataDir = path.join(serverDir, 'data')
  const dataFile = path.join(dataDir, 'products.json')
  const dbFile = process.env.DATABASE_PATH || path.join(dataDir, 'bolosdanize.db')
  const uploadsDir = path.join(serverDir, 'uploads')

  return { dataDir, dataFile, dbFile, uploadsDir }
}
