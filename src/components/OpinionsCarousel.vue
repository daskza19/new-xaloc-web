<template>
  <div class="opinions-part">
    <div
      class="opinion-carousel-container"
      ref="carouselRef"
      @mousedown="onMouseDown"
      @touchstart.passive="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        v-for="(opinion, i) in opinions"
        :key="i"
        class="opinion-card"
        :class="{
          active: i === currentIndex,
          prev: i === prevIndex,
          next: i === nextIndex
        }"
      >
        <div class="person-column">
          <img :src="`/images/opinions/person-${i + 1}.webp`" loading="lazy" :alt="`Foto de cliente ${i + 1}`" class="client-photo">
        </div>
        <div class="opinion-column">
          <div class="opinion-stars">
            <img v-for="s in 5" :key="s" src="/images/opinions/star.webp" loading="lazy" alt="Estrella" class="star-icon">
          </div>
          <p class="client-name">{{ opinion.name }}</p>
          <p class="client-opinion">{{ t(opinion.key) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { t } = useLanguage()

const opinions = [
  { name: 'Rubén Doblas', key: 'client-opinion-1' },
  { name: 'Guillermo Díaz', key: 'client-opinion-2' },
  { name: 'Samuel de Luque', key: 'client-opinion-3' },
  { name: 'David Cánovas', key: 'client-opinion-4' },
  { name: 'Ibai Llanos', key: 'client-opinion-5' },
]

const carouselRef = ref(null)
const currentIndex = ref(0)

const prevIndex = computed(() => (currentIndex.value - 1 + opinions.length) % opinions.length)
const nextIndex = computed(() => (currentIndex.value + 1) % opinions.length)

let autoPlayInterval = null
let isDragging = false
let startX = 0
let startY = 0
let currentX = 0
let currentY = 0
const THRESHOLD = 50

function goTo(index) {
  currentIndex.value = (index + opinions.length) % opinions.length
}
function goNext() { goTo(currentIndex.value + 1) }
function goPrev() { goTo(currentIndex.value - 1) }

function resetAutoPlay() {
  clearInterval(autoPlayInterval)
  autoPlayInterval = setInterval(goNext, 4000)
}

function isWithinActiveCard(x, y) {
  const card = carouselRef.value?.querySelector('.opinion-card.active')
  if (!card) return false
  const rect = card.getBoundingClientRect()
  const m = -window.innerHeight * 0.05
  return x >= rect.left - m && x <= rect.right + m && y >= rect.top - m && y <= rect.bottom + m
}

function applyDrag(offsetX, offsetY) {
  const card = carouselRef.value?.querySelector('.opinion-card.active')
  if (!card || !isDragging) return
  card.style.transform = `scale(1) translateX(${offsetX}px) translateY(${offsetY}px)`
  card.style.transition = 'none'
}

function resetDrag() {
  const card = carouselRef.value?.querySelector('.opinion-card.active')
  if (card) { card.style.transform = ''; card.style.transition = '' }
}

function handleSwipeEnd(deltaX, deltaY) {
  resetDrag()
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > THRESHOLD) { goPrev(); resetAutoPlay() }
    else if (deltaX < -THRESHOLD) { goNext(); resetAutoPlay() }
  } else {
    if (deltaY > THRESHOLD) { goPrev(); resetAutoPlay() }
    else if (deltaY < -THRESHOLD) { goNext(); resetAutoPlay() }
  }
  isDragging = false
}

function onMouseDown(e) {
  if (!isWithinActiveCard(e.clientX, e.clientY)) return
  isDragging = true
  startX = e.clientX; startY = e.clientY
  currentX = startX; currentY = startY
  if (carouselRef.value) carouselRef.value.style.cursor = 'grabbing'
  e.preventDefault()
}

function onMouseMove(e) {
  if (!isDragging) return
  currentX = e.clientX; currentY = e.clientY
  applyDrag(currentX - startX, currentY - startY)
}

function onMouseUp(e) {
  if (!isDragging) return
  if (carouselRef.value) carouselRef.value.style.cursor = 'grab'
  handleSwipeEnd(currentX - startX, currentY - startY)
}

function onTouchStart(e) {
  if (!isWithinActiveCard(e.touches[0].clientX, e.touches[0].clientY)) return
  isDragging = true
  startX = e.touches[0].clientX; startY = e.touches[0].clientY
  currentX = startX; currentY = startY
}

function onTouchMove(e) {
  if (!isDragging) return
  currentX = e.touches[0].clientX; currentY = e.touches[0].clientY
  const dx = currentX - startX; const dy = currentY - startY
  if (Math.abs(dx) > 10 || Math.abs(dy) > 10) applyDrag(dx, dy)
}

function onTouchEnd() {
  if (!isDragging) return
  handleSwipeEnd(currentX - startX, currentY - startY)
}

onMounted(() => {
  if (carouselRef.value) carouselRef.value.style.cursor = 'grab'
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  resetAutoPlay()
})

onUnmounted(() => {
  clearInterval(autoPlayInterval)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>
