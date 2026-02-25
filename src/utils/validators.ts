import { parseSpec, type SpecFormat } from './converters'

export interface ValidationResult {
  valid: boolean
  spec?: object
  error?: string
  line?: number
}

const LINE_REGEX = /(?:line|строка|line)\s*(\d+)/i

function extractLineFromMessage(message: string | undefined): number | undefined {
  if (!message) return undefined
  const match = message.match(LINE_REGEX)
  const num = match?.[1]
  return num !== undefined ? parseInt(num, 10) : undefined
}

/**
 * Validate and parse spec text. Returns parsed spec or error with optional line number.
 */
export function validateSpec(text: string, format: SpecFormat): ValidationResult {
  if (!text.trim()) {
    return { valid: false, error: 'Спецификация пуста', line: 1 }
  }
  try {
    const spec = parseSpec(text, format)
    if (spec && typeof spec === 'object') {
      return { valid: true, spec }
    }
    return { valid: false, error: 'Некорректная структура спецификации' }
  } catch (e) {
    const err = e as Error
    const line = extractLineFromMessage(err?.message)
    return {
      valid: false,
      error: err.message ?? 'Ошибка валидации',
      line: line ?? 1,
    }
  }
}
