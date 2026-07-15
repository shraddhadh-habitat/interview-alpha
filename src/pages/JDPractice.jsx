import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const VALID_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const extractFileText = async (file) => {
  if (file.size > MAX_FILE_SIZE) throw new Error('File too large. Maximum size is 5MB.');
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'txt') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Could not read this file.'));
      reader.readAsText(file);
    });
  }
  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(' '));
    }
    const text = pages.join('\n').trim();
    if (!text) throw new Error('Could not read this PDF. Please paste your text directly.');
    return text;
  }
  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    if (!text) throw new Error('Could not read this file.');
    return text;
  }
  throw new Error('Unsupported file type.');
};

export default function JDPractice() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('input'); // input | processing | results
  const resumeFileInputRef = useRef(null);

  const handleResumeFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!VALID_MIMES.includes(file.type)) {
      setError('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    setFileUploading(true);
    setError('');
    try {
      const text = await extractFileText(file);
      setResumeText(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setFileUploading(false);
    }
  };

  const canGenerate = resumeText.trim().length > 100 && jdText.trim().length > 100;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setStep('processing');
    // matching logic will be wired here in phase 2
    setTimeout(() => setStep('results'), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Instrument Serif', serif", color: '#1a1a1a', marginBottom: 8 }}>
            Practice for Your Interview
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Upload your resume and paste the job description. We'll build you a personalised set of 100 practice questions.
          </p>
        </div>

        {step === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Resume Upload */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>
                Step 1 — Your Resume
              </div>

              <input
                ref={resumeFileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleResumeFileSelect}
                style={{ display: 'none' }}
              />

              {!resumeText ? (
                <button
                  onClick={() => resumeFileInputRef.current?.click()}
                  disabled={fileUploading}
                  style={{
                    width: '100%',
                    padding: '20px',
                    border: '2px dashed #d1d5db',
                    borderRadius: 12,
                    background: 'transparent',
                    cursor: fileUploading ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    color: '#6b7280',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 28 }}>📄</span>
                  <span>{fileUploading ? 'Reading your resume...' : 'Upload Resume (PDF or DOCX)'}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>or paste below</span>
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10 }}>
                  <span style={{ fontSize: 20 }}>✅</span>
                  <span style={{ fontSize: 14, color: '#15803d', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Resume uploaded successfully</span>
                  <button onClick={() => setResumeText('')} style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>Change</button>
                </div>
              )}

              {!resumeText && (
                <textarea
                  placeholder="Or paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: 12,
                    padding: '12px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: '#374151',
                    minHeight: 100,
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </div>

            {/* JD Input */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>
                Step 2 — Job Description
              </div>
              <textarea
                placeholder="Paste the full job description here — including role, responsibilities, requirements, and company details..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 13,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: '#374151',
                  minHeight: 180,
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {jdText.length > 0 && jdText.length < 100 && (
                <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Please paste the full job description for better results.
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#dc2626', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              style={{
                width: '100%',
                padding: '16px',
                background: canGenerate ? 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)' : '#e5e7eb',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: canGenerate ? '#fff' : '#9ca3af',
                cursor: canGenerate ? 'pointer' : 'not-allowed',
              }}
            >
              Generate My 100 Questions →
            </button>

            {!canGenerate && (resumeText || jdText) && (
              <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Add both your resume and job description to continue.
              </p>
            )}
          </div>
        )}

        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>⚡</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Instrument Serif', serif", color: '#1a1a1a', marginBottom: 8 }}>
              Building your question set...
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Analysing your JD and matching questions from our bank.
            </p>
          </div>
        )}

        {step === 'results' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>🎯</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Instrument Serif', serif", color: '#1a1a1a', marginBottom: 8 }}>
              Your question set is ready
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Matching logic will be wired in phase 2.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
