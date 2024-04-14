import type { NameMap, StratName, KeyMapping } from "./GameTypes";

/* CONSTS */

const u = "u";
const d = "d";
const l = "l";
const r = "r";

export const stratagems: NameMap<StratName> = {
    Reinforce: {
        name: "Reinforce",
        category: "Mission",
        directions: [u, d, r, l, u],
    },
    "SOS Beacon": {
        name: "SOS Beacon",
        category: "Mission",
        directions: [u, d, r, u],
    },
    Resupply: {
        name: "Resupply",
        category: "Mission",
        directions: [d, d, u, r],
    },
    "Hell Bomb": {
        name: "Hell Bomb",
        category: "Mission",
        directions: [u, d, l, d, u, r, d, u],
    },
    "SSSD Delivery": {
        name: "SSSD Delivery",
        category: "Mission",
        directions: [d, d, d, u, u],
    },
    "Seismic Probe": {
        name: "Seismic Probe",
        category: "Mission",
        directions: [u, u, l, r, d, d],
    },
    "Upload Data": {
        name: "Upload Data",
        category: "Mission",
        directions: [d, d, u, u, u],
    },
    "Eagle Rearm": {
        name: "Eagle Rearm",
        category: "Eagle",
        directions: [u, u, l, u, r],
    },
    "SEAF Artillery": {
        name: "SEAF Artillery",
        category: "Orbital",
        directions: [r, u, u, d],
    },
    "Eagle Strafing Run": {
        name: "Eagle Strafing Run",
        category: "Eagle",
        directions: [u, r, r],
    },
    "Eagle Airstrike": {
        name: "Eagle Airstrike",
        category: "Eagle",
        directions: [u, r, d, r],
    },
    "Eagle Cluster Bomb": {
        name: "Eagle Cluster Bomb",
        category: "Eagle",
        directions: [u, r, d, d, r],
    },
    "Eagle Napalm": {
        name: "Eagle Napalm",
        category: "Eagle",
        directions: [u, r, d, u],
    },
    "Eagle 110MM Rocket Pods": {
        name: "Eagle 110MM Rocket Pods",
        category: "Eagle",
        directions: [u, r, u, l],
    },
    "Eagle 500kg Bomb": {
        name: "Eagle 500kg Bomb",
        category: "Eagle",
        directions: [u, r, d, d, d],
    },
    "Quasar Cannon": {
        name: "Quasar Cannon",
        category: "Weapon",
        directions: [d, d, u, l, r],
    },
};

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
