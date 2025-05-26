'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      update(); // Manually trigger session update
    }
  }, [status, update]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <p>Please sign in to access the Flow Builder.</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <FlowBuilder />
      </Suspense>
    </ReactFlowProvider>
  );
}
