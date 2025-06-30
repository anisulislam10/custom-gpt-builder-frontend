'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FormDetail({data}) {

  const [responseData, setResponseData] = useState(data);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Form Response Details</h1>
      <Link
        href={`/responses/${responseData.userId || ''}`}
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Responses
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="space-y-4">
          <div><h2 className="text-lg font-semibold text-gray-700">Response ID</h2><p>{responseData._id || 'N/A'}</p></div>
          <div><h2 className="text-lg font-semibold text-gray-700">Form Name</h2><p>{responseData.formName || 'N/A'}</p></div>
          <div><h2 className="text-lg font-semibold text-gray-700">User Email</h2><p>{responseData.userEmail || 'N/A'}</p></div>
          <div><h2 className="text-lg font-semibold text-gray-700">Form ID</h2><p>{responseData.formId || 'N/A'}</p></div>
          <div><h2 className="text-lg font-semibold text-gray-700">Flow ID</h2><p>{responseData.flowId || 'N/A'}</p></div>
          <div><h2 className="text-lg font-semibold text-gray-700">Date</h2><p>{responseData.date || 'N/A'}</p></div>
          <div><h2 className="text-lg font-semibold text-gray-700">Submit Date</h2><p>{responseData.submitDate ? new Date(responseData.submitDate).toLocaleString() : 'N/A'}</p></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Response Data</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
              {responseData.response
                ? typeof responseData.response === 'object'
                  ? JSON.stringify(responseData.response, null, 2)
                  : String(responseData.response)
                : 'No response data'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
