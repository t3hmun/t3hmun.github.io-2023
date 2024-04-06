/** @jsxImportSource solid-js */

import { createEffect, createSignal, type JSX } from "solid-js";
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

type KeyAttempt = {
    expected: Direction;
    actual: Direction;
    success: boolean;
};

type CompletedAttempt = {
    stratagem: Stratagem;
    success: boolean;
    attempt: Array<KeyAttempt>;
};

type GameState = {
    stratagem: Stratagem;
    keySequence: Array<Direction>;
    attempt: Array<KeyAttempt>;
    completed: Array<CompletedAttempt>;
};

function printAttempt(attempt: Array<KeyAttempt>) {
    return attempt.map((a) => `[${a.actual},${a.expected}]`).join(" ");
}
function printCompleted(completed: Array<CompletedAttempt>) {
    return completed
        .map(
            (c) =>
                `${c.success}: ${c.stratagem.directions.join("-")} ${printAttempt(c.attempt)}`,
        )
        .join("\n");
}
function printState(state: GameState) {
    return `${state.stratagem.name} ${state.keySequence.join(" ")}\n${printAttempt(state.attempt)}\n${printCompleted(state.completed)}`;
}

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

    const [gameState, setGameState] = createSignal<GameState>({
        stratagem: stratagems.Resupply,
        keySequence: [],
        attempt: [],
        completed: [],
    });

    const event = useKeyDownEvent();

    createEffect(() => {
        const e = event();
        const m = mapping;
        if (e && !e.repeat) {
            const key = e.key.toLowerCase(); // The a mapping for keys with word names like ArrowUp will break if toLowerCase is removed.
            const direction = m[key];
            if (direction) {
                setGameState((prev) => {
                    let seq = [...prev.keySequence, direction];

                    // Just re-evaluate the whole attempt, it is cheap, simple and works when you reset the key sequence.
                    let attempt: Array<KeyAttempt> = [];
                    for (let i = 0; i < seq.length; i++) {
                        const actual = seq[i]!;
                        if (i >= prev.stratagem.directions.length) {
                            // Once the strat is finished extra keys don't matter.
                            break;
                        }
                        const expected = prev.stratagem.directions[i]!;
                        const success = expected === actual;
                        attempt.push({
                            expected,
                            actual,
                            success: success,
                        });
                    }

                    const completedAttempts = [...prev.completed];

                    if (!attempt.every((a) => a.success)) {
                        completedAttempts.push({
                            stratagem: prev.stratagem,
                            success: false,
                            attempt: attempt,
                        });
                        attempt = [];
                        seq = [];
                    } else if (
                        attempt.length === prev.stratagem.directions.length
                    ) {
                        completedAttempts.push({
                            stratagem: prev.stratagem,
                            success: true,
                            attempt: attempt,
                        });
                        attempt = [];
                        seq = [];
                    }
                    return {
                        stratagem: prev.stratagem,
                        keySequence: seq,
                        attempt: attempt,
                        completed: completedAttempts,
                    };
                });
            }
        }
    });

    return (
        <>
            <h1>yo</h1>
            <Button
                class="my-2"
                onClick={() => setGameState((p) => ({ ...p, keySequence: [] }))}
            >
                Clear
            </Button>
            <p class="font-mono">KEYS:</p>
            <pre class="whitespace-pre">{printState(gameState())}</pre>

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
