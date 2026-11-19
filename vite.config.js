import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev: /api/* is proxied to the staging server (avoids CORS issues).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://staging.fastor.ai",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
