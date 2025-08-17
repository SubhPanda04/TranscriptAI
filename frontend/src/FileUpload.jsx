import React, { useState, useCallback } from 'react';

const FileUpload = ({ onTranscriptChange, fileProcessing, setFileProcessing }) => {
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      setFileProcessing(true);

      try {
        if (fileExtension === 'txt') {
          // Handle text files
          const reader = new FileReader();
          reader.onload = (evt) => {
            onTranscriptChange(evt.target.result);
            setFileProcessing(false);
          };
          reader.onerror = () => {
            alert('Error reading file. Please try again.');
            setFileProcessing(false);
          };
          reader.readAsText(file);
        } else if (fileExtension === 'docx') {
          // Handle DOCX files using mammoth
          const { default: mammoth } = await import('mammoth');
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          onTranscriptChange(result.value);
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
  }, [onTranscriptChange, setFileProcessing]);

  return (
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
      </div>
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
    </div>
  );
};

export default FileUpload;