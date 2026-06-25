import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

function isImage(f) {
  return ALLOWED_EXT.includes(f.slice(f.lastIndexOf('.')).toLowerCase())
}

function buildGalleryData() {
  const galleryDir = 'public/gallery'
  let folders
  try {
    folders = readdirSync(galleryDir)
      .filter(f => {
        if (f.startsWith('.')) return false
        try { return statSync(join(galleryDir, f)).isDirectory() } catch { return false }
      })
      .sort()
  } catch {
    return []
  }

  return folders.map(folder => {
    const folderPath = join(galleryDir, folder)

    let manifest
    try {
      manifest = JSON.parse(readFileSync(join(folderPath, 'manifest.json'), 'utf-8'))
    } catch {
      console.warn(`[gallery] No manifest.json in ${folder}, skipping`)
      return null
    }

    const imagesSubdir = (manifest.images_path || '/images').replace(/^\//, '')

    let images = []
    try {
      images = readdirSync(join(folderPath, imagesSubdir))
        .filter(f => !f.startsWith('.') && isImage(f))
        .sort()
        .map(f => `/gallery/${folder}/${imagesSubdir}/${encodeURIComponent(f)}`)
    } catch {
      console.warn(`[gallery] No images dir in ${folder}`)
    }

    return {
      id: folder,
      title: manifest.title || folder,
      description: manifest.description || '',
      event_date: manifest.event_date || '',
      logo: manifest.logo_path ? `/gallery/${folder}/${manifest.logo_path}` : null,
      photoCount: images.length,
      images,
    }
  }).filter(Boolean)
}

function galleryPlugin() {
  const VIRTUAL = 'virtual:gallery'
  const RESOLVED = '\0virtual:gallery'

  return {
    name: 'gallery-plugin',
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },
    load(id) {
      if (id !== RESOLVED) return
      const galleries = buildGalleryData()
      console.log(`[gallery] ${galleries.length} galleries loaded`)
      galleries.forEach(g => console.log(`  ↳ ${g.title} (${g.photoCount} photos)`))
      return `export default ${JSON.stringify(galleries)}`
    },
  }
}

export default defineConfig({
  plugins: [vue(), galleryPlugin()],
  base: process.env.GITHUB_ACTIONS ? '/new-xaloc-web/' : '/',
})
