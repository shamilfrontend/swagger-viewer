import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

function readFromStorage<T>(raw: string | null, defaultValue: T): T {
  if (raw === null) return defaultValue
  // Строки храним как есть — контент редактора (YAML/JSON) не парсим через JSON.parse
  if (typeof defaultValue === 'string') return raw as T
  try {
    const parsed = JSON.parse(raw) as T
    return parsed ?? defaultValue
  } catch {
    return defaultValue
  }
}

function writeToStorage(key: string, value: unknown): void {
  try {
    const toStore = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, toStore)
  } catch {
    // ignore quota / serialization errors
  }
}

export interface UseLocalStorageOptions {
  /** Задержка записи в localStorage (мс). Для больших текстов лучше 300–500. 0 = писать сразу. */
  debounce?: number
}

/**
 * Реактивный ref, синхронизированный с localStorage.
 * При инициализации читает из localStorage; при изменении пишет (с debounce по желанию).
 * При уходе со страницы (beforeunload) принудительно сохраняет текущее значение.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions = {}
) {
  const { debounce: debounceMs = 0 } = options
  const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null
  const value = readFromStorage(stored, defaultValue)
  const state = ref<T>(value) as { value: T }

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function flush() {
    if (timeoutId != null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    writeToStorage(key, state.value)
  }

  watch(
    state,
    (newVal) => {
      if (debounceMs <= 0) {
        writeToStorage(key, newVal)
        return
      }
      if (timeoutId != null) clearTimeout(timeoutId)
      timeoutId = setTimeout(flush, debounceMs)
    },
    { deep: true }
  )

  onMounted(() => {
    window.addEventListener('beforeunload', flush)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', flush)
    flush()
  })

  return state
}
