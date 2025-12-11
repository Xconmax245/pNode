'use client';

import { Menu, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AutoRefreshToggle from '@/components/AutoRefreshToggle';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Home, List, Map, Archive, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: <Home size={18} /> },
    { href: '/nodes', label: 'Nodes', icon: <List size={18} /> },
    { href: '/map', label: 'Map', icon: <Map size={18} /> },
    { href: '/archives', label: 'Archives', icon: <Archive size={18} /> },
  ];

  return (
    <>
      <motion.header
        className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md py-3 px-4 border-b border-border"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              className="hide-desktop p-2 rounded-md hover:bg-muted/10 transition-colors focus-visible:outline-none"
            >
              <Menu size={20} />
            </button>

            <div className="text-lg font-bold tracking-tight">
              pNodes
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search nodes..."
                  className="pl-9 pr-4 py-2 rounded-lg bg-muted/10 border border-transparent hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground text-sm transition-all w-[200px] focus:w-[280px]"
                  aria-label="Search nodes"
                />
              </div>
            </div>

            <AutoRefreshToggle />
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-surface z-50 p-4 shadow-lg"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold">pNodes</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-muted/10"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav>
                <ul className="space-y-1">
                  {navItems.map((it) => {
                    const active = pathname === it.href;
                    return (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                            active
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
                          }`}
                        >
                          {it.icon}
                          <span className="font-medium">{it.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
