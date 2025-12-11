'use client';

import { motion, AnimatePresence } from 'framer-motion';
import NodeCard from '@/components/NodeCard';
import NodeMapWrapper from '@/components/NodeMapWrapper';
import StorageChart from '@/components/StorageChart';
import LatencyChart from '@/components/LatencyChart';
import NodeHealthBadge from '@/components/NodeHealthBadge';
import LottieAnimation from '@/components/LottieAnimation';
import { Suspense, useEffect, useState, useMemo } from 'react';
import { fetchPNodes, PNode } from '@/lib/api';
import Link from 'next/link';
import { Activity, Server, HardDrive, Clock, ArrowRight, Search, Filter, X, MapPin } from 'lucide-react';

type HealthFilter = 'all' | 'healthy' | 'degraded' | 'down';

export default function Dashboard() {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all');

  useEffect(() => {
    fetchPNodes().then((data) => {
      setNodes(data.nodes || []);
      setTotal(data.total || 0);
      setLoading(false);
    });
  }, []);

  const filteredNodes = useMemo(() => {
    let result = nodes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(n =>
        n.name.toLowerCase().includes(query) ||
        n.id.toLowerCase().includes(query) ||
        n.location?.city?.toLowerCase().includes(query) ||
        n.location?.country?.toLowerCase().includes(query)
      );
    }

    if (healthFilter !== 'all') {
      result = result.filter(n => n.health === healthFilter);
    }

    return result;
  }, [nodes, searchQuery, healthFilter]);

  const healthyCount = nodes.filter(n => n.health === 'healthy').length;
  const degradedCount = nodes.filter(n => n.health === 'degraded').length;
  const downCount = nodes.filter(n => n.health === 'down').length;
  
  const avgLatency = nodes.length > 0 
    ? Math.round(nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length) 
    : 0;
  
  const totalStorage = nodes.length > 0 
    ? Math.round(nodes.reduce((sum, n) => sum + (n.storage?.used || 0), 0) / nodes.length)
    : 0;
  const avgUptime = nodes.length > 0
    ? (nodes.reduce((sum, n) => sum + n.uptime, 0) / nodes.length).toFixed(1)
    : '0';

  const clearFilters = () => {
    setSearchQuery('');
    setHealthFilter('all');
  };

  const hasActiveFilters = searchQuery.trim() || healthFilter !== 'all';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <LottieAnimation type="loading" size={60} />
        <div className="text-muted-foreground text-sm">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* Header */}
      <motion.div 
        className="flex flex-wrap items-center justify-between gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Real-time network status</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-surface border border-border text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </motion.div>

      {/* KPI Row */}
      <section className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 lg:grid-cols-4">
        <motion.div 
          className="card-surface p-3 sm:p-4 min-w-0" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">Total Nodes</h3>
            <Server size={14} className="text-muted-foreground shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">{total}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Active in network</p>
        </motion.div>
        
        <motion.div 
          className="card-surface p-3 sm:p-4 min-w-0" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">Latency</h3>
            <Activity size={14} className="text-muted-foreground shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">
            {avgLatency}<span className="text-xs sm:text-sm font-normal text-muted-foreground">ms</span>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Average</p>
        </motion.div>
        
        <motion.div 
          className="card-surface p-3 sm:p-4 min-w-0" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">Storage</h3>
            <HardDrive size={14} className="text-muted-foreground shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">
            {totalStorage}<span className="text-xs sm:text-sm font-normal text-muted-foreground">%</span>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Avg used</p>
        </motion.div>
        
        <motion.div 
          className="card-surface p-3 sm:p-4 min-w-0" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">Uptime</h3>
            <Clock size={14} className="text-muted-foreground shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">
            {avgUptime}<span className="text-xs sm:text-sm font-normal text-muted-foreground">%</span>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">30-day avg</p>
        </motion.div>
      </section>

      {/* Health Filter + Recent Nodes */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Health Filter */}
        <motion.div 
          className="card-surface p-3 sm:p-4 min-w-0" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-xs sm:text-sm font-semibold mb-3">Filter by Status</h3>
          <div className="space-y-2">
            {(['all', 'healthy', 'degraded', 'down'] as HealthFilter[]).map((status) => (
              <button 
                key={status}
                onClick={() => setHealthFilter(status)}
                className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-lg border transition-all text-left ${
                  healthFilter === status 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-surface border-border hover:border-primary/20'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium capitalize">{status}</span>
                <span className="text-xs text-muted-foreground">
                  {status === 'all' ? total : status === 'healthy' ? healthyCount : status === 'degraded' ? degradedCount : downCount}
                </span>
              </button>
            ))}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear filters
            </button>
          )}
        </motion.div>

        {/* Recent Nodes */}
        <motion.div 
          className="lg:col-span-3 card-surface p-3 sm:p-4 min-w-0" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-3 gap-2">
            <h3 className="text-xs sm:text-sm font-semibold truncate">
              {hasActiveFilters ? `Filtered (${filteredNodes.length})` : 'Recent Nodes'}
            </h3>
            <Link href="/nodes" className="text-[10px] sm:text-xs text-primary hover:text-primary/80 shrink-0">
              View all
            </Link>
          </div>
          
          {filteredNodes.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No nodes found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNodes.slice(0, 5).map((node, i) => {
                const locationStr = node.location 
                  ? `${node.location.city || ''}, ${node.location.country || ''}`.replace(/^, |, $/g, '')
                  : 'Unknown';
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <Link 
                      href={`/nodes/${node.id}`}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-muted/5 hover:bg-muted/10 border border-transparent hover:border-border transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                          <Server size={12} className="text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium truncate">{node.name}</div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <MapPin size={10} />
                            <span className="truncate">{locationStr}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-medium">{node.latency}ms</div>
                          <div className="text-[10px] text-muted-foreground">{node.uptime}% up</div>
                        </div>
                        <NodeHealthBadge status={node.health} />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <motion.div 
          className="card-surface p-3 sm:p-4 min-w-0" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3 gap-2">
            <h4 className="text-xs sm:text-sm font-semibold truncate">Storage Trend</h4>
            <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">24h</span>
          </div>
          <StorageChart />
        </motion.div>
        <motion.div 
          className="card-surface p-3 sm:p-4 min-w-0" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <div className="flex items-center justify-between mb-3 gap-2">
            <h4 className="text-xs sm:text-sm font-semibold truncate">Latency Monitor</h4>
            <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">24h</span>
          </div>
          <LatencyChart />
        </motion.div>
      </section>

      {/* Map */}
      <motion.section 
        className="card-surface p-3 sm:p-4 min-w-0" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="text-xs sm:text-sm font-semibold truncate">Global Network</h3>
          <Link href="/map" className="text-[10px] sm:text-xs text-primary hover:text-primary/80 shrink-0">
            Full map
          </Link>
        </div>
        <div className="h-[200px] sm:h-[280px] lg:h-[350px] rounded-lg overflow-hidden border border-border">
          <Suspense fallback={<div className="h-full flex items-center justify-center text-muted-foreground text-sm">Loading map...</div>}>
            <NodeMapWrapper nodes={filteredNodes.length > 0 ? filteredNodes : nodes} />
          </Suspense>
        </div>
      </motion.section>
    </div>
  );
}
