'use client';
import { useEffect, Suspense } from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import FlowBuilder from '../components/FlowBuilder';

export default function ClientChatbotFlowPage({ session }) {
  useEffect(() => {
    // Optional: Client-side logic if needed
    const interval = setInterval(() => {
      // Add session refresh logic if required
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        {session?.user ? <FlowBuilder /> : 'loading'}
      </Suspense>
    </ReactFlowProvider>
  );
}
