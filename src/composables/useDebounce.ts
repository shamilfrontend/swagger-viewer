import { ref, watch, type Ref } from 'vue'

/**
 * Returns a ref that updates with a delay after the source ref changes.
 */
export function useDebounce<T>(source: { value: T }, delay: number): Ref<T> {
  const debounced: Ref<T> = ref(source.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(
    () => source.value,
    (newVal: T) => {
      if (timeoutId != null) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        debounced.value = newVal
        timeoutId = null
      }, delay)
    },
    { immediate: true }
  )

  return debounced
}
