'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import FlowBuilder from '../components/FlowBuilder';

export default function ChatbotFlowPage() {
  const { data: session, status } = useSession();
  const [client, setClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (!client || status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
}
