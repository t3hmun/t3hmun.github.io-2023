import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import { remarkDarkLightShiki } from "./src/remark/remarkDarkLightShiki";

export default defineConfig({
    markdown: {
        remarkPlugins: [remarkDarkLightShiki],
        syntaxHighlight: false,
    },
    integrations: [tailwind(), preact(), mdx({})],
});
