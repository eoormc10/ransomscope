import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes asset paths relative, so the build works whether it's
// served from a domain root (Vercel/Netlify) or a sub-path (GitHub Pages).
export default defineConfig({
  base: "./",
  plugins: [react()],
});
