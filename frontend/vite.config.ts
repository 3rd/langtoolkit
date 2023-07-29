import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) }],
  },
  server: {
    host: "localhost",
    port: 5201,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8090/",
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/ws": {
        target: "ws://localhost:8090/",
        secure: false,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
