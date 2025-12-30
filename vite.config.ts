import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'infinity-comics.com',
      'www.infinity-comics.com',
      'https://library-manager-rlq5.onrender.com/',
      'library-manager-rlq5.onrender.com'
    ]
  },
  
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'infinity-comics.com',
      'www.infinity-comics.com',
      'https://library-manager-rlq5.onrender.com/'
    ]
  }
})