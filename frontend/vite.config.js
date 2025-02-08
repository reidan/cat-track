import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],    
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL || "http://localhost:8080/api"),
    },
    server: {
      allowedHosts: [
        'ideal-brief-treefrog.ngrok-free.app'
      ],
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080/api",,
          changeOrigin: true,
          secure: true,
        },
        "/uploads": "http://localhost:8080",
      },
    },
  };
});
