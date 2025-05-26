'use client';
export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useEffect, Suspense } from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import FlowBuilder from "../components/FlowBuilder";

export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      update(); // Trigger session update when tab becomes visible
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Initial update if unauthenticated or loading
  if (status === 'unauthenticated' || status === 'loading') {
    update();
  }

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [status, update]);

  return (
    <ReactFlowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <FlowBuilder />
      </Suspense>
    </ReactFlowProvider>
  );
}
