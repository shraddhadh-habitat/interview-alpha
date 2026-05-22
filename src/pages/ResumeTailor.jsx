import { useState, useRef } from 'react';
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

const TAILOR_SYSTEM_PROMPT = `You are an expert resume consultant. Given a resume and a job description, analyze the match and provide tailored improvements.

Respond in this exact JSON format:
{
  "match_percentage": number,
  "keywords_found": ["keyword1", "keyword2"],
  "keywords_missing": ["keyword1", "keyword2"],
  "bullet_rewrites": [
    { "original": "original text", "tailored": "rewritten text matching JD keywords" }
  ],
  "skills_to_add": ["skill1", "skill2"],
  "summary_rewrite": "A professional summary paragraph tailored to this specific role...",
  "overall_advice": "One paragraph of strategic advice on positioning for this role"
}

Rules:
- Do not hallucinate experience the candidate doesn't have
- Only rewrite existing bullet points to better match JD language
- Highlight transferable skills
- Be specific about which JD requirements each rewrite addresses
- Keep the candidate's authentic experience, just frame it better`;

// Helper component to highlight keywords in text
function HighlightedText({ text, keywords }) {
  if (!keywords || keywords.length === 0) return <span>{text}</span>;

  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  const escapedKeywords = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        lowerKeywords.includes(part.toLowerCase()) ? (
          <mark
            key={i}
            style={{
              background: '#FDCD34',
              padding: '0 2px',
              borderRadius: '2px',
              fontWeight: 600,
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function ResumeTailor({ user }) {
  const { requireAuth } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [summaryCopied, setSummaryCopied] = useState(false);
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

  const runTailorCheck = async () => {
    if (resumeText.trim().length < 200) {
      setError('Please paste or upload a resume with at least 200 characters.');
      return;
    }
    if (jdText.trim().length < 100) {
      setError('Job description is required. Please paste the complete job description.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const userMessage = `Resume:\n\n${resumeText}\n\nJob Description:\n\n${jdText}`;

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          system: TAILOR_SYSTEM_PROMPT,
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

      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse API response.');
      }

      const parsedResult = JSON.parse(jsonMatch[0]);
      setResult(parsedResult);
    } catch (err) {
      setError(err.message || 'Could not tailor resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = () => {
    requireAuth('Sign in to tailor your resume', runTailorCheck);
  };

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleSummaryCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.summary_rewrite);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
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

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>{`
        @media (max-width: 768px) {
          .tailor-input-grid { grid-template-columns: 1fr !important; }
          .keyword-grid { grid-template-columns: 1fr !important; }
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
            margin: 0,
            marginBottom: '12px',
          }}
        >
          Resume Tailor
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(27,27,24,0.5)',
            margin: 0,
            marginTop: '12px',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Paste your resume and a job description. AI tailors your resume to match the role, highlighting relevant experience and adding missing keywords.
        </p>
      </div>

      {!result ? (
        <>
          {/* Input Section */}
          <div
            className="tailor-input-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
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
                  fontWeight: 700,
                  color: '#1B1B18',
                  marginBottom: '8px',
                }}
              >
                Your Current Resume
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your full resume text here..."
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
                  fontWeight: 700,
                  color: '#1B1B18',
                  marginBottom: '8px',
                }}
              >
                Target Job Description
              </label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the complete job description you're applying for..."
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
              onClick={handleTailor}
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
              {loading ? 'Tailoring your resume...' : 'Tailor My Resume'}
            </button>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(27,27,24,0.5)',
                textAlign: 'center',
                margin: '12px 0 0 0',
              }}
            >
              AI rewrites your bullet points to match the JD. Takes about 45 seconds.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Results Section */}

          {/* Match Score */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: getScoreColor(result.match_percentage),
                marginBottom: '8px',
              }}
            >
              {result.match_percentage}% Match
            </div>
            <div style={{ fontSize: '16px', color: '#1B1B18' }}>
              Your resume matches {result.match_percentage}% of the job requirements
            </div>
          </div>

          {/* Keyword Analysis */}
          <div
            className="keyword-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            {/* Keywords Found */}
            <div
              style={{
                padding: '20px',
                background: 'white',
                border: '1px solid #E8E6E1',
                borderRadius: '12px',
              }}
            >
              <h3
                style={{
                  color: '#16A34A',
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                ✓ Keywords Found
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.keywords_found.map((keyword, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      background: 'rgba(22,163,74,0.1)',
                      color: '#16A34A',
                      borderRadius: '20px',
                      fontSize: '12px',
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Keywords Missing */}
            <div
              style={{
                padding: '20px',
                background: 'white',
                border: '1px solid #E8E6E1',
                borderRadius: '12px',
              }}
            >
              <h3
                style={{
                  color: '#CF222E',
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                ✗ Keywords Missing
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.keywords_missing.map((keyword, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      background: 'rgba(207,34,46,0.1)',
                      color: '#CF222E',
                      borderRadius: '20px',
                      fontSize: '12px',
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bullet Rewrites */}
          {result.bullet_rewrites && result.bullet_rewrites.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1B1B18',
                  marginBottom: '16px',
                }}
              >
                Suggested Rewrites
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {result.bullet_rewrites.map((rewrite, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      background: 'white',
                      border: '1px solid #E8E6E1',
                      borderRadius: '12px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(27,27,24,0.5)',
                          fontWeight: 600,
                          marginBottom: '4px',
                        }}
                      >
                        Original:
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(27,27,24,0.6)',
                          lineHeight: 1.5,
                        }}
                      >
                        {rewrite.original}
                      </div>
                    </div>

                    <div
                      style={{
                        height: '1px',
                        background: '#E8E6E1',
                        marginBottom: '12px',
                      }}
                    />

                    <div style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#1B1B18',
                          fontWeight: 600,
                          marginBottom: '4px',
                        }}
                      >
                        Tailored:
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#1B1B18',
                          lineHeight: 1.5,
                        }}
                      >
                        <HighlightedText
                          text={rewrite.tailored}
                          keywords={result.keywords_found}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(rewrite.tailored, idx)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 10px',
                        border: '1px solid #E8E6E1',
                        borderRadius: '6px',
                        background: 'white',
                        color: '#1B1B18',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedIdx === idx ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills to Add */}
          {result.skills_to_add && result.skills_to_add.length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1B1B18',
                  marginBottom: '16px',
                }}
              >
                Skills to Add
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(27,27,24,0.6)',
                  marginBottom: '12px',
                }}
              >
                Based on the JD, consider adding these skills to your resume:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.skills_to_add.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      background: 'rgba(198,127,0,0.1)',
                      color: '#C67F00',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary Rewrite */}
          {result.summary_rewrite && (
            <div style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1B1B18',
                  marginBottom: '16px',
                }}
              >
                Suggested Professional Summary
              </h2>
              <div
                style={{
                  padding: '16px',
                  background: 'white',
                  border: '1px solid #E8E6E1',
                  borderRadius: '12px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#1B1B18',
                    lineHeight: 1.6,
                    paddingRight: '80px',
                  }}
                >
                  <HighlightedText
                    text={result.summary_rewrite}
                    keywords={result.keywords_found}
                  />
                </div>
                <button
                  onClick={handleSummaryCopy}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    border: '1px solid #E8E6E1',
                    borderRadius: '6px',
                    background: 'white',
                    color: '#1B1B18',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {summaryCopied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Overall Advice */}
          {result.overall_advice && (
            <div style={{ marginBottom: '48px' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1B1B18',
                  marginBottom: '16px',
                }}
              >
                Strategic Advice
              </h2>
              <div
                style={{
                  padding: '16px',
                  background: '#F5F3EF',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#1B1B18',
                  lineHeight: 1.6,
                }}
              >
                {result.overall_advice}
              </div>
            </div>
          )}

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
              Tailor for another role
            </button>
          </div>
        </>
      )}
    </div>
  );
}
