/** @jsxImportSource solid-js */

import { createEffect, type ComponentProps } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import type { Direction, KeyAttempt } from "../StratHero/StratHeroTypes";

export function StratHero() {
    const keyDownEvent = useKeyDownEvent();

    createEffect(() => {
        // This event depends on keyDownEvent and nothing else, the only thing that appends to keyBuf. Other things may wipe it.
        const e = keyDownEvent();
        if (!e || e.repeat) return;
        const key = e.key;
        // TODO: Send the key to the game.
    });

    return (
        <>
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

type ButtonProps = ComponentProps<"button"> & {};

function Button(props: ButtonProps) {
    return (
        <button
            {...props}
            class={`bg-orange-800 rounded active:scale-95  focus:shadow py-1 px-2 ${props.class}`}
        >
            {props.children}
        </button>
    );
}
