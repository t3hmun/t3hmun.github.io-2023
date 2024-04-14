export type Direction = "u" | "d" | "l" | "r";

export type StratName =
    | "Reinforce"
    | "SOS Beacon"
    | "Resupply"
    | "Hell Bomb"
    | "SSSD Delivery"
    | "Seismic Probe"
    | "Upload Data"
    | "Eagle Rearm"
    | "SEAF Artillery"
    | "Eagle Strafing Run"
    | "Eagle Airstrike"
    | "Eagle Cluster Bomb"
    | "Eagle Napalm"
    | "Eagle 110MM Rocket Pods"
    | "Eagle 500kg Bomb"
    | "Quasar Cannon";

export type StratCategory =
    | "Mission"
    | "Eagle"
    | "Orbital"
    | "Weapon"
    | "Greens"
    | "Backpacks";

export type Stratagem = {
    name: StratName;
    category: StratCategory;
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
