import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      mode: "development",
      base: "/",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["/favicon.ico"],
      strategies: "injectManifest",
      manifest: {
        name: "Keep Talking",
        short_name: "Keep Talking",
        theme_color: "#0891b2",
        start_url: "/",
        display: "standalone",
        background_color: "#0891b2",
        icons: [
            {
                src: "icons/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
				purpose: "any"
            },
            {
                src: "icons/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
				purpose: "any",
            },
            {
                src: "icons/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
      },
    }),
  ],
  server: {
    host: true
  },
})
