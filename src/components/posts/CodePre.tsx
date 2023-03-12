import type { ComponentChildren, Ref } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

type CodePreProps = {
    "data-lang": string;
    "data-theme": string;
    "data-title"?: string;
    class: string;
    children: ComponentChildren;
};

export function CodePre(props: CodePreProps): JSX.Element {
    const lang = props["data-lang"];
    const theme = props["data-theme"];
    const title = props["data-title"];
    const [clientSideJs, setClientSideJs] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [copyAnim, setCopyAnim] = useState(false);
    let codeEle = useRef<null | HTMLPreElement>(null);
    useEffect(() => {
        // This effect only runs client side, so it enables the features for the js enabled.
        setClientSideJs(true);
    });

    function clip() {
        if (!codeEle) return;
        const innerText = codeEle.current?.innerText;
        if (!innerText) return;
        navigator.clipboard.writeText(innerText);
        setCopyAnim(true);
    }

    return (
        // Maybe max-wit-fit should be the default for code, and I don't need any code or interactivity...
        <div
            class={`mx-auto my-4  rounded-md border-0 bg-stone-200 pb-2 dark:bg-stone-800 display-${theme} ${
                expanded ? "max-w-fit" : "max-w-3xl"
            }`}
        >
            <div class="text-s flex justify-between rounded-t-md border-0 bg-stone-300 px-2 py-1 dark:bg-stone-700">
                <div>{title}</div>
                {clientSideJs && (
                    <div class="flex flex-row">
                        <div
                            class={`mr-1 cursor-pointer pr-0.5 pl-0.5 text-amber-500 shadow  hover:scale-110 hover:text-amber-400 hover:shadow-md ${
                                copyAnim && "animate-wiggle"
                            }`}
                            onClick={clip}
                            onAnimationEnd={() => {
                                setCopyAnim(false);
                            }}
                        >
                            📋
                        </div>
                        <div
                            class="cursor-pointer pr-0.5 pl-0.5 text-amber-500 shadow  hover:scale-110 hover:text-amber-400"
                            onClick={() => setExpanded((s) => !s)}
                        >
                            ↔
                        </div>
                    </div>
                )}
            </div>
            <pre
                ref={codeEle}
                {...props}
                class={`mx-2 overflow-x-auto px-1 py-1 font-mono text-lg ${props.class} `}
            >
                {props.children}
            </pre>
        </div>
    );
}
