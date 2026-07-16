import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { pmQuestions } from '../data/pmQuestions';
import { projectManagementQuestions } from '../data/projectManagementQuestions';
import { consultingQuestions } from '../data/consultingQuestions';
import { technicalWritingQuestions } from '../data/technicalWritingQuestions';
import useTextToSpeech from '../hooks/useTextToSpeech';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

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

// ── JD PARSING ──────────────────────────────────────────────
const parseJD = (jdText, resumeText) => {
  const text = (jdText + ' ' + resumeText).toLowerCase();

  const levelMap = {
    'associate pm': ['Associate PM'],
    'apm': ['Associate PM'],
    'product manager': ['PM', 'Senior PM'],
    'senior pm': ['Senior PM'],
    'senior product manager': ['Senior PM'],
    'lead pm': ['Lead PM'],
    'lead product manager': ['Lead PM'],
    'staff pm': ['Staff/Principal PM'],
    'principal pm': ['Staff/Principal PM'],
    'director of product': ['Director of PM'],
    'vp of product': ['VP of Product'],
    'cpo': ['Chief Product Officer (CPO)'],
    'data scientist': ['Data Scientist'],
    'junior project manager': ['Junior Project Manager'],
    'project manager': ['Project Manager', 'Senior Project Manager'],
    'senior project manager': ['Senior Project Manager'],
    'program manager': ['Program Manager'],
    'technical writer': ['Technical Writer', 'Senior Technical Writer'],
    'senior technical writer': ['Senior Technical Writer'],
    'consultant': ['Consultant'],
  };

  const domainMap = {
    'fintech': 'fintech',
    'financial technology': 'fintech',
    'payments': 'fintech',
    'banking': 'banking',
    'bank': 'banking',
    'jpmorgan': 'banking',
    'chase': 'banking',
    'regulatory': 'banking',
    'aml': 'banking',
    'treasury': 'banking',
    'reconciliation': 'banking',
    'data platform': 'banking',
    'data pipeline': 'banking',
    'downstream': 'banking',
    'compliance': 'banking',
    'risk': 'banking',
    'accounting': 'banking',
    'icb': 'banking',
    'insurance': 'insurance',
    'insurtech': 'insurance',
    'telecom': 'telecom',
    'telecommunications': 'telecom',
    'healthcare': 'healthcare',
    'health tech': 'healthcare',
    'edtech': 'edtech',
    'education technology': 'edtech',
    'e-commerce': 'ecommerce',
    'ecommerce': 'ecommerce',
    'saas': 'saas',
    'b2b': 'saas',
    'payroll': 'payroll',
    'hrtech': 'payroll',
    'cybersecurity': 'cybersecurity',
    'ai': 'aiml',
    'machine learning': 'aiml',
    'logistics': 'logistics',
    'oil': 'oilgas',
    'energy': 'oilgas',
  };

  const trackMap = {
    'b2b': 'B2B / Enterprise PM',
    'enterprise': 'B2B / Enterprise PM',
    'growth': 'Growth PM',
    'technical': 'Technical PM',
    'ai pm': 'AI PM',
    'data': 'Data / AI PM',
    'forward deployed': 'Forward Deployed PM',
    'fintech pm': 'Fintech PM',
  };

  // Detect levels
  const detectedLevels = [];
  Object.entries(levelMap).forEach(([keyword, levels]) => {
    if (text.includes(keyword)) levels.forEach(l => { if (!detectedLevels.includes(l)) detectedLevels.push(l); });
  });

  // Detect domains
  const detectedDomains = [];
  Object.entries(domainMap).forEach(([keyword, domain]) => {
    if (text.includes(keyword) && !detectedDomains.includes(domain)) detectedDomains.push(domain);
  });

  // Detect tracks
  const detectedTracks = [];
  Object.entries(trackMap).forEach(([keyword, track]) => {
    if (text.includes(keyword) && !detectedTracks.includes(track)) detectedTracks.push(track);
  });

  // Detect role type
  let roleType = 'pm';
  if (text.includes('data scientist') || text.includes('data science')) roleType = 'ds';
  else if (text.includes('project manager') || text.includes('programme manager')) roleType = 'pm_project';
  else if (text.includes('technical writer') || text.includes('content designer')) roleType = 'tw';
  else if (text.includes('consultant') || text.includes('consulting')) roleType = 'consulting';

  return { detectedLevels, detectedDomains, detectedTracks, roleType };
};

