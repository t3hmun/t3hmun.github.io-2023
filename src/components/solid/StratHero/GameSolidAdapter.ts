import { createStore, produce } from "solid-js/store";
import * as Game from "./Game";
import { createEffect } from "solid-js";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import type { Stratagem } from "./GameTypes";

export function CreateGame() {
    const [gameState, setGameState] = createStore(Game.initGameState());
    const keyDownEvent = useKeyDownEvent();
    createEffect(() => {
        // This event depends on keyDownEvent and nothing else, the only thing that appends to keyBuf. Other things may wipe it.
        const e = keyDownEvent();
        if (!e || e.repeat) return;
        const key = e.key;
        setGameState(produce((s) => Game.pushKey(s, key)));
    });
    return {
        state: gameState,
        setStratagem: (stratagem: Stratagem) =>
            setGameState(produce((s) => Game.setStratagem(s, stratagem))),
    };
}
