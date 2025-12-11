'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const NodeMap = dynamic(() => import('./NodeMap'), { ssr: false });

export default function NodeMapWrapper(props: any) {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center text-muted">Loading map...</div>}>
      <NodeMap {...props} />
    </Suspense>
  );
}
