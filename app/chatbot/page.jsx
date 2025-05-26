'use client';

import React, { Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FlowBuilder from '../components/FlowBuilder';

export default function ChatbotFlowPage() {
  const { data: session, status } = useSession();
  console.log('Session:', session,status);
  const router = useRouter();


  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Redirect will handle this
  }

  return (
    <ReactFlowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <FlowBuilder />
      </Suspense>
    </ReactFlowProvider>
  );
}
