'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import FlowBuilder from '../components/FlowBuilder';

export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure rendering only happens client-side
    const interval = setInterval(() => {
      update();
    }, 3000); // 30 seconds

    return () => clearInterval(interval);
  }, [update]);

  if (!isMounted || status === 'loading' || !session) {
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
