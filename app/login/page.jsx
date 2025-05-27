'use client';
import {  Suspense } from 'react';

import LoginPagee from '../components/Login';

export default function LoginPage() {
 

  return (
 <Suspense fallback={<div>Loading...</div>}>

<LoginPagee />
  </Suspense>
  );
}