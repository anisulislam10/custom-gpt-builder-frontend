// app/login/page.js
'use client';
import { Suspense } from 'react';

import Link from 'next/link';
import { FaEnvelope, FaLock, FaGoogle, FaPaperPlane } from 'react-icons/fa';
import LoginPagee from '../components/LoginPage';


export default function LoginPage() {


  return (
    <Suspense fallback={<div>Loading login...</div>}>
 <LoginPagee/>
    </Suspense>
  );
}