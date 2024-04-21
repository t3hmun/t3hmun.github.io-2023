import { createStore, produce } from "solid-js/store";
import { createEffect } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import * as G from "./Game";
import * as GT from "./GameTypes";

export function CreateGame() {
    const [gameState, setGameState] = createStore(G.initGameState());
    const keyDownEvent = useKeyDownEvent();
    createEffect(() => {
        // This event depends on keyDownEvent and nothing else, the only thing that appends to keyBuf. Other things may wipe it.
        const e = keyDownEvent();
        if (!e || e.repeat) return;
        const key = e.key;
        setGameState(produce((s) => G.pushKey(s, key)));
    });
    return {
        state: gameState,
        addStrat: (strat: GT.Stratagem) =>
            setGameState(produce((s) => G.addStrat(s, strat))),
        removeStrat: (index: number) =>
            setGameState(produce((s) => G.removeStrat(s, index))),
        restartRun: () => setGameState(produce(G.restartRun)),
    };
}
