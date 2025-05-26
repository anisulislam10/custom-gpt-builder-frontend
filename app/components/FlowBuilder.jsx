'use client';
export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { Suspense, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowBuilder from '../components/FlowBuilder';

export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();

  // Optional: Trigger session update periodically to avoid tab focus dependency
  useEffect(() => {
     window.location.reload(); // Programmatically refresh the page
// Cleanup on unmount
  }, []);



  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <FlowBuilder />
        {/* Optional: Button to trigger manual refresh */}
    
      </Suspense>
    </ReactFlowProvider>
  );
}
