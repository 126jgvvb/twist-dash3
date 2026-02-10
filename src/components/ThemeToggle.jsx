import { useEffect, useState } from "react";
import { cn } from "../utils";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
    const [isDark, setDark] = useState(() => {
        // Check initial theme from localStorage
        const savedTheme = localStorage.getItem("tracker");
        return savedTheme ? parseInt(savedTheme) : 1; // Default to dark theme
    });

    useEffect(() => {
        // Apply initial theme
        if (isDark === 0) {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }
    }, [isDark]);

    const toggleTheme = () => {
        const newTheme = isDark === 0 ? 1 : 0;
        setDark(newTheme);
        localStorage.setItem('tracker', newTheme);
        
        if (newTheme === 0) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    };

    return (
        <button 
            className={cn(
                "fixed top-5 right-5 z-50 p-2 rounded-full transition-colors duration-300 bg-card/80 backdrop-blur-md border border-border/50",
                "focus:outline-hidden hover:bg-card/90"
            )}
            onClick={toggleTheme}
            title={isDark === 0 ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
            {isDark === 0 ? (
                <Moon className={"h-5 w-5 text-blue-300"} />
            ) : (
                <Sun className={"h-5 w-5 text-yellow-300"} />
            )}
        </button>
    );
};
