<template>
  <section class="typing-section">
    <div class="typing-general">
      <p>
        <span>{{ t('hero-subtitle') }}</span>
        <span class="typing-wrapper" :style="{ width: wrapperWidth }">
          <span class="typing" ref="typingRef">{{ currentWord }}</span>
        </span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { t, typingWords } = useLanguage()

const typingRef = ref(null)
const currentWord = ref('')
const wrapperWidth = ref('auto')
let wordIndex = 0
let timeout1 = null
let timeout2 = null

const TYPING_MS = 1000
const DISPLAY_MS = 2000
const ERASE_MS = 500

function measureWord(word) {
  const span = document.createElement('span')
  span.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap;'
  if (typingRef.value) {
    span.style.font = window.getComputedStyle(typingRef.value).font
  }
  span.textContent = word
  document.body.appendChild(span)
  const w = span.offsetWidth
  document.body.removeChild(span)
  return w
}

function changeWord() {
  const words = typingWords.value
  if (!words.length || !typingRef.value) return

  const word = words[wordIndex]
  currentWord.value = word
  wrapperWidth.value = (measureWord(word) + 10) + 'px'

  const el = typingRef.value
  el.style.animation = 'none'
  el.style.maxWidth = '0'
  void el.offsetWidth
  el.style.animation = `typing ${TYPING_MS}ms steps(30, end) forwards, blink 1s step-end infinite`

  timeout1 = setTimeout(() => {
    el.style.animation = `erasing ${ERASE_MS}ms steps(30, end) forwards, blink 1s step-end infinite`
    timeout2 = setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length
      changeWord()
    }, ERASE_MS)
  }, TYPING_MS + DISPLAY_MS)
}

function restart() {
  clearTimeout(timeout1)
  clearTimeout(timeout2)
  wordIndex = 0
  changeWord()
}

onMounted(() => {
  changeWord()
})

onUnmounted(() => {
  clearTimeout(timeout1)
  clearTimeout(timeout2)
})

watch(typingWords, () => {
  restart()
})
</script>
