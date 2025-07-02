// app/components/Chatbot.jsx
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Chatbot = () => {
  const initializedRef = useRef(false);
  const containerRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    console.log('[Next.js] Creating chatbot container');
    const container = document.createElement('div');
    container.id = 'chatbot-container';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 100000; /* Increased z-index */
      pointer-events: none;
    `;
    document.body.appendChild(container);
    containerRef.current = container;

    console.log('[Next.js] Loading script.js');
    const script = document.createElement('script');
    script.src = '/api/chatbot-script';
    script.async = true;
    script.onload = () => {
      console.log('[Next.js] script.js loaded');
      window.ChatbotConfig = {
        flowId: '6839fd37577ced143770b4a3',
        userId: '6839e0287f90d8c892f0c2cf',
        websiteDomain: 'http://localhost:3000',
        position: 'bottom-right',
        theme: {
          primary: '#6366f1',
          secondary: '#f59e0b',
          background: '#ffffff',
          text: '#1f2937',
        },
      };
      console.log('[Next.js] ChatbotConfig set:', window.ChatbotConfig);
      try {
        window.initChatbot();
        console.log('[Next.js] initChatbot called');
      } catch (error) {
        console.error('[Next.js] initChatbot error:', error);
      }
    };
    script.onerror = (error) => {
      console.error('[Next.js] Failed to load script.js:', error);
    };
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      // Delay cleanup to ensure script initialization completes
      setTimeout(() => {
        console.log('[Next.js] Cleaning up chatbot');
        if (containerRef.current && document.body.contains(containerRef.current)) {
          document.body.removeChild(containerRef.current);
        }
        if (scriptRef.current && document.head.contains(scriptRef.current)) {
          document.head.removeChild(scriptRef.current);
        }
      }, 2000); // Increased delay to 2 seconds
    };
  }, []);

  return null;
};

export default dynamic(() => Promise.resolve(Chatbot), { ssr: false });