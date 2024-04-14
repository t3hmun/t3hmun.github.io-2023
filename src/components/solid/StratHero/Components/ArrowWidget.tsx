/** @jsxImportSource solid-js */

import type { JSX } from "solid-js/jsx-runtime";
import type { Direction, KeyAttempt } from "../GameTypes";

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
    let color: string;
    switch (props.keyAttempt.status) {
        case "success":
            color = "text-green-500";
            break;
        case "fail":
            color = "text-red-500";
            break;
        default: // "pending"
            color = "text-gray-500";
    }

    return (
        <span class={`text-4xl text-center mx-3 ${color} `}>
            {CharMap[props.keyAttempt.expected]}
        </span>
    );
}
