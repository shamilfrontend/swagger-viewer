<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
// @ts-expect-error UMD bundle
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle.js'
// @ts-expect-error UMD bundle
import SwaggerUIStandalonePreset from 'swagger-ui-dist/swagger-ui-standalone-preset.js'
import 'swagger-ui-dist/swagger-ui.css'
import './PreviewComponent.css'

const props = defineProps<{
  parsedSpec: object | null
  validationError: string | null
  errorLine: number | null
}>()

const containerRef = ref<HTMLElement | null>(null)

function renderSwagger(spec: object) {
  if (!containerRef.value) return
  containerRef.value.innerHTML = ''
  const inner = document.createElement('div')
  inner.id = 'swagger-preview-inner'
  inner.style.height = '100%'
  containerRef.value.appendChild(inner)
  SwaggerUIBundle({
    spec,
    dom_id: '#swagger-preview-inner',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset,
    ],
    layout: 'StandaloneLayout',
  })
}


watch(
  () => props.parsedSpec,
  async (spec) => {
    if (!spec) return
    await nextTick()
    if (containerRef.value) renderSwagger(spec)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (containerRef.value) containerRef.value.innerHTML = ''
})
</script>

<template>
  <div class="preview-wrapper">
    <div
      v-if="validationError"
      class="preview-error"
    >
      <div class="preview-error-title">Ошибка парсинга спецификации</div>
      <div class="preview-error-message">{{ validationError }}</div>
      <div v-if="errorLine" class="preview-error-line">
        Строка: {{ errorLine }}
      </div>
    </div>
    <div
      v-else
      id="swagger-preview-container"
      ref="containerRef"
    />
  </div>
</template>
