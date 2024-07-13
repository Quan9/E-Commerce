import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `${import.meta.env.VITE_URL_SERVER}`,
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
});
