<script setup lang="ts">
import { ref, computed } from 'vue'
import ToolbarComponent from '@/components/Toolbar/ToolbarComponent.vue'
import SplitPaneComponent from '@/components/SplitPane/SplitPaneComponent.vue'
import EditorComponent from '@/components/Editor/EditorComponent.vue'
import PreviewComponent from '@/components/Preview/PreviewComponent.vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useOpenApiValidator } from '@/composables/useOpenApiValidator'
import { DEFAULT_SPEC_YAML } from '@/constants/defaultSpec'
import type { SpecFormat } from '@/utils/converters'
import './App.css'

const specText = useLocalStorage<string>('swagger-editor-spec', DEFAULT_SPEC_YAML, {
  debounce: 400,
})
const format = useLocalStorage<SpecFormat>('swagger-editor-format', 'yaml')

const { parsedSpec, validationError, lineNumber } = useOpenApiValidator(
  specText,
  format,
  300
)

const isFullscreen = ref(false)
const lastSavedSpec = ref(specText.value)

const unsaved = computed(() => specText.value !== lastSavedSpec.value)

const specTextModel = computed({
  get: () => specText.value,
  set: (v: string) => { specText.value = v },
})
const formatModel = computed({
  get: () => format.value,
  set: (v: SpecFormat) => { format.value = v },
})

function onLoadFile() {
  lastSavedSpec.value = specText.value
}

function onReset() {
  lastSavedSpec.value = specText.value
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

function onDropOrLoad() {
  lastSavedSpec.value = specText.value
}

function onDrop(e: DragEvent) {
  const f = e.dataTransfer?.files?.[0]
  if (!f || !/\.(yaml|yml|json)$/i.test(f.name)) return
  const reader = new FileReader()
  reader.onload = () => {
    specText.value = String(reader.result ?? '')
    format.value = f.name.toLowerCase().endsWith('.json') ? 'json' : 'yaml'
    onDropOrLoad()
  }
  reader.readAsText(f)
}
</script>

<template>
  <div
    class="app"
    :class="{ 'app--fullscreen': isFullscreen }"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <ToolbarComponent
      v-model:spec-text="specTextModel"
      v-model:format="formatModel"
      :unsaved="unsaved"
      @load-file="onLoadFile"
      @reset="onReset"
      @toggle-fullscreen="toggleFullscreen"
    />
    <div class="main-content">
      <div class="split-panes">
        <SplitPaneComponent>
          <template #left>
            <EditorComponent
              v-model="specTextModel"
              :format="formatModel"
              :error-line="lineNumber ?? null"
            />
          </template>
          <template #right>
            <PreviewComponent
              :parsed-spec="parsedSpec"
              :validation-error="validationError"
              :error-line="lineNumber"
            />
          </template>
        </SplitPaneComponent>
      </div>
    </div>
  </div>
</template>
