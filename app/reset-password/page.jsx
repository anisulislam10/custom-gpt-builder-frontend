'use client';
import {  Suspense } from 'react';

import ResetPassword from '../components/Resetpassword';

export default function ResetPasswordPage() {

  return (
   <Suspense fallback={<div>Loading...</div>}>

<ResetPassword />
    </Suspense>
  );
}