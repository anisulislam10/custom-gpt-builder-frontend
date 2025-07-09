import { useEffect } from 'react';

export default function ChatbotLoader() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `${process.env.NEXT_PUBLIC_API_BASE}/api/chatbot/script.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      window.ChatbotConfig = {
        flowId: "686baae530bf09c5634ea510",
        userId: "6839e0287f90d8c892f0c2cf",
        websiteDomain: "https://custom-gpt-builder-frontend.vercel.app",
        position: "bottom-right",
        theme: {
          primary: "#7C3AED",
          secondary: "#F59E0B",
          background: "#FFFFFF",
          text: "#1F2937",
          buttonText: "#FFFFFF"
        }
      };
      setTimeout(() => {
        if (window.initChatbot) {
          window.initChatbot();
        }
      }, 300);
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}