// ── FLATTEN ALL QUESTIONS ────────────────────────────────────
const flattenQuestions = () => {
  const all = [];

  // PM questions
  Object.entries(pmQuestions).forEach(([level, categories]) => {
    Object.entries(categories).forEach(([category, questions]) => {
      if (Array.isArray(questions)) {
        questions.forEach(q => all.push({ ...q, _level: level, _category: category, _source: 'pm' }));
      }
    });
  });

  // Project Management questions
  Object.entries(projectManagementQuestions).forEach(([level, categories]) => {
    Object.entries(categories).forEach(([category, questions]) => {
      if (Array.isArray(questions)) {
        questions.forEach(q => all.push({ ...q, _level: level, _category: category, _source: 'pm_project' }));
      }
    });
  });

  // Consulting questions
  Object.entries(consultingQuestions).forEach(([role, categories]) => {
    if (typeof categories === 'object' && !Array.isArray(categories)) {
      Object.entries(categories).forEach(([category, questions]) => {
        if (Array.isArray(questions)) {
          questions.forEach(q => all.push({ ...q, _level: role, _category: category, _source: 'consulting' }));
        }
      });
    }
  });

  // Technical Writing questions
  Object.entries(technicalWritingQuestions).forEach(([level, categories]) => {
    if (typeof categories === 'object' && !Array.isArray(categories)) {
      Object.entries(categories).forEach(([category, questions]) => {
        if (Array.isArray(questions)) {
          questions.forEach(q => all.push({ ...q, _level: level, _category: category, _source: 'tw' }));
        }
      });
    }
  });

  return all;
};

// ── SCORING ──────────────────────────────────────────────────
const scoreQuestion = (q, parsed) => {
  let score = 0;

  // Domain match (0-40)
  if (q.domain && parsed.detectedDomains.includes(q.domain)) score += 40;
  else if (q.domain === 'general') score += 10;

  // Track match (0-30)
  if (q.tracks && Array.isArray(q.tracks)) {
    const trackMatch = q.tracks.some(t => parsed.detectedTracks.includes(t));
    if (trackMatch) score += 30;
  }

  // Level match (0-20)
  if (parsed.detectedLevels.includes(q._level)) score += 20;

  // Source/role type match (0-10)
  if (q._source === parsed.roleType) score += 10;
  else if (parsed.roleType === 'pm' && q._source === 'pm') score += 10;

  // Difficulty bonus for Hard questions
  if (q.difficulty === 'Hard') score += 2;

  return score;
};

