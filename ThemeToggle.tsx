'use client';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    if (saved === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', next);
  }

  return (
    <button
      className="p-2 rounded-md hover:bg-white/6 focus-visible:outline-none"
      aria-label="Toggle theme"
      onClick={toggle}
    >
      {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
    </button>
  );
}
