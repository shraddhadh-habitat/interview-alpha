import { useState, useEffect } from 'react';

const FONT = "'Plus Jakarta Sans', sans-serif";
const GRAD = 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)';

const EXPERIENCE_OPTIONS = ['Less than 1 year', '1-2 years', '3-5 years', '6-9 years', '10-15 years', '15+ years'];
const LEVEL_OPTIONS = ['Intern / Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director', 'VP / C-Suite'];

const labelStyle = {
  display: 'block', fontSize: '11px', fontWeight: 600,
  letterSpacing: '1.5px', textTransform: 'uppercase',
  color: 'rgba(27,27,24,0.5)', marginBottom: '6px', fontFamily: FONT,
};

const sectionStyle = {
  background: '#FFFFFF', border: '1px solid rgba(27,27,24,0.12)',
  borderRadius: '16px', padding: '24px', marginBottom: '16px',
};

export default function CareerGapAnalysis({ user, profile }) {
  const [mode, setMode] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 1023px)').matches;
  });
  const [form, setForm] = useState({
    currentRole: '', currentOrg: '', currentIndustry: '', experience: '',
    targetRole: '', targetOrg: '', targetIndustry: '', targetLevel: '',
    resumeText: '', jdText: '', resumeFileName: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = e => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase());
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const isPro = isAdmin || profile?.subscription_status === 'pro' || profile?.subscription_status === 'active';
  const quickUsed = localStorage.getItem('ia_gap_analysis_used') === 'true';
  const canAnalyze = isPro || !quickUsed;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid rgba(27,27,24,0.12)', borderRadius: '12px',
    fontSize: '14px', fontFamily: FONT, color: '#1B1B18',
    background: '#FFFFFF', boxSizing: 'border-box', outline: 'none',
  };

  const handleAnalyze = async () => {
    if (!form.currentRole || !form.currentOrg || !form.currentIndustry || !form.experience || !form.targetRole || !form.targetLevel) {
      setError('Please fill in all required fields marked with *');
      return;
    }
    if (mode === 'deep' && (!form.resumeText.trim() || !form.jdText.trim())) {
      setError('Please paste your resume and the target job description for Deep Analysis.');
      return;
    }
    if (!canAnalyze) {
      setError('You have used your free analysis. Upgrade to Pro for unlimited gap analyses.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    const isDeep = mode === 'deep';
    const prompt = isDeep
      ? `You are a senior career coach and talent advisor. Perform a detailed career gap analysis using the actual resume and job description provided.

CURRENT PROFILE:
- Role: ${form.currentRole}
- Organization: ${form.currentOrg}
- Industry: ${form.currentIndustry}
- Experience: ${form.experience}

TARGET PROFILE:
- Role: ${form.targetRole}
- Organization: ${form.targetOrg || 'Not specified'}
- Industry: ${form.targetIndustry || 'Not specified'}
- Level: ${form.targetLevel}

CANDIDATE RESUME:
${form.resumeText}

TARGET JOB DESCRIPTION:
${form.jdText}

Analyze the resume against the job description carefully. Return ONLY a valid JSON object. No preamble, no markdown, no backticks, no explanation before or after:
{
  "summary": "2-3 sentence honest assessment of this specific candidate for this specific role",
  "transferable": ["specific skill from resume that maps to JD requirement"],
  "critical_gaps": ["specific gap between resume and JD requirement"],
  "nice_to_have": ["JD requirement candidate partially meets"],
  "courses": [
    { "name": "Course Name", "provider": "Coursera/LinkedIn Learning/Google/PMI/AWS etc", "url": "https://real-url.com", "reason": "Specific reason this closes a gap for this JD" }
  ],
  "timeline": "Realistic timeline for this specific transition",
  "ia_tracks": ["Product Management"],
  "jd_match_score": 65
}
Provide 4-6 items per array and 4-5 courses with real working URLs from well-known platforms like Coursera, LinkedIn Learning, Google, PMI, AWS, Udemy, edX.`
      : `You are a senior career coach and talent advisor. Perform a career gap analysis.

CURRENT PROFILE:
- Role: ${form.currentRole}
- Organization: ${form.currentOrg}
- Industry: ${form.currentIndustry}
- Experience: ${form.experience}

TARGET PROFILE:
- Role: ${form.targetRole}
- Organization: ${form.targetOrg || 'Not specified'}
- Industry: ${form.targetIndustry || 'Not specified'}
- Level: ${form.targetLevel}

Return ONLY a valid JSON object. No preamble, no markdown, no backticks, no explanation before or after:
{
  "summary": "2-3 sentence honest assessment of this transition",
  "transferable": ["skill or quality that transfers"],
  "critical_gaps": ["critical gap"],
  "nice_to_have": ["nice to have skill"],
  "courses": [
    { "name": "Course Name", "provider": "Coursera/LinkedIn Learning/Google/PMI/AWS etc", "url": "https://real-url.com", "reason": "Why this course helps" }
  ],
  "timeline": "Realistic transition timeline",
  "ia_tracks": ["Product Management"]
}
Provide 4-6 items per array and 4-5 courses with real working URLs from well-known platforms like Coursera, LinkedIn Learning, Google, PMI, AWS, Udemy, edX.`;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], max_tokens: 2000 }),
      });
      const data = await response.json();
      const text = data?.content?.[0]?.text || '';
      const clean = text.replace(/```json[\n\r]?|```/g, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid response format');
      const parsed = JSON.parse(jsonMatch[0]);
      if (mode === 'quick') localStorage.setItem('ia_gap_analysis_used', 'true');
      setResult(parsed);
    } catch (e) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mode selector screen
  if (!mode) return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: isMobile ? '32px 16px' : '48px 24px', fontFamily: FONT }}>
      <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 400, color: '#1B1B18', marginBottom: '8px', fontFamily: "'Instrument Serif', serif" }}>
        Career Gap Analysis
      </h1>
      <p style={{ fontSize: '15px', color: 'rgba(27,27,24,0.5)', marginBottom: '40px', lineHeight: 1.6 }}>
        Find out exactly what stands between you and your target role and what to do about it.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
        {/* Quick Analysis Card */}
        <div
          onClick={() => canAnalyze ? setMode('quick') : null}
          style={{
            background: '#FFFFFF',
            border: `1.5px solid ${quickUsed && !isPro ? 'rgba(27,27,24,0.06)' : 'rgba(27,27,24,0.12)'}`,
            borderRadius: '16px', padding: '28px 24px',
            cursor: canAnalyze ? 'pointer' : 'default',
            opacity: quickUsed && !isPro ? 0.6 : 1,
            transition: 'all 0.2s', position: 'relative',
          }}
          onMouseEnter={e => { if (canAnalyze) { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(167,139,250,0.12)'; }}}
          onMouseLeave={e => { e.currentTarget.style.borderColor = quickUsed && !isPro ? 'rgba(27,27,24,0.06)' : 'rgba(27,27,24,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1B1B18', marginBottom: '8px' }}>Quick Analysis</h2>
          <p style={{ fontSize: '13px', color: 'rgba(27,27,24,0.5)', lineHeight: 1.6, marginBottom: '20px' }}>
            Fill in your profile details. Get a comprehensive gap analysis in seconds.
          </p>
          <div style={{ fontSize: '12px', color: 'rgba(27,27,24,0.4)', marginBottom: '20px', lineHeight: 1.8 }}>
            • Transferable skills &nbsp;&nbsp; • Critical gaps<br />
            • Recommended courses &nbsp;&nbsp; • Timeline
          </div>
          {quickUsed && !isPro ? (
            <span style={{ display: 'inline-block', background: 'rgba(27,27,24,0.06)', color: 'rgba(27,27,24,0.4)', borderRadius: '50px', padding: '4px 12px', fontSize: '11px', fontWeight: 600 }}>
              Used - Upgrade for more
            </span>
          ) : (
            <span style={{ display: 'inline-block', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#16A34A', borderRadius: '50px', padding: '4px 12px', fontSize: '11px', fontWeight: 600 }}>
              1 free use
            </span>
          )}
        </div>

        {/* Deep Analysis Card */}
        <div
          onClick={() => isPro ? setMode('deep') : null}
          style={{
            background: isPro ? '#FFFFFF' : '#FAFAF8',
            border: '1.5px solid rgba(27,27,24,0.12)',
            borderRadius: '16px', padding: '28px 24px',
            cursor: isPro ? 'pointer' : 'default',
            transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={e => { if (isPro) { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(167,139,250,0.12)'; }}}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(27,27,24,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {!isPro && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', background: GRAD, color: '#fff', borderRadius: '50px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
              PRO
            </div>
          )}
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1B1B18', marginBottom: '8px' }}>Deep Analysis</h2>
          <p style={{ fontSize: '13px', color: 'rgba(27,27,24,0.5)', lineHeight: 1.6, marginBottom: '20px' }}>
            Paste your resume and the target job description. Get a precise gap analysis against the actual role requirements.
          </p>
          <div style={{ fontSize: '12px', color: 'rgba(27,27,24,0.4)', marginBottom: '20px', lineHeight: 1.8 }}>
            • Everything in Quick &nbsp;&nbsp; • Resume vs JD match<br />
            • JD match score &nbsp;&nbsp; • Role-specific courses
          </div>
          {isPro ? (
            <span style={{ display: 'inline-block', background: GRAD, color: '#fff', borderRadius: '50px', padding: '4px 12px', fontSize: '11px', fontWeight: 600 }}>
              Unlimited
            </span>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'upgrade' })); }}
              style={{ background: GRAD, color: '#fff', border: 'none', borderRadius: '50px', padding: '8px 20px', fontSize: '12px', fontWeight: 600, fontFamily: FONT, cursor: 'pointer' }}
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Form + Results screen
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: isMobile ? '24px 16px' : '32px 24px', fontFamily: FONT }}>
      <button
        onClick={() => { setMode(null); setResult(null); setError(''); }}
        style={{ background: 'none', border: 'none', color: 'rgba(27,27,24,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: FONT, marginBottom: '24px', padding: 0 }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: 400, color: '#1B1B18', marginBottom: '6px', fontFamily: "'Instrument Serif', serif" }}>
        {mode === 'deep' ? 'Deep Gap Analysis' : 'Quick Gap Analysis'}
      </h1>
      <p style={{ fontSize: '14px', color: 'rgba(27,27,24,0.5)', marginBottom: '28px', lineHeight: 1.6 }}>
        {mode === 'deep'
          ? 'Paste your resume and the target JD for a precise, personalised gap analysis.'
          : 'Fill in your profile to get a comprehensive career gap analysis.'}
      </p>

      {/* Current Profile */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#1B1B18', marginBottom: '20px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Your Current Profile
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Current Role *</label>
            <input style={inputStyle} placeholder="e.g. Technical Writer, Data Analyst" value={form.currentRole} onChange={e => set('currentRole', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Current Organization *</label>
            <input style={inputStyle} placeholder="e.g. Mastercard, Infosys, TCS" value={form.currentOrg} onChange={e => set('currentOrg', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Current Industry *</label>
            <input style={inputStyle} placeholder="e.g. Fintech, Healthcare, E-commerce" value={form.currentIndustry} onChange={e => set('currentIndustry', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Years of Experience *</label>
            <select style={inputStyle} value={form.experience} onChange={e => set('experience', e.target.value)}>
              <option value=''>Select...</option>
              {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Target Profile */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#1B1B18', marginBottom: '20px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Your Target Profile
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Target Role *</label>
            <input style={inputStyle} placeholder="e.g. Product Manager, Data Scientist" value={form.targetRole} onChange={e => set('targetRole', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Target Level *</label>
            <select style={inputStyle} value={form.targetLevel} onChange={e => set('targetLevel', e.target.value)}>
              <option value=''>Select...</option>
              {LEVEL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Target Organization</label>
            <input style={inputStyle} placeholder="e.g. Google, McKinsey, Mastercard" value={form.targetOrg} onChange={e => set('targetOrg', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Target Industry</label>
            <input style={inputStyle} placeholder="e.g. Fintech, Consulting, Tech" value={form.targetIndustry} onChange={e => set('targetIndustry', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Deep Analysis extras */}
      {mode === 'deep' && (
        <>
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#1B1B18', marginBottom: '4px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Your Resume
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(27,27,24,0.4)', marginBottom: '16px', fontFamily: FONT }}>
              Upload a PDF or paste your resume text below.
            </p>
            <label
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '12px', marginBottom: '12px',
                border: '1.5px dashed rgba(27,27,24,0.2)', borderRadius: '12px',
                background: '#FAFAF8', cursor: 'pointer', fontFamily: FONT,
                fontSize: '13px', color: 'rgba(27,27,24,0.5)', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#a78bfa'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(27,27,24,0.2)'}
            >
              📄 Upload Resume (PDF)
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    set('resumeFileName', file.name);
                    set('resumeText', `[PDF uploaded: ${file.name}] - Please also paste your resume text below for best results.`);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {form.resumeFileName && (
              <p style={{ fontSize: '12px', color: '#16A34A', marginBottom: '12px', fontFamily: FONT }}>
                ✓ {form.resumeFileName} uploaded
              </p>
            )}
            <textarea
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              placeholder="Or paste your resume text here: experience, skills, education, achievements..."
              value={form.resumeText.startsWith('[PDF uploaded:') ? '' : form.resumeText}
              onChange={e => set('resumeText', e.target.value)}
            />
          </div>
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#1B1B18', marginBottom: '16px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Target Job Description
            </h2>
            <textarea
              style={{ ...inputStyle, minHeight: '160px', resize: 'vertical' }}
              placeholder="Paste the full job description including requirements, responsibilities and must-have skills..."
              value={form.jdText}
              onChange={e => set('jdText', e.target.value)}
            />
          </div>
        </>
      )}

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(211,47,47,0.07)', border: '1px solid rgba(211,47,47,0.18)', borderRadius: '12px', fontSize: '13px', color: '#CF222E', fontFamily: FONT, marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          width: '100%', padding: '14px',
          background: loading ? '#F5F3EF' : GRAD,
          border: 'none', borderRadius: '50px',
          color: loading ? 'rgba(27,27,24,0.5)' : '#fff',
          fontSize: '15px', fontWeight: 700, fontFamily: FONT,
          cursor: loading ? 'wait' : 'pointer',
          marginBottom: '32px', opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? 'Analysing your career gap...' : mode === 'deep' ? 'Run Deep Gap Analysis' : 'Analyse My Career Gap'}
      </button>

      {/* Results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* JD Match Score - Deep only */}
          {mode === 'deep' && result.jd_match_score && (
            <div style={{ ...sectionStyle, textAlign: 'center', padding: '32px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(27,27,24,0.5)', marginBottom: '8px', fontFamily: FONT }}>
                JD Match Score
              </p>
              <p style={{ fontSize: '56px', fontWeight: 700, background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '0 0 4px' }}>
                {result.jd_match_score}%
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(27,27,24,0.5)', margin: 0, fontFamily: FONT }}>
                Your resume matches {result.jd_match_score}% of this role's requirements
              </p>
            </div>
          )}

          {/* Summary */}
          <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, rgba(168,230,207,0.08), rgba(192,132,252,0.08))', border: '1px solid rgba(167,139,250,0.15)' }}>
            <p style={{ fontSize: '15px', color: '#1B1B18', lineHeight: 1.7, margin: '0 0 12px', fontStyle: 'italic', fontFamily: FONT }}>
              {result.summary}
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(27,27,24,0.5)', margin: 0, fontFamily: FONT }}>
              ⏱ Estimated timeline: <strong style={{ color: '#1B1B18' }}>{result.timeline}</strong>
            </p>
          </div>

          {/* Transferable Skills */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: FONT }}>
              ✓ What You Already Bring
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.transferable?.map((s, i) => (
                <span key={i} style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#16A34A', borderRadius: '50px', padding: '6px 14px', fontSize: '13px', fontWeight: 500, fontFamily: FONT }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Critical Gaps */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#CF222E', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: FONT }}>
              ⚠ Critical Gaps - Must Fix
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.critical_gaps?.map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#1B1B18', lineHeight: 1.6, fontFamily: FONT }}>
                  <span style={{ color: '#CF222E', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✗</span>
                  {g}
                </div>
              ))}
            </div>
          </div>

          {/* Nice to Have */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#a78bfa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: FONT }}>
              ◎ Good to Have
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.nice_to_have?.map((s, i) => (
                <span key={i} style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa', borderRadius: '50px', padding: '6px 14px', fontSize: '13px', fontWeight: 500, fontFamily: FONT }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Courses */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#1B1B18', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px', fontFamily: FONT }}>
              📚 Recommended Courses
            </h3>
            <p style={{ fontSize: '11px', color: 'rgba(27,27,24,0.35)', marginBottom: '16px', fontFamily: FONT }}>
              If a link doesn't open the course directly, search the course name on the platform.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.courses?.map((c, i) => (
                <a
                  key={i}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', padding: '14px 16px', background: '#FAFAF8', border: '1px solid rgba(27,27,24,0.12)', borderRadius: '12px', textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#a78bfa'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(27,27,24,0.12)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', gap: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B1B18', fontFamily: FONT }}>{c.name}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(27,27,24,0.5)', background: '#F5F3EF', padding: '2px 8px', borderRadius: '50px', flexShrink: 0, fontFamily: FONT }}>{c.provider}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(27,27,24,0.5)', margin: 0, lineHeight: 1.5, fontFamily: FONT }}>{c.reason}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Practice CTA */}
          {result.ia_tracks?.length > 0 && (
            <div style={{ background: GRAD, borderRadius: '16px', padding: '28px 24px', textAlign: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px', fontFamily: FONT }}>
                Practice for your target role on InterviewAlpha
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px', fontFamily: FONT }}>
                Recommended tracks: {result.ia_tracks.join(', ')}
              </p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }))}
                style={{ background: '#fff', color: '#a78bfa', border: 'none', borderRadius: '50px', padding: '10px 28px', fontSize: '13px', fontWeight: 700, fontFamily: FONT, cursor: 'pointer' }}
              >
                Start Practicing →
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
