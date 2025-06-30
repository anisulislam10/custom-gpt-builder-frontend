'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ResponseDetail() {
  const params = useParams();
  const [responseId, setResponseId] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params?.responseId) {
      setResponseId(params.responseId);
    }
  }, [params]);

  useEffect(() => {
    if (!responseId) return;

    const fetchResponseDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/flow/response/detail/${responseId}`);
        if (!res.ok) throw new Error('Failed to fetch response details');
        const data = await res.json();
        setResponseData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponseDetail();
  }, [responseId]);

  return (
    <div className="container mx-auto p-4 max-w-2xl" >
      {loading && (
        <div className="text-center p-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4" >
          <p className="text-red-500">Error: {error}</p>
          <Link
            href="/form-responses"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Responses
          </Link>
        </div>
      )}

      {!loading && !error && !responseData && (
        <div className="text-center p-4" >
          <p className="text-gray-600">No response data found</p>
          <Link
            href="/form-responses"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Responses
          </Link>
        </div>
      )}

      {!loading && !error && responseData && (
        <>
          <Link
            href="/form-responses"
            className="mb-6 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
            data-hydration-marker="back-link"
          >
            ← Back to Responses
          </Link>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Form Response Details</h1>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="space-y-4 text-gray-700">
              <div>
                <h2 className="text-lg font-semibold">Response ID</h2>
                <p>{responseData._id || 'N/A'}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Form Name</h2>
                <p>{responseData.formName || 'N/A'}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">User Email</h2>
                <p>{responseData.userEmail || 'N/A'}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Form ID</h2>
                <p>{responseData.formId || 'N/A'}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Flow ID</h2>
                <p>{responseData.flowId || 'N/A'}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Date</h2>
                <p>{responseData.date || 'N/A'}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Submit Date</h2>
                <p>
                  {responseData.submitDate
                    ? new Date(responseData.submitDate).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Response Data</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  {responseData.response
                    ? JSON.stringify(responseData.response, null, 2)
                    : 'No response data'}
                </pre>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}