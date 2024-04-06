/** @jsxImportSource solid-js */

import { createEffect, createSignal } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";

type Direction = "u" | "d" | "l" | "r";
type StratagemName = "Resupply";

type Stratagem = {
    name: StratagemName;
    directions: Array<Direction>;
};

const stratagems: Record<StratagemName, Stratagem> = {
    Resupply: { name: "Resupply", directions: ["d", "d", "u", "r"] },
};

export function PloyChamp() {
    /** If I decide to make this editable then need to add another "no-in-game" signal to suspend accepting new key-presses? */
    const mapping: Record<string, Direction> = {
        w: "u",
        s: "d",
        a: "l",
        d: "r",
        arrowup: "u",
        arrowdown: "d",
        arrowleft: "l",
        arrowright: "r",
    };

    const [lastSeq, setLastSeq] = createSignal<Array<Direction>>([]);
    const [stratagem, setStratagem] = createSignal<Stratagem>(
        stratagems.Resupply,
    );

    const event = useKeyDownEvent();

    createEffect(() => {
        const e = event();
        const m = mapping;
        if (e && !e.repeat) {
            const key = e.key.toLowerCase(); // The a mapping for keys with word names like ArrowUp will break if toLowerCase is removed.
            const direction = m[key];
            if (direction) {
                setLastSeq((prev) => [...prev, direction]);
            }
        }
    });

    return (
        <>
            <h1>yo</h1>
            <Button class="my-2" onClick={() => setLastSeq([])}>
                Clear
            </Button>
            <p class="font-mono">KEYS: {lastSeq()}</p>

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
