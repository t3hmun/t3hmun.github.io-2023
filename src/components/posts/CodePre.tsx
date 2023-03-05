import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

type CodePreProps = {
    "data-lang": string;
    "data-theme": string;
    class: string;
    children: ComponentChildren;
};

export function CodePre(props: CodePreProps): JSX.Element {
    const lang = props["data-lang"];
    const theme = props["data-theme"];
    const [clientSideJs, setClientSideJs] = useState(false);
    useEffect(() => {
        // This effect only runs client side, so it enables the features for the js enabled.
        setClientSideJs(true);
    });
    return (
        <div
            class={`mx-auto my-4 max-w-3xl rounded-md border-0 bg-stone-200 pb-2 dark:bg-stone-800 display-${theme}`}
        >
            <div class="text-s flex justify-between rounded-t-md border-0 bg-stone-300 px-2 py-1 dark:bg-stone-700">
                <div>{lang}</div>
                {clientSideJs && <div>I have JS</div>}
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
