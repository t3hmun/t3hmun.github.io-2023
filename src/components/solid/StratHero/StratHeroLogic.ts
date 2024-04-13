import type {
    Direction,
    Game,
    GameAction,
    KeyAttempt,
    KeyMapping,
    Stratagem,
} from "./StratHeroTypes";

export function GameDispatch(state: Game, action: GameAction): Game {}

function lowerIfSingleAlpha(key: string): string {
    return /^[a-zA-Z]$/.test(key) ? key.toLowerCase() : key;
}
function MapRelevantKeys(
    keyMapping: KeyMapping,
    keys: Array<string>,
): Array<Direction> {
    return keys
        .map(lowerIfSingleAlpha)
        .map((key) => keyMapping[key])
        .filter((mappedKey): mappedKey is Direction => mappedKey !== undefined);
}

function CalcAttempt(
    stratAttempt: StratAttempt,
): Array<KeyAttempt> | undefined {
    const stratagem = stratAttempt.stratagem;
    const s;
    // If no stratagem is selected, attempt cant be defined at all.
    if (!stratagem) return undefined;
    // Ignore keys pressed after the strat is complete, the Helldivers doesn't care.
    // Separate logic can decide if to reset or change to the next stratagem, could be a click, a timer, a key or anything else.
    return stratagem.directions.map((expected, i) => {
        const actual = seq[i];
        if (actual === undefined) {
            return {
                expected,
                actual: undefined,
                state: "pending",
            };
        }
        return {
            expected,
            actual,
            state: expected === actual ? "success" : "fail",
        };
    });
}

function AttemptComplete(
    attempt: Array<KeyAttempt> | undefined,
): AttemptStatus | undefined {
    if (!attempt) return undefined;
    const success = attempt.every((a) => a.state === "success");
    if (success) return "success";
    const fail = attempt.some((a) => a.state === "fail");
    if (fail) return "fail";
    return "incomplete";
}
