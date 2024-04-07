/** @jsxImportSource solid-js */

import {
    createEffect,
    createMemo,
    createSignal,
    For,
    type JSX,
} from "solid-js";
import { defaultMapping, stratagems } from "./StratHeroTypes";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import type {
    Stratagem,
    Direction,
    KeyAttempt,
} from "../StratHero/StratHeroTypes";
import {
    AttemptComplete,
    CalcAttempt,
    MapRelevantKeys,
} from "./StratHeroLogic";

export function StratHero() {
    const keyDownEvent = useKeyDownEvent();
    const [keyMap, setKeyMap] = createSignal(defaultMapping);
    const [keyBuf, setKeyBuf] = createSignal<Array<string>>([]);
    const [currStrat, setCurrStrat] = createSignal<Stratagem | undefined>(
        undefined,
    );

    createEffect(() => {
        // This event depends on keyDownEvent and nothing else, the only thing that appends to keyBuf. Other things may wipe it.
        const e = keyDownEvent();
        if (!e || e.repeat) return;
        setKeyBuf((p) => [...p, e.key]);
    });

    const seqBuf = createMemo(() => MapRelevantKeys(keyMap(), keyBuf()));

    const attempt = createMemo(() => CalcAttempt(currStrat(), seqBuf()));

    const complete = createMemo(() => AttemptComplete(attempt()));

    return (
        <>
            <div class="grid gap-4 grid-flow-col auto-cols-max my-2">
                <Button onClick={() => setCurrStrat(stratagems.Resupply)}>
                    Resupply
                </Button>
                <Button
                    onClick={() => setCurrStrat(stratagems["Quasar Cannon"])}
                >
                    Quasar Cannon
                </Button>
                <Button onClick={() => setKeyBuf([])}>Reset Input</Button>
            </div>
            <div>SeqBuf: {seqBuf().join(",")}</div>
            <div>
                Attempt:
                {attempt()
                    ?.map((a) => `${a.actual},${a.expected},${a.state}`)
                    .join("|")}
            </div>

            <div class="flex justify-center">
                <div class="w-96">
                    <div class="bg-yellow-500 text-slate-900 text-center">
                        {currStrat()?.name ?? "Awaiting Stratagem"}
                    </div>
                    <div class="text-center">
                        <For each={attempt()} fallback={<span>⚠</span>}>
                            {(a) => <ActiveKeyAttempt keyAttempt={a} />}
                        </For>
                    </div>
                </div>
            </div>

            <h2 class="text-2xl mt-5 mb-3">Issues</h2>
            <ul class="list-disc pl-5">
                <li>
                    Holding down keys occasionally double registers, but you
                    shouldn't be holding down keys anyway.
                </li>
                <li>
                    Trying to capture the ctrl key in the browser is dodgy, so
                    this game simply ignores modifier keys.
                </li>
                <li>
                    This game pretends the current strat is the only only
                    possible strat and fails you immediately, keeps it simple.
                </li>
            </ul>
        </>
    );
}

type ButtonProps = {
    onClick: () => void;
    children: JSX.Element;
    class?: string;
};

function Button(props: ButtonProps) {
    return (
        <button
            class={`bg-orange-800 rounded active:scale-95  focus:shadow py-1 px-2 ${props.class}`}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

type ActiveKeyAttemptProps = {
    keyAttempt: KeyAttempt;
};

const CharMap: Record<Direction, string> = {
    u: "⇧",
    d: "⇩",
    l: "⇦",
    r: "⇨",
};

function ActiveKeyAttempt(props: ActiveKeyAttemptProps): JSX.Element {
    let color: string;
    switch (props.keyAttempt.state) {
        case "success":
            color = "text-green-500";
            break;
        case "fail":
            color = "text-red-500";
            break;
        default: // "pending"
            color = "text-gray-500";
    }

    return (
        <span class={`text-4xl text-center mx-3 ${color} `}>
            {CharMap[props.keyAttempt.expected]}
        </span>
    );
}
