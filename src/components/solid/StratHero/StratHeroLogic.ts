import type {
    Direction,
    KeyAttempt,
    KeyMapping,
    Stratagem,
} from "./StratHeroTypes";

function lowerIfSingleAlpha(key: string): string {
    return /^[a-zA-Z]$/.test(key) ? key.toLowerCase() : key;
}
export function MapRelevantKeys(
    keyMapping: KeyMapping,
    keys: Array<string>,
): Array<Direction> {
    return keys
        .map(lowerIfSingleAlpha)
        .map((key) => keyMapping[key])
        .filter((mappedKey): mappedKey is Direction => mappedKey !== undefined);
}

export function CalcAttempt(
    stratagem: Stratagem | undefined,
    seq: Array<Direction>,
): Array<KeyAttempt> | undefined {
    // If no stratagem is selected, attempt cant be defined at all.
    console.log(JSON.stringify(stratagem));
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
