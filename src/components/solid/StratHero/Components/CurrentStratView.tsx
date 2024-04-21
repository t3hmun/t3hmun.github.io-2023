/** @jsxImportSource solid-js */

import { For, Show, createMemo, createSignal, onCleanup } from "solid-js";
import * as GT from "../GameTypes";
import { ArrowWidget } from "./ArrowWidget";

export function CurrentStratView(props: {
    runListIndex: number | null;
    runList: GT.StratAttempt[];
}) {
    const strat = createMemo(() => {
        const index = props.runListIndex;
        if (index === null) return null;
        return props.runList[index];
    });

    const [elapsedS, setElapsedS] = createSignal(null as number | null);
    const timer = setInterval(() => {
        const start = strat()?.startTime;
        if (start) {
            setElapsedS((Date.now() - start.getTime()) / 1000);
        } else {
            setElapsedS(null);
        }
    }, 10);
    onCleanup(() => clearInterval(timer));

    return (
        <div class="w-96">
            <div class="bg-yellow-500 text-slate-900 text-center h-6">
                {strat()?.stratagem.name ?? "Awaiting Stratagem Selection"}
            </div>
            <div class="text-center h-12">
                <For each={strat()?.attempts}>
                    {(keyAttempt) => <ArrowWidget keyAttempt={keyAttempt} />}
                </For>
            </div>
            <div class="bg-yellow-500 text-slate-900 text-center h-6">
                <Show
                    when={strat()?.startTime !== null}
                    fallback={<span>Waiting...</span>}
                >
                    {elapsedS()}
                </Show>
            </div>
        </div>
    );
}
