'use client';

import '../app/globals.css';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/DashboardLayout';
import { AppProviders } from './providers';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isChatbotPage = pathname === '/chatbot';
  const isSignupPage = pathname === '/signup';
  const isResetPasswordPage = pathname === '/reset-password';

  const showIframe = !isLoginPage && !isChatbotPage && !isSignupPage && !isResetPasswordPage;

  return (
    <html lang="en">
      <body>
        <AppProviders>
          {isLoginPage || isChatbotPage || isSignupPage || isResetPasswordPage ? (
            <>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#f8f9fa',
                    color: '#212529',
                    border: '1px solid #007bff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                  error: {
                    style: {
                      border: '1px solid #dc3545',
                    },
                  },
                }}
              />
            </>
          ) : (
            <DashboardLayout>
              {children}
              {showIframe && (
                <iframe
                  src="https://custom-gpt-backend-sigma.vercel.app/api/chatbot/6835fb35590bc462d6f353a7/6835bc42f384539e5750e84a?domain=https%3A%2F%2Fcustom-gpt-builder-frontend.vercel.app"
                  style={{
                    width: '400px',
                    height: '600px',
                    border: 'none',
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                  }}
                  allowTransparency="true"
                  title="Chatbot"
                ></iframe>
              )}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#f8f9fa',
                    color: '#212529',
                    border: '1px solid #007bff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                  error: {
                    style: {
                      border: '1px solid #dc3545',
                    },
                  },
                }}
              />
            </DashboardLayout>
          )}
        </AppProviders>
      </body>
    </html>
  );
}