/** Script for setting dark/light theme on a page (to work with Tailwind dark:"class")
 *  - Respects system theme setting if available
 *  - Allows user to override system, saving to localStorage
 *  - Defaults to dark if all other settings absent (to avoid blinding us night people)
 *
 * This does not need to be minified and isn't meant to be bundled, this is just simple js.
 *
 * What happens when there is no JS? A few places need to have their defaults set to dark:
 *  - The HTML element should have the dark class set so the css should all default to dark
 *      - Tailwind is configured to use this class
 *      - prefers-color-scheme will not be respected without JS, no simple way to do this and allow user to toggle
 *  - style.css should have the default values of none for display-light and block for display-dark
 *      - This shows and hides code the appropriate generated code block
 *  - ThemeSwitcher component needs to have its default SSG rendered state as dark.
 *
 * */

const dark = "dark";
const light = "light";
const key = "theme";
const cssId = "syntax-highlight-css";

// This is a global script that runs at the start of every page load.
// To be run before page render to avoid page flash from theme switching.
activateTheme();

// Global 🙃 functions for theme switching / management.
window.toggleTheme = toggleTheme;
window.getTheme = getTheme;

/** Set the CSS to activate whatever theme is set in localStorage.theme or CSS media. */
function activateTheme() {
    const theme = getTheme();
    if (theme === dark) {
        document.documentElement.classList.add(dark);
        document.documentElement.style.setProperty("--display-dark", "block");
        document.documentElement.style.setProperty("--display-light", "none");
    } else {
        document.documentElement.classList.remove(dark);
        document.documentElement.style.setProperty("--display-dark", "none");
        document.documentElement.style.setProperty("--display-light", "block");
    }

    // Clear local storage if user's computer settings match the current stored setting.
    // Only want to keep a setting persisted while it is different from the user's settings.
    if (theme === getCssTheme()) {
        localStorage.removeItem(key);
    }
}

/** Toggle the current theme and set it to persist if it does not match the computer setting. */
function toggleTheme() {
    const current = getTheme();
    const newTheme = current === light ? dark : light;
    const cssTheme = getCssTheme();

    if (newTheme === cssTheme) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, newTheme);
    }

    activateTheme();
}

/** Figure out the current theme by checking localStorage ?? prefers-color-scheme setting ?? dark. */
function getTheme() {
    return getLocalTheme() ?? getCssTheme() ?? dark;
}

function getCssTheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return dark;
    if (window.matchMedia("(prefers-color-scheme: light)").matches)
        return light;
    return null;
}

function getLocalTheme() {
    if (localStorage.getItem(key) === dark) return dark;
    if (localStorage.getItem(key) === light) return light;
    return null;
}
