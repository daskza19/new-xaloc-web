<template>
  <section class="page-section" id="tickets">
    <img src="/images/effects/effect_03.webp" alt="Effect 3" class="effect-3">
    <div class="page-content">
      <h2>{{ t('nav-tickets') }}</h2>
      <p class="page-message">{{ t('work-in-progress') }}</p>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from '../composables/useLanguage.js'
const { t } = useLanguage()
</script>
