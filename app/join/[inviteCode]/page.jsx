// app/join/[inviteCode]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function JoinPage() {
  const { inviteCode } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log("token",session)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?inviteCode=${inviteCode}`);
    }
  }, [status, inviteCode, router]);

  const handleJoin = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/invites/accept/${inviteCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({ userId: session.user.id }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to join: ${response.statusText}`);
      }
      const data = await response.json();
      alert('Successfully joined the flow!');
      router.push(`/flows`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Join Chatbot Project</h1>
        <p className="text-gray-600 text-center mb-6">
          Please{' '}
          <a href={`/register?inviteCode=${inviteCode}`} className="text-indigo-600 hover:underline">
            register
          </a>{' '}
          or{' '}
          <a href={`/login?inviteCode=${inviteCode}`} className="text-indigo-600 hover:underline">
            log in
          </a>{' '}
          to accept this invitation.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Join Chatbot Project</h1>
      {error && (
        <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg mb-6">
          Error: {error}
        </div>
      )}
      <p className="text-gray-600 text-center mb-6">
        Click below to join the chatbot project as a collaborator.
      </p>
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300"
      >
        {loading ? 'Joining...' : 'Join Project'}
      </button>
    </div>
  );
}