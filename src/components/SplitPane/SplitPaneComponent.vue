<script setup lang="ts">
import { computed } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import { useLocalStorage } from '@/composables/useLocalStorage'
import 'splitpanes/dist/splitpanes.css'
import './SplitPaneComponent.css'

const STORAGE_KEY = 'swagger-editor-pane-sizes'
const DEFAULT_SIZES: [number, number] = [50, 50]

const paneSizes = useLocalStorage<[number, number]>(STORAGE_KEY, DEFAULT_SIZES)

const leftSize = computed(() => {
  const arr = paneSizes.value
  if (!Array.isArray(arr) || arr.length < 2) return 50
  const n = Number(arr[0])
  return Number.isFinite(n) && n >= 25 && n <= 75 ? n : 50
})
const rightSize = computed(() => {
  const arr = paneSizes.value
  if (!Array.isArray(arr) || arr.length < 2) return 50
  const n = Number(arr[1])
  return Number.isFinite(n) && n >= 25 && n <= 75 ? n : 50
})

function onResized(payload: { panes?: Array<{ size: number }> }) {
  const panes = payload.panes
  const s0 = panes?.[0]?.size
  const s1 = panes?.[1]?.size
  if (s0 != null && s1 != null) {
    paneSizes.value = [
      Math.round(s0 * 10) / 10,
      Math.round(s1 * 10) / 10,
    ]
  }
}
</script>

<template>
  <div class="split-panes-wrapper">
    <!-- horizontal=false → две вертикальные колонки (слева редактор, справа превью) -->
    <Splitpanes
      :horizontal="false"
      class="split-panes-full-width"
      @resized="onResized"
    >
      <Pane :min-size="25" :size="leftSize" class="pane-content">
        <slot name="left" />
      </Pane>
      <Pane :min-size="25" :size="rightSize" class="pane-content">
        <slot name="right" />
      </Pane>
    </Splitpanes>
  </div>
</template>
