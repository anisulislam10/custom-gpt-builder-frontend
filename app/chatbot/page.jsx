'use client';
import { useSession } from 'next-auth/react';
import { useEffect, Suspense } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
  } from 'reactflow';
import FlowBuilder from "../components/FlowBuilder";
export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();

  useEffect(() => {
      if (status === 'unauthenticated') {
         update();
      }
    if (status === 'loading') {
      update(); // Manually trigger session update
    }
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
