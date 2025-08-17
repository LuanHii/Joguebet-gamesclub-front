"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light")

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)")
        const stored = localStorage.getItem("theme") as "light" | "dark" | null
        const initial = stored || (media.matches ? "dark" : "light")

        setTheme(initial)
        document.documentElement.className = initial

        const updateSystemTheme = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                const systemTheme = e.matches ? "dark" : "light"
                setTheme(systemTheme)
                document.documentElement.className = systemTheme
            }
        }

        media.addEventListener("change", updateSystemTheme)
        return () => media.removeEventListener("change", updateSystemTheme)
    }, [])

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark"
        setTheme(next)
        localStorage.setItem("theme", next)
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(next)
    }

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
            className="sr-only peer"
            aria-label="Alternar tema"
            />
            <span className="w-16 h-9 bg-gray-300 rounded-full peer peer-checked:bg-gray-700 transition-colors"></span>

            <span className="absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md peer-checked:translate-x-7 transform transition-transform flex items-center justify-center">
            <img
                src={theme === "dark" ? "/sun.svg" : "/moon.svg"}
                alt={`Tema: ${theme}`}
                width={32}   
                height={32}
            />
            </span>
        </label>
        )
}
