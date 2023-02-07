import { useEffect, useState } from "react";

/** client:load render this */
export function ThemeSwitcher(): JSX.Element {
    // If the theme is light and this component is configured to client:load then the toggle will show dark for a brief moment while react initialises.
    const [theme, setTheme] = useState<string>("dark");
    const [toggleUpdate, setToggleUpdate] = useState<() => void>(() => {});

    // This insane looking event wraps up all the window using code so astro can build-time render the component.
    // Build time rendering ignores useEffect but wont tolerate window use anywhere else.
    // The build time render cant know which theme the use will have saved so light theme users may see a flicker as the toggle corrects.
    // This is better than client:only rendering where the whole row shifts when the toggle is added to the dom.
    useEffect(() => {
        setToggleUpdate(() => () => {
            window.toggleTheme();
            setTheme(window.getTheme());
        });
        setTheme(window.getTheme());
    }, []);

    return (
        <button
            onClick={toggleUpdate}
            className="m-0 inline-grid grid-cols-2 gap-0 rounded-full border-2 border-amber-500 p-0 text-sm"
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
