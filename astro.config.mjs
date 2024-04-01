import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import solid from "@astrojs/solid-js";
import { remarkDarkLightShiki } from "./src/remark/remarkDarkLightShiki";

// https://astro.build/config
export default defineConfig({
    site: "https://t3hmun.github.io",
    markdown: {
        remarkPlugins: [remarkDarkLightShiki],
        syntaxHighlight: false,
    },
    integrations: [
        tailwind(),
        preact({ include: ["**/components/preact/*"] }),
        mdx(),
        solid({ include: ["**/components/solid/*"] }),
    ],
});
