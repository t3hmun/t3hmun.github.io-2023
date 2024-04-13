export type Direction = "u" | "d" | "l" | "r";

export type StratagemName = "Resupply" | "Quasar Cannon";

export type Stratagem = {
    name: StratagemName;
    directions: Array<Direction>;
};

type NameMap<Keys extends string> = { [K in Keys]: { name: K } & Stratagem };

export const stratagems: NameMap<StratagemName> = {
    Resupply: { name: "Resupply", directions: ["d", "d", "u", "r"] },
    "Quasar Cannon": {
        name: "Quasar Cannon",
        directions: ["d", "d", "u", "l", "r"],
    },
};

export type KeyAttempt =
    | {
          expected: Direction;
          actual: Direction;
          state: "success" | "fail";
      }
    | {
          expected: Direction;
          state: "pending";
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
