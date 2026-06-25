<template>
  <section class="about-section" id="about">
    <ProposalSection />
    <div class="numbers-opinions-container">
      <StatsSection />
      <OpinionsCarousel />
    </div>
  </section>
</template>

<script setup>
import ProposalSection from './ProposalSection.vue'
import StatsSection from './StatsSection.vue'
import OpinionsCarousel from './OpinionsCarousel.vue'
</script>
