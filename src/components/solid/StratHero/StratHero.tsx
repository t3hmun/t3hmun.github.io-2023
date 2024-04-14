/** @jsxImportSource solid-js */

import { createEffect, type ComponentProps, For } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import { createStore } from "solid-js/store";

import * as Game from "./Game";
import * as GameConsts from "./GameConsts";
import * as GameTypes from "./GameTypes";
import { ArrowWidget } from "./Components/ArrowWidget";

export function StratHero() {
    const keyDownEvent = useKeyDownEvent();
    const [gameState, setGameState] = createStore(Game.initGameState());

    createEffect(() => {
        // This event depends on keyDownEvent and nothing else, the only thing that appends to keyBuf. Other things may wipe it.
        const e = keyDownEvent();
        if (!e || e.repeat) return;
        const key = e.key;
        Game.pushKey(setGameState, key);
    });

    return (
        <>
            <div class="flex justify-center">
                <div class="flex flex-row mb-8">
                    <For
                        each={
                            Object.keys(
                                GameConsts.stratagems,
                            ) as Array<GameTypes.StratagemName>
                        }
                    >
                        {(name) => (
                            <Button
                                class="mr-2"
                                onClick={() => {
                                    Game.setStratagem(setGameState, name);
                                }}
                            >
                                {name}
                            </Button>
                        )}
                    </For>
                </div>
            </div>
            <div class="flex justify-center">
                <div class="w-96">
                    <div class="bg-yellow-500 text-slate-900 text-center h-6">
                        {gameState.stratagem?.name ??
                            "Awaiting Stratagem Selection"}
                    </div>
                    <div class="text-center h-12">
                        <For each={gameState.currentAttempt}>
                            {(keyAttempt) => (
                                <ArrowWidget keyAttempt={keyAttempt} />
                            )}
                        </For>
                    </div>
                    <div class="bg-yellow-500 text-slate-900 text-center h-6"></div>
                    <div class="flex flex-col text-center">
                        <For each={gameState.completedAttempts}>
                            {(completedAttempt) => (
                                <div>
                                    <For each={completedAttempt.attempts}>
                                        {(keyAttempt) => (
                                            <ArrowWidget
                                                keyAttempt={keyAttempt}
                                            />
                                        )}
                                    </For>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </div>
            <h2 class="text-2xl mt-5 mb-3">What</h2>
            <p>
                This is a simple version of the Stratagem Hero mini-game in
                Helldivers 2. This page is the first thing I have ever tried to
                write using{" "}
                <a class="text-blue-300" href="https://docs.solidjs.com">
                    Solid
                </a>
                , this page is an experiment to try out the library. The Solid
                component is contained an{" "}
                <a
                    class="text-blue-300"
                    href="https://docs.astro.build/en/concepts/islands/"
                >
                    Astro island
                </a>
                .
            </p>
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
