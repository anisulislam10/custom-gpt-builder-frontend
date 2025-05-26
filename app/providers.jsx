"use client";

import { SessionProvider } from "next-auth/react";

import './globals.css';

export function AppProviders({ children }) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  );
}
