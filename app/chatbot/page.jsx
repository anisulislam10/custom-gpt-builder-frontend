'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
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
import FlowBuilder from "../components/FlowBuilder";
import { useSession } from 'next-auth/react';
export default function ChatbotFlowPage() {
    const { data: session, status } = useSession();
useEffect(() => {
    
  }, [status, session]);
  if (status === "loading") {
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
