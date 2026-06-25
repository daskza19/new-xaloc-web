<template>
  <section class="gallery-section" id="gallery">
    <div class="gallery-header">
      <img src="/images/effects/effect_04.webp" alt="Effect 4" class="effect-4">
      <h2 class="gallery-title">{{ t('nav-gallery') }}</h2>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="gallery-loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ t('gallery-loading') }}</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="gallery-error">
      <div class="gallery-error-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <p class="gallery-error-text">{{ error }}</p>
    </div>

    <!-- Folders -->
    <template v-else>
      <div class="folders-carousel">
        <div
          v-for="(folder, index) in folders"
          :key="folder.id"
          class="folder-card"
          :class="{
            'hidden-folder': isVertical && !showAll && index >= maxVisible && folders.length >= minForShowMore,
            'fade-folder': isVertical && !showAll && index === 3 && folders.length >= minForShowMore
          }"
          @click="openAlbum(folder)"
        >
          <div class="folder-icon" :class="{ 'has-logo': folder.logo }" :style="folder.logo ? `background-image:url('${folder.logo.thumbnail}');background-size:contain;background-position:center;background-repeat:no-repeat;` : ''">
            <svg v-if="!folder.logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
          </div>
          <p v-if="!folder.logo" class="folder-name">{{ folder.name }}</p>
          <p class="folder-count" :class="{ 'no-logo': !folder.logo }">{{ folder.photoCount }} <span>{{ t('gallery-photos') }}</span></p>
        </div>
      </div>

      <div v-if="isVertical && !showAll && folders.length >= minForShowMore" class="show-more-container">
        <button class="show-more-btn" @click="showAll = true">{{ t('gallery-show-more') }}</button>
      </div>
    </template>

    <!-- Album panel -->
    <div class="album-backdrop" :class="{ active: albumOpen }" @click.self="closeAlbum">
      <div class="album-panel-overlay" :class="{ active: albumOpen }">
        <div class="album-header">
          <button class="album-back-btn" @click="closeAlbum" aria-label="Cerrar álbum">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="album-header-center">
            <div class="album-logo" :class="{ 'has-logo': currentFolder?.logo }">
              <img v-if="currentFolder?.logo" :src="currentFolder.logo.thumbnail" :alt="currentFolder?.name">
            </div>
            <h2 v-if="!currentFolder?.logo" class="album-title">{{ currentFolder?.name }}</h2>
          </div>
        </div>
        <div class="album-panel">
          <div class="photo-grid">
            <div v-if="loadingPhotos" class="gallery-loading" style="grid-column:1/-1">
              <div class="loading-spinner"></div>
              <p class="loading-text">{{ t('gallery-loading-photos') }}</p>
            </div>
            <template v-else>
              <div v-if="photos.length === 0" class="gallery-error-text" style="grid-column:1/-1">{{ t('gallery-no-photos') }}</div>
              <div v-for="(photo, i) in photos" :key="photo.id" class="photo-item" @click="openViewer(i)">
                <img :src="photo.thumbnail" :alt="photo.name" loading="lazy">
                <div class="photo-item-overlay"><p class="photo-item-name">{{ photo.name }}</p></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo viewer -->
    <div class="photo-viewer-overlay" :class="{ active: viewerOpen }" @click.self="closeViewer">
      <div class="photo-viewer">
        <div class="photo-viewer-header">
          <button class="album-back-btn" @click="closeViewer" aria-label="Cerrar visor">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <h3 class="photo-viewer-title">{{ photos[currentPhotoIndex]?.name }}</h3>
          <div class="photo-viewer-actions"></div>
        </div>
        <div class="photo-viewer-content">
          <button class="photo-nav-btn photo-nav-prev" @click.stop="prevPhoto" :style="{ opacity: currentPhotoIndex === 0 ? '0.3' : '1', pointerEvents: currentPhotoIndex === 0 ? 'none' : 'auto' }" aria-label="Foto anterior">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="photo-carousel" ref="carouselRef" @mousedown="onCarouselMouseDown" @touchstart.passive="onCarouselTouchStart" @touchmove.prevent="onCarouselTouchMove" @touchend="onCarouselTouchEnd">
            <div class="photo-carousel-track" ref="trackRef">
              <div v-for="(photo, i) in photos" :key="photo.id" class="carousel-slide" :data-index="i">
                <img
                  class="carousel-image"
                  :class="{ loaded: loadedImages.has(i) }"
                  :src="loadedImages.has(i) ? photo.fullSize : undefined"
                  :alt="photo.name"
                  draggable="false"
                >
                <div v-if="!loadedImages.has(i)" class="carousel-loader"><div class="loading-spinner"></div></div>
              </div>
            </div>
          </div>
          <button class="photo-nav-btn photo-nav-next" @click.stop="nextPhoto" :style="{ opacity: currentPhotoIndex === photos.length - 1 ? '0.3' : '1', pointerEvents: currentPhotoIndex === photos.length - 1 ? 'none' : 'auto' }" aria-label="Siguiente foto">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="photo-viewer-download">
          <button class="download-btn" @click.stop="downloadPhoto" :disabled="isDownloading">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>{{ isDownloading ? t('gallery-downloading') : t('gallery-download') }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { t } = useLanguage()

const API_KEY = 'AIzaSyCe-NEPXAU1tvpsCxu6Segh73LmKXcWTtY'
const ROOT_FOLDER_ID = '1-WYTmYR3m95RXYnfeoQnXdYSAPW5J7Zi'
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const folders = ref([])
const isLoading = ref(true)
const error = ref(null)
const showAll = ref(false)
const isVertical = ref(false)
const maxVisible = 4
const minForShowMore = 4

const albumOpen = ref(false)
const currentFolder = ref(null)
const photos = ref([])
const loadingPhotos = ref(false)

const viewerOpen = ref(false)
const currentPhotoIndex = ref(0)
const loadedImages = ref(new Set())
const isDownloading = ref(false)

const carouselRef = ref(null)
const trackRef = ref(null)

// Swipe state
let swipeStartX = 0
let swipeStartY = 0
let swipeEndX = 0
let isSwiping = false

function getDirectUrl(id, size) {
  return size === 'thumbnail'
    ? `https://drive.google.com/thumbnail?id=${id}&sz=w400`
    : `https://drive.google.com/thumbnail?id=${id}&sz=w2000`
}

async function fetchFolderContents(folderId) {
  const mimeQuery = ALLOWED_MIME_TYPES.map(t => `mimeType='${t}'`).join(' or ')
  const query = `'${folderId}' in parents and (${mimeQuery}) and trashed=false`
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent('files(id,name,mimeType,thumbnailLink)')}&key=${API_KEY}&pageSize=100`
  const res = await fetch(url)
  if (!res.ok) return { photoCount: 0, logo: null }
  const data = await res.json()
  const files = data.files || []
  const logoFile = files.find(f => f.name.toLowerCase() === 'logo.png')
  const logo = logoFile ? { thumbnail: getDirectUrl(logoFile.id, 'thumbnail') } : null
  const photoCount = files.filter(f => f.name.toLowerCase() !== 'logo.png').length
  return { photoCount, logo }
}

async function loadFolders() {
  try {
    const query = `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent('files(id,name,createdTime)')}&key=${API_KEY}&orderBy=name`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const result = await Promise.all(data.files.map(async folder => {
      const { photoCount, logo } = await fetchFolderContents(folder.id)
      return { ...folder, photoCount, logo }
    }))
    result.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
    folders.value = result
  } catch (e) {
    error.value = t('gallery-loading') + ' - Error'
  } finally {
    isLoading.value = false
  }
}

async function openAlbum(folder) {
  currentFolder.value = folder
  albumOpen.value = true
  loadingPhotos.value = true
  document.body.style.overflow = 'hidden'

  try {
    const mimeQuery = ALLOWED_MIME_TYPES.map(t => `mimeType='${t}'`).join(' or ')
    const query = `'${folder.id}' in parents and (${mimeQuery}) and name!='logo.png' and trashed=false`
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent('files(id,name,mimeType,thumbnailLink)')}&key=${API_KEY}&pageSize=100&orderBy=name`
    const res = await fetch(url)
    const data = await res.json()
    photos.value = (data.files || []).map(f => ({
      id: f.id,
      name: f.name,
      thumbnail: f.thumbnailLink || getDirectUrl(f.id, 'thumbnail'),
      fullSize: getDirectUrl(f.id, 'full'),
    }))
  } finally {
    loadingPhotos.value = false
  }
}

