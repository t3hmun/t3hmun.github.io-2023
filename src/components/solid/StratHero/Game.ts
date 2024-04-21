/** All the game logic and all code that modifies state. */

import * as GT from "./GameTypes";

function logError(ctx: unknown) {
    // TODO: Add errored flag and get the game to reset state on next interaction?
    console.log(new Error(JSON.stringify(ctx, null, 2)));
}

export function initGameState(): GT.GameState {
    return {
        keyMapping: GT.defaultMapping,
        runList: [],
        runListIndex: null,
    };
}

const isSingleAlpha = /^[a-zA-Z]$/;
function lowerIfAlpha(key: string) {
    return isSingleAlpha.test(key) ? key.toLowerCase() : key;
}

function getCurrentStratAttempt(state: GT.GameState): GT.StratAttempt | null {
    const { runListIndex, runList } = state;
    if (runListIndex === null) return null;
    const strat = runList[runListIndex];
    if (strat === undefined) {
        logError({ state });
        return null;
    }
    return strat;
}

function pushDir(dir: GT.Direction, keyAttempts: Array<GT.KeyAttempt>) {
    const next = keyAttempts.find((a) => a.actual === null);
    if (next === undefined) return; // Ignore extra key presses on the end of strats.
    next.actual = dir;
    next.status = next.expected === next.actual ? "success" : "fail";
}

export function endCurrentStrat(state: GT.GameState) {
    if (state.runListIndex === null) return;
    const attempt = getCurrentStratAttempt(state);
    if (attempt === null) return;
    state.runListIndex++;
    if (state.runListIndex >= state.runList.length) {
        // The list is completed.
        state.runListIndex = null;
    }
    attempt.status = attempt.attempts.every((a) => a.status === "success")
        ? "success"
        : "fail";
}

export function pushKey(state: GT.GameState, key: string) {
    if (key === "Enter") {
        endCurrentStrat(state);
        return;
    }
    const lowerKey = lowerIfAlpha(key);
    const dir = state.keyMapping[lowerKey];
    const currentStrat = getCurrentStratAttempt(state);
    if (dir === undefined || currentStrat === null) {
        return;
    }
    if (currentStrat.status === "incomplete") {
        pushDir(dir, currentStrat.attempts);
    }
    if (currentStrat.attempts.every((a) => a.status !== "pending")) {
        endCurrentStrat(state);
    }
}

export function addStrat(state: GT.GameState, strat: GT.Stratagem) {
    state.runList.push({
        stratagem: strat,
        attempts: strat.code.map((dir) => ({
            expected: dir,
            actual: null,
            status: "pending",
        })),
        status: "incomplete",
    });
}

export function removeStrat(state: GT.GameState, index: number) {
    if (state.runList.length <= index) {
        logError({ index, state });
        return;
    }
    state.runList.splice(index, 1);
}

export function restartRun(state: GT.GameState) {
    state.runListIndex = 0;
    for (const strat of state.runList) {
        strat.status = "incomplete";
        strat.attempts.forEach((a) => {
            a.actual = null;
            a.status = "pending";
        });
    }
}
