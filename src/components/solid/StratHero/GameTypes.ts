export type Direction = "u" | "d" | "l" | "r";

import stratagemsJson from "./strats.json";

export const strats = stratagemsJson as StratagemDataJson;

const u = "u";
const d = "d";
const l = "l";
const r = "r";

export const defaultMapping: KeyMapping = {
    w: u,
    s: d,
    a: l,
    d: r,
    ArrowUp: u,
    ArrowDown: d,
    ArrowLeft: l,
    ArrowRight: r,
};

export type Stratagem = {
    readonly name: string;
    readonly code: Array<Direction>;
    readonly category: string;
};

export type StratagemDataJson = Record<string, Array<Stratagem>>;

export type SuccessfulKeyAttempt = {
    expected: Direction;
    actual: Direction;
    status: "success";
};

export type FailedKeyAttempt = {
    expected: Direction;
    actual: Direction | null;
    status: "fail";
};

export type PendingKeyAttempt = {
    expected: Direction;
    actual: null;
    status: "pending";
};

export type KeyAttempt =
    | SuccessfulKeyAttempt
    | FailedKeyAttempt
    | PendingKeyAttempt;

export type StratAttempt = {
    stratagem: Stratagem;
    attempts: Array<KeyAttempt>;
    status: "incomplete" | "success" | "fail";
    startTime: Date | null;
    endTime: Date | null;
};

export type KeyMapping = Record<string, Direction>;

export type GameState = {
    keyMapping: KeyMapping;
    runListIndex: number | null;
    runList: Array<StratAttempt>;
    attempts: Array<StratAttempt>;
};
