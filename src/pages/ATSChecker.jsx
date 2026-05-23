import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const VALID_EXTS = ['pdf', 'docx', 'txt'];
const VALID_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

async function extractFileText(file) {
  if (file.size > MAX_FILE_SIZE)
    throw new Error('File is too large. Please upload a file under 5MB or paste text directly.');

  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'txt') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Could not read this file. Please paste your text directly.'));
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
    if (!text) throw new Error('Could not read this file. Please paste your text directly.');
    return text;
  }

  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    if (!text) throw new Error('Could not read this file. Please paste your text directly.');
    return text;
  }

  throw new Error('Please upload your resume as PDF or DOCX, or paste the text directly.');
}

const ATS_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyzer. Score the resume on 4 dimensions (each out of 25, total 100):

1. FORMATTING (25): Check for ATS-friendly formatting. Penalize: tables, images, columns, fancy fonts, headers/footers, special characters. Reward: clean text, standard fonts, consistent formatting.

2. KEYWORDS (25): If a JD is provided, check keyword match percentage. If no JD, check for common industry keywords. Penalize: missing technical skills, missing soft skills. Reward: strong keyword density.

3. STRUCTURE (25): Check for standard resume sections: contact info, summary, experience, education, skills. Penalize: missing sections, non-standard section names, poor organization. Reward: clear hierarchy, chronological order.

4. IMPACT (25): Check for quantified achievements, action verbs, results-oriented language. Penalize: generic descriptions, duties-based language, no metrics. Reward: specific numbers, percentages, dollar amounts.

