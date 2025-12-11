'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import NodeHealthBadge from './NodeHealthBadge';
import { Server, ExternalLink, MapPin, Clock } from 'lucide-react';

export default function NodeTable({ nodes }: { nodes: any[] }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-surface border border-border">
      <table className="min-w-full">
        <thead className="bg-muted/5 border-b border-border">
          <tr className="text-left text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
            <th className="p-3 sm:p-4 font-medium">Node</th>
            <th className="p-3 sm:p-4 font-medium hidden md:table-cell">Location</th>
            <th className="p-3 sm:p-4 font-medium">Latency</th>
            <th className="p-3 sm:p-4 font-medium hidden lg:table-cell">Storage</th>
            <th className="p-3 sm:p-4 font-medium hidden sm:table-cell">Uptime</th>
            <th className="p-3 sm:p-4 font-medium">Status</th>
            <th className="p-3 sm:p-4 font-medium w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {nodes.map((n, i) => {
            const locationStr = n.location 
              ? (typeof n.location === 'string' 
                  ? n.location 
                  : `${n.location.city || ''}, ${n.location.country || ''}`.replace(/^, |, $/g, ''))
              : 'Unknown';
            return (
              <motion.tr
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="hover:bg-muted/5 transition-colors group"
              >
                <td className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                      <Server size={12} className="text-primary sm:w-[14px] sm:h-[14px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">{n.name}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground font-mono truncate max-w-[100px] sm:max-w-[150px]">{n.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 sm:p-4 hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate max-w-[120px]">{locationStr}</span>
                  </div>
                </td>
                <td className="p-3 sm:p-4">
                  <span className={`text-xs sm:text-sm font-medium ${
                    n.latency < 50 ? 'text-emerald-500' : n.latency < 100 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {n.latency}<span className="text-[10px] sm:text-xs text-muted-foreground ml-0.5">ms</span>
                  </span>
                </td>
                <td className="p-3 sm:p-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 sm:w-20 h-1.5 bg-muted/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          (n.storage?.used || 0) < 60 ? 'bg-emerald-500' 
                          : (n.storage?.used || 0) < 80 ? 'bg-amber-500' 
                          : 'bg-red-500'
                        }`}
                        style={{ width: `${n.storage?.used || 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{n.storage?.used || 0}%</span>
                  </div>
                </td>
                <td className="p-3 sm:p-4 hidden sm:table-cell">
                  <div className="flex items-center gap-1 text-xs sm:text-sm">
                    <Clock size={12} className="text-muted-foreground shrink-0" />
                    <span className={n.uptime > 99 ? 'text-emerald-500' : n.uptime > 95 ? 'text-amber-500' : 'text-red-500'}>
                      {n.uptime}%
                    </span>
                  </div>
                </td>
                <td className="p-3 sm:p-4">
                  <NodeHealthBadge status={n.health || n.status} />
                </td>
                <td className="p-3 sm:p-4 text-right">
                  <Link
                    href={`/nodes/${n.id}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={`View ${n.name}`}
                  >
                    <ExternalLink size={14} />
                  </Link>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
