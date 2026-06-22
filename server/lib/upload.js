import multer from 'multer'
import { config, isAllowedImage } from '../config.js'
import { sanitizeFilename } from './files.js'

export function createUploader(uploadsDir) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir)
    },
    filename: (_req, file, cb) => {
      const filename = sanitizeFilename(file.originalname)

      if (!filename) {
        cb(new Error('Tipo de arquivo não permitido'))
        return
      }

      cb(null, filename)
    },
  })

  return multer({
    storage,
    limits: { fileSize: config.uploadMaxBytes, files: 1 },
    fileFilter: (_req, file, cb) => {
      if (isAllowedImage(file)) {
        cb(null, true)
        return
      }

      cb(new Error('Apenas imagens JPG, PNG, WebP ou GIF são permitidas'))
    },
  })
}
