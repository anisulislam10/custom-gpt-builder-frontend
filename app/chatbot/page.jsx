'use client';

import React, { Suspense, useCallback, useState } from 'react';
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
import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function ChatbotFlowPage() {
    const { data: session, status } = useSession();
 const sessions = await getServerSession(authOptions);
  if (!sessions) {
    redirect('/login?callbackUrl=/chatbot');
  }
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
