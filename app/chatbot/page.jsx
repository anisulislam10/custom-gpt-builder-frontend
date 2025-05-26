'use client';
import { getServerSession } from 'next-auth/next';
import { useEffect, Suspense } from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import FlowBuilder from '../components/FlowBuilder';
import { authOptions } from '../api/auth/[...nextauth]/route'; // Adjust path to your auth options

export default async function ChatbotFlowPage() {
  // Fetch session on the server
  const session = await getServerSession(authOptions);

  useEffect(() => {
    // Optional: Client-side session refresh if needed
    const interval = setInterval(() => {
      // You can use a client-side update mechanism if necessary
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!session) {
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
