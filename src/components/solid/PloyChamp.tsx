/** @jsxImportSource solid-js */

import { createSignal } from "solid-js";

export function PloyChamp() {
    const [thing, setThing] = createSignal("inital");
    return (
        <>
            <p>{thing()}</p>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                onClick={() => setThing("A")}
            >
                A
            </button>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setThing("B")}
            >
                B
            </button>
        </>
    );
}
