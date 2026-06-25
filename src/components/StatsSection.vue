<template>
  <div class="number-part" id="stats" ref="statsRef">
    <div class="stat-item">
      <div class="icon-number">
        <img src="/images/icons/calendar-icon.webp" loading="lazy" alt="Calendar icon" class="stat-icon">
        <div class="separator-icon-number"></div>
        <span class="plus-sign">+ </span>
        <p class="stat-number">{{ displayedEvents }}</p>
      </div>
      <p class="stat-label">
        <span class="first-word">{{ t('events-color') }}</span>
        <span> {{ t('events-subtitle') }}</span>
      </p>
    </div>

    <div class="stat-separator"></div>

    <div class="stat-item">
      <div class="icon-number">
        <img src="/images/icons/person-icon.webp" loading="lazy" alt="Person icon" class="stat-icon">
        <div class="separator-icon-number"></div>
        <p class="stat-number">{{ displayedAttendees }}</p>
      </div>
      <p class="stat-label">
        <span class="first-word">{{ t('attendees-color') }}</span>
        <span> {{ t('attendees-subtitle') }}</span>
      </p>
    </div>

    <div class="stat-separator"></div>

    <div class="stat-item">
      <div class="icon-number">
        <img src="/images/icons/clock-icon.webp" loading="lazy" alt="Clock icon" class="stat-icon">
        <div class="separator-icon-number"></div>
        <span class="plus-sign">+ </span>
        <p class="stat-number">{{ displayedYears }}</p>
      </div>
      <p class="stat-label">
        <span class="first-word">{{ t('years-color') }}</span>
        <span> {{ t('years-subtitle') }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { t } = useLanguage()

const statsRef = ref(null)
const displayedEvents = ref(0)
const displayedAttendees = ref(0)
const displayedYears = ref(0)
let animationStarted = false

function animateCounter(setter, target, duration = 1000) {
  const start = performance.now()
  function animate(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    setter(Math.floor(easeOut * target))
    if (progress < 1) requestAnimationFrame(animate)
    else setter(target)
  }
  requestAnimationFrame(animate)
}

onMounted(() => {
  if (!statsRef.value) return
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animationStarted) {
      animationStarted = true
      animateCounter(v => displayedEvents.value = v, 20)
      animateCounter(v => displayedAttendees.value = v, 4000)
      animateCounter(v => displayedYears.value = v, 4)
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' })
  observer.observe(statsRef.value)
})
</script>
