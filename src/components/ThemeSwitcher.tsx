import { useState } from "react";

export function ThemeSwitcher(): JSX.Element {
    const [theme, setTheme] = useState<string>(window.getTheme());
    // TODO: this needs a useEffect with a sub to an event of the theme changing. Also theme.js needs to fire a theme change event.
    function toggleUpdate() {
        window.toggleTheme();
        setTheme(window.getTheme());
    }
    return (
        <button
            onClick={toggleUpdate}
            className="m-1 inline-grid grid-cols-2 gap-0 rounded-full border-2 border-amber-500 p-0"
        >
            <div
                className={`rounded-l-full pb-0.5 pl-0.5 pr-0.5 ${
                    theme == "light" ? " bg-amber-500" : "bg-amber-900"
                }`}
            >
                🌞
            </div>
            <div
                className={`rounded-r-full pb-0.5 pr-0.5 pl-0.5 ${
                    theme == "dark" ? " bg-amber-500" : "bg-amber-900"
                }`}
            >
                🌚
            </div>
        </button>
    );
}
