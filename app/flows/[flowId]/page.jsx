'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function InvitePage() {
  const { flowId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('collaborator');
  const [inviteLink, setInviteLink] = useState('');
  const [invites, setInvites] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [access, setAccess] = useState({ allowed: false }); // Fix typo: acess -> access, default to not allowed

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?redirect=/invite/${flowId}`);
      return;
    }

    if (session) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [invitesRes, collaboratorsRes, accessRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/invites/${flowId}`, {
              headers: { Authorization: `Bearer ${session.user.token}` },
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/invites/collaborators/${flowId}`, {
              headers: { Authorization: `Bearer ${session.user.token}` },
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/flow/get/${session?.user?.id}/${flowId}`, {
              headers: { Authorization: `Bearer ${session.user.token}` },
            }),
          ]);

          if (!invitesRes.ok) throw new Error(`Failed to fetch invites: ${invitesRes.statusText}`);
          if (!collaboratorsRes.ok) throw new Error(`Failed to fetch collaborators: ${collaboratorsRes.statusText}`);
          if (!accessRes.ok) throw new Error(`Failed to fetch access permission: ${accessRes.statusText}`);

          const invitesData = await invitesRes.json();
          const collaboratorsData = await collaboratorsRes.json();
          const accessData = await accessRes.json();
          setAccess(accessData); // Set access state
          setInvites(invitesData.invites || []);
          setCollaborators(collaboratorsData.collaborators || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [status, session, flowId, router]);

  const handleGenerateInvite = async () => {
    if (!access.allowed) {
      setError('You do not have permission to generate invites for this flow.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/invites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ flowId, role }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to generate invite: ${response.statusText}`);
      }
      const data = await response.json();
      setInviteLink(data.inviteLink);
      setInvites([...invites, { inviteLink: data.inviteLink, inviteCode: data.inviteCode, role, createdAt: new Date() }]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!access.allowed) {
      setError('You do not have permission to send invites for this flow morir');
      return;
    }
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/invites/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ flowId, email, role }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to send email: ${response.statusText}`);
      }
      const data = await response.json();
      setInvites([...invites, { inviteLink: data.inviteLink, inviteCode: data.inviteCode, role, createdAt: new Date() }]);
      setEmail('');
      setError(null);
      alert('Invitation sent successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateInvite = async (inviteCode) => {
    if (!access.allowed) {
      setError('You do not have permission to deactivate invites for this flow.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/invites/deactivate/${inviteCode}`,
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
        throw new Error(errorData.message || `Failed to deactivate invite: ${response.statusText}`);
      }
      setInvites(invites.filter((invite) => invite.inviteCode !== inviteCode));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.write(link);
    alert('Invite link copied to clipboard!');
  };

  if (status === 'loading' || (loading && invites.length === 0 && collaborators.length === 0)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
          Invite Collaborators
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Invite others to collaborate on your chatbot project (Flow ID: {flowId})
        </p>

      

        {!access.allowed? (
          <div className="text-yellow-600 text-center p-4 bg-yellow-50 rounded-lg mb-8">
            You do not have permission to invite collaborators to this flow. Only flow owners or admins can send invites.
          </div>
        ):
        (
          <>
        
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Invitation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter email address"
                disabled={!access.allowed} // Disable if not allowed
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!access.allowed} // Disable if not allowed
              >
                <option value="collaborator">Collaborator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSendEmail}
              disabled={loading || !access.allowed} // Disable if not allowed
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300"
            >
              Send Email Invite
            </button>
            <button
              onClick={handleGenerateInvite}
              disabled={loading || !access.allowed} // Disable if not allowed
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition disabled:bg-gray-200"
            >
              Generate Link
            </button>
          </div>
          {inviteLink && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Invite Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  onClick={() => handleCopyLink(inviteLink)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Invites Table */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Invites</h2>
          {invites.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invite Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invites.map((invite) => (
                    <tr key={invite.inviteCode}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a
                          href={invite.inviteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          {invite.inviteLink}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {invite.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invite.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeactivateInvite(invite.inviteCode)}
                          disabled={!access.allowed} // Disable if not allowed
                          className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No active invites found</p>
          )}
        </div>

        {/* Collaborators Table */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Collaborators</h2>
          {collaborators.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collaborators.map((collab) => (
                    <tr key={collab.userId._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {collab.userId.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {collab.userId.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {collab.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(collab.addedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No collaborators found</p>
          )}
        </div>
        </>)
        }

        {/* Invite Form */}
      
      </motion.div>
    </div>
  );
}