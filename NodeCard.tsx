'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import NodeHealthBadge from './NodeHealthBadge';
import { ArrowUpRight, Server, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  node: any;
  compact?: boolean;
};

export default function NodeCard({ node, compact = false }: Props) {
  const [copied, setCopied] = useState(false);

  const locationStr = node.location 
    ? (typeof node.location === 'string' 
        ? node.location 
        : `${node.location.city || ''}, ${node.location.country || ''}`.replace(/^, |, $/g, ''))
    : 'Unknown';

  const copyId = async () => {
    await navigator.clipboard.writeText(node.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <Link href={`/nodes/${node.id}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-primary/30 hover:shadow-sm transition-all min-w-0 overflow-hidden cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
              <Server size={12} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="font-medium text-xs truncate">{node.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{locationStr}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-[10px] text-muted-foreground">{node.latency}ms</span>
            <NodeHealthBadge status={node.health || node.status} />
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/nodes/${node.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="card-surface p-0 cursor-pointer relative overflow-hidden"
      >
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2 px-3 pt-3">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                <Server size={12} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <CardTitle className="text-xs font-semibold truncate">{node.name}</CardTitle>
                <div className="text-[10px] text-muted-foreground truncate">{locationStr}</div>
              </div>
            </div>
            <NodeHealthBadge status={node.health || node.status} />
          </CardHeader>

          <CardContent className="grid grid-cols-3 gap-1 py-2 px-3">
            <div className="min-w-0 overflow-hidden">
              <div className="text-sm font-semibold truncate">
                {node.latency}<span className="text-[9px] font-normal text-muted-foreground">ms</span>
              </div>
              <div className="text-[9px] text-muted-foreground truncate">Latency</div>
            </div>
            <div className="min-w-0 overflow-hidden">
              <div className="text-sm font-semibold truncate">
                {node.storage?.used || 0}<span className="text-[9px] font-normal text-muted-foreground">%</span>
              </div>
              <div className="text-[9px] text-muted-foreground truncate">Storage</div>
            </div>
            <div className="min-w-0 overflow-hidden">
              <div className="text-sm font-semibold truncate">
                {node.uptime}<span className="text-[9px] font-normal text-muted-foreground">%</span>
              </div>
              <div className="text-[9px] text-muted-foreground truncate">Uptime</div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center pt-0 pb-2 px-3 border-t border-border/50 mt-1">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyId(); }}
              className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors min-w-0 overflow-hidden"
            >
              {copied ? <Check size={9} className="text-emerald-500 shrink-0" /> : <Copy size={9} className="shrink-0" />}
              <span className="font-mono truncate">{node.id}</span>
            </button>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary shrink-0">
              View <ArrowUpRight size={10} />
            </span>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}
