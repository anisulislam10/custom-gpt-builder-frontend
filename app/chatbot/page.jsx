'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import FlowBuilder from "../components/FlowBuilder";

export default function ChatbotFlowPage() {
  const { data: session, status, update } = useSession();
  const [initialized, setInitialized] = useState(false);

  // Enhanced session handling
  useEffect(() => {
    const handleSession = async () => {
      try {
        // First, try to update the session
        await update();
        
        // If still unauthenticated after update, redirect
        if (status === 'unauthenticated') {
          window.location.href = '/login'; // Using window.location to ensure full page reload
          return;
        }
        
        setInitialized(true);
      } catch (error) {
        console.error('Session update error:', error);
      }
    };

    // Initial check
    handleSession();

    // Set up visibility change handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, update]);

  // Additional session check on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'loading') {
        update();
      }
    }, 1000); // Retry after 1 second if still loading

    return () => clearTimeout(timer);
  }, [status, update]);

  if (!initialized || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirect will handle this
  }

  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
}
