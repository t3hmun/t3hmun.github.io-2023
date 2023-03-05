import { useEffect, useState } from "preact/hooks";

/** Theme switcher, should be SSG rendered - showing default of dark, hydrates to make it work.
 *  People not using JS will see the switcher indicate dark theme but have no way of changing it.
 *  This is a compromise, don't want js users to have it hydrate after the page is visible, witness jank.
 */
export function ThemeSwitcher() {
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
            class="m-0 inline-grid grid-cols-2 gap-0 rounded-full border-2 border-amber-500 p-0 text-sm"
        >
            <div
                class={`rounded-l-full pb-0.5 pl-0.5 pr-0.5 ${
                    theme == "light" ? " bg-amber-500" : "bg-amber-900"
                }`}
            >
                🌞
            </div>
            <div
                class={`rounded-r-full pb-0.5 pr-0.5 pl-0.5 ${
                    theme == "dark" ? " bg-amber-500" : "bg-amber-900"
                }`}
            >
                🌚
            </div>
        </button>
    );
}