// ── MATCH QUESTIONS ──────────────────────────────────────────
const matchQuestions = (jdText, resumeText) => {
  const parsed = parseJD(jdText, resumeText);
  const allQuestions = flattenQuestions();

  const scored = allQuestions
    .map(q => ({ ...q, _score: scoreQuestion(q, parsed) }))
    .filter(q => q._score > 0)
    .sort((a, b) => b._score - a._score);

  // Deduplicate by question text
  const seen = new Set();
  const deduped = scored.filter(q => {
    const key = q.q?.slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    questions: deduped.slice(0, 100),
    parsed,
    totalMatched: deduped.length,
  };
};

// ── COMPONENT ────────────────────────────────────────────────
export default function JDPractice({ user }) {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('input');
  const [results, setResults] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const resumeFileInputRef = useRef(null);
  const tts = useTextToSpeech();

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

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setStep('processing');
    setError('');

    try {
      // Step 1 — Match from local bank first
      const bankResult = matchQuestions(jdText, resumeText);
      const bankQuestions = bankResult.questions;
      const parsed = bankResult.parsed;

      // Step 2 — Search internet for additional questions
      const roleDescription = parsed.detectedLevels[0] || 'Product Manager';
      const domainDescription = parsed.detectedDomains[0] || 'technology';
      const searchPrompt = `Search for the most recent and commonly asked interview questions for a ${roleDescription} role in the ${domainDescription} industry in India in 2025.

Search these sources: Glassdoor interview reviews, Reddit r/ProductManagement, Blind app interview experiences, AmbitionBox interview questions, IIMjobs interview experiences.

Return exactly 50 interview questions that are:
1. Specific to ${roleDescription} roles
2. Relevant to ${domainDescription} domain
3. Recently asked in 2024-2025
4. Different from generic questions like "tell me about yourself"

Format your response as a JSON array with this exact structure:
[
  {
    "q": "question text here",
    "source": "Glassdoor/Reddit/Blind/etc",
    "domain": "${domainDescription}",
    "difficulty": "Medium or Hard"
  }
]

Return ONLY the JSON array, no other text.`;

      const searchResponse = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{ role: 'user', content: searchPrompt }],
        }),
      });

      const searchData = await searchResponse.json();
      console.log('Web search response:', JSON.stringify(searchData).slice(0, 500));

      // Extract text content from response - handle multi-block web search response
      let internetQuestions = [];
      if (searchData.content && Array.isArray(searchData.content)) {
        // Get all text blocks and concatenate
        const allText = searchData.content
          .filter(b => b.type === 'text')
          .map(b => b.text)
          .join('');

        if (allText) {
          try {
            // Try to find JSON array in the text
            const jsonMatch = allText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              internetQuestions = JSON.parse(jsonMatch[0]);
              console.log('Parsed internet questions:', internetQuestions.length);
            }
          } catch (e) {
            console.log('Could not parse internet questions:', e);
          }
        }
      }

      // Step 3 — Store internet questions without answers (generate on demand)
      let internetWithAnswers = internetQuestions.slice(0, 20).map(q => ({
        ...q,
        a: null, // answer will be generated on demand
        _source: 'internet',
        _needsAnswer: true,
      }));

      // Step 4 — Combine bank + internet questions
      // Deduplicate: remove internet questions similar to bank questions
      const bankQTexts = new Set(bankQuestions.map(q => q.q?.slice(0, 60).toLowerCase()));
      const uniqueInternet = internetWithAnswers.filter(q =>
        !bankQTexts.has(q.q?.slice(0, 60).toLowerCase())
      );

      // Take top 60 from bank + up to 40 from internet = 100 total
      const combined = [
        ...bankQuestions.slice(0, 60),
        ...uniqueInternet.slice(0, 40),
      ];

      setResults({
        questions: combined.slice(0, 100),
        parsed,
        totalMatched: combined.length,
        internetCount: uniqueInternet.length,
        bankCount: Math.min(bankQuestions.length, 60),
      });
      setStep('results');

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setStep('input');
      console.error(err);
    }
  };

  const currentQ = results?.questions[currentIndex];
  const F = "'Plus Jakarta Sans', sans-serif";
  const S = "'Instrument Serif', serif";

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', padding: '40px 20px' }}>
      <div style={{ maxWidth: step === 'practice' ? 780 : 720, margin: '0 auto' }}>

        {/* Header */}
        {step === 'input' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: S, color: '#1a1a1a', marginBottom: 8 }}>
                Practice for Your Interview
              </h1>
              <p style={{ fontSize: 15, color: '#6b7280', fontFamily: F }}>
                Upload your resume and paste the job description. We'll build you a personalised set of 100 practice questions.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Resume Upload */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', fontFamily: F, marginBottom: 16 }}>
                  Step 1 — Your Resume
                </div>
                <input ref={resumeFileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleResumeFileSelect} style={{ display: 'none' }} />
                {!resumeText ? (
                  <>
                    <button
                      onClick={() => resumeFileInputRef.current?.click()}
                      disabled={fileUploading}
                      style={{ width: '100%', padding: '20px', border: '2px dashed #d1d5db', borderRadius: 12, background: 'transparent', cursor: fileUploading ? 'not-allowed' : 'pointer', fontSize: 14, color: '#6b7280', fontFamily: F, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                    >
                      <span style={{ fontSize: 28 }}>📄</span>
                      <span>{fileUploading ? 'Reading your resume...' : 'Upload Resume (PDF or DOCX)'}</span>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>or paste below</span>
                    </button>
                    <textarea
                      placeholder="Or paste your resume text here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      style={{ width: '100%', marginTop: 12, padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, fontFamily: F, color: '#374151', minHeight: 100, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10 }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <span style={{ fontSize: 14, color: '#15803d', fontFamily: F, fontWeight: 600 }}>Resume uploaded successfully</span>
                    <button onClick={() => setResumeText('')} style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>Change</button>
                  </div>
                )}
              </div>

              {/* JD Input */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#9ca3af', fontFamily: F, marginBottom: 16 }}>
                  Step 2 — Job Description
                </div>
                <textarea
                  placeholder="Paste the full job description here — including role, responsibilities, requirements, and company details..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 13, fontFamily: F, color: '#374151', minHeight: 180, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                />
                {jdText.length > 0 && jdText.length < 100 && (
                  <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontFamily: F }}>Please paste the full job description for better results.</p>
                )}
              </div>

              {error && (
                <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#dc2626', fontFamily: F }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                style={{ width: '100%', padding: '16px', background: canGenerate ? 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)' : '#e5e7eb', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: F, color: canGenerate ? '#fff' : '#9ca3af', cursor: canGenerate ? 'pointer' : 'not-allowed' }}
              >
                Build My Interview Kit →
              </button>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>⚡</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: S, color: '#1a1a1a', marginBottom: 8 }}>
              Building your question set...
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', fontFamily: F }}>
              This takes 30-60 seconds.
            </p>
          </div>
        )}

        {step === 'results' && results && (
          <div>
            {/* Results header */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: S, color: '#1a1a1a', marginBottom: 4 }}>
                    Your personalised question set
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b7280', fontFamily: F }}>
                    {results.internetCount > 0
                      ? `${results.bankCount} from our expert bank · ${results.internetCount} sourced from Glassdoor, Reddit & Blind`
                      : 'Questions matched from our expert bank — tailored to your JD'}
                    {results.parsed.detectedDomains.length > 0 && ` · ${results.parsed.detectedDomains.join(', ')}`}
                    {results.parsed.detectedLevels.length > 0 && ` · ${results.parsed.detectedLevels[0]}`}
                  </p>
                </div>
                <button
                  onClick={() => { setStep('practice'); setCurrentIndex(0); setAnswer(''); }}
                  style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: F, color: '#fff', cursor: 'pointer' }}
                >
                  Start Practising →
                </button>
              </div>
            </div>

            {/* Question list preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.questions.slice(0, 20).map((q, i) => (
                <div
                  key={i}
                  onClick={() => { setStep('practice'); setCurrentIndex(i); setAnswer(''); }}
                  style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start' }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#1a1a1a', fontFamily: F, margin: 0, lineHeight: 1.5 }}>{q.q?.slice(0, 120)}...</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                      {q.domain && <span style={{ fontSize: 10, padding: '2px 8px', background: '#f3f4f6', borderRadius: 6, color: '#6b7280', fontFamily: F }}>{q.domain}</span>}
                      {q.difficulty && <span style={{ fontSize: 10, padding: '2px 8px', background: '#f3f4f6', borderRadius: 6, color: '#6b7280', fontFamily: F }}>{q.difficulty}</span>}
                      {q._level && <span style={{ fontSize: 10, padding: '2px 8px', background: '#f3f4f6', borderRadius: 6, color: '#6b7280', fontFamily: F }}>{q._level}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {results.questions.length > 20 && (
                <div style={{ textAlign: 'center', padding: '16px', fontSize: 13, color: '#6b7280', fontFamily: F }}>
                  + {results.questions.length - 20} more questions available when you start practising
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'practice' && results && currentQ && (
          <div>
            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <button onClick={() => setStep('results')} style={{ fontSize: 13, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F }}>← Back to list</button>
              <div style={{ flex: 1, height: 4, background: '#e5e7eb', borderRadius: 2 }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #a78bfa, #c084fc)', borderRadius: 2, width: `${((currentIndex + 1) / results.questions.length) * 100}%` }} />
              </div>
              <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: F }}>{currentIndex + 1}/{results.questions.length}</span>
            </div>

            {/* Question */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {currentQ.domain && <span style={{ fontSize: 11, padding: '3px 10px', background: '#f3f4f6', borderRadius: 6, color: '#6b7280', fontFamily: F }}>{currentQ.domain}</span>}
                {currentQ.difficulty && <span style={{ fontSize: 11, padding: '3px 10px', background: '#f3f4f6', borderRadius: 6, color: '#6b7280', fontFamily: F }}>{currentQ.difficulty}</span>}
              </div>
              <p style={{ fontSize: 16, color: '#1a1a1a', fontFamily: F, lineHeight: 1.7, margin: 0 }}>{currentQ.q}</p>
              <button
                onClick={() => tts.isSpeaking ? tts.stop() : tts.speak(currentQ.q)}
                style={{
                  marginTop: 12,
                  padding: '6px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#6b7280',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {tts.isSpeaking ? '⏹ Stop' : '🔊 Listen to question'}
              </button>
            </div>

            {/* Answer box */}
            <textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ width: '100%', padding: '16px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, fontFamily: F, color: '#374151', minHeight: 160, resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
            />

            {/* Expert answer */}
            {currentQ && (
              <div style={{ marginBottom: 20 }}>
                {currentQ._needsAnswer && !currentQ.a ? (
                  <button
                    onClick={async () => {
                      // Generate answer on demand
                      const prompt = `Generate a professional model answer for this interview question for a ${results.parsed.detectedLevels[0] || 'Senior PM'} role in ${results.parsed.detectedDomains[0] || 'technology'}.

Follow this EXACT format:
- Start with 2 clarifying questions the candidate would ask
- State assumptions explicitly
- Give a structured numbered approach (3-5 steps)
- Include specific metrics and examples
- Acknowledge trade-offs
- End with TWO real examples in first person past tense starting with "In a past project where I tackled similar challenges..."

Write in first person as the candidate. Answer must be 300-400 words.

Question: ${currentQ.q}

Return only the answer text, no JSON.`;

                      const updatedQuestions = [...results.questions];
                      updatedQuestions[currentIndex] = { ...currentQ, a: 'Generating expert answer...' };
                      setResults({ ...results, questions: updatedQuestions });

                      try {
                        const res = await fetch('/api/messages', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            model: 'claude-sonnet-4-6',
                            max_tokens: 1500,
                            messages: [{ role: 'user', content: prompt }],
                          }),
                        });
                        const data = await res.json();
                        const answerText = data.content?.find(b => b.type === 'text')?.text || 'Could not generate answer.';
                        updatedQuestions[currentIndex] = { ...currentQ, a: answerText, _needsAnswer: false };
                        setResults({ ...results, questions: updatedQuestions });
                      } catch (e) {
                        updatedQuestions[currentIndex] = { ...currentQ, a: 'Could not generate answer. Please try again.', _needsAnswer: false };
                        setResults({ ...results, questions: updatedQuestions });
                      }
                    }}
                    style={{ width: '100%', padding: '12px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', fontSize: 14, color: '#6b7280', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    ✨ Generate Expert Answer for This Question
                  </button>
                ) : currentQ.a && currentQ.a !== 'Generating expert answer...' ? (
                  <details style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px' }}>
                    <summary style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer' }}>
                      View expert answer
                    </summary>
                    <div style={{ marginTop: 12, fontSize: 13, color: '#4b5563', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {currentQ.a}
                    </div>
                    <button
                      onClick={() => tts.isSpeaking ? tts.stop() : tts.speak(currentQ.a)}
                      style={{ marginTop: 8, padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: 12, color: '#6b7280', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      {tts.isSpeaking ? '⏹ Stop' : '🔊 Listen to answer'}
                    </button>
                  </details>
                ) : currentQ.a === 'Generating expert answer...' ? (
                  <div style={{ padding: '16px 20px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, color: '#6b7280', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    ✨ Generating expert answer...
                  </div>
                ) : null}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setAnswer(''); }}
                disabled={currentIndex === 0}
                style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontFamily: F, color: '#374151', background: '#fff', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <button
                onClick={() => { setCurrentIndex(Math.min(results.questions.length - 1, currentIndex + 1)); setAnswer(''); }}
                disabled={currentIndex === results.questions.length - 1}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: F, color: '#fff', cursor: currentIndex === results.questions.length - 1 ? 'not-allowed' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
