<template>
  <section class="contact-section" id="contact">
    <img src="/images/effects/effect_05.webp" loading="lazy" alt="Effect 5" class="last-effect-1">
    <img src="/images/effects/effect_06.webp" loading="lazy" alt="Effect 6" class="last-effect-2">
    <h2>{{ t('contact-title') }}</h2>

    <div class="contact-container" ref="containerRef">
      <h1 class="contact-title-vertical" ref="titleRef">{{ t('contact-title') }}</h1>
      <div class="contact-form-wrapper">
        <div class="contact-inputs-column">
          <div class="name-contact-part">
            <h3 class="name-contact-label">{{ t('name-contact-label') }}</h3>
            <input
              type="text"
              class="name-contact-input"
              :class="{ 'input-error': errors.name }"
              :placeholder="t('name-placeholder')"
              v-model="form.name"
              @input="errors.name = false"
            >
          </div>
          <div class="email-contact-part">
            <h3 class="email-contact-label">{{ t('email-contact-label') }}</h3>
            <input
              type="email"
              class="email-contact-input"
              :class="{ 'input-error': errors.email }"
              :placeholder="t('email-placeholder')"
              v-model="form.email"
              @blur="validateEmailOnBlur"
              @input="clearEmailError"
            >
          </div>
          <div class="type-contact-part">
            <h3 class="subject-contact-label">{{ t('subject-contact-label') }}</h3>
            <select
              class="subject-contact-input"
              :class="{ 'input-error': errors.subject }"
              v-model="form.subject"
              @change="errors.subject = false"
            >
              <option value="" disabled>{{ t('subject-placeholder') }}</option>
              <option value="fiesta-empresa">{{ t('subject-company') }}</option>
              <option value="particular">{{ t('subject-private') }}</option>
              <option value="duda-eventos">{{ t('subject-question') }}</option>
            </select>
          </div>
          <div class="text-contact-part">
            <h3 class="name-contact-label">{{ t('message-contact-label') }}</h3>
            <div class="message-char-counter" style="text-align:right;font-size:1.5vh;color:black;margin-bottom:1vh;">
              <span>{{ form.message.length }}</span>/200
            </div>
            <textarea
              class="text-contact-input"
              :class="{ 'input-error': errors.message }"
              :placeholder="t('message-placeholder')"
              v-model="form.message"
              maxlength="200"
              @input="errors.message = false"
            ></textarea>
          </div>
        </div>

        <button class="send-contact-button send-button-text" @click="submit">{{ t('send-contact-button') }}</button>
        <button class="send-contact-button send-button-icon" @click="submit">
          <img src="/images/icons/send-icon.webp" loading="lazy" alt="Enviar">
        </button>
      </div>
    </div>

    <div class="social-media-row">
      <a href="https://www.instagram.com/xaloc.events/" target="_blank" class="social-media-button">
        <img src="/images/logos/instragram-logo.webp" loading="lazy" alt="Instagram">
      </a>
      <a href="https://www.tiktok.com/@xaloc.events" target="_blank" class="social-media-button">
        <img src="/images/logos/tiktok-logo.webp" loading="lazy" alt="TikTok">
      </a>
      <a href="https://www.bodas.net/musica/xaloc-events--e283839" target="_blank" class="social-media-button">
        <img src="/images/logos/bodas-logo.webp" loading="lazy" alt="Bodas.net">
      </a>
    </div>

    <div class="footer-text-row">
      <p>© 2025 Xaloc Events. Tots els drets reservats.</p>
    </div>

    <!-- Toasts -->
    <div class="toast-success-message" :class="{ 'toast-show': toast === 'success', 'toast-hide': toast === 'hide-success' }">
      <p class="toast-text">{{ t('toast-success-message') }}</p>
    </div>
    <div class="toast-fail-message" :class="{ 'toast-show': toast === 'fail', 'toast-hide': toast === 'hide-fail' }">
      <p class="toast-text">{{ t('toast-fail-message') }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { t, currentLanguage } = useLanguage()

const SUPABASE_URL = 'https://wwrklkdvuthcwcbowkeb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_SI-Y_hDJhQyOxyyjvH3QPw_-WYPdbuv'

const containerRef = ref(null)
const titleRef = ref(null)
const toast = ref('')

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: false, email: false, subject: false, message: false })

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateEmailOnBlur() {
  if (form.email && !validateEmail(form.email)) errors.email = true
}

function clearEmailError() {
  if (errors.email && validateEmail(form.email)) errors.email = false
}

function showToast(type) {
  toast.value = type
  setTimeout(() => {
    toast.value = type === 'success' ? 'hide-success' : 'hide-fail'
  }, 5000)
}

async function submit() {
  errors.name = !form.name.trim()
  errors.email = !form.email || !validateEmail(form.email)
  errors.subject = !form.subject
  errors.message = !form.message.trim()

  if (errors.name || errors.email || errors.subject || errors.message) {
    showToast('fail')
    return
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const { error } = await supabase.from('form_users').insert([{
      name: form.name.trim(),
      email: form.email.trim(),
      contact_type: form.subject,
      message: form.message.trim()
    }])
    if (error) throw error
    showToast('success')
    form.name = ''; form.email = ''; form.subject = ''; form.message = ''
  } catch {
    showToast('fail')
  }
}

// Contact title size (binary search to fill container height)
function adjustTitleSize() {
  const title = titleRef.value
  const container = containerRef.value
  if (!title || !container) return

  const containerHeight = container.offsetHeight
  let min = 1, max = containerHeight, best = 1

  while (max - min > 1) {
    const mid = (max + min) / 2
    title.style.fontSize = mid + 'px'
    if (title.offsetWidth < containerHeight) { min = mid; best = mid }
    else max = mid
  }

  title.style.fontSize = best + 'px'
  const textHeightVh = (title.offsetHeight / window.innerHeight) * 100
  title.style.left = (textHeightVh / 3) + 'vh'
}

onMounted(() => {
  adjustTitleSize()
  window.addEventListener('resize', adjustTitleSize)
  document.fonts.ready.then(adjustTitleSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustTitleSize)
})

watch(currentLanguage, () => {
  setTimeout(adjustTitleSize, 50)
})
</script>
