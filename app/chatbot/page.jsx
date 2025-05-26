'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const FlowBuilder = dynamic(() => import('../components/FlowBuilder'), {
  ssr: false,
  loading: () => <div>Loading FlowBuilder...</div>
});

export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const interval = setInterval(() => {
      update();
    }, 30000);
    return () => clearInterval(interval);
  }, [update]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full">
      {session?.user ? <FlowBuilder /> : 'loading'}
    </div>
  );
}
