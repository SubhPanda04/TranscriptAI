import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Summarize in bullet points for executives');
  const [summary, setSummary] = useState('');
  const [recipients, setRecipients] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

  useEffect(() => {
    const handle = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleSummarize();
      }
    };
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    };
  }, [transcript, prompt]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      setFileProcessing(true);

      try {
        if (fileExtension === 'txt') {
          // Handle text files
          const reader = new FileReader();
          reader.onload = (evt) => {
            setTranscript(evt.target.result);
            setFileProcessing(false);
          };
          reader.onerror = () => {
            alert('Error reading file. Please try again.');
            setFileProcessing(false);
          };
          reader.readAsText(file);
        } else if (fileExtension === 'docx') {
          // Handle DOCX files using mammoth
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          setTranscript(result.value);
          setFileProcessing(false);
        } else if (fileExtension === 'doc') {
          // DOC files (older format) are not supported by mammoth
          alert('Legacy .doc files are not supported. Please save your document as .docx or .txt format, or copy and paste the text directly.');
          setFileProcessing(false);
          e.target.value = '';
        } else {
          alert('Please upload a .txt or .docx file, or copy and paste your text directly.');
          setFileProcessing(false);
          e.target.value = '';
        }
      } catch (error) {
        alert('Error processing file. Please try saving it as a .txt file or copy and paste the text directly.');
        setFileProcessing(false);
        e.target.value = '';
      }
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    setEmailStatus('');
    const res = await fetch(`${API_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, prompt })
    });
    const data = await res.json();
    setSummary(data.summary || '');
    setLoading(false);
  };

  const handleSendEmail = async () => {
    setLoading(true);
    setEmailStatus('');

    try {
      const res = await fetch(`${API_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, recipients })
      });

      const data = await res.json();

      if (data.success) {
        setEmailStatus('Email sent successfully!');
      } else {
        setEmailStatus(data.details || data.error || 'Failed to send email. Please check email configuration.');
      }
    } catch (error) {
      setEmailStatus('Network error. Please check if the backend server is running.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">✦</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">TranscriptAI</h1>
          <span className="ml-auto bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">Beta</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Upload Transcript */}
        <div className="w-1/2 p-6 bg-white border-r border-gray-200">
          <div className="h-full flex flex-col">
            {/* Upload Section */}
            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Upload Transcript</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4">Upload your meeting notes, call transcripts, or paste text directly</p>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-25">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                  {fileProcessing ? (
                    <svg className="w-6 h-6 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="mb-2">
                  <label htmlFor="file-upload" className={`font-medium cursor-pointer ${fileProcessing ? 'text-green-500' : 'text-green-700 hover:text-green-800'}`}>
                    {fileProcessing ? 'Processing file...' : 'Click to upload or drag and drop'}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.docx"
                    onChange={handleFileChange}
                    disabled={fileProcessing}
                    className="hidden"
                  />
                </div>
                <p className="text-gray-500 text-sm">TXT, DOCX files up to 10MB</p>
              </div>              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            </div>

            {/* Paste Text Area */}
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Paste transcript text</label>
              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript or call notes here..."
                className="flex-1 w-full border border-gray-300 rounded-lg p-3 bg-green-50 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none resize-none"
              />
            </div>

            {/* Custom Instructions */}
            <div className="mt-6">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Custom Instructions</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">Customize how you want your transcript summarized</p>

                <label className="text-sm font-medium text-gray-700 mb-2 block">Summarization prompt</label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  rows={3}
                />                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setPrompt('Summarize in bullet points for executives')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Executive Summary
                  </button>
                  <button
                    onClick={() => setPrompt('Extract action items and next steps')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Action Items
                  </button>
                  <button
                    onClick={() => setPrompt('Summarize meeting minutes with key decisions')}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Meeting Minutes
                  </button>
                </div>

                <button
                  onClick={handleSummarize}
                  disabled={loading || !transcript || !prompt}
                  className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  {loading ? 'Generating...' : 'Generate Summary'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Generated Summary */}
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
                        <p className={`mt-2 text-sm ${emailStatus === 'Email sent!' ? 'text-green-600' : 'text-red-600'}`}>
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
      </div>
    </div>
  );
}

export default App;
