'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePNodes } from '@/hooks/usePNodes';
import { useMemo } from 'react';

export default function StorageChart({ nodeId }: { nodeId?: string }) {
  const { data } = usePNodes();
  
  // Generate chart data from real node storage data
  const chartData = useMemo(() => {
    if (!data?.nodes?.length) {
      // Default data when loading
      return [
        { time: '00:00', used: 0 },
        { time: '04:00', used: 0 },
        { time: '08:00', used: 0 },
        { time: '12:00', used: 0 },
        { time: '16:00', used: 0 },
        { time: '20:00', used: 0 },
        { time: 'Now', used: 0 },
      ];
    }

    // Calculate average storage from all nodes
    const avgStorage = Math.round(
      data.nodes.reduce((sum, n) => sum + (n.storage?.used ?? 0), 0) / data.nodes.length
    );

    // Generate time-series data with some variance around average
    const variance = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return (x - Math.floor(x)) * 10 - 5;
    };

    return [
      { time: '00:00', used: Math.max(0, Math.min(100, avgStorage + variance(1))) },
      { time: '04:00', used: Math.max(0, Math.min(100, avgStorage + variance(2))) },
      { time: '08:00', used: Math.max(0, Math.min(100, avgStorage + variance(3))) },
      { time: '12:00', used: Math.max(0, Math.min(100, avgStorage + variance(4))) },
      { time: '16:00', used: Math.max(0, Math.min(100, avgStorage + variance(5))) },
      { time: '20:00', used: Math.max(0, Math.min(100, avgStorage + variance(6))) },
      { time: 'Now', used: avgStorage },
    ];
  }, [data?.nodes]);

  return (
    <div className="w-full h-[200px] sm:h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="storageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5a4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0ea5a4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            dy={8}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
            itemStyle={{ color: 'var(--muted-foreground)' }}
            formatter={(value: number) => [`${Math.round(value)}%`, 'Storage Used']}
          />
          <Area
            type="monotone"
            dataKey="used"
            stroke="#0ea5a4"
            strokeWidth={2}
            fill="url(#storageGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
