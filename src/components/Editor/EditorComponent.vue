<script setup lang="ts">
import { computed, watch, onBeforeUnmount } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import type * as Monaco from 'monaco-editor'
import type { SpecFormat } from '@/utils/converters'
import './EditorComponent.css'

const props = defineProps<{
  modelValue: string
  format: SpecFormat
  errorLine: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

let monacoInstance: typeof Monaco | null = null
let editorInstance: Monaco.editor.IStandaloneCodeEditor | null = null

const language = computed(() => (props.format === 'yaml' ? 'yaml' : 'json'))

const editorOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 14,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  padding: { top: 8 },
}

function onEditorMount(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
  editorInstance = editor
  monacoInstance = monaco
  updateMarkers()
}

function updateMarkers() {
  if (!monacoInstance || !editorInstance) return
  const model = editorInstance.getModel()
  if (!model) return
  const line = props.errorLine ?? 0
  if (line > 0) {
    monacoInstance.editor.setModelMarkers(model, 'validator', [
      {
        severity: monacoInstance.MarkerSeverity.Error,
        message: 'Ошибка валидации',
        startLineNumber: line,
        startColumn: 1,
        endLineNumber: line,
        endColumn: model.getLineMaxColumn(line),
      },
    ])
  } else {
    monacoInstance.editor.setModelMarkers(model, 'validator', [])
  }
}

watch(
  () => props.errorLine,
  () => updateMarkers(),
  { immediate: true }
)

onBeforeUnmount(() => {
  if (monacoInstance && editorInstance) {
    const model = editorInstance.getModel()
    if (model) monacoInstance.editor.setModelMarkers(model, 'validator', [])
  }
  editorInstance = null
  monacoInstance = null
})
</script>

<template>
  <div class="editor-wrapper">
    <VueMonacoEditor
      :value="modelValue"
      :language="language"
      theme="vs"
      :options="editorOptions"
      height="100%"
      @update:value="emit('update:modelValue', $event ?? '')"
      @mount="onEditorMount"
    />
  </div>
</template>
