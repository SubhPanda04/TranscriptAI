import React, { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SummaryDisplay = ({ summary, setSummary, loading, setLoading, transcript, prompt }) => {
  const [recipients, setRecipients] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  const handleSendEmail = useCallback(async () => {
    setLoading(true);
    setEmailStatus('');

    try {
      const response = await axios.post(`${API_URL}/v1/send-email`, {
        summary,
        recipients
      });

      if (response.data.success) {
        setEmailStatus('Email sent successfully!');
      } else {
        setEmailStatus(response.data.details || response.data.error || 'Failed to send email. Please check email configuration.');
      }
    } catch (error) {
      if (error.response) {
        setEmailStatus(error.response.data.details || error.response.data.error || 'Failed to send email.');
      } else {
        setEmailStatus('Network error. Please check if the backend server is running.');
      }
    }

    setLoading(false);
  }, [summary, recipients, setLoading]);

  return (
    <div className="w-1/2 p-6 bg-gray-50">
      <div className="h-full flex flex-col">
        <div className="bg-green-50 rounded-xl p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Generated Summary</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">AI-generated summary based on your custom instructions</p>

          {!summary && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-gray-500">Upload a transcript and click 'Generate Summary' to get started</p>
            </div>
          )}

          {(summary || loading) && (
            <div className="flex-1 flex flex-col">
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder={loading ? "Generating summary..." : "Your AI-generated summary will appear here..."}
                className="flex-1 w-full border border-gray-300 rounded-lg p-4 bg-white text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none resize-none"
                readOnly={loading}
              />

              {summary && !loading && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Send summary via email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={recipients}
                      onChange={e => setRecipients(e.target.value)}
                      placeholder="Enter email addresses, comma separated"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    />
                    <button
                      onClick={handleSendEmail}
                      disabled={loading || !summary || !recipients}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                  {emailStatus && (
                    <p className={`mt-2 text-sm ${emailStatus === 'Email sent successfully!' ? 'text-green-600' : 'text-red-600'}`}>
                      {emailStatus}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;