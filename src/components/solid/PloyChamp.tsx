/** @jsxImportSource solid-js */

import { createEffect, createSignal, For, type JSX } from "solid-js";
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

type KeyAttempt =
    | {
          expected: Direction;
          actual: Direction;
          success: boolean;
      }
    | {
          expected: Direction;
          actual: undefined;
          success: undefined;
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
    return attempt.map((a) => `[${a.actual ?? ""},${a.expected}]`).join(" ");
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

function GameStateLogic(prev: GameState, direction: Direction) {
    let seq = [...prev.keySequence, direction];
    const stratagem = prev.stratagem;

    // Just re-evaluate the whole attempt, it is cheap, simple and works when you reset the key sequence.
    let attempt: Array<KeyAttempt> = [];

    stratagem.directions.forEach((expected, i) => {
        const actual = seq[i];
        if (actual === undefined) {
            attempt.push({
                expected,
                actual: undefined,
                success: undefined,
            });
            return;
        }
        const success = expected === actual;
        attempt.push({
            expected,
            actual,
            success: success,
        });
    });

    const completedAttempts = [...prev.completed];

    const success = attempt.every((a) => a.success === true);
    const complete = success || attempt.some((a) => a.success === false);

    if (complete) {
        completedAttempts.unshift({
            stratagem: stratagem,
            success: success,
            attempt: attempt,
        });
        attempt = stratagem.directions.map((d) => ({
            expected: d,
            actual: undefined,
            success: undefined,
        }));
        seq = [];
    }

    return {
        stratagem: prev.stratagem,
        keySequence: seq,
        attempt: attempt,
        completed: completedAttempts,
    };
}

function initState(stratagem: Stratagem): GameState {
    return {
        stratagem: stratagem,
        keySequence: [],
        attempt: stratagem.directions.map((d) => ({
            expected: d,
            actual: undefined,
            success: undefined,
        })),
        completed: [],
    };
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

    const [gameState, setGameState] = createSignal<GameState>(
        initState(stratagems.Resupply),
    );

    const event = useKeyDownEvent();

    createEffect(() => {
        const e = event();
        const m = mapping;
        if (e && !e.repeat) {
            const key = e.key.toLowerCase(); // The a mapping for keys with word names like ArrowUp will break if toLowerCase is removed.
            const direction = m[key];
            if (direction) {
                setGameState((prev) => GameStateLogic(prev, direction));
            }
        }
    });

    return (
        <>
            <Button
                class="my-2"
                onClick={() => setGameState((p) => initState(p.stratagem))}
            >
                Reset
            </Button>

            <div class="flex justify-center">
                <div class="w-96">
                    <div class="bg-yellow-500 text-slate-900 text-center">
                        {gameState().stratagem.name.toUpperCase()}
                    </div>
                    <div class="text-center">
                        <For each={gameState().attempt}>
                            {(a) => <ActiveKeyAttempt keyAttempt={a} />}
                        </For>{" "}
                    </div>
                    <div class="text-center d-flex flex-column">
                        <For each={gameState().completed}>
                            {(c) => (
                                <div>
                                    <For each={c.attempt}>
                                        {(a) => (
                                            <ActiveKeyAttempt keyAttempt={a} />
                                        )}
                                    </For>
                                </div>
                            )}
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

            <h2 class="text-2xl mt-5 mb-3">Game State Debug</h2>
            <pre class="whitespace-pre">{printState(gameState())}</pre>
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
    switch (props.keyAttempt.success) {
        case true:
            color = "text-green-500";
            break;
        case false:
            color = "text-red-500";
            break;
        default:
            color = "text-gray-500";
    }

    return (
        <span class={`text-4xl text-center mx-3 ${color} `}>
            {CharMap[props.keyAttempt.expected]}
        </span>
    );
}
