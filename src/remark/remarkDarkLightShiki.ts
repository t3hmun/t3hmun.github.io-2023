// Based on https://github.com/withastro/astro/blob/780c583b0eabdb457a7f90f3d447b5e37e464b2c/packages/markdown/remark/src/remark-shiki.ts
// Cut out features and parameters I'm not using
// Made it render twice in 2 themes.
// Removed the async on the plugin because it didn't work (no idea how the original is called).

import { getHighlighter } from "shiki";
import { visit } from "unist-util-visit";

const hlDark = await getHighlighter({ theme: "github-dark" });
const hlLight = await getHighlighter({ theme: "github-light" });

export function remarkDarkLightShiki() {
    const wrap = false;
    const scopedClassName = null;

    const highlighter = hlDark;

    console.log("hi I'm shiki");
    return (tree: any) => {
        console.log("plugin ran");
        visit(tree, "code", (node) => {
            let lang: string;
            console.log("found one");

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

            let html = highlighter!.codeToHtml(node.value, { lang });

            // Q: Couldn't these regexes match on a user's inputted code blocks?
            // A: Nope! All rendered HTML is properly escaped.
            // Ex. If a user typed `<span class="line"` into a code block,
            // It would become this before hitting our regexes:
            // &lt;span class=&quot;line&quot;

            // Replace "shiki" class naming with "astro" and add "is:raw".
            html = html.replace(
                /<pre class="(.*?)shiki(.*?)"/,
                `<pre is:raw class="$1astro-code dark$2${
                    scopedClassName ? " " + scopedClassName : ""
                }"`
            );
            // Add "user-select: none;" for "+"/"-" diff symbols
            if (node.lang === "diff") {
                html = html.replace(
                    /<span class="line"><span style="(.*?)">([\+|\-])/g,
                    '<span class="line"><span style="$1"><span style="user-select: none;">$2</span>'
                );
            }
            // Handle code wrapping
            // if wrap=null, do nothing.
            if (wrap === false) {
                html = html.replace(
                    /style="(.*?)"/,
                    'style="$1; overflow-x: auto;"'
                );
            } else if (wrap === true) {
                html = html.replace(
                    /style="(.*?)"/,
                    'style="$1; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;"'
                );
            }

            // Apply scopedClassName to all nested lines
            if (scopedClassName) {
                html = html.replace(
                    /\<span class="line"\>/g,
                    `<span class="line ${scopedClassName}"`
                );
            }

            node.type = "html";
            node.value = html + html;
            node.children = [];
        });
    };
}
