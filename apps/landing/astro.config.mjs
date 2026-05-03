import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import clerk from "@clerk/astro";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://medivisitas.com",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [svelte(), sitemap(), clerk()],
  vite: {
    plugins: [tailwindcss()],
  },
});
