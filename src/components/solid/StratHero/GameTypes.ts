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
    name: string;
    code: Array<Direction>;
    category: string;
};

export type StratagemDataJson = Record<string, Array<Stratagem>>;

export type CompletedKeyAttempt = {
    expected: Direction;
    actual: Direction;
    status: "success" | "fail";
};

export type PendingKeyAttempt = {
    expected: Direction;
    status: "pending";
};

export type KeyAttempt = CompletedKeyAttempt | PendingKeyAttempt;

export type CompletedAttempt = {
    stratagem: Stratagem;
    attempts: Array<CompletedKeyAttempt>;
    status: "success" | "fail";
};

export type KeyMapping = Record<string, Direction>;

export type GameState = {
    keyMapping: KeyMapping;
    stratagem: Stratagem | null;
    keyBuf: Array<Direction>;
    currentAttempt: Array<KeyAttempt>;
    completedAttempts: Array<CompletedAttempt>;
};

export type StateUpdater = (state: GameState) => void;
