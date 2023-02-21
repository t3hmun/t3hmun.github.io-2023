import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";

export default defineConfig({
    integrations: [tailwind(), preact(), mdx()],
});
