import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // import.meta.env.VITE_NAME available here with: env.VITE_NAME

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  });
};
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: import.meta.env.VITE_URL,
//         changeOrigin: true,
//         secure: true,
//         ws: true,
//       },
//     },
//   },
// });
