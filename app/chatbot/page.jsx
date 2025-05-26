'use client';
export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useEffect, Suspense } from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import FlowBuilder from "../components/FlowBuilder";

export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();



  return (
    <ReactFlowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <FlowBuilder />
      </Suspense>
    </ReactFlowProvider>
  );
}
