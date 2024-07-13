import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT

  return defineConfig({
    plugins: [react()],

    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_URL_SERVER,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  });
};
// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: `${import.meta.env.VITE_URL_SERVER}`,
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//       },
//     },
//   },
// });
