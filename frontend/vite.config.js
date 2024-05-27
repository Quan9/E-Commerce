import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://e-commerce-frontend-g39l.onrender.com"||
          "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
