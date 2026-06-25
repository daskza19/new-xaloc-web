<template>
  <section class="gallery-section" id="gallery">
    <div class="gallery-header">
      <img src="/images/effects/effect_04.webp" alt="Effect 4" class="effect-4">
      <h2 class="gallery-title">{{ t('nav-gallery') }}</h2>
    </div>

    <!-- Empty -->
    <div v-if="galleries.length === 0" class="gallery-error">
      <p class="gallery-error-text">{{ t('gallery-no-albums') }}</p>
    </div>

    <!-- Folders -->
    <template v-else>
      <div class="folders-carousel">
        <div
          v-for="(gallery, index) in galleries"
          :key="gallery.id"
          class="folder-card"
          :class="{
            'hidden-folder': isVertical && !showAll && index >= maxVisible && galleries.length >= minForShowMore,
            'fade-folder':   isVertical && !showAll && index === 3 && galleries.length >= minForShowMore
          }"
          @click="openAlbum(gallery)"
        >
          <div
            class="folder-icon"
            :class="{ 'has-logo': gallery.logo }"
            :style="gallery.logo ? `background-image:url('${gallery.logo}');background-size:contain;background-position:center;background-repeat:no-repeat;` : ''"
          >
            <svg v-if="!gallery.logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
          </div>
          <p v-if="!gallery.logo" class="folder-name">{{ gallery.title }}</p>
          <p v-if="gallery.photoCount > 0" class="folder-count" :class="{ 'no-logo': !gallery.logo }">
            {{ gallery.photoCount }} <span>{{ t('gallery-photos') }}</span>
          </p>
          <p v-else class="folder-count folder-count--soon" :class="{ 'no-logo': !gallery.logo }">
            {{ t('gallery-photos-soon') }}
          </p>
        </div>
      </div>

      <div
        v-if="isVertical && !showAll && galleries.length >= minForShowMore"
        class="show-more-container"
      >
        <button class="show-more-btn" @click="showAll = true">{{ t('gallery-show-more') }}</button>
      </div>
    </template>

    <!-- Album panel -->
    <div class="album-backdrop" :class="{ active: albumOpen }" @click.self="closeAlbum">
      <div class="album-panel-overlay" :class="{ active: albumOpen }">
        <div class="album-header">
          <button class="album-back-btn" @click="closeAlbum" aria-label="Cerrar álbum">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="album-header-center">
            <div class="album-logo" :class="{ 'has-logo': currentGallery?.logo }">
              <img v-if="currentGallery?.logo" :src="currentGallery.logo" :alt="currentGallery.title">
            </div>
            <h2 v-if="!currentGallery?.logo" class="album-title">{{ currentGallery?.title }}</h2>
          </div>
        </div>
        <div class="album-panel">
          <div v-if="currentGallery?.images.length === 0" class="gallery-photos-soon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="gallery-photos-soon-icon">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h3l-4 4-4-4h3V8h2v4z" fill-rule="nonzero"/>
            </svg>
            <p>{{ t('gallery-photos-soon') }}</p>
          </div>
          <div v-else class="photo-grid">
            <div
              v-for="(src, i) in currentGallery?.images"
              :key="src"
              class="photo-item"
              @click="openViewer(i)"
            >
              <img :src="src" :alt="`Foto ${i + 1}`" loading="lazy">
              <div class="photo-item-overlay">
                <p class="photo-item-name">{{ filename(src) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo viewer -->
    <div class="photo-viewer-overlay" :class="{ active: viewerOpen }" @click.self="closeViewer">
      <div class="photo-viewer">
        <div class="photo-viewer-header">
          <button class="album-back-btn" @click="closeViewer" aria-label="Cerrar visor">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h3 class="photo-viewer-title">{{ filename(photos[currentPhotoIndex] || '') }}</h3>
          <div class="photo-viewer-actions"></div>
        </div>

        <div class="photo-viewer-content">
          <button
            class="photo-nav-btn photo-nav-prev"
            @click.stop="prevPhoto"
            :style="{ opacity: currentPhotoIndex === 0 ? '0.3' : '1', pointerEvents: currentPhotoIndex === 0 ? 'none' : 'auto' }"
            aria-label="Foto anterior"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div
            class="photo-carousel"
            ref="carouselRef"
            @mousedown="onMouseDown"
            @touchstart.passive="onTouchStart"
            @touchmove.prevent="onTouchMove"
            @touchend="onTouchEnd"
          >
            <div class="photo-carousel-track" ref="trackRef">
              <div v-for="(src, i) in photos" :key="src" class="carousel-slide">
                <img
                  class="carousel-image"
                  :class="{ loaded: loadedSet.has(i) }"
                  :src="loadedSet.has(i) ? src : undefined"
                  :alt="`Foto ${i + 1}`"
                  draggable="false"
                >
                <div v-if="!loadedSet.has(i)" class="carousel-loader">
                  <div class="loading-spinner"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            class="photo-nav-btn photo-nav-next"
            @click.stop="nextPhoto"
            :style="{ opacity: currentPhotoIndex === photos.length - 1 ? '0.3' : '1', pointerEvents: currentPhotoIndex === photos.length - 1 ? 'none' : 'auto' }"
            aria-label="Siguiente foto"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="photo-viewer-download">
          <a
            class="download-btn"
            :href="photos[currentPhotoIndex]"
            :download="filename(photos[currentPhotoIndex] || '')"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ t('gallery-download') }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'
import galleriesData from 'virtual:gallery'

const { t } = useLanguage()

// Data comes from the Vite plugin — no runtime fetch needed
const galleries = ref(galleriesData)

const showAll = ref(false)
const isVertical = ref(false)
const maxVisible = 4
const minForShowMore = 4

const albumOpen = ref(false)
const currentGallery = ref(null)

const viewerOpen = ref(false)
const currentPhotoIndex = ref(0)
const loadedSet = ref(new Set())

const carouselRef = ref(null)
const trackRef = ref(null)

const photos = computed(() => currentGallery.value?.images || [])

function filename(src) {
  return decodeURIComponent(src.split('/').pop() || '')
}

// Album
function openAlbum(gallery) {
  currentGallery.value = gallery
  albumOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeAlbum() {
  albumOpen.value = false
  document.body.style.overflow = ''
}

// Viewer
function openViewer(index) {
  currentPhotoIndex.value = index
  viewerOpen.value = true
  loadedSet.value = new Set()
  nextTick(() => {
    updateCarousel(false)
    loadNearby(index)
  })
}

function closeViewer() {
  viewerOpen.value = false
  if (trackRef.value) trackRef.value.style.transform = ''
}

function updateCarousel(animate = true) {
  if (!trackRef.value) return
  trackRef.value.style.transition = animate ? 'transform 0.3s ease-out' : 'none'
  trackRef.value.style.transform = `translateX(${-currentPhotoIndex.value * 100}%)`
}

function loadNearby(index) {
  const imgs = photos.value
  ;[index - 1, index, index + 1].filter(i => i >= 0 && i < imgs.length).forEach(i => {
    if (loadedSet.value.has(i)) return
    const img = new Image()
    img.onload = () => {
      const next = new Set(loadedSet.value)
      next.add(i)
      loadedSet.value = next
    }
    img.src = imgs[i]
  })
}

function prevPhoto() {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    updateCarousel(true)
    loadNearby(currentPhotoIndex.value)
  }
}

function nextPhoto() {
  if (currentPhotoIndex.value < photos.value.length - 1) {
    currentPhotoIndex.value++
    updateCarousel(true)
    loadNearby(currentPhotoIndex.value)
  }
}

// Swipe / drag
let swipeStartX = 0, swipeStartY = 0, swipeEndX = 0, isSwiping = false

function startSwipe(x, y) {
  swipeStartX = x; swipeStartY = y; swipeEndX = x; isSwiping = true
  if (trackRef.value) trackRef.value.style.transition = 'none'
}

function moveSwipe(x, y) {
  if (!isSwiping || !carouselRef.value || !trackRef.value) return
  swipeEndX = x
  const diffX = swipeStartX - x
  const diffY = Math.abs(swipeStartY - y)
  if (Math.abs(diffX) <= diffY) return
  const base = -currentPhotoIndex.value * 100
  let offset = base + (-diffX / carouselRef.value.offsetWidth) * 100
  const min = -(photos.value.length - 1) * 100
  if (offset > 0) offset *= 0.3
  if (offset < min) offset = min + (offset - min) * 0.3
  trackRef.value.style.transform = `translateX(${offset}%)`
}

function endSwipe() {
  if (!isSwiping) return
  isSwiping = false
  const diff = swipeStartX - swipeEndX
  if (Math.abs(diff) > 50) { diff > 0 ? nextPhoto() : prevPhoto() }
  else updateCarousel(true)
}

function onMouseDown(e) {
  if (e.target.closest('.photo-nav-btn') || e.target.closest('.download-btn')) return
  e.preventDefault()
  startSwipe(e.clientX, e.clientY)
  if (carouselRef.value) carouselRef.value.style.cursor = 'grabbing'
}
function onGlobalMouseMove(e) { if (isSwiping) moveSwipe(e.clientX, e.clientY) }
function onGlobalMouseUp() {
  if (!isSwiping) return
  if (carouselRef.value) carouselRef.value.style.cursor = 'grab'
  endSwipe()
}

function onTouchStart(e) { startSwipe(e.touches[0].clientX, e.touches[0].clientY) }
function onTouchMove(e) { moveSwipe(e.touches[0].clientX, e.touches[0].clientY) }
function onTouchEnd() { endSwipe() }

// Keyboard
function onKeydown(e) {
  if (viewerOpen.value) {
    if (e.key === 'ArrowLeft') prevPhoto()
    else if (e.key === 'ArrowRight') nextPhoto()
    else if (e.key === 'Escape') closeViewer()
  } else if (albumOpen.value && e.key === 'Escape') {
    closeAlbum()
  }
}

function onResize() {
  isVertical.value = window.matchMedia('(max-aspect-ratio: 1/1)').matches
}

onMounted(() => {
  isVertical.value = window.matchMedia('(max-aspect-ratio: 1/1)').matches
  window.addEventListener('resize', onResize)
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('mousemove', onGlobalMouseMove)
  document.addEventListener('mouseup', onGlobalMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousemove', onGlobalMouseMove)
  document.removeEventListener('mouseup', onGlobalMouseUp)
})
</script>
