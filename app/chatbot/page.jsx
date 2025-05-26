'use client';
import { useSession } from 'next-auth/react';
import { useEffect, Suspense } from 'react';
import ReactFlow, {
   
    ReactFlowProvider,
   
  } from 'reactflow';
import FlowBuilder from "../components/FlowBuilder";
export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();

 useEffect(() => {
  if (status === 'unauthenticated' || status === 'loading') {
    update(); // Trigger initial update
  }

  const interval = setInterval(() => {
    if (status === 'unauthenticated' || status === 'loading') {
      update(); // Periodically check session
    }
  }, 5000); // Every 5 seconds

  return () => clearInterval(interval); // Cleanup on unmount
}, [status, update]);
  if (status === 'loading') {
    return <div>Loading...</div>;
  }


  return (
    <ReactFlowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <FlowBuilder />
      </Suspense>
    </ReactFlowProvider>
  );
}
