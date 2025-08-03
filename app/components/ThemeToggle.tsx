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
        <button onClick={toggleTheme} aria-label="Alternar tema">
            <img
                src={theme === "dark" ? "/sun.svg" : "/moon.svg"}
                alt={`Tema: ${theme}`}
                width={32}
                height={32}
            />
        </button>
    )
}
