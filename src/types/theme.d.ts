type Theme = "dark" | "light";
interface Window {
    getTheme: () => Theme;
    toggleTheme: () => void;
}
