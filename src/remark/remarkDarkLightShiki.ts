// Based on https://github.com/withastro/astro/blob/780c583b0eabdb457a7f90f3d447b5e37e464b2c/packages/markdown/remark/src/remark-shiki.ts
// Cut out features and parameters I'm not using (all the default styles and other stuff I forgot)
// Made it render twice in 2 themes, with data-theme attr:
//    data-theme will be dark or light for each block, the display component needs to use this to hide the one that is not the active page theme.
// Added custom data-lang and data-title attributes:
//    data-lang is the language of the fenced code block
//    data-title is any text after the lang on the same line, to be used as a title for the code block
// Removed the async on the plugin because it didn't work (no idea how the original is called).

import { getHighlighter, Highlighter } from "shiki";
import { visit } from "unist-util-visit";
import { escape } from "html-escaper";

// Change these 2 consts to customise themes https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes

const darkTheme = "dark-plus";
const lightTheme = "github-light";

type Theme = {
    name: "dark" | "light";
    shikiTheme: string;
};

const hl = await getHighlighter({ themes: [darkTheme, lightTheme] });

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

            // Any text after the language on the open code fence line (```lang text after) gets stored in node.meta.
            // I'm using that data as a custom title for the code block.
            let title = node.meta ?? lang;

            const light = render(node, hl, lang, title, {
                name: "dark",
                shikiTheme: darkTheme,
            });
            const dark = render(node, hl, lang, title, {
                name: "light",
                shikiTheme: lightTheme,
            });

            node.type = "html";
            node.value = light + dark;
            node.children = [];
        });
    };
}

/**
 * Render the code block in a particular theme.
 * @param node unist tree node
 * @param hl Shiki highlighter with themes loaded.
 * @param lang Value for the data-lang attr
 * @param title Value for the data-title attr
 * @param theme The rending theme and the name is the data for the data-theme attr
 * @returns Syntax highlighted code block html.
 */
function render(
    node: any,
    hl: Highlighter,
    lang: string,
    title: string,
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
        `<pre is:raw data-theme="${
            theme.name
        }" data-lang="${lang}" data-title="${escape(title)}"}` // class="$1 $2 if I wanted to preserve the theme name class.
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
