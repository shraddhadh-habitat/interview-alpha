import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { pmQuestions } from '../data/pmQuestions';
import { projectManagementQuestions } from '../data/projectManagementQuestions';
import { consultingQuestions } from '../data/consultingQuestions';
import { technicalWritingQuestions } from '../data/technicalWritingQuestions';
import useTextToSpeech from '../hooks/useTextToSpeech';
import { useAuth } from '../contexts/AuthContext';
import FormattedAnswer from '../components/FormattedAnswer';

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

// ── PROCESSING SCREEN ──────────────────────────────────────────
function ProcessingScreen() {
  const stars = [0, 1, 2, 3, 4];
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 60px',
      background: '#FAFAF8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <style>{`
        @keyframes starBounce {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-16px) scale(1.3); opacity: 1; }
        }
        .star-bounce-0 { animation: starBounce 1.4s ease-in-out 0s infinite; }
        .star-bounce-1 { animation: starBounce 1.4s ease-in-out 0.2s infinite; }
        .star-bounce-2 { animation: starBounce 1.4s ease-in-out 0.4s infinite; }
        .star-bounce-3 { animation: starBounce 1.4s ease-in-out 0.6s infinite; }
        .star-bounce-4 { animation: starBounce 1.4s ease-in-out 0.8s infinite; }
      `}</style>
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, alignItems: 'center' }}>
        {[0,1,2,3,4].map(i => (
          <span
            key={i}
            className={`star-bounce-${i}`}
            style={{
              fontSize: 38,
              display: 'inline-block',
              filter: 'drop-shadow(0 0 10px #fbbf24)',
            }}
          >⭐</span>
        ))}
      </div>
      <h2 style={{
        fontSize: 20,
        fontWeight: 700,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#1a1a1a',
        marginBottom: 8,
        letterSpacing: 4,
        textTransform: 'uppercase',
      }}>
        Generating Results
      </h2>
      <p style={{
        fontSize: 13,
        color: '#6b7280',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        Processing... Please wait
      </p>
    </div>
  );
}

// ── COMPONENT ────────────────────────────────────────────────
export default function JDPractice({ user, profile }) {
  const isPro = user && profile?.subscription_status === 'active';
  const { requireAuth } = useAuth();
  const [resumeText, setResumeText] = useState('');

  // Restore JD Practice state after auth
  useEffect(() => {
    if (!user) return;
    console.log('[JDPractice] user changed, checking sessionStorage:', {
      user: !!user,
      savedResults: !!sessionStorage.getItem('jdp_results'),
      savedStep: sessionStorage.getItem('jdp_step'),
    });
    const savedResults = sessionStorage.getItem('jdp_results');
    const savedStep = sessionStorage.getItem('jdp_step');
    const savedIndex = sessionStorage.getItem('jdp_index');
    const savedResume = sessionStorage.getItem('jdp_resumeText');
    const savedJD = sessionStorage.getItem('jdp_jdText');
    if (savedResults && savedStep) {
      try {
        const parsed = JSON.parse(savedResults);
        setResults(parsed);
        setStep(savedStep);
        setCurrentIndex(parseInt(savedIndex) || 0);
        if (savedResume) setResumeText(savedResume);
        if (savedJD) setJdText(savedJD);
        // Clear after restoring
        sessionStorage.removeItem('jdp_results');
        sessionStorage.removeItem('jdp_step');
        sessionStorage.removeItem('jdp_index');
        sessionStorage.removeItem('jdp_resumeText');
        sessionStorage.removeItem('jdp_jdText');
      } catch (e) {
        console.log('Could not restore JD Practice state:', e);
      }
    }
  }, [user, step]);
  const [jdText, setJdText] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('input');
  const [results, setResults] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showExpert, setShowExpert] = useState(false);
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
      // Step 1 — Match from local bank
      const bankResult = matchQuestions(jdText, resumeText);
      const parsed = bankResult.parsed;
      const bankQuestions = bankResult.questions.slice(0, 60);

      // Step 2 — Web search for internet questions
      const role = parsed.detectedLevels[0] || 'Product Manager';
      const domain = parsed.detectedDomains[0] || 'technology';

      let internetQuestions = [];
      try {
        const searchResponse = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 4000,
            tools: [{ type: 'web_search_20250305', name: 'web_search' }],
            messages: [{ role: 'user', content: `Search Glassdoor, Reddit, Blind, AmbitionBox for recent ${role} interview questions in ${domain} industry India 2025. Return a JSON array of 30 questions: [{"q": "question text", "domain": "${domain}", "difficulty": "Hard"}]. Return ONLY the JSON array.` }],
          }),
        });
        const searchData = await searchResponse.json();
        console.log('Search response blocks:', searchData.content?.map(b => b.type));
        if (searchData.content && Array.isArray(searchData.content)) {
          const allText = searchData.content.filter(b => b.type === 'text').map(b => b.text).join('');
          const match = allText.match(/\[[\s\S]*\]/);
          if (match) {
            internetQuestions = JSON.parse(match[0]).map(q => ({
              ...q,
              a: null,
              _source: 'internet',
              _needsAnswer: true,
              _level: role,
              _category: 'behavioral',
            }));
            console.log('Internet questions parsed:', internetQuestions.length);
          }
        }
      } catch (e) {
        console.log('Web search failed, using bank only:', e.message);
      }

      // Step 3 — Deduplicate and combine
      const bankTexts = new Set(bankQuestions.map(q => q.q?.slice(0, 60).toLowerCase()));
      const uniqueInternet = internetQuestions.filter(q => !bankTexts.has(q.q?.slice(0, 60).toLowerCase()));

      // Put internet questions FIRST so users see them
      const combined = [
        ...uniqueInternet.slice(0, 40),
        ...bankQuestions,
      ].slice(0, 100);

      console.log('Question sources:', combined.map(q => q._source).join(', '));

      console.log('Final combined:', combined.length, 'internet:', uniqueInternet.length, 'bank:', bankQuestions.length);

      setResults({
        questions: combined,
        parsed,
        totalMatched: combined.length,
        internetCount: uniqueInternet.length,
        bankCount: bankQuestions.length,
      });
      setStep('results');

    } catch (err) {
      console.log('handleGenerate error:', err.message);
      setError('Something went wrong. Please try again.');
      setStep('input');
    }
  };

  // Inject star animation CSS globally
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'star-bounce-styles';
    style.textContent = `
      @keyframes starBounce {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-16px) scale(1.3); opacity: 1; }
      }
      .star-bounce-0 { animation: starBounce 1.4s ease-in-out 0s infinite; }
      .star-bounce-1 { animation: starBounce 1.4s ease-in-out 0.2s infinite; }
      .star-bounce-2 { animation: starBounce 1.4s ease-in-out 0.4s infinite; }
      .star-bounce-3 { animation: starBounce 1.4s ease-in-out 0.6s infinite; }
      .star-bounce-4 { animation: starBounce 1.4s ease-in-out 0.8s infinite; }
    `;
    if (!document.getElementById('star-bounce-styles')) {
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById('star-bounce-styles');
      if (existing) existing.remove();
    };
  }, []);

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
                Upload your resume and paste the job description. We'll build you a personalised set of practice questions.
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
                  placeholder="Paste the full job description here; including role, responsibilities, requirements, and company details..."
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
                Build My Exclusive Interview Prep Kit
              </button>
            </div>
          </>
        )}

        {step === 'processing' && (
          <ProcessingScreen />
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
                    Your personalised question set based on your resume and job description
                  </p>
                </div>
                <button
                  onClick={() => { setStep('practice'); setCurrentIndex(0); setAnswer(''); setShowExpert(false); }}
                  style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: F, color: '#fff', cursor: 'pointer' }}
                >
                  Start Practising →
                </button>
              </div>
            </div>

            {/* Question list preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.questions.slice(0, isPro ? 20 : 5).map((q, i) => (
                <div
                  key={i}
                  onClick={() => { setStep('practice'); setCurrentIndex(i); setAnswer(''); setShowExpert(false); }}
                  style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start' }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#1a1a1a', fontFamily: F, margin: 0, lineHeight: 1.5 }}>{q.q?.slice(0, 120)}...</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                      {q.domain && <span style={{ fontSize: 10, padding: '2px 8px', background: '#f3f4f6', borderRadius: 6, color: '#6b7280', fontFamily: F }}>{q.domain}</span>}
                      {q.difficulty && <span style={{ fontSize: 10, padding: '2px 8px', background: '#f3f4f6', borderRadius: 6, color: '#6b7280', fontFamily: F }}>{q.difficulty}</span>}
                      {q._level && <span style={{ fontSize: 10, padding: '2px 8px', background: '#f3f4f6', borderRadius: 6, color: '#6b7280', fontFamily: F }}>{q._level}</span>}
                      {window.location.search.includes('debug=true') && (
                        <span style={{ fontSize: 10, padding: '2px 8px',
                          background: q._source === 'internet' ? '#fef3c7' : '#f0fdf4',
                          borderRadius: 6,
                          color: q._source === 'internet' ? '#92400e' : '#166534',
                          fontFamily: F
                        }}>
                          {q._source === 'internet' ? '🌐 Web' : '✓ Bank'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!isPro && (
                <div style={{ marginTop: 8 }}>
                  {[...Array(15)].map((_, i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 18px', marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}>
                        <p style={{ fontSize: 13, color: '#1a1a1a', fontFamily: F, margin: 0 }}>
                          {i % 3 === 0 ? 'How would you approach building a product roadmap for a complex enterprise client with competing stakeholder priorities...' : i % 3 === 1 ? 'Walk me through a time when you had to make a difficult product decision with incomplete data and tight deadlines...' : 'You are a Senior PM at a fintech company. The CEO asks you to evaluate a new market opportunity in embedded finance...'}
                        </p>
                      </div>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', fontFamily: F }}>🔒 Unlock with Pro</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', marginTop: 16, padding: '20px', background: 'linear-gradient(135deg, #f5f3ff, #fdf4ff)', borderRadius: 16, border: '1px solid #e9d5ff' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#7c3aed', fontFamily: F, marginBottom: 8 }}>Unlock all questions + expert answers</p>
                    <p style={{ fontSize: 13, color: '#6b7280', fontFamily: F, marginBottom: 16 }}>Get full access to questions sourced from Glassdoor, Reddit and Blind — with complete expert answers</p>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'upgrade' }))}
                      style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #a78bfa, #c084fc)', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: F, cursor: 'pointer' }}
                    >
                      Upgrade to Pro →
                    </button>
                  </div>
                </div>
              )}
              {isPro && results.questions.length > 20 && (
                <div style={{ textAlign: 'center', padding: '16px', fontSize: 13, color: '#6b7280', fontFamily: F }}>
                  Many more questions available when you start practising
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
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#1a1a1a', fontFamily: F, marginBottom: 10 }}>Question</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#1a1a1a', fontFamily: F, margin: 0, fontWeight: 500 }}>{currentQ.q}</p>
              <button
                onClick={() => tts.isSpeaking ? tts.stop() : tts.speak(currentQ.q)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  background: 'linear-gradient(135deg, #a78bfa, #f59e0b)',
                  border: 'none',
                  borderRadius: 50,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  marginTop: 10,
                }}
              >
                {tts.isSpeaking ? '⏹ Stop' : '▶ Listen'}
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
                  !user ? (
                    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', fontFamily: F, marginBottom: 4 }}>
                        Sign up to see the expert answer
                      </p>
                      <p style={{ fontSize: 12, color: '#6b7280', fontFamily: F, marginBottom: 16 }}>
                        Free account. No credit card required.
                      </p>
                      <button
                        onClick={() => {
                          // Save current state to sessionStorage before auth
                          if (results) {
                            sessionStorage.setItem('jdp_results', JSON.stringify(results));
                            sessionStorage.setItem('jdp_step', 'practice');
                            sessionStorage.setItem('jdp_index', String(currentIndex));
                            sessionStorage.setItem('jdp_resumeText', resumeText);
                            sessionStorage.setItem('jdp_jdText', jdText);
                            sessionStorage.setItem('jdp_post_auth_page', 'resume-tools');
                          }
                          requireAuth('Sign up to see expert answers');
                        }}
                        style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #a78bfa, #c084fc)', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: F, cursor: 'pointer' }}
                      >
                        Sign Up Free →
                      </button>
                    </div>
                  ) : isPro || currentIndex === 0 ? (
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
                              max_tokens: 800,
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
                      style={{ width: '100%', padding: '12px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', fontSize: 14, color: '#6b7280', fontFamily: F }}
                    >
                      ✨ Generate Expert Answer for This Question
                    </button>
                  ) : (
                    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
                      <p style={{ fontSize: 13, color: '#6b7280', fontFamily: F, marginBottom: 4 }}>
                        Expert answer available with Pro
                      </p>
                      <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: F, marginBottom: 16 }}>
                        Upgrade to unlock expert answers for all questions
                      </p>
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'upgrade' }))}
                        style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #a78bfa, #c084fc)', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: F, cursor: 'pointer' }}
                      >
                        Upgrade to Pro →
                      </button>
                    </div>
                  )
                ) : currentQ.a && currentQ.a !== 'Generating expert answer...' ? (
                  <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 16 }}>
                    <button
                      onClick={() => setShowExpert(v => !v)}
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        color: '#9ca3af',
                        fontFamily: F,
                      }}
                    >
                      <span>View Expert Answer</span>
                      <span style={{ fontSize: 14, transform: showExpert ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.2s' }}>▾</span>
                    </button>
                    {showExpert && (
                      <div style={{ paddingBottom: 20, background: '#FAFAF8', borderTop: '1px solid #e5e7eb', padding: '16px 0 20px' }}>
                        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#1a1a1a', fontFamily: F, marginBottom: 10 }}>Expert Answer</div>
                        <button
                          onClick={() => {
                            if (tts.isSpeaking) { tts.stop(); return; }
                            if (!currentQ.a || currentQ.a === 'Generating expert answer...') return;
                            tts.speak('Expert Answer. ' + currentQ.a);
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'linear-gradient(135deg, #a78bfa, #f59e0b)', border: 'none', borderRadius: 50, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: F, marginBottom: 12 }}
                        >
                          {tts.isSpeaking ? '⏹ Stop' : '▶ Listen'}
                        </button>
                        <FormattedAnswer text={currentQ.a} />
                      </div>
                    )}
                  </div>
                ) : currentQ.a === 'Generating expert answer...' ? (
                  <div style={{ padding: '24px 20px', background: '#FAFAF8', border: '1px solid #e5e7eb', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {[0,1,2,3,4].map(i => (
                        <span
                          key={i}
                          className={`star-bounce-${i}`}
                          style={{ fontSize: 20, display: 'inline-block', filter: 'drop-shadow(0 0 6px #fbbf24)' }}
                        >⭐</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>
                      Generating expert answer...
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setAnswer(''); setShowExpert(false); }}
                disabled={currentIndex === 0}
                style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontFamily: F, color: '#374151', background: '#fff', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>
              <button
                onClick={() => { setCurrentIndex(Math.min(results.questions.length - 1, currentIndex + 1)); setAnswer(''); setShowExpert(false); }}
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
