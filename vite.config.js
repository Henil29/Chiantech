import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    // allow access from the Render hostname and bind to the runtime port
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    allowedHosts: ['chiantech.onrender.com']
  }
})