Respond in this exact JSON format:
{
  "overall_score": number,
  "formatting_score": number,
  "keywords_score": number,
  "structure_score": number,
  "impact_score": number,
  "whats_working": ["point 1", "point 2", "point 3"],
  "what_to_fix": ["issue 1", "issue 2", "issue 3"],
  "missing_keywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

export default function ATSChecker({ user }) {
  const { requireAuth } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const resumeFileInputRef = useRef(null);

  const handleResumeFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_MIMES.includes(file.type)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    setFileUploading(true);
    try {
      const text = await extractFileText(file);
      setResumeText(text);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setFileUploading(false);
    }
  };

  const runATSCheck = async () => {
    if (resumeText.trim().length < 100) {
      setError('Please paste or upload a resume with at least 100 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const userMessage = jdText.trim()
        ? `Resume:\n\n${resumeText}\n\nTarget Job Description:\n\n${jdText}`
        : `Resume:\n\n${resumeText}`;

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: ATS_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      let fullText = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.content?.[0]?.text) {
                fullText += json.content[0].text;
              }
            } catch (e) {
              // ignore parse errors in individual chunks
            }
          }
        }
      }

      // Extract JSON from response (strip markdown fences if present)
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse API response.');
      }

      const parsedResult = JSON.parse(jsonMatch[0]);
      setResult(parsedResult);
    } catch (err) {
      setError(err.message || 'Could not analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckResume = () => {
    requireAuth('Sign in to check your resume', runATSCheck);
  };

  const resetForm = () => {
    setResumeText('');
    setJdText('');
    setResult(null);
    setError('');
  };

  const getScoreColor = (score) => {
    if (score < 50) return '#CF222E';
    if (score < 75) return '#C67F00';
    return '#16A34A';
  };

  const getSectionColor = (score) => {
    if (score < 12) return '#F5F3EF';
    return '#FDCD34';
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
      <style>{`
        @media (max-width: 768px) {
          .ats-input-grid { grid-template-columns: 1fr !important; }
          .ats-scores-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ats-textarea { font-size: 16px !important; }
          .ats-button { min-height: 44px !important; }
        }
      `}</style>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: '28px',
            fontWeight: 400,
            color: '#1B1B18',
            marginBottom: '12px',
            margin: 0,
          }}
        >
          ATS Resume Checker
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(27,27,24,0.5)',
            margin: 0,
            marginTop: '12px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Find out if your resume will pass Applicant Tracking Systems. Get instant feedback on formatting, keywords, and structure.
        </p>
      </div>

      {!result ? (
        <>
          {/* Input Section */}
          <div
            className="ats-input-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            {/* Resume Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1B1B18',
                  marginBottom: '8px',
                }}
              >
                Your Resume
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                style={{
                  width: '100%',
                  height: '280px',
                  padding: '13px 16px',
                  border: '1.5px solid #E8E6E1',
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  resize: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '12px',
                }}
              />
              <button
                onClick={() => resumeFileInputRef.current?.click()}
                disabled={fileUploading}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: '1.5px solid #E8E6E1',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#1B1B18',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: fileUploading ? 'not-allowed' : 'pointer',
                  opacity: fileUploading ? 0.6 : 1,
                }}
              >
                {fileUploading ? 'Uploading...' : 'Upload Resume (PDF or DOCX)'}
              </button>
              <input
                ref={resumeFileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleResumeFileSelect}
                style={{ display: 'none' }}
              />
            </div>

            {/* Job Description Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1B1B18',
                  marginBottom: '8px',
                }}
              >
                Target Job Description (optional)
              </label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the JD you're applying to for keyword matching..."
                style={{
                  width: '100%',
                  height: '280px',
                  padding: '13px 16px',
                  border: '1.5px solid #E8E6E1',
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: '#FEE',
                border: '1px solid #CF222E',
                borderRadius: '8px',
                color: '#CF222E',
                fontSize: '13px',
                marginBottom: '24px',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={handleCheckResume}
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                background: loading ? '#999' : '#1B1B18',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Analyzing your resume...' : 'Check My Resume'}
            </button>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(27,27,24,0.5)',
                textAlign: 'center',
                marginTop: '12px',
                margin: 0,
                marginTop: '12px',
              }}
            >
              Takes about 30 seconds. Your resume is not stored.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Results Section */}

          {/* Overall Score */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: getScoreColor(result.overall_score),
                marginBottom: '8px',
              }}
            >
              {result.overall_score}/100
            </div>
            <div style={{ fontSize: '16px', color: '#1B1B18', fontWeight: 600 }}>
              ATS Compatibility Score
            </div>
          </div>

          {/* Section Scores */}
          <div
            className="ats-scores-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            {[
              { label: 'Formatting', score: result.formatting_score },
              { label: 'Keywords', score: result.keywords_score },
              { label: 'Structure', score: result.structure_score },
              { label: 'Impact', score: result.impact_score },
            ].map((section, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px',
                  background: getSectionColor(section.score),
                  border: '1px solid #E8E6E1',
                  borderRadius: '16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '14px', color: '#1B1B18', fontWeight: 600, marginBottom: '8px' }}>
                  {section.label}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#1B1B18',
                  }}
                >
                  {section.score}/25
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Sections */}
          <div style={{ marginBottom: '48px' }}>
            {/* What's Working */}
            {result.whats_working && result.whats_working.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  background: 'white',
                  border: '4px solid #16A34A',
                  borderLeft: '4px solid #16A34A',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ color: '#16A34A', margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
                  ✓ What's Working
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#1B1B18', fontSize: '14px' }}>
                  {result.whats_working.map((point, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to Fix */}
            {result.what_to_fix && result.what_to_fix.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  background: 'white',
                  border: '4px solid #CF222E',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ color: '#CF222E', margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
                  ✗ What to Fix
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#1B1B18', fontSize: '14px' }}>
                  {result.what_to_fix.map((point, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {result.missing_keywords && result.missing_keywords.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  background: 'white',
                  border: '4px solid #C67F00',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ color: '#C67F00', margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
                  Missing Keywords from JD
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#1B1B18', fontSize: '14px' }}>
                  {result.missing_keywords.map((keyword, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>
                      {keyword}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  background: 'white',
                  border: '4px solid #0066CC',
                  borderRadius: '12px',
                }}
              >
                <h3 style={{ color: '#0066CC', margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
                  Suggested Improvements
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#1B1B18', fontSize: '14px' }}>
                  {result.suggestions.map((suggestion, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }))
              }
              style={{
                flex: 1,
                minWidth: '200px',
                height: '48px',
                background: '#1B1B18',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Now practice your interview →
            </button>
            <button
              onClick={resetForm}
              style={{
                flex: 1,
                minWidth: '200px',
                height: '48px',
                background: 'white',
                color: '#1B1B18',
                border: '1.5px solid #E8E6E1',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Check another resume
            </button>
          </div>
        </>
      )}
    </div>
  );
}
