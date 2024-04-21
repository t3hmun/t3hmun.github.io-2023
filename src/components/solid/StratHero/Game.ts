/** All the game logic and all code that modifies state. */

import * as GT from "./GameTypes";
import * as R from "remeda";

function logError(ctx: unknown) {
    // TODO: Add errored flag and get the game to reset state on next interaction?
    console.log(new Error(JSON.stringify(ctx, null, 2)));
}

export function initGameState(): GT.GameState {
    const ms = GT.strats["Mission"]!;
    return {
        keyMapping: GT.defaultMapping,
        runList: [initStrat(ms[0]!), initStrat(ms[1]!), initStrat(ms[2]!)],
        runListIndex: 0,
        attempts: [],
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
    if (keyAttempts.find((a) => a.status === "fail")) return; // Ignore extra key presses after a fail.
    const next = keyAttempts.find((a) => a.actual === null);
    if (next === undefined) return; // Ignore extra key presses on the end of strats.
    next.actual = dir;
    next.status = next.expected === next.actual ? "success" : "fail";
    return next.status;
}

function retryAttempt(attempt: GT.StratAttempt) {
    attempt.status = "incomplete";
    attempt.attempts.forEach((a) => {
        a.actual = null;
        a.status = "pending";
    });
}
function resetAttempt(attempt: GT.StratAttempt) {
    attempt.status = "incomplete";
    attempt.attempts.forEach((a) => {
        a.actual = null;
        a.status = "pending";
    });
    attempt.startTime = null;
    attempt.endTime = null;
}

export function finaliseCurrentStratAttempt(state: GT.GameState) {
    if (state.runListIndex === null) return;
    const attempt = getCurrentStratAttempt(state);
    if (attempt === null) return;
    attempt.status = attempt.attempts.every((a) => a.status === "success")
        ? "success"
        : "fail";
    attempt.endTime = new Date();
    state.attempts.push(R.clone(attempt));

    if (attempt.status === "success") {
        state.runListIndex++;
        const next = state.runList[state.runListIndex];
        if (next === undefined) {
            state.runListIndex = null;
        } else {
            next.startTime = new Date();
        }
    } else {
        // Failed attempt has to be reset, the player has to try again until they get it.
        retryAttempt(attempt);
    }
}

function startNewRun(state: GT.GameState) {
    if (state.runList[0] === undefined) return;
    state.runListIndex = 0;
    state.runList.forEach(resetAttempt);
    state.attempts = [];
    //state.runList[0].startTime = new Date(); - let the first key press start the timing.
}

export function pushKey(state: GT.GameState, key: string) {
    if (key === "Enter") {
        // Enter either starts a new run or signals completion of the current strat.
        if (state.runListIndex === null) {
            startNewRun(state);
        } else {
            finaliseCurrentStratAttempt(state);
        }
        return;
    }
    const lowerKey = lowerIfAlpha(key);
    const dir = state.keyMapping[lowerKey];
    const currentStrat = getCurrentStratAttempt(state);
    if (dir === undefined || currentStrat === null) {
        return;
    }
    if (currentStrat.status === "incomplete") {
        const result = pushDir(dir, currentStrat.attempts);
        if (currentStrat.startTime === null)
            currentStrat.startTime = new Date();
        if (result === "fail") {
            finaliseCurrentStratAttempt(state);
        }
    }
}

function initStrat(strat: GT.Stratagem): GT.StratAttempt {
    return {
        stratagem: strat,
        status: "incomplete",
        attempts: strat.code.map((dir) => ({
            expected: dir,
            actual: null,
            status: "pending",
        })),
        startTime: null,
        endTime: null,
    };
}

export function addStrat(state: GT.GameState, strat: GT.Stratagem) {
    state.runList.push(initStrat(strat));
}

export function removeStrat(state: GT.GameState, index: number) {
    if (state.runList.length <= index) {
        logError({ index, state });
        return;
    }
    state.runList.splice(index, 1);
}

export function restartRun(state: GT.GameState) {
    startNewRun(state);
}
