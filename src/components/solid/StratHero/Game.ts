/** All the game logic and all code that modifies state.
 * Ideally this would not depend on SolidJs but in order to use a store with fine grained reactivity all state updates need to go though setStore.
 * Could break the dependency by always returning the full state object, then the solid component just overwrites the whole state object, just like in React, but that misses out on what is interesting about solid.
 * In reality none of this matters, the state is so small that any approach will work fine.
 * */

import { produce, type SetStoreFunction } from "solid-js/store";
import type {
    StratagemName,
    GameState,
    Direction,
    Stratagem,
    KeyAttempt,
    CompletedAttempt,
    CompletedKeyAttempt,
} from "./GameTypes";
import { defaultMapping, stratagems } from "./GameConsts";

export function initGameState(): GameState {
    return {
        keyMapping: defaultMapping,
        stratagem: null,
        keyBuf: [],
        currentAttempt: calc(null, []),
        completedAttempts: [],
    };
}

const isSingleAlpha = /^[a-zA-Z]$/;
function lowerIfAlpha(key: string) {
    return isSingleAlpha.test(key) ? key.toLowerCase() : key;
}

export function pushKey(
    setGameState: SetStoreFunction<GameState>,
    key: string,
) {
    const lowerKey = lowerIfAlpha(key);
    setGameState(
        produce((s) => {
            const dir = s.keyMapping[lowerKey];
            if (dir === undefined || s.stratagem === null) {
                return;
            }

            const keysForCalc = [...s.keyBuf, dir];
            const keyAttempts = calc(s.stratagem, keysForCalc);
            const status = keyAttempts.some((a) => a.status === "fail")
                ? "fail"
                : keyAttempts.every((a) => a.status === "success")
                  ? "success"
                  : "pending";
            if (status === "pending") {
                s.keyBuf.push(dir);
                s.currentAttempt = keyAttempts;
                return;
            }

            const completed = keyAttempts as Array<CompletedKeyAttempt>;

            s.keyBuf = [];
            const completedAttempt: CompletedAttempt = {
                stratagem: s.stratagem,
                attempts: completed,
                status,
            };
            s.completedAttempts.unshift(completedAttempt);
            console.log("TODO: Set next stratagem.");
            const nextStrat = s.stratagem;
            s.currentAttempt = calc(nextStrat, []);
        }),
    );
}

function calc(
    stratagem: Stratagem | null,
    keys: Array<Direction>,
): Array<KeyAttempt> {
    if (stratagem === null) {
        return [];
    }
    const attempts: Array<KeyAttempt> = [];
    // Loop though stratagem only, extra key presses after a strat is finished are ignored, consistent with the game.)
    stratagem.directions.forEach((d, i) => {
        const key = keys[i];
        if (key === undefined) {
            attempts.push({ expected: d, status: "pending" });
            return;
        }
        if (key === d) {
            attempts.push({ expected: d, actual: d, status: "success" });
            return;
        }
        attempts.push({ expected: d, actual: key, status: "fail" });
    });
    return attempts;
}

export function setStratagem(
    setGameState: SetStoreFunction<GameState>,
    name: StratagemName,
) {
    setGameState(
        produce((s) => {
            s.stratagem = stratagems[name];
            s.keyBuf = [];
            s.currentAttempt = calc(stratagems[name], []);
        }),
    );
}
