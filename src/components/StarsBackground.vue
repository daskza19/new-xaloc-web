<template></template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let container = null

onMounted(() => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const config = {
    numStars: isMobile ? 50 : 120,
    minSize: 0.3,
    maxSize: 2,
    minDuration: 2,
    maxDuration: 5,
    minOpacity: 0.4,
    maxOpacity: 0.9,
  }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  container = document.createElement('div')
  container.className = 'stars-container'
  document.body.insertBefore(container, document.body.firstChild)

  const appEl = document.getElementById('app')
  const target = appEl || document.body

  function updateHeight() {
    container.style.height = target.offsetHeight + 'px'
  }
  updateHeight()

  const ro = new ResizeObserver(updateHeight)
  ro.observe(target)
  container._cleanupResize = () => ro.disconnect()

  for (let i = 0; i < config.numStars; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.backgroundImage = `url('${import.meta.env.BASE_URL}images/effects/star.webp')`
    star.style.left = `${randomInRange(0, 100)}%`
    star.style.top = `${randomInRange(0, 100)}%`
    const sizeVh = randomInRange(config.minSize, config.maxSize)
    star.style.width = `${sizeVh}vh`
    star.style.height = `${sizeVh}vh`
    const duration = randomInRange(config.minDuration, config.maxDuration)
    star.style.setProperty('--duration', `${duration}s`)
    star.style.setProperty('--delay', `${randomInRange(0, duration)}s`)
    star.style.setProperty('--max-opacity', randomInRange(config.minOpacity, config.maxOpacity))
    container.appendChild(star)
  }
})

onUnmounted(() => {
  if (container) {
    if (container._cleanupResize) container._cleanupResize()
    if (container.parentNode) container.parentNode.removeChild(container)
  }
})
</script>
