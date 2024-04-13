export type Direction = "u" | "d" | "l" | "r";

export type Stratagem = {
    name: StratagemName;
    directions: Array<Direction>;
};

export type KeyAttempt =
    | {
          expected: Direction;
          actual: Direction;
          state: "success" | "fail";
      }
    | {
          expected: Direction;
          actual: undefined;
          state: "pending";
      };

export type PastAttempt = {
    stratagem: Stratagem;
    status: "success" | "fail";
    attempt: Array<KeyAttempt>;
};

export type StratagemName = "Resupply" | "Quasar Cannon";

export const stratagems: { [K in StratagemName]: Stratagem } = {
    Resupply: { name: "Resupply", directions: ["d", "d", "u", "r"] },
    "Quasar Cannon": {
        name: "Quasar Cannon",
        directions: ["d", "d", "u", "l", "r"],
    },
};

export type KeyMapping = Record<string, Direction>;

export const defaultMapping: KeyMapping = {
    w: "u",
    s: "d",
    a: "l",
    d: "r",
    ArrowUp: "u",
    ArrowDown: "d",
    ArrowLeft: "l",
    ArrowRight: "r",
};

export type GameActionNames = "reSetStrat" | "updateKeys" | "updateMapping";

export type GameAction = {};

export type Game = {
    seqBuf: Array<Direction>;
    keyMap: KeyMapping;
    currStrat: Stratagem | undefined;
    pastAttempts: Array<PastAttempt>;
};
