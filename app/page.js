'use client';

import { useSession } from "next-auth/react";
import DashboardPage from "./dashboard/page";
import LoginPage from "./login/page";
import { Suspense } from "react";
export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session?.user?.name) {
    return <DashboardPage />;
  }

  return(
    <Suspense fallback={<div>Loading...</div>}>
    
    <LoginPage />
    
    </Suspense>
    )


}