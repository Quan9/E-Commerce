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
          // secure: false,
          ws: true,
          // configure: (proxy, _options) => {
          //   proxy.on("error", (err, _req, _res) => {
          //     console.log("proxy error", err);
          //   });
          //   proxy.on("proxyReq", (proxyReq, req, _res) => {
          //     console.log(
          //       "Sending Request to the Target:",
          //       req.method,
          //       req.url
          //     );
          //   });
          //   proxy.on("proxyRes", (proxyRes, req, _res) => {
          //     console.log(
          //       "Received Response from the Target:",
          //       proxyRes.statusCode,
          //       req.url
          //     );
          //   });
          // },
        },
      },
    },
  });
};
