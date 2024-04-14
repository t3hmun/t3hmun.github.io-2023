export type Direction = "u" | "d" | "l" | "r";

export type StratagemName = "Resupply" | "Quasar Cannon" | "Reinforce";

export type Stratagem = {
    name: StratagemName;
    directions: Array<Direction>;
};
/** This is a utility to create an dictionary of objects keyed by their name property. */

export type NameMap<Keys extends string> = {
    [K in Keys]: { name: K } & Stratagem;
};

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
