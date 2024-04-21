/** @jsxImportSource solid-js */

import {
    type ComponentProps,
    For,
    createSignal,
    createMemo,
    Show,
} from "solid-js";

import * as GT from "./GameTypes";
import { ArrowWidget } from "./Components/ArrowWidget";
import { CurrentStratView } from "./Components/CurrentStratView";
import { CreateGame } from "./GameSolidAdapter";

function stratFilter(searchText: string): GT.StratagemDataJson {
    searchText = searchText.toLowerCase();
    const allStrats = GT.strats;
    const filteredStrats: GT.StratagemDataJson = {};
    for (const cat in allStrats) {
        const catStrats = allStrats[cat];
        if (!catStrats) continue;
        const filteredCatStrats = catStrats.filter((strat) =>
            strat.name.toLowerCase().includes(searchText),
        );
        if (filteredCatStrats.length > 0) {
            filteredStrats[cat] = filteredCatStrats;
        }
    }
    return filteredStrats;
}

export function StratHero() {
    const { state, addStrat, removeStrat, restartRun } = CreateGame();
    const [searchText, setSearchText] = createSignal("");
    const filteredStrats = createMemo(() => stratFilter(searchText()));

    return (
        <>
            <div class="">
                <div class="flex justify-center mb-6">
                    <CurrentStratView
                        runList={state.runList}
                        runListIndex={state.runListIndex}
                    />
                </div>
                <div class="flex justify-center mb-8">
                    <div class="">
                        <div class="flex flex-col text-center">
                            <For each={state.attempts}>
                                {(stratAttempt) => (
                                    <div>
                                        {stratAttempt.stratagem.name}
                                        <For each={stratAttempt.attempts}>
                                            {(keyAttempt) => (
                                                <ArrowWidget
                                                    keyAttempt={keyAttempt}
                                                />
                                            )}
                                        </For>
                                        {stratAttempt.startTime &&
                                            stratAttempt.endTime && (
                                                <span
                                                    class={
                                                        stratAttempt.status ===
                                                        "success"
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    }
                                                >
                                                    {(stratAttempt.endTime?.getTime() -
                                                        stratAttempt.startTime?.getTime()) /
                                                        1000}
                                                    s
                                                </span>
                                            )}
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
                <div class="text-center mb-4">
                    <div class="inline px-2 py-1 text-center border-b-2">
                        <input
                            class=" bg-transparent text-center ml-4"
                            type="text"
                            placeholder="search stratagems"
                            value={searchText()}
                            onInput={(e) =>
                                setSearchText(e.currentTarget.value)
                            }
                        ></input>
                        🔎
                    </div>
                </div>

                <div class="flex mb-6">
                    <div class="">
                        {Object.keys(filteredStrats()).length === 0 && (
                            <div class="border-b-yellow-600 border-b-2 text-yellow-600 text-center h-6 mb-2">
                                No strats found
                            </div>
                        )}
                        {Object.keys(filteredStrats()).map((cat) => (
                            <>
                                <h2 class="border-b-yellow-600 border-b-2 text-yellow-600 text-center h-6 mb-2">
                                    {cat} Stratagems
                                </h2>
                                <div class="flex flex-row flex-wrap">
                                    <For each={filteredStrats()[cat]}>
                                        {(strat) => (
                                            <Button
                                                class="mr-2 mb-2 h-20 w-32"
                                                onClick={() => addStrat(strat)}
                                            >
                                                {strat.name}
                                            </Button>
                                        )}
                                    </For>
                                </div>
                            </>
                        ))}
                    </div>
                    <div class="min-w-80 ml-3">
                        <h2 class="mb-3 text-center bg-orange-500 text-slate-900 ">
                            Strat Run
                        </h2>
                        {state.runList.length === 0 ? (
                            <div class="text-center">
                                Click on a stratagem to add to the run.
                            </div>
                        ) : (
                            <>
                                {state.runList.map((stratAttempt) => (
                                    <>
                                        <div class="flex justify-between mb-3">
                                            <div>
                                                {stratAttempt.stratagem.name}
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    removeStrat(
                                                        state.runList.indexOf(
                                                            stratAttempt,
                                                        ),
                                                    )
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </>
                                ))}
                                <div class="mb-4"></div>
                                <div class="text-center">
                                    <Button
                                        class=""
                                        onClick={() => restartRun()}
                                    >
                                        Start Run
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <h2 class="text-2xl mt-5 mb-3">What</h2>
                <p>
                    This is a simple version of the Stratagem Hero mini-game in
                    Helldivers 2. This page is the first thing I have ever tried
                    to write using{" "}
                    <a class="text-blue-300" href="https://docs.solidjs.com">
                        Solid
                    </a>
                    , this page is an experiment to try out the library. The
                    Solid component is contained an{" "}
                    <a
                        class="text-blue-300"
                        href="https://docs.astro.build/en/concepts/islands/"
                    >
                        Astro island
                    </a>
                    .
                </p>
                <h2 class="text-2xl mt-5 mb-3">Issues</h2>
                <ul class="list-disc pl-5">
                    <li>
                        Holding down keys occasionally double registers, but you
                        shouldn't be holding down keys anyway.
                    </li>
                    <li>
                        Trying to capture the ctrl key in the browser is dodgy,
                        so this game simply ignores modifier keys.
                    </li>
                    <li>
                        This game pretends the current strat is the only only
                        possible strat and fails you immediately, keeps it
                        simple.
                    </li>
                </ul>
            </div>
        </>
    );
}

type ButtonProps = ComponentProps<"button"> & {};

function Button({ class: className, children, ...buttonProps }: ButtonProps) {
    return (
        <button
            {...buttonProps}
            class={`bg-orange-800 rounded active:scale-95  focus:shadow py-1 px-2 ${className}`}
        >
            {children}
        </button>
    );
}
