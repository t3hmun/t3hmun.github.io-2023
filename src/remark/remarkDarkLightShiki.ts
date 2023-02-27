// Based on https://github.com/withastro/astro/blob/780c583b0eabdb457a7f90f3d447b5e37e464b2c/packages/markdown/remark/src/remark-shiki.ts
// Cut out features and parameters I'm not using
// Made it render twice in 2 themes.
// Removed the async on the plugin because it didn't work (no idea how the original is called).

import { getHighlighter, Highlighter } from "shiki";
import { visit } from "unist-util-visit";

type Theme =
    | {
          name: "dark";
          shikiTheme: "github-dark";
      }
    | {
          name: "light";
          shikiTheme: "github-light";
      };

const themes: Theme[] = [
    { name: "dark", shikiTheme: "github-dark" },
    { name: "light", shikiTheme: "github-light" },
];

const hl = await getHighlighter({ themes: themes.map((t) => t.shikiTheme) });

export function remarkDarkLightShiki() {
    const highlighter = hl;

    return (tree: any, file: any) => {
        visit(tree, "code", (node) => {
            let lang: string;

            if (typeof node.lang === "string") {
                const langExists = highlighter
                    .getLoadedLanguages()
                    .includes(node.lang);
                if (langExists) {
                    lang = node.lang;
                } else {
                    // eslint-disable-next-line no-console
                    console.warn(
                        `The language "${node.lang}" doesn't exist, falling back to plaintext.`
                    );
                    lang = "plaintext";
                }
            } else {
                lang = "plaintext";
            }

            const light = render(node, hl, lang, {
                name: "dark",
                shikiTheme: "github-dark",
            });
            const dark = render(node, hl, lang, {
                name: "light",
                shikiTheme: "github-light",
            });

            node.type = "html";
            node.value = light + dark;
            node.children = [];
        });
    };
}

function render(
    node: any,
    hl: Highlighter,
    lang: string,
    theme: Theme
): string {
    let html = hl.codeToHtml(node.value, {
        lang,
        theme: theme.shikiTheme,
    });

    // Q: Couldn't these regexes match on a user's inputted code blocks?
    // A: Nope! All rendered HTML is properly escaped.
    // Ex. If a user typed `<span class="line"` into a code block,
    // It would become this before hitting our regexes:
    // &lt;span class=&quot;line&quot;

    // Replace "shiki" class naming with "astro" and add "is:raw".
    html = html.replace(
        /<pre class="(.*?)shiki(.*?)"/,
        `<pre is:raw data-theme="${theme.name}" data-lang="${lang}"` // class="$1 $2 if I wanted to preserve the theme name class.
    );
    // Add "user-select: none;" for "+"/"-" diff symbols
    if (node.lang === "diff") {
        html = html.replace(
            /<span class="line"><span style="(.*?)">([\+|\-])/g,
            '<span class="line"><span style="$1"><span style="user-select: none;">$2</span>'
        );
    }
    html = html.replace(/style="(.*?)"/, ""); // Delete this to keep the theme's background setting.
    return html;
}
