'use client';
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function AutoRefreshToggle() {
  const [on, setOn] = useState(true);
  
  useEffect(() => {
    // optionally manage a polling interval elsewhere; this just toggles UI
  }, [on]);

  return (
    <button
      onClick={() => setOn(v => !v)}
      aria-pressed={on}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none ${on ? 'bg-accent/10 text-accent hover:bg-accent/20' : 'bg-muted/10 text-muted hover:bg-muted/20'}`}
      title="Toggle auto refresh"
    >
      <RefreshCw size={14} className={on ? 'animate-spin-slow' : ''} />
      <span className="hidden sm:inline">{on ? 'Auto' : 'Manual'}</span>
    </button>
  );
}
