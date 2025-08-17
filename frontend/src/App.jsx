import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL;

const FileUpload = lazy(() => import('./FileUpload.jsx'));
const SummaryDisplay = lazy(() => import('./SummaryDisplay.jsx'));

function App() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Summarize in bullet points for executives');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const handleSummarize = useCallback(async () => {
    setLoading(true);
    setSummary('');
    const res = await fetch(`${API_URL}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, prompt })
    });
    const data = await res.json();
    setSummary(data.summary || '');
    setLoading(false);
  }, [transcript, prompt]);

  const debouncedSummarize = useMemo(() => debounce(handleSummarize, 500), [handleSummarize]);

  useEffect(() => {
    const handle = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        debouncedSummarize();
      }
    };
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    };
  }, [debouncedSummarize]);


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
            <Suspense fallback={<div>Loading...</div>}>
              <FileUpload
                onTranscriptChange={setTranscript}
                fileProcessing={fileProcessing}
                setFileProcessing={setFileProcessing}
              />
            </Suspense>

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
                  onClick={debouncedSummarize}
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
        <Suspense fallback={<div>Loading...</div>}>
          <SummaryDisplay
            summary={summary}
            setSummary={setSummary}
            loading={loading}
            setLoading={setLoading}
            transcript={transcript}
            prompt={prompt}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
