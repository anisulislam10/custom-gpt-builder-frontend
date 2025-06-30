// pages/form-responses.js (or app/form-responses/page.js)
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function FormResponses() {
  const [formResponses, setFormResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/flow/response/${session.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch responses');
        const data = await response.json();
        setFormResponses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) fetchResponses();
  }, [session?.user?.id]);

  const openModal = (response) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResponse(null);
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center py-10">⏳ Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">❌ {error}</div>;
  if (!formResponses.length) return <div className="text-center py-10 text-gray-500">No responses found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">📋 Form Responses</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">📅 Date</th>
              <th className="px-6 py-3 text-left font-semibold">📝 Form Name</th>
              <th className="px-6 py-3 text-left font-semibold">📧 User Email</th>
              <th className="px-6 py-3 text-left font-semibold">⏱️ Submitted At</th>
              <th className="px-6 py-3 text-left font-semibold">🔍 Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {formResponses.map((group) =>
              group.responses.map((response) => (
                <tr key={response._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-600">{group.date}</td>
                  
                  <td className="px-6 py-4">{response.formName==='Unnamed Flow'?'Contact Form':response.formName}</td>
                  <td className="px-6 py-4">{response.userEmail}</td>
                  <td className="px-6 py-4">{new Date(response.submitDate).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openModal(response)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative transform transition-all duration-300 scale-100">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Response Details</h2>
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-600">Form Name:</span>
                <p className="text-gray-800">{selectedResponse.formName==='Unnamed Flow'?'Contact Form':''}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">User Email:</span>
                <p className="text-gray-800">{selectedResponse.userEmail}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Submitted At:</span>
                <p className="text-gray-800">{new Date(selectedResponse.submitDate).toLocaleString()}</p>
              </div>
              {/* Add more response details as needed */}
              <div>
                <span className="font-semibold text-gray-600">Response Data:</span>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 overflow-auto max-h-60">
                  {JSON.stringify(selectedResponse, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}