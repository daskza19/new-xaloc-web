<template>
  <!-- Vertical nav (portrait/mobile) -->
  <nav id="vertical-nav">
    <div class="vertical-language-dropdown">
      <button
        class="vertical-language-dropdown-toggle"
        :class="{ open: verticalDropdownOpen }"
        @click="toggleVerticalDropdown"
      >
        <img :src="flags[currentLanguage]" alt="Selected Language">
        <span class="vertical-dropdown-arrow">▼</span>
      </button>
      <div class="vertical-language-dropdown-menu" :class="{ open: verticalDropdownOpen }">
        <button class="vertical-language-dropdown-item" @click="selectLanguage('ca')">
          <img :src="flags.ca" alt="Català">
          <span>Català</span>
        </button>
        <button class="vertical-language-dropdown-item" @click="selectLanguage('es')">
          <img :src="flags.es" alt="Español">
          <span>Español</span>
        </button>
        <button class="vertical-language-dropdown-item" @click="selectLanguage('en')">
          <img :src="flags.en" alt="English">
          <span>English</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Horizontal nav (landscape/desktop) -->
  <nav id="horizontal-nav" :class="{ sticky: isSticky }">
    <div class="horizontal-nav-content">
      <div class="horizontal-nav-links">
        <a href="#about" class="horizontal-nav-link" :class="{ active: activeSection === 'about' }">{{ t('nav-about') }}</a>
        <a href="#gallery" class="horizontal-nav-link" :class="{ active: activeSection === 'gallery' }">{{ t('nav-gallery') }}</a>
        <a href="#contact" class="horizontal-nav-link" :class="{ active: activeSection === 'contact' }">{{ t('nav-contact') }}</a>
      </div>
      <div class="horizontal-language-dropdown">
        <button
          class="language-dropdown-toggle"
          :class="{ open: horizontalDropdownOpen }"
          @click="toggleHorizontalDropdown"
        >
          <img :src="flags[currentLanguage]" alt="Selected Language">
          <span class="dropdown-arrow">▼</span>
        </button>
        <div class="language-dropdown-menu" :class="{ open: horizontalDropdownOpen }">
          <button class="language-dropdown-item" @click="selectLanguage('ca')">
            <img :src="flags.ca" alt="Català">
            <span>Català</span>
          </button>
          <button class="language-dropdown-item" @click="selectLanguage('es')">
            <img :src="flags.es" alt="Español">
            <span>Español</span>
          </button>
          <button class="language-dropdown-item" @click="selectLanguage('en')">
            <img :src="flags.en" alt="English">
            <span>English</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { currentLanguage, t, changeLanguage, flags } = useLanguage()

const isSticky = ref(false)
const activeSection = ref('')
const horizontalDropdownOpen = ref(false)
const verticalDropdownOpen = ref(false)

function toggleHorizontalDropdown() {
  horizontalDropdownOpen.value = !horizontalDropdownOpen.value
}

function toggleVerticalDropdown() {
  verticalDropdownOpen.value = !verticalDropdownOpen.value
}

function selectLanguage(lang) {
  changeLanguage(lang)
  horizontalDropdownOpen.value = false
  verticalDropdownOpen.value = false
}

function updateActiveSection() {
  const sections = document.querySelectorAll('section[id]')
  const scrollPosition = window.scrollY + 100
  let current = ''
  sections.forEach(section => {
    const top = section.offsetTop
    const height = section.offsetHeight
    if (scrollPosition >= top && scrollPosition < top + height) {
      current = section.getAttribute('id')
    }
  })
  activeSection.value = current
}

function onScroll() {
  isSticky.value = window.scrollY >= window.innerHeight
  updateActiveSection()
}

function onClickOutside(e) {
  if (!e.target.closest('.horizontal-language-dropdown')) {
    horizontalDropdownOpen.value = false
  }
  if (!e.target.closest('.vertical-language-dropdown')) {
    verticalDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})
</script>
