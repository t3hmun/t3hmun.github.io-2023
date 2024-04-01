/** Code element that has a header that displays a title (should be lang by default or filename if supplied) and copy and expand size buttons.
 * The expand bit isn't perfect - currently if the code has ridiculous line length it will make the page that wide.
 * Default:
 * - Make the code boxes fit in with the page, they have their own scrollbars.
 * - This is a horrible compromise on mobile because you often have to scroll to the bottom to get to the horizontal scroll, but the document width stays reasonable.
 * Expanded:
 * - The code boxes will expand to the width of the code, expanding the page with it if it doesn't fit.
 * - This is nice for most code on a large monitor, a little bit awkward for very long lines and terrible for extreme one-line dumps (which you probably shouldn't put on the page to start with).
 * - For mobile it is nice for medium width code because you can scroll horizontally without scrolling to find the bottom of the code box.
 *
 * This really could have been done without JSX or any framework. Could have just written a tiny bit of js in a script tag.
 * Still good enough. Maybe I'll and a random number generator that renders this component with a random framework.
 */

import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

type CodePreProps = {
    "data-lang": string;
    "data-theme": string;
    "data-title"?: string;
    class: string;
    children: ComponentChildren;
};

const styleObserverConfig: MutationObserverInit = {
    attributes: true,
    attributeFilter: ["style"],
};

export function CodePre(props: CodePreProps): JSX.Element {
    // The title defaults to the value of lang because the title us usually a filename with an extension that makes the lang redundant.
    // As a result we don't need lang at all.
    // const lang = props["data-lang"];
    const theme = props["data-theme"];
    const title = props["data-title"];
    const [clientSideJs, setClientSideJs] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [copyAnim, setCopyAnim] = useState(false);
    const [codeHasScrollbar, setCodeHasScrollbar] = useState(true);
    const codePre = useRef<null | HTMLPreElement>(null);
    useEffect(() => {
        // This effect only runs client side, so it enables the features for the js enabled.
        setClientSideJs(true);
    });

    useEffect(() => {
        // Check if the code pre has a horizontal scrollbar, which can change on screen resize.
        // If the div is hidden due to being the hidden dark/light theme, there is no scrollbar.
        // When the theme is toggled that changes without react knowing since nothing in this component changes - a single style on the root html element changes.
        // So also check that html element for style changes.
        // Without the theme observer, the hasScrollbar state will always be false when the theme is changed.

        if (!codePre.current) return;
        const checkForScrollbar = () => {
            if (!codePre.current) return;
            const hasScroll =
                codePre.current.scrollWidth > codePre.current.clientWidth;
            setCodeHasScrollbar(hasScroll);
        };
        checkForScrollbar();
        window.addEventListener("resize", checkForScrollbar);

        // The theme is a style applied to the top html element by hand-witten simple js.
        const themeObserver = new MutationObserver(() => checkForScrollbar());
        themeObserver.observe(document.documentElement, styleObserverConfig);

        return () => {
            window.removeEventListener("resize", checkForScrollbar);
            themeObserver && themeObserver.disconnect();
        };
    }, []);

    function clip() {
        if (!codePre) return;
        const innerText = codePre.current?.innerText;
        if (!innerText) return;
        navigator.clipboard.writeText(innerText);
        setCopyAnim(true);
    }

    return (
        // Maybe max-wit-fit should be the default for code, and I don't need any code or interactivity...
        <div
            class={`mx-auto my-4  rounded-md border border-zinc-600 bg-stone-200 pb-2 dark:bg-stone-700 display-${theme} ${
                expanded ? "min-w-min max-w-3xl" : "max-w-3xl"
            }`}
        >
            <div class="text-s flex justify-between rounded-t-md border-0 bg-stone-300 px-2 py-1 dark:bg-stone-600">
                <div>{title}</div>
                {clientSideJs && (
                    <div class="flex flex-row">
                        <div
                            class={`mr-1 cursor-pointer pr-0.5 pl-0.5 text-amber-500 shadow rounded-sm border border-zinc-300 dark:border-zinc-600 hover:scale-105 hover:text-amber-400 hover:shadow-md ${
                                copyAnim && "animate-wiggle"
                            }`}
                            onClick={clip}
                            onAnimationEnd={() => {
                                setCopyAnim(false);
                            }}
                        >
                            Copy
                        </div>
                        {expanded && (
                            <>
                                <div
                                    class="cursor-pointer pr-0.5 pl-0.5 text-amber-500 shadow rounded-sm border border-zinc-300 dark:border-zinc-600 hover:scale-105 hover:text-amber-400 hover:shadow-md "
                                    onClick={() => setExpanded(false)}
                                >
                                    Shrink
                                </div>
                            </>
                        )}
                        {!expanded && codeHasScrollbar && (
                            <>
                                <div
                                    class="cursor-pointer pr-0.5 pl-0.5 text-amber-500 shadow rounded-sm border border-zinc-300 dark:border-zinc-600 hover:scale-105 hover:text-amber-400 hover:shadow-md "
                                    onClick={() => setExpanded(true)}
                                >
                                    Expand
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <pre
                ref={codePre}
                {...props}
                class={`mx-2 overflow-x-auto px-1 py-1 font-mono text-lg ${props.class} `}
            >
                {props.children}
            </pre>
        </div>
    );
}
