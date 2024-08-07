'use client'

import { useState } from "react";

 const useTheme =  () =>{
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? 'light');
    const toggleTheme = () => {
        setTheme((theme) => theme === 'dark' ? 'light' : 'dark');
        localStorage.setItem('theme', theme)
    }
    console.log('chned!')

    return {theme, toggleTheme}
}

export default useTheme