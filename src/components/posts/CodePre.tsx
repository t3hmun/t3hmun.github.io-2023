import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

type CodePreProps = {
    "data-lang": string;
    "data-theme": string;
    "data-filename"?: string;
    class: string;
    children: ComponentChildren;
};

export function CodePre(props: CodePreProps): JSX.Element {
    const lang = props["data-lang"];
    const theme = props["data-theme"];
    const filename = props["data-filename"];
    const title = filename ?? lang;
    const [clientSideJs, setClientSideJs] = useState(false);
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        // This effect only runs client side, so it enables the features for the js enabled.
        setClientSideJs(true);
    });
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
                    <div class="">
                        <div
                            class="cursor-pointer rounded-r-full pr-0.5 pl-0.5 text-amber-500 hover:text-amber-400"
                            onClick={() => setExpanded((s) => !s)}
                        >
                            ↔
                        </div>
                    </div>
                )}
            </div>
            <pre
                {...props}
                class={`mx-2 overflow-x-auto px-2 py-1 font-mono ${props.class} `}
            >
                {props.children}
            </pre>
        </div>
    );
}
