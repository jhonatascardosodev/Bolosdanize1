import fs from 'fs'
import path from 'path'
import { config } from '../config.js'

export function ensureDirectories(...dirs) {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}

export function deleteImageFile(imagePath, uploadsDir) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return

  const filename = path.basename(imagePath)
  const fullPath = path.join(uploadsDir, filename)

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}

export function sanitizeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase()

  if (!config.allowedImageExtensions.has(ext)) {
    return null
  }

  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return `${unique}${ext}`
}
