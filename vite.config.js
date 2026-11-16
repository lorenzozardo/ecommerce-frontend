import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // o backend libera CORS para http://localhost:5173; se a porta estiver ocupada,
    // é melhor falhar com uma mensagem clara do que subir em outra porta e dar erro de CORS
    strictPort: true,
  },
})
