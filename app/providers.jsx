"use client";

import { SessionProvider } from "next-auth/react";

import './globals.css';

export function AppProviders({ children }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
        {children}
    </SessionProvider>
  );
}
