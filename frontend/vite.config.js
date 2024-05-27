import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://e-commerce-backend-studentquan9-9b1574ae.koyeb.app",
        // ||
        // "http://localhost:8080",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
});
