'use client';

import Link from 'next/link';
import { Home, Map, List, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { href: '/', label: 'Dashboard', icon: <Home size={18} /> },
    { href: '/nodes', label: 'Nodes', icon: <List size={18} /> },
    { href: '/map', label: 'Map', icon: <Map size={18} /> },
    { href: '/archives', label: 'Archives', icon: <Archive size={18} /> },
  ];

  return (
    <motion.aside
      className={`hide-mobile flex flex-col bg-surface border-r border-border ${collapsed ? 'w-[60px]' : 'w-[220px]'} p-3 gap-4 transition-all duration-300`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-10">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold tracking-tight"
            >
              pNodes
            </motion.div>
          )}
        </AnimatePresence>
        <button
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed(v => !v)}
          className="p-2 rounded-md hover:bg-muted/10 transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-all duration-200 ${
                    active 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
                  } focus-visible:outline-none`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{it.icon}</span>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {it.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground border-t border-border pt-3"
          >
            v1.0.0 Beta
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