function closeAlbum() {
  albumOpen.value = false
  document.body.style.overflow = ''
  currentFolder.value = null
  photos.value = []
}

function openViewer(index) {
  currentPhotoIndex.value = index
  viewerOpen.value = true
  loadedImages.value = new Set()
  nextTick(() => {
    updateCarousel(false)
    loadNearby(index)
  })
}

function closeViewer() {
  viewerOpen.value = false
  if (trackRef.value) { trackRef.value.style.transform = ''; trackRef.value.style.transition = '' }
}

function updateCarousel(animate = true) {
  if (!trackRef.value) return
  const offset = -currentPhotoIndex.value * 100
  trackRef.value.style.transition = animate ? 'transform 0.3s ease-out' : 'none'
  trackRef.value.style.transform = `translateX(${offset}%)`
}

function loadNearby(index) {
  const toLoad = [index - 1, index, index + 1].filter(i => i >= 0 && i < photos.value.length)
  toLoad.forEach(i => {
    if (loadedImages.value.has(i)) return
    const img = new Image()
    img.onload = () => {
      const newSet = new Set(loadedImages.value)
      newSet.add(i)
      loadedImages.value = newSet
    }
    img.src = photos.value[i].fullSize
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

async function downloadPhoto() {
  const photo = photos.value[currentPhotoIndex.value]
  isDownloading.value = true
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${photo.id}?alt=media&key=${API_KEY}`)
    if (!res.ok) throw new Error()
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = photo.name || `photo_${photo.id}.jpg`
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    window.open(`https://drive.google.com/uc?export=download&id=${photo.id}`, '_blank')
  } finally {
    isDownloading.value = false
  }
}

// Carousel swipe
function onCarouselMouseDown(e) {
  if (e.target.closest('.photo-nav-btn') || e.target.closest('.download-btn')) return
  e.preventDefault()
  swipeStartX = e.clientX; swipeStartY = e.clientY; swipeEndX = e.clientX
  isSwiping = true
  if (trackRef.value) trackRef.value.style.transition = 'none'
  if (carouselRef.value) carouselRef.value.style.cursor = 'grabbing'
}

function onCarouselMouseMove(e) {
  if (!isSwiping) return
  swipeEndX = e.clientX
  if (!carouselRef.value || !trackRef.value) return
  const diffX = swipeStartX - swipeEndX
  const base = -currentPhotoIndex.value * 100
  let offset = base + (-diffX / carouselRef.value.offsetWidth) * 100
  const min = -(photos.value.length - 1) * 100
  if (offset > 0) offset = offset * 0.3
  if (offset < min) offset = min + (offset - min) * 0.3
  trackRef.value.style.transform = `translateX(${offset}%)`
}

function onCarouselMouseUp() {
  if (!isSwiping) return
  isSwiping = false
  if (carouselRef.value) carouselRef.value.style.cursor = 'grab'
  const diff = swipeStartX - swipeEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextPhoto(); else prevPhoto()
  } else {
    updateCarousel(true)
  }
}

function onCarouselTouchStart(e) {
  swipeStartX = e.touches[0].clientX; swipeStartY = e.touches[0].clientY
  swipeEndX = swipeStartX; isSwiping = true
  if (trackRef.value) trackRef.value.style.transition = 'none'
}

function onCarouselTouchMove(e) {
  if (!isSwiping) return
  swipeEndX = e.touches[0].clientX
  const diffX = swipeStartX - swipeEndX
  const diffY = Math.abs(swipeStartY - e.touches[0].clientY)
  if (Math.abs(diffX) <= diffY) return
  if (!carouselRef.value || !trackRef.value) return
  const base = -currentPhotoIndex.value * 100
  let offset = base + (-diffX / carouselRef.value.offsetWidth) * 100
  const min = -(photos.value.length - 1) * 100
  if (offset > 0) offset = offset * 0.3
  if (offset < min) offset = min + (offset - min) * 0.3
  trackRef.value.style.transform = `translateX(${offset}%)`
}

function onCarouselTouchEnd() {
  if (!isSwiping) return
  isSwiping = false
  const diff = swipeStartX - swipeEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextPhoto(); else prevPhoto()
  } else {
    updateCarousel(true)
  }
}

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
  document.addEventListener('mousemove', onCarouselMouseMove)
  document.addEventListener('mouseup', onCarouselMouseUp)
  loadFolders()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousemove', onCarouselMouseMove)
  document.removeEventListener('mouseup', onCarouselMouseUp)
})
</script>
