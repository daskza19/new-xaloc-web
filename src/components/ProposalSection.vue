<template>
  <div class="proposal-part" ref="proposalRef">
    <div class="proposal-sticky-container">
      <div class="proposal-slideshow-mask">
        <div class="proposal-slideshow">
          <img
            v-for="(src, i) in slides"
            :key="i"
            :src="src"
            :alt="`Proposal ${i + 1}`"
            class="proposal-slide"
            :class="{ active: i === currentSlide }"
            loading="lazy"
          >
        </div>
      </div>
      <div class="proposal-content">
        <h2>{{ t('proposal-title') }}</h2>
        <p class="proposal-subtitle">
          <span
            v-for="(word, i) in subtitleWords"
            :key="`${currentLanguage}-${i}`"
            class="scroll-word"
            :class="{ active: i === activeWordIndex, past: i < activeWordIndex }"
          >{{ word }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { t, currentLanguage } = useLanguage()

const proposalRef = ref(null)
const currentSlide = ref(0)
const scrollProgress = ref(0)

const BASE = import.meta.env.BASE_URL
const slides = [
  `${BASE}images/proposal/proposal-01.webp`,
  `${BASE}images/proposal/proposal-02.webp`,
  `${BASE}images/proposal/proposal-03.webp`,
  `${BASE}images/proposal/proposal-04.webp`,
  `${BASE}images/proposal/proposal-05.webp`,
]

const subtitleWords = computed(() => t('proposal-subtitle').split(' '))

const activeWordIndex = computed(() => {
  const n = subtitleWords.value.length
  return Math.min(Math.floor(scrollProgress.value * n), n - 1)
})

let slideInterval = null
let rafId = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function updateScroll() {
  if (!proposalRef.value) return
  const rect = proposalRef.value.getBoundingClientRect()
  const scrollDistance = rect.height - window.innerHeight
  if (scrollDistance <= 0) return
  const scrolled = -rect.top
  scrollProgress.value = Math.max(0, Math.min(1, scrolled / scrollDistance))
}

function onScroll() {
  if (rafId !== null) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    updateScroll()
    rafId = null
  })
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', updateScroll, { passive: true })
  updateScroll()
})

onUnmounted(() => {
  clearInterval(slideInterval)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateScroll)
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>
