export type Direction = "u" | "d" | "l" | "r";

export type Stratagem = {
    name: StratagemName;
    directions: Array<Direction>;
};

type AttemptStatus = "success" | "fail" | "incomplete";

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

export type StratAttempt = {
    stratagem: Stratagem;
    status: AttemptStatus;
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
