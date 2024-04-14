/** All the game logic and all code that modifies state. */

import {
    type GameState,
    type Direction,
    type Stratagem,
    type KeyAttempt,
    type CompletedAttempt,
    type CompletedKeyAttempt,
    defaultMapping,
} from "./GameTypes";

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

export function pushKey(state: GameState, key: string) {
    const lowerKey = lowerIfAlpha(key);
    const dir = state.keyMapping[lowerKey];
    if (dir === undefined || state.stratagem === null) {
        return;
    }

    const keysForCalc = [...state.keyBuf, dir];
    const keyAttempts = calc(state.stratagem, keysForCalc);
    const status = keyAttempts.some((a) => a.status === "fail")
        ? "fail"
        : keyAttempts.every((a) => a.status === "success")
          ? "success"
          : "pending";
    if (status === "pending") {
        state.keyBuf.push(dir);
        state.currentAttempt = keyAttempts;
        return;
    }

    const completed = keyAttempts as Array<CompletedKeyAttempt>;

    state.keyBuf = [];
    const completedAttempt: CompletedAttempt = {
        stratagem: state.stratagem,
        attempts: completed,
        status,
    };
    state.completedAttempts.unshift(completedAttempt);
    console.log("TODO: Set next stratagem.");
    const nextStrat = state.stratagem;
    state.currentAttempt = calc(nextStrat, []);
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
    stratagem.code.forEach((d, i) => {
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

export function setStratagem(state: GameState, stratagem: Stratagem) {
    state.stratagem = stratagem;
    state.keyBuf = [];
    state.currentAttempt = calc(stratagem, []);
}
