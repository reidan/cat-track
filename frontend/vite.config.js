import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const API_URL = process.env.VITE_API_URL || "http://localhost:8080/api"; // Fallback for safety
  return {
      plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      allowedHosts: [
        'ideal-brief-treefrog.ngrok-free.app',
        'cat-track.onrender.com'
      ],
      proxy: {
        "/api": API_URL,
        "/uploads": "http://localhost:8080",
      },
    },
  };
});
