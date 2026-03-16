import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const savedTheme = localStorage.getItem('slipscan_theme');
        
        if (savedTheme === 'dark' || savedTheme === 'light') {
            console.log('Theme loaded from localStorage:', savedTheme);
            setTheme(savedTheme);
        } else {
            const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = systemPrefersDark ? 'dark' : 'light';
            console.log('No saved theme, using system preference:', initialTheme);
            setTheme(initialTheme);
            localStorage.setItem('slipscan_theme', initialTheme);
        }
        
        setMounted(true);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const root = window.document.documentElement;
        console.log('Applying theme:', theme);
        
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        
        document.body.style.backgroundColor = theme === 'dark' ? '#111827' : '#f9fafb';
        document.body.style.color = theme === 'dark' ? '#ffffff' : '#111827';
        
        console.log('Applied theme:', theme);
        localStorage.setItem('slipscan_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        console.log('Toggle clicked, current:', theme);
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            console.log('Switching to:', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div style={{ visibility: mounted ? 'visible' : 'hidden', minHeight: '100vh' }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};
