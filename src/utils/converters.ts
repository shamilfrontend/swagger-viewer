import * as YAML from 'yaml'

export type SpecFormat = 'yaml' | 'json'

/**
 * Parse spec text (YAML or JSON) into object.
 * @throws Error with message on parse failure
 */
export function parseSpec(text: string, format: SpecFormat): object {
  try {
    if (format === 'json') {
      return JSON.parse(text) as object
    }
    const parsed = YAML.parse(text)
    if (parsed === undefined || parsed === null) {
      return {}
    }
    return parsed as object
  } catch (e) {
    const err = e as Error & { line?: number; pos?: number }
    let message = err.message ?? 'Ошибка парсинга'
    if (err.line != null) {
      message += ` (строка ${err.line})`
    }
    throw new Error(message)
  }
}

/**
 * Convert YAML string to JSON string (2 spaces indent).
 */
export function yamlToJson(yamlStr: string): string {
  try {
    const obj = YAML.parse(yamlStr)
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    const err = e as Error & { line?: number }
    let message = err.message ?? 'Ошибка конвертации YAML в JSON'
    if (err.line != null) {
      message += ` (строка ${err.line})`
    }
    throw new Error(message)
  }
}

/**
 * Convert JSON string to YAML string (2 spaces indent).
 */
export function jsonToYaml(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr) as unknown
    return YAML.stringify(obj, { indent: 2 })
  } catch (e) {
    const err = e as Error
    throw new Error(err.message ?? 'Ошибка конвертации JSON в YAML')
  }
}
