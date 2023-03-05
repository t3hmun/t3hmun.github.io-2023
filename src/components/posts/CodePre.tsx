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
    const [glowTooltip, setGlowTooltip] = useState(false);
    const [copyClicked, setCopyClicked] = useState(0);
    const [toolTip, setToolTip] = useState("default");
    let codeEle = useRef<null | HTMLPreElement>(null);
    useEffect(() => {
        // This effect only runs client side, so it enables the features for the js enabled.
        setClientSideJs(true);
    });
    useEffect(() => {
        if (copyClicked == 0) return;
        setGlowTooltip(true);
        var timeout = setTimeout(() => {
            setGlowTooltip(false);
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [copyClicked]);

    function clip() {
        if (!codeEle) return;
        const innerText = codeEle.current?.innerText;
        if (!innerText) return;
        navigator.clipboard.writeText(innerText);
        setCopyClicked((x) => x + 1);
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
                            class={`pr-0.5 pl-0.5 text-amber-400  transition ${
                                glowTooltip
                                    ? "text-amber-400"
                                    : "text-amber-100"
                            }`}
                        >
                            {toolTip}
                        </div>
                        <div
                            class="cursor-pointer pr-2 pl-0.5 text-amber-500 hover:text-amber-400"
                            onClick={clip}
                            onMouseEnter={() => setToolTip("Copy")}
                            onMouseLeave={() => setToolTip("")}
                        >
                            📋
                        </div>
                        <div
                            class="cursor-pointer pr-0.5 pl-0.5 text-amber-500 hover:text-amber-400"
                            onClick={() => setExpanded((s) => !s)}
                            onMouseEnter={() => setToolTip("Expand")}
                            onMouseLeave={() => setToolTip("")}
                        >
                            ↔
                        </div>
                    </div>
                )}
            </div>
            <pre
                ref={codeEle}
                {...props}
                class={`mx-2 overflow-x-auto px-2 py-1 font-mono ${props.class} `}
            >
                {props.children}
            </pre>
        </div>
    );
}
