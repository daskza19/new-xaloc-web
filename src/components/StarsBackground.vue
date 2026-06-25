<template>
  <div class="stars-container" ref="containerRef"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const containerRef = ref(null)

onMounted(() => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const config = {
    numStars: isMobile ? 20 : 50,
    minSize: 0.3,
    maxSize: 2,
    minDuration: 2,
    maxDuration: 5,
    minOpacity: 0.1,
    maxOpacity: 0.4,
  }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  for (let i = 0; i < config.numStars; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.backgroundImage = "url('/images/effects/star.webp')"
    star.style.left = `${randomInRange(0, 100)}%`
    star.style.top = `${randomInRange(0, 100)}%`
    const sizeVh = randomInRange(config.minSize, config.maxSize)
    star.style.width = `${sizeVh}vh`
    star.style.height = `${sizeVh}vh`
    const duration = randomInRange(config.minDuration, config.maxDuration)
    star.style.setProperty('--duration', `${duration}s`)
    star.style.setProperty('--delay', `${randomInRange(0, duration)}s`)
    star.style.setProperty('--max-opacity', randomInRange(config.minOpacity, config.maxOpacity))
    containerRef.value.appendChild(star)
  }
})
</script>
