import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

manifest: {
  name: "Washi",
  short_name: "Washi",

  display: "standalone",

  theme_color: "#f4eee4",
  background_color: "#f4eee4",

  icons: [
    {
      src: "/pwa-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "/pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable"
    }
  ]
}