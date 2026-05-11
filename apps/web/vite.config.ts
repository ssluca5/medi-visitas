import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@sentry")) return "vendor-sentry";
          if (id.includes("@clerk") || id.includes("svelte-clerk")) return "vendor-clerk";
          if (id.includes("lucide-svelte")) return "vendor-icons";
        },
      },
    },
  },
});
