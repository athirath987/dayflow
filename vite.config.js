import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DayFlow - Personal Workspace',
        short_name: 'DayFlow',
        description: 'Your personal productivity workspace',
        theme_color: '#0b0d13',
        background_color: '#0b0d13',
        display: 'standalone',
        start_url: './',
        icons: [
          {
            src: 'dayflow.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
