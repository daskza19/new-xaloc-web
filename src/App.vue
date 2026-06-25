<template>
  <StarsBackground />
  <WavesEffect />
  <TheNavigation />
  <div class="overlay"></div>
  <div class="container">
    <div class="effects">
      <img src="/images/effects/effect_00.webp" alt="Effect 0" class="first-effect">
      <img src="/images/effects/effect_01.webp" alt="Effect 1" class="second-effect" loading="lazy">
      <img src="/images/effects/effect_02.webp" alt="Effect 2" class="third-effect" loading="lazy">
    </div>
    <HeroSection />
    <TypingSection />
    <AboutSection />
    <GallerySection />
    <ContactSection />
  </div>
</template>

<script setup>
import StarsBackground from './components/StarsBackground.vue'
import WavesEffect from './components/WavesEffect.vue'
import TheNavigation from './components/TheNavigation.vue'
import HeroSection from './components/HeroSection.vue'
import TypingSection from './components/TypingSection.vue'
import AboutSection from './components/AboutSection.vue'
import GallerySection from './components/GallerySection.vue'
import ContactSection from './components/ContactSection.vue'
</script>
