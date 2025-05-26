'use client';
import { useSession } from 'next-auth/react';
import { useEffect, Suspense } from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import FlowBuilder from '../components/FlowBuilder';

export const dynamic = 'force-dynamic'; // Add this to skip SSG

export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const interval = setInterval(() => {
      update();
    }, 30000); // Changed to 30 seconds for efficiency
    return () => clearInterval(interval);
  }, [update]);

  if (status === 'loading' || !session) {
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
