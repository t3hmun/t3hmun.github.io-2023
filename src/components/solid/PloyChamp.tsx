/** @jsxImportSource solid-js */

import { For, createSignal } from "solid-js";

export function PloyChamp() {
    const [thing, setThing] = createSignal("inital");
    const [things, setThings] = createSignal<Array<string>>([]);
    const [challenges, setChallenges] = createSignal<Array<ChallengeProps>>([]);

    return (
        <>
            <p>{thing()}</p>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                onClick={() => setThing("A") && setThings([...things(), "A"])}
            >
                A
            </button>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setThing("B") && setThings([...things(), "B"])}
            >
                B
            </button>
            <Challenge stratagem={["A", "B"]} attempt={things()} />
        </>
    );
}

type ButtonProps = {
    onClick: () => void;
    children:
}

function Button(){}

type ChallengeProps = {
    stratagem: Array<string>;
    attempts: Array<Array<PressProps>>;
};

function Challenge(props: ChallengeProps) {
    return (
        <>
            <p class="text-center">
                <For each={props.stratagem}>
                    {(thing) => <span class="mr-2 text-blue-500">{thing}</span>}
                </For>
            </p>
            <ul>
                <For each={props.attempts}>
                    {(attempt) => (
                        <li>
                            <ul class="flex flex-wrap items-center justify-center">
                                <For each={attempt}>
                                    {(pressProps) => (
                                        <li>
                                            <Press {...pressProps} />
                                        </li>
                                    )}
                                </For>
                            </ul>
                        </li>
                    )}
                </For>
            </ul>
        </>
    );
}

type PressProps = {
    direction: string;
    valid: boolean;
};

function Press(props: PressProps) {
    // TODO: Figure out if Solid really wants me to use a function here
    const color = () => props.valid ? "text-green-500" : "text-red-500";
    return <span class={`${color()}`}>{props.direction}</span>;
}
