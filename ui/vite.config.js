import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// Vite automatically loads .env files and exposes VITE_* variables
export default defineConfig({
  plugins: [vue()],
})
