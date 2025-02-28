import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      secure: false,
    },
  },
  plugins: [
    tailwindcss(),
  ],
})