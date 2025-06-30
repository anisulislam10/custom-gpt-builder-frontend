'use client';
import InteractionHistory from '@/app/components/InteractionHistory';
import { use } from 'react';

export default function InteractionHistoryPage({ params }) {
  const { flowId, userId } = use(params); // Unwrap params with React.use()

  return (
    <div className="min-h-screen bg-gray-100">
      <InteractionHistory flowId={flowId} userId={userId} />
    </div>
  );
}