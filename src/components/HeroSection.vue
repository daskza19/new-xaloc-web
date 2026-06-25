<template>
  <section class="hero">
    <video class="hero-background" autoplay loop muted playsinline>
      <source src="/images/hero/hero_background_original.webm" type="video/webm">
    </video>
    <div ref="lottieRef" class="xaloc-logo"></div>
    <div class="hero-tagline">
      <p class="hero-tagline-text">
        <span>{{ t('hero-tagline-1') }}</span>
        <span class="sparkle-word" ref="sparkleWordRef">{{ t('hero-tagline-sparkle') }}</span>,
      </p>
      <p class="hero-tagline-text">
        <span>{{ t('hero-tagline-2') }}</span>
      </p>
    </div>

    <svg viewBox="0 0 2500 1600" xmlns="http://www.w3.org/2000/svg" class="first-text-effect">
      <path id="sv-curve1" d="M 0 0 C 0 0 347.633 707.969 1210.899 822.158 C 2074.165 936.346 2476.109 1607.775 2476.109 1607.775" fill="transparent"/>
      <text><textPath id="text-path1" ref="path1Ref" href="#sv-curve1" startOffset="10">XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS</textPath></text>
    </svg>
    <svg viewBox="0 0 2500 1600" xmlns="http://www.w3.org/2000/svg" class="second-text-effect">
      <path id="sv-curve2" d="M 0 0 C 0 0 347.633 707.969 1210.899 822.158 C 2074.165 936.346 2476.109 1607.775 2476.109 1607.775" fill="transparent"/>
      <text><textPath id="text-path2" ref="path2Ref" href="#sv-curve2" startOffset="10">XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS</textPath></text>
    </svg>
    <svg viewBox="0 0 2363 984" xmlns="http://www.w3.org/2000/svg" class="third-text-effect">
      <path id="sv-curve3" d="M 0 0 C 0 0 306.025 443.052 931.779 443.052 C 1557.532 443.052 2142.178 644.023 2361.42 982.022" fill="transparent"/>
      <text><textPath id="text-path3" ref="path3Ref" href="#sv-curve3" startOffset="10">XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS</textPath></text>
    </svg>
    <svg viewBox="0 0 1124 2198" xmlns="http://www.w3.org/2000/svg" class="fourth-text-effect">
      <path id="sv-curve4" d="M 64.446 0.507 C 64.446 0.507 1005.36 -11.643 1114.981 997.008 C 1224.602 2005.659 160.364 2188.361 0.5 2197.496" fill="transparent"/>
      <text><textPath id="text-path4" ref="path4Ref" href="#sv-curve4" startOffset="10">XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS</textPath></text>
    </svg>
    <svg viewBox="0 0 1124 2198" xmlns="http://www.w3.org/2000/svg" class="fifth-text-effect">
      <path id="sv-curve5" d="M 64.446 0.507 C 64.446 0.507 1005.36 -11.643 1114.981 997.008 C 1224.602 2005.659 160.364 2188.361 0.5 2197.496" fill="transparent"/>
      <text><textPath id="text-path5" ref="path5Ref" href="#sv-curve5" startOffset="10">XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS · XALOC EVENTS</textPath></text>
    </svg>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import lottie from 'lottie-web'
import { useLanguage } from '../composables/useLanguage.js'

const { t, currentLanguage } = useLanguage()

const lottieRef = ref(null)
let lottieInstance = null

const sparkleWordRef = ref(null)
const path1Ref = ref(null)
const path2Ref = ref(null)
const path3Ref = ref(null)
const path4Ref = ref(null)
const path5Ref = ref(null)

// SVG text animation
const speed = 0.15
const offsets = [-100, -100, -100, -100, -100]
let isVisible = true
let animationId = null

function animateText() {
  if (!isVisible) { animationId = null; return }
  const paths = [path1Ref.value, path2Ref.value, path3Ref.value, path4Ref.value, path5Ref.value]
  paths.forEach((el, i) => {
    if (!el) return
    offsets[i] += speed
    if (offsets[i] >= 0) offsets[i] = -100
    el.setAttribute('startOffset', offsets[i] + '%')
  })
  animationId = requestAnimationFrame(animateText)
}

// Sparkle effect
function initSparkle() {
  const word = sparkleWordRef.value
  if (!word) return
  const existing = word.querySelector('.sparkle-container')
  if (existing) existing.remove()

  const container = document.createElement('div')
  container.className = 'sparkle-container'
  container.style.cssText = 'position:absolute;z-index:1000;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:visible;'
  word.style.position = 'relative'
  word.appendChild(container)

  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div')
    star.className = 'sparkle-star'
    star.style.backgroundImage = "url('/images/effects/star.webp')"
    star.style.backgroundSize = 'contain'
    star.style.backgroundRepeat = 'no-repeat'
    star.style.backgroundPosition = 'center'
    star.style.position = 'absolute'
    star.style.left = `${Math.random() * 85 - 5}%`
    star.style.top = `${Math.random() * 100 - 20}%`
    const size = 12 + Math.random() * 13
    star.style.width = `${size}px`
    star.style.height = `${size}px`
    const duration = 2 + Math.random() * 2
    const delay = -duration + Math.random() * duration * 2
    star.style.setProperty('--duration', `${duration}s`)
    star.style.setProperty('--delay', `${delay}s`)
    star.style.setProperty('--max-opacity', 0.4 + Math.random() * 0.5)
    container.appendChild(star)
  }
}

onMounted(() => {
  if (lottieRef.value) {
    lottieInstance = lottie.loadAnimation({
      container: lottieRef.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/images/hero/xaloc_logo.json',
    })
  }

  const heroSection = document.querySelector('.hero')
  if (heroSection) {
    const observer = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting
      if (isVisible && !animationId) animationId = requestAnimationFrame(animateText)
    }, { threshold: 0 })
    observer.observe(heroSection)
  }
  animationId = requestAnimationFrame(animateText)
  setTimeout(initSparkle, 500)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (lottieInstance) lottieInstance.destroy()
})

watch(currentLanguage, () => {
  setTimeout(initSparkle, 100)
})
</script>
