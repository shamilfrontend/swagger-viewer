import { ref, watch } from 'vue'
import { validateSpec, type ValidationResult } from '@/utils/validators'
import type { SpecFormat } from '@/utils/converters'
import { useDebounce } from './useDebounce'

/**
 * Validates spec text (debounced) and exposes parsed spec, error message and line number.
 */
export function useOpenApiValidator(
  specText: { value: string },
  format: { value: SpecFormat },
  debounceMs = 300
) {
  const parsedSpec = ref<object | null>(null)
  const validationError = ref<string | null>(null)
  const lineNumber = ref<number | null>(null)

  const debouncedText = useDebounce(specText, debounceMs)

  function applyResult(result: ValidationResult) {
    if (result.valid && result.spec) {
      parsedSpec.value = result.spec
      validationError.value = null
      lineNumber.value = null
    } else {
      parsedSpec.value = null
      validationError.value = result.error ?? null
      lineNumber.value = result.line ?? null
    }
  }

  watch(
    () => [debouncedText.value, format.value],
    () => {
      applyResult(validateSpec(debouncedText.value, format.value))
    },
    { immediate: true }
  )

  return { parsedSpec, validationError, lineNumber }
}
