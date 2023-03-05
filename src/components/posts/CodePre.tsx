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
            class={`mx-auto my-4 max-w-3xl rounded-md border-0 pb-2 dark:bg-stone-800 display-${theme}`}
        >
            <div className="text-s flex justify-between rounded-t-md border-0 bg-stone-700 px-2 py-1">
                <div>{lang}</div>
                {clientSideJs && <div>I have JS</div>}
            </div>
            <pre
                className={`mx-2 overflow-x-auto px-2 py-1 font-mono ${props.class} `}
                {...props}
            >
                {props.children}
            </pre>
        </div>
    );
}
