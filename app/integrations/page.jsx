'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SmtpModal from '../components/Smtp';
import ApiConfigModal from '../components/APiConfig';
export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const [isSmtpModalOpen, setIsSmtpModalOpen] = useState(false);
  const [isApiconfig, setApiOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            ></path>
          </svg>
          <span className="text-gray-700 text-xl font-medium">Loading Settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
          Settings
        </h1>
        <p className="text-gray-500 mb-8 text-lg">
          Configure your API and SMTP settings with ease.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setApiOpen(true)}
            className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Configure API Settings
          </button>
          <button
            onClick={() => setIsSmtpModalOpen(true)}
            className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Configure SMTP Settings
          </button>
        </div>

        <ApiConfigModal
          isOpen={isApiconfig}
          onClose={() => setApiOpen(false)}
          apiConfig={{
            openai: { apiKey: '', model: 'gpt-3.5-turbo' },
            deepseek: { apiKey: '', model: 'deepseek-chat' },
            gemini: { apiKey: '', model: 'gemini-pro' },
            chatbot: { provider: '' },
            provider: 'openai',
          }}
          onSave={(config) => {
            console.log('API Config Saved:', config);
            setApiOpen(false);
          }}
        />

        <SmtpModal
          isOpen={isSmtpModalOpen}
          onClose={() => setIsSmtpModalOpen(false)}
          onSave={(config) => {
            console.log('SMTP Config Saved:', config);
            setIsSmtpModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}