<script setup lang="ts">
import { ref } from 'vue'
import type { SpecFormat } from '@/utils/converters'
import { yamlToJson, jsonToYaml } from '@/utils/converters'
import { DEFAULT_SPEC_YAML } from '@/constants/defaultSpec'
import './ToolbarComponent.css'

const props = withDefaults(
  defineProps<{
    specText: string
    format: SpecFormat
    unsaved?: boolean
  }>(),
  { unsaved: false }
)

const emit = defineEmits<{
  'update:specText': [value: string]
  'update:format': [value: SpecFormat]
  loadFile: [content: string, format: SpecFormat]
  reset: []
  toggleFullscreen: []
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const loading = ref(false)

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  loading.value = true
  const reader = new FileReader()
  reader.onload = () => {
    const content = String(reader.result ?? '')
    const ext = (file.name.split('.').pop() ?? '').toLowerCase()
    let format: SpecFormat = 'yaml'
    if (ext === 'json') format = 'json'
    else if (ext === 'yaml' || ext === 'yml') format = 'yaml'
    else if (content.trimStart().startsWith('{')) format = 'json'
    emit('update:specText', content)
    emit('update:format', format)
    emit('loadFile', content, format)
    loading.value = false
  }
  reader.onerror = () => {
    loading.value = false
  }
  reader.readAsText(file)
  input.value = ''
}

function downloadYaml() {
  try {
    const yaml =
      props.format === 'yaml' ? props.specText : jsonToYaml(props.specText)
    const blob = new Blob([yaml], { type: 'application/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spec.yaml'
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert((e as Error).message)
  }
}

function downloadJson() {
  try {
    const json =
      props.format === 'json' ? props.specText : yamlToJson(props.specText)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spec.json'
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert((e as Error).message)
  }
}

function toggleFormat() {
  try {
    if (props.format === 'yaml') {
      emit('update:specText', yamlToJson(props.specText))
      emit('update:format', 'json')
    } else {
      emit('update:specText', jsonToYaml(props.specText))
      emit('update:format', 'yaml')
    }
  } catch (e) {
    alert((e as Error).message)
  }
}

function reset() {
  emit('update:specText', DEFAULT_SPEC_YAML)
  emit('update:format', 'yaml')
  emit('reset')
}

function toggleFullscreen() {
  emit('toggleFullscreen')
}
</script>

<template>
  <div class="toolbar">
    <input
      ref="fileInputRef"
      type="file"
      accept=".yaml,.yml,.json"
      @change="onFileSelect"
    />
    <div class="toolbar-group">
      <button
        type="button"
        class="toolbar-btn primary"
        :disabled="loading"
        @click="triggerFileSelect"
      >
        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
        <i v-else class="fa-solid fa-upload"></i>
        <span>{{ loading ? 'Загрузка...' : 'Загрузить' }}</span>
      </button>
    </div>
    <div class="toolbar-separator" />
    <div class="toolbar-group">
      <button type="button" class="toolbar-btn" @click="downloadYaml">
        <i class="fa-solid fa-download"></i>
        <span>YAML</span>
      </button>
      <button type="button" class="toolbar-btn" @click="downloadJson">
        <i class="fa-solid fa-download"></i>
        <span>JSON</span>
      </button>
    </div>
    <div class="toolbar-separator" />
    <div class="toolbar-group">
      <button type="button" class="toolbar-btn" @click="toggleFormat">
        <i class="fa-solid fa-arrows-left-right"></i>
        <span>{{ format === 'yaml' ? 'YAML → JSON' : 'JSON → YAML' }}</span>
      </button>
      <button type="button" class="toolbar-btn" @click="reset">
        <i class="fa-solid fa-rotate-left"></i>
        <span>Сбросить</span>
      </button>
    </div>
    <div class="toolbar-separator" />
    <div class="toolbar-group">
      <button type="button" class="toolbar-btn" @click="toggleFullscreen">
        <i class="fa-solid fa-expand"></i>
        <span>Полный экран</span>
      </button>
    </div>
    <div v-if="unsaved" class="toolbar-unsaved">
      <span class="dot" />
      <span>Не сохранено</span>
    </div>
  </div>
</template>
