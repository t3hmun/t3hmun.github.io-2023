import type { NameMap, StratagemName, KeyMapping } from "./GameTypes";

/* CONSTS */

export const stratagems: NameMap<StratagemName> = {
    Reinforce: {
        name: "Reinforce",
        directions: ["u", "d", "r", "l", "u"],
    },
    Resupply: { name: "Resupply", directions: ["d", "d", "u", "r"] },
    "Quasar Cannon": {
        name: "Quasar Cannon",
        directions: ["d", "d", "u", "l", "r"],
    },
};

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
