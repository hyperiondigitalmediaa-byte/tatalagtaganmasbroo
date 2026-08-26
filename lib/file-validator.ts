/**
 * File Upload Validator
 * Validates file type, size, and content for security
 */

export interface FileValidationResult {
  valid: boolean
  error?: string
}

// Allowed MIME types for images
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Dangerous file extensions to block
const BLOCKED_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr',
  '.vbs', '.js', '.jar', '.zip', '.rar',
  '.sh', '.app', '.deb', '.rpm'
]

/**
 * Validate uploaded file
 */
export function validateFile(file: File, type: 'image' | 'content' = 'image'): FileValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'File tidak ditemukan' }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    }
  }

  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: 'File kosong' }
  }

  // Check file extension
  const fileName = file.name.toLowerCase()
  const hasBlockedExtension = BLOCKED_EXTENSIONS.some(ext => fileName.endsWith(ext))
  
  if (hasBlockedExtension) {
    return { valid: false, error: 'Tipe file tidak diizinkan' }
  }

  // Check MIME type for images
  if (type === 'image' || type === 'content') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `Tipe file tidak valid. Hanya menerima: ${ALLOWED_IMAGE_TYPES.join(', ')}` 
      }
    }
  }

  // Additional check: file name should not contain suspicious patterns
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { valid: false, error: 'Nama file tidak valid' }
  }

  return { valid: true }
}

/**
 * Validate file content by checking magic bytes
 * This prevents file extension spoofing
 */
export async function validateFileContent(file: File): Promise<FileValidationResult> {
  try {
    // Read first few bytes to check magic numbers
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer).slice(0, 4)
    
    // Check magic bytes for common image formats
    const magicNumbers = {
      jpeg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47],
      gif: [0x47, 0x49, 0x46],
      webp: [0x52, 0x49, 0x46, 0x46], // RIFF
    }

    // Check if file matches declared MIME type
    let isValid = false
    
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      isValid = bytes[0] === magicNumbers.jpeg[0] && 
                bytes[1] === magicNumbers.jpeg[1] && 
                bytes[2] === magicNumbers.jpeg[2]
    } else if (file.type === 'image/png') {
      isValid = bytes[0] === magicNumbers.png[0] && 
                bytes[1] === magicNumbers.png[1] && 
                bytes[2] === magicNumbers.png[2] && 
                bytes[3] === magicNumbers.png[3]
    } else if (file.type === 'image/gif') {
      isValid = bytes[0] === magicNumbers.gif[0] && 
                bytes[1] === magicNumbers.gif[1] && 
                bytes[2] === magicNumbers.gif[2]
    } else if (file.type === 'image/webp') {
      isValid = bytes[0] === magicNumbers.webp[0] && 
                bytes[1] === magicNumbers.webp[1] && 
                bytes[2] === magicNumbers.webp[2] && 
                bytes[3] === magicNumbers.webp[3]
    } else if (file.type === 'image/svg+xml') {
      // SVG is XML-based, check for XML declaration or SVG tag
      const text = new TextDecoder().decode(bytes)
      isValid = text.includes('<') || text.includes('<?xml')
    } else {
      return { valid: false, error: 'Tipe file tidak didukung' }
    }

    if (!isValid) {
      return { 
        valid: false, 
        error: 'File tidak sesuai dengan tipe yang dideklarasikan (possible spoofing)' 
      }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Gagal memvalidasi konten file' }
  }
}
