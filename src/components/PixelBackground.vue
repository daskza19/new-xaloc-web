<template>
  <canvas ref="canvasRef" class="pixel-background"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref(null)
let animationId = null
let startTime = null

const CELL = 18
const I = 16  // drawn area per cell (1px gap each side)

// Gaussian blob radius² (normalized 0–1 coords).
// Controls how wide each "foco" spreads.
const R2 = 0.038

// 6 sources spread across the screen — each orbits its own zone independently.
// When paths cross they merge like a lava lamp, then drift apart again.
// cx/cy: orbit center  ax/ay: drift amplitude  fx/fy: speed  px/py: phase offset
const SOURCES = [
  { cx: 0.22, cy: 0.28, ax: 0.12, ay: 0.14, fx: 0.97, fy: 0.71, px: 0.00, py: 1.50 },
  { cx: 0.78, cy: 0.28, ax: 0.12, ay: 0.14, fx: 0.82, fy: 1.13, px: 2.10, py: 0.70 },
  { cx: 0.22, cy: 0.72, ax: 0.13, ay: 0.12, fx: 1.05, fy: 0.63, px: 4.20, py: 2.30 },
  { cx: 0.78, cy: 0.72, ax: 0.11, ay: 0.13, fx: 0.73, fy: 0.89, px: 1.80, py: 3.60 },
  { cx: 0.50, cy: 0.18, ax: 0.15, ay: 0.10, fx: 1.18, fy: 0.55, px: 3.50, py: 1.10 },
  { cx: 0.50, cy: 0.82, ax: 0.15, ay: 0.10, fx: 0.65, fy: 1.05, px: 0.90, py: 4.00 },
]

// 10 progressive pixel patterns — same fill color, only shape changes.
// n=0 empty → n=1 full square, 10 distinct steps.
function drawCell(ctx, x, y, n) {
  if (n < 0.1) return

  if (n < 0.2) {
    // Tiny 2×2 center dot
    ctx.fillRect(x + 7, y + 7, 2, 2)

  } else if (n < 0.3) {
    // 4×4 center dot
    ctx.fillRect(x + 6, y + 6, 4, 4)

  } else if (n < 0.4) {
    // 4 corner dots (2×2) + center dot (2×2)
    ctx.fillRect(x,      y,      2, 2)
    ctx.fillRect(x+I-2,  y,      2, 2)
    ctx.fillRect(x,      y+I-2,  2, 2)
    ctx.fillRect(x+I-2,  y+I-2,  2, 2)
    ctx.fillRect(x+7,    y+7,    2, 2)

  } else if (n < 0.5) {
    // Plus / cross — 2px thick
    ctx.fillRect(x,     y+7,  I, 2)
    ctx.fillRect(x+7,   y,    2, I)

  } else if (n < 0.6) {
    // Vertical stripes — 1px filled, 3px gap
    for (let sx = 0; sx < I; sx += 4) {
      ctx.fillRect(x + sx, y, 1, I)
    }

  } else if (n < 0.7) {
    // Vertical stripes — 2px filled, 2px gap
    for (let sx = 0; sx < I; sx += 4) {
      ctx.fillRect(x + sx, y, 2, I)
    }

  } else if (n < 0.8) {
    // Border 1px + center dot 4×4
    ctx.fillRect(x,      y,      I, 1)
    ctx.fillRect(x,      y+I-1,  I, 1)
    ctx.fillRect(x,      y+1,    1, I-2)
    ctx.fillRect(x+I-1,  y+1,    1, I-2)
    ctx.fillRect(x+6,    y+6,    4, 4)

  } else if (n < 0.9) {
    // Border 2px + 8×8 center fill
    ctx.fillRect(x,      y,      I, 2)
    ctx.fillRect(x,      y+I-2,  I, 2)
    ctx.fillRect(x,      y+2,    2, I-4)
    ctx.fillRect(x+I-2,  y+2,    2, I-4)
    ctx.fillRect(x+4,    y+4,    8, 8)

  } else {
    // Full fill
    ctx.fillRect(x, y, I, I)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  function onResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  onResize()
  window.addEventListener('resize', onResize)

  function draw(timestamp) {
    if (!startTime) startTime = timestamp
    // Very slow base speed — sources drift over minutes, not seconds
    const s = (timestamp - startTime) / 1000 * 0.035

    const cols = Math.ceil(canvas.width / CELL) + 1
    const rows = Math.ceil(canvas.height / CELL) + 1

    // Compute source world positions once per frame
    const pos = SOURCES.map(src => ({
      x: src.cx + src.ax * Math.cos(s * src.fx + src.px),
      y: src.cy + src.ay * Math.sin(s * src.fy + src.py),
    }))

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgb(213, 213, 213)'

    for (let row = 0; row < rows; row++) {
      const fy = row / rows
      for (let col = 0; col < cols; col++) {
        const fx = col / cols

        let intensity = 0
        for (let si = 0; si < pos.length; si++) {
          const dx = fx - pos[si].x
          const dy = fy - pos[si].y
          intensity += Math.exp(-(dx * dx + dy * dy) / R2)
        }

        drawCell(ctx, col * CELL + 1, row * CELL + 1, Math.min(1, intensity))
      }
    }

    animationId = requestAnimationFrame(draw)
  }

  animationId = requestAnimationFrame(draw)

  canvas._cleanup = () => window.removeEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (canvasRef.value?._cleanup) canvasRef.value._cleanup()
})
</script>

<style scoped>
.pixel-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  image-rendering: pixelated;
}
</style>
