/** @jsxImportSource solid-js */

import type { JSX } from "solid-js/jsx-runtime";
import type { Direction, KeyAttempt } from "../GameTypes";
import { createMemo } from "solid-js";

const CharMap: Record<Direction, string> = {
    u: "⇧",
    d: "⇩",
    l: "⇦",
    r: "⇨",
};

type ActiveKeyAttemptProps = {
    keyAttempt: KeyAttempt;
};

export function ArrowWidget(props: ActiveKeyAttemptProps): JSX.Element {
    const color = createMemo(() => {
        switch (props.keyAttempt.status) {
            case "success":
                return "text-green-500";
            case "fail":
                return "text-red-500";
            default: // "pending"
                return "text-gray-500";
        }
    });

    return (
        <span class={`text-4xl text-center mx-3 ${color()} `}>
            {CharMap[props.keyAttempt.expected]}
        </span>
    );
}
