import { useState, useMemo, useEffect } from 'react';
import { pmQuestions, PM_LEVELS, DS_LEVELS } from '../data/pmQuestions';
import { consultingQuestions, CONSULTING_LEVELS } from '../data/consultingQuestions';
import { projectManagementQuestions, PROJECTMANAGEMENT_LEVELS } from '../data/projectManagementQuestions';
import { supabase } from '../lib/supabase';
import PracticeMode from './PracticeMode';
import { useAuth } from '../contexts/AuthContext';
import useTextToSpeech from '../hooks/useTextToSpeech';
import FormattedAnswer from '../components/FormattedAnswer';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#1B1B18', textSoft: '#1B1B18', textMuted: 'rgba(27, 27, 24, 0.5)',
  border: 'rgba(27, 27, 24, 0.12)', borderLight: 'rgba(27, 27, 24, 0.08)',
  green: '#1B1B18', greenHover: '#0A0A0A',
  greenLight: 'rgba(27, 27, 24, 0.08)', greenBorder: 'rgba(27, 27, 24, 0.12)',
  yellow: '#FDCD34', yellowLight: 'rgba(253, 205, 52, 0.12)', yellowBorder: 'rgba(253, 205, 52, 0.2)',
  success: '#FDCD34', successLight: 'rgba(253, 205, 52, 0.12)', successBorder: 'rgba(253, 205, 52, 0.2)',
};

const PM_CATEGORY_CHIPS = [
  { id: 'behavioral',       label: 'Behavioral',           dataKeys: ['behavioral'], subcategory: null },
  { id: 'product_design',   label: 'Product Design',       dataKeys: ['product'],    subcategory: 'product_design' },
  { id: 'product_strategy', label: 'Product Strategy',     dataKeys: ['product'],    subcategory: 'product_strategy' },
  { id: 'analytical',       label: 'Analytical/Metrics',   dataKeys: ['ai'],         subcategory: null },
  { id: 'technical',        label: 'Technical/Estimation', dataKeys: ['ai_technical'], subcategory: null },
];

// DS_CATEGORY_CHIPS will be built dynamically from the Data Scientist data
const buildDSCategoryChips = (dsLevel) => {
  const categoryMap = {
    'fundamentals': { label: 'Fundamentals', subcategory: null },
    'product': { label: 'Product', subcategory: null },
    'behavioral': { label: 'Behavioral', subcategory: null },
    'ai': { label: 'AI/Analytical', subcategory: null },
    'ai_technical': { label: 'Technical/SQL', subcategory: null },
    'machine_learning': { label: 'Machine Learning', subcategory: null },
    'statistics': { label: 'Statistics & Probability', subcategory: null },
    'domain_specific': { label: 'Domain Specific', subcategory: null },
  };

  const chips = [];
  Object.keys(dsLevel).forEach(cat => {
    if (Array.isArray(dsLevel[cat]) && dsLevel[cat].length > 0 && categoryMap[cat]) {
      const config = categoryMap[cat];
      chips.push({
        id: cat,
        label: config.label,
        dataKeys: [cat],
        subcategory: config.subcategory,
      });
    }
  });
  return chips;
};

const EXP_LEVEL_CHIPS = [
  { id: 'intern',    label: 'Intern',              levels: ['Associate PM'] },
  { id: 'apm',       label: 'Associate PM',        levels: ['Associate PM'] },
  { id: 'pm',        label: 'Product Manager',     levels: ['PM'] },
  { id: 'spm',       label: 'Senior PM',           levels: ['Senior PM'] },
  { id: 'lpm',       label: 'Lead PM',             levels: ['Lead PM'] },
  { id: 'staff',     label: 'Staff/Principal PM',  levels: ['Staff/Principal PM'] },
  { id: 'gpm',       label: 'Group PM',            levels: ['Group Product Manager'] },
  { id: 'dir',       label: 'Director',            levels: ['Director of PM', 'Senior Director of PM'] },
  { id: 'vp',        label: 'VP/Head of Product',  levels: ['VP of Product'] },
  { id: 'cpo',       label: 'CPO',                 levels: ['Chief Product Officer (CPO)'] },
];

const DIFFICULTY_CHIPS = ['Easy', 'Medium', 'Difficult'];

const PM_COMPANY_CHIPS = [
  { id: 'Google',    label: 'Google' },
  { id: 'Amazon',    label: 'Amazon' },
  { id: 'Meta',      label: 'Meta' },
  { id: 'Apple',     label: 'Apple' },
  { id: 'Microsoft', label: 'Microsoft' },
  { id: 'Flipkart',  label: 'Flipkart' },
  { id: 'Swiggy',    label: 'Swiggy' },
  { id: 'Razorpay',  label: 'Razorpay' },
  { id: 'CRED',      label: 'CRED' },
  { id: 'Zepto',     label: 'Zepto' },
];

const DS_COMPANY_CHIPS = [
  { id: 'Accenture',     label: 'Accenture' },
  { id: 'Airbnb',        label: 'Airbnb' },
  { id: 'Amazon',        label: 'Amazon' },
  { id: 'Bain',          label: 'Bain' },
  { id: 'BCG',           label: 'BCG' },
  { id: 'CRED',          label: 'CRED' },
  { id: 'Deloitte',      label: 'Deloitte' },
  { id: 'EY',            label: 'EY' },
  { id: 'Flipkart',      label: 'Flipkart' },
  { id: 'Goldman Sachs', label: 'Goldman Sachs' },
  { id: 'Google',        label: 'Google' },
  { id: 'JP Morgan',     label: 'JP Morgan' },
  { id: 'LinkedIn',      label: 'LinkedIn' },
  { id: 'McKinsey',      label: 'McKinsey' },
  { id: 'Meta',          label: 'Meta' },
  { id: 'Netflix',       label: 'Netflix' },
  { id: 'Razorpay',      label: 'Razorpay' },
  { id: 'Spotify',       label: 'Spotify' },
  { id: 'Swiggy',        label: 'Swiggy' },
  { id: 'TCS',           label: 'TCS' },
  { id: 'Uber',          label: 'Uber' },
  { id: 'Zepto',         label: 'Zepto' },
];

const PM_DOMAIN_CHIPS = [
  { id: 'fintech',       label: 'Fintech' },
  { id: 'healthcare',    label: 'Healthcare' },
  { id: 'telecom',       label: 'Telecom' },
  { id: 'edtech',        label: 'Edtech' },
  { id: 'ecommerce',     label: 'E-commerce' },
  { id: 'oilgas',        label: 'Oil & Gas' },
  { id: 'logistics',     label: 'Logistics' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'saas',          label: 'SaaS' },
  { id: 'consumer',      label: 'Consumer' },
  { id: 'marketplace',   label: 'Marketplace' },
  { id: 'aiml',          label: 'AI/ML' },
  { id: 'general',       label: 'General' },
];

const CAREER_TRACK_CHIPS = [
  { id: 'b2c_consumer',      label: 'B2C / Consumer PM' },
  { id: 'b2b_enterprise',    label: 'B2B / Enterprise PM' },
  { id: 'growth',            label: 'Growth PM' },
  { id: 'technical',         label: 'Technical PM' },
  { id: 'data_ai',           label: 'Data / AI PM' },
  { id: 'hardware',          label: 'Hardware PM' },
  { id: 'web3_crypto',       label: 'Web3 / Crypto PM' },
  { id: 'internal_tools',    label: 'Internal Tools PM' },
  { id: 'localization',      label: 'Localization PM' },
  { id: 'product_ops',       label: 'Product Operations' },
  { id: 'product_marketing', label: 'Product Marketing Manager' },
];

const DS_DOMAIN_CHIPS = [
  { id: 'fintech',    label: 'Fintech' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'telecom',    label: 'Telecom' },
  { id: 'ecommerce',  label: 'E-commerce' },
  { id: 'edtech',     label: 'Edtech' },
  { id: 'saas',       label: 'SaaS' },
  { id: 'general',    label: 'General' },
];

const CONSULTING_COMPANY_CHIPS = [
  { id: 'mckinsey', label: 'McKinsey' },
  { id: 'deloitte', label: 'Deloitte' },
  { id: 'pwc', label: 'PwC' },
  { id: 'ey', label: 'EY' },
  { id: 'kpmg', label: 'KPMG' },
  { id: 'accenture', label: 'Accenture' },
  { id: 'bcg', label: 'BCG' },
  { id: 'bain', label: 'Bain & Company' },
  { id: 'kearney', label: 'Kearney' },
  { id: 'ibm', label: 'IBM Consulting' },
  { id: 'strategy_and', label: 'Strategy&' },
  { id: 'ey_parthenon', label: 'EY-Parthenon' },
  { id: 'capgemini', label: 'Capgemini Invent' },
  { id: 'publicis', label: 'Publicis Sapient' },
  { id: 'alvarez', label: 'Alvarez & Marsal' },
];

const CONSULTING_DOMAIN_CHIPS = [
  { id: 'strategy', label: 'Strategy', subcategories: ['Strategy Consultant', 'Corporate Strategy Consultant'] },
  { id: 'operations', label: 'Operations', subcategories: ['Operations Consultant', 'Supply Chain Consultant'] },
  { id: 'technology', label: 'Technology', subcategories: ['Technology Consultant', 'Digital Consultant'] },
  { id: 'risk', label: 'Risk & Controls', subcategories: ['Risk Consultant', 'Advisory Consultant'] },
  { id: 'transformation', label: 'Transformation', subcategories: ['Transformation Consultant'] },
  { id: 'human_capital', label: 'Human Capital', subcategories: ['Human Capital Consultant'] },
  { id: 'financial_advisory', label: 'Financial Advisory', subcategories: ['Financial Advisory Consultant'] },
  { id: 'digital', label: 'Digital', subcategories: ['Digital Consultant', 'Technology Consultant'] },
  { id: 'supply_chain', label: 'Supply Chain', subcategories: ['Supply Chain Consultant'] },
];

const PROJECTMANAGEMENT_DOMAIN_CHIPS = [
  { id: 'fintech', label: 'Fintech' },
  { id: 'banking', label: 'Banking' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'telecom', label: 'Telecom' },
];

const PROJECTMANAGEMENT_CATEGORY_CHIPS = [
  { id: 'behavioral', label: 'Behavioral', dataKeys: ['behavioral'] },
  { id: 'case_study', label: 'Case Study', dataKeys: ['case_study'] },
  { id: 'situational', label: 'Situational', dataKeys: ['situational'] },
  { id: 'leadership', label: 'Leadership', dataKeys: ['leadership'] },
  { id: 'technical', label: 'Technical', dataKeys: ['technical'] },
];

const CONSULTING_CATEGORY_CHIPS = [
  { id: 'profitability', label: 'Profitability Case', dataKeys: ['case_interview'], subcategory: 'Consultant' },
  { id: 'market_entry', label: 'Market Entry', dataKeys: ['case_interview'], subcategory: 'Strategy Consultant' },
  { id: 'market_sizing', label: 'Market Sizing', dataKeys: ['case_interview'], subcategory: 'Management Consultant' },
  { id: 'growth_strategy', label: 'Growth Strategy', dataKeys: ['case_interview'], subcategory: 'Business Consultant' },
  { id: 'operations', label: 'Operations', dataKeys: ['case_interview'], subcategory: 'Operations Consultant' },
  { id: 'merger_acquisition', label: 'M&A / Due Diligence', dataKeys: ['case_interview'], subcategory: 'Financial Advisory Consultant' },
  { id: 'digital_transformation', label: 'Digital Transformation', dataKeys: ['case_interview'], subcategory: 'Digital Consultant' },
  { id: 'risk_compliance', label: 'Risk & Compliance', dataKeys: ['case_interview'], subcategory: 'Risk Consultant' },
  { id: 'people_org', label: 'People & Organization', dataKeys: ['case_interview'], subcategory: 'Human Capital Consultant' },
  { id: 'supply_chain', label: 'Supply Chain', dataKeys: ['case_interview'], subcategory: 'Supply Chain Consultant' },
];

const POPULAR_KEYWORDS = {
  pm: ['AI Product', 'Stakeholder', 'Agile', 'Growth', 'Product Strategy', 'Leadership', 'Data', 'System Design'],
  ds: ['Machine Learning', 'SQL', 'Statistics', 'Python', 'A/B Testing', 'Feature Engineering', 'Model Evaluation', 'Data Pipeline'],
  consulting: ['Case Interview', 'Market Entry', 'Profitability', 'Market Sizing', 'Growth Strategy', 'Operations', 'M&A', 'Digital Transformation'],
};

// Sorting priority functions for each track
const getQuestionPriority = (question, track) => {
  const questionText = `${question.q} ${question.a}`.toLowerCase();

  if (track === 'pm') {
    // Priority 1: AI, artificial intelligence, LLM, GenAI, machine learning
    if (/\b(ai|artificial\s+intelligence|llm|genai|machine\s+learning)\b/i.test(questionText)) return 0;
    // Priority 2: agile, scrum, sprint, roadmap
    if (/\b(agile|scrum|sprint|roadmap)\b/i.test(questionText)) return 1;
    // Priority 3: stakeholder, leadership, strategy
    if (/\b(stakeholder|leadership|strategy)\b/i.test(questionText)) return 2;
    // Priority 4: all other questions
    return 3;
  } else if (track === 'ds') {
    // Priority 1: LLM, AI, GenAI, real-time, streaming
    if (/\b(llm|ai|genai|real-time|streaming)\b/i.test(questionText)) return 0;
    // Priority 2: causal, A/B test, experiment, inference
    if (/\b(causal|a\/b\s+test|experiment|inference)\b/i.test(questionText)) return 1;
    // Priority 3: SQL, Python, feature, pipeline
    if (/\b(sql|python|feature|pipeline)\b/i.test(questionText)) return 2;
    // Priority 4: all other questions
    return 3;
  } else if (track === 'consulting') {
    // Priority 1: AI strategy, digital transformation, GenAI
    if (/\b(ai\s+strategy|digital\s+transformation|genai)\b/i.test(questionText)) return 0;
    // Priority 2: sustainability, ESG, supply chain
    if (/\b(sustainability|esg|supply\s+chain)\b/i.test(questionText)) return 1;
    // Priority 3: market entry, profitability, M&A
    if (/\b(market\s+entry|profitability|m&a|mergers?\s+and\s+acquisitions)\b/i.test(questionText)) return 2;
    // Priority 4: all other questions
    return 3;
  }

  return 3;
};

const ROLES = {
  pm: {
    id: 'pm',
    label: 'Product Management',
    levels: PM_LEVELS,
    expLevelChips: [
      { id: 'intern',    label: 'Intern',              levels: ['Associate PM'] },
      { id: 'apm',       label: 'Associate PM',        levels: ['Associate PM'] },
      { id: 'pm',        label: 'Product Manager',     levels: ['PM'] },
      { id: 'spm',       label: 'Senior PM',           levels: ['Senior PM'] },
      { id: 'lpm',       label: 'Lead PM',             levels: ['Lead PM'] },
      { id: 'staff',     label: 'Staff/Principal PM',  levels: ['Staff/Principal PM'] },
      { id: 'gpm',       label: 'Group PM',            levels: ['Group Product Manager'] },
      { id: 'dir',       label: 'Director',            levels: ['Director of PM', 'Senior Director of PM'] },
      { id: 'vp',        label: 'VP/Head of Product',  levels: ['VP of Product'] },
      { id: 'cpo',       label: 'CPO',                 levels: ['Chief Product Officer (CPO)'] },
    ],
    titleSuffix: 'Product Management Interview Questions',
  },
  ds: {
    id: 'ds',
    label: 'Data Science',
    levels: DS_LEVELS,
    expLevelChips: [
      { id: 'junior_ds', label: 'Junior Data Scientist', levels: ['Data Scientist'] },
      { id: 'mid_ds', label: 'Data Scientist', levels: ['Data Scientist'] },
      { id: 'senior_ds', label: 'Senior Data Scientist', levels: ['Data Scientist'] },
      { id: 'lead_ds', label: 'Lead/Principal DS', levels: ['Data Scientist'] },
      { id: 'head_ds', label: 'Head of Data Science', levels: ['Data Scientist'] },
    ],
    titleSuffix: 'Data Science Interview Questions',
    comingSoon: false,
  },
  consulting: {
    id: 'consulting',
    label: 'Consulting',
    levels: CONSULTING_LEVELS,
    expLevelChips: CONSULTING_LEVELS.map(level => ({ id: level.toLowerCase().replace(/\s+/g, '_'), label: level, levels: [level] })),
    titleSuffix: 'Consulting Interview Questions',
    comingSoon: false,
  },
  projectmanagement: {
    id: 'projectmanagement',
    label: 'Project Management',
    levels: PROJECTMANAGEMENT_LEVELS,
    expLevelChips: [
      { id: 'junior_pm', label: 'Junior PM', levels: ['Junior Project Manager'] },
      { id: 'pm', label: 'Project Manager', levels: ['Project Manager'] },
      { id: 'senior_pm', label: 'Senior PM', levels: ['Senior Project Manager'] },
      { id: 'program_pm', label: 'Program Manager', levels: ['Program Manager'] },
      { id: 'head_pmo', label: 'Head of PMO', levels: ['Head of PMO'] },
    ],
    titleSuffix: 'Project Management Interview Questions',
    comingSoon: false,
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    comingSoon: true,
  },
  sales: {
    id: 'sales',
    label: 'Sales & Marketing',
    comingSoon: true,
  },
  general: {
    id: 'general',
    label: 'General Management',
    comingSoon: true,
  },
};

// Difficulty derived from PM level  . the only reliable classification signal in the data
function getDifficulty(level) {
  if (['Associate PM', 'PM'].includes(level)) return 'Easy';
  if (['Senior PM', 'Lead PM', 'Staff/Principal PM'].includes(level)) return 'Medium';
  return 'Difficult'; // Group PM, Director+
}

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 2000px; } }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
  * { box-sizing: border-box; }
  input:focus { outline: none; }
  button:focus-visible { outline: 2px solid #16A34A; outline-offset: 2px; }
  ::selection { background: rgba(22,163,74,0.18); }
  .filter-tags-row {
    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;
  }
`;

// ─── Preserved components ────────────────────────────────────────────────────

function ReportIssueModal({ questionId, user, onClose }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await supabase.from('question_reports').insert({
      user_id: user.id,
      question_id: questionId,
      report_text: text.trim(),
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '0 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 12, padding: '28px 28px 24px',
          width: '100%', maxWidth: 440,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 14, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
              Thanks  . we'll review this.
            </div>
            <button
              onClick={onClose}
              style={{
                marginTop: 20, padding: '8px 22px',
                background: C.green, border: 'none', borderRadius: 10,
                color: '#fff', fontSize: 11, letterSpacing: 1.5,
                textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: 'uppercase', marginBottom: 14 }}>
              Report Issue
            </div>
            <label style={{ fontSize: 13, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'block', marginBottom: 10 }}>
              What's wrong with this answer?
            </label>
            <textarea
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Describe the issue  . e.g. outdated info, factual error, unclear explanation..."
              rows={4}
              style={{
                width: '100%', padding: '10px 14px',
                border: `1px solid ${C.border}`, borderRadius: 12,
                fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: C.text, lineHeight: 1.6, resize: 'vertical',
                background: C.bgSoft, outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 18px', background: 'transparent',
                  border: `1px solid ${C.border}`, borderRadius: 10,
                  color: C.textMuted, fontSize: 11, letterSpacing: 1.5,
                  textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                style={{
                  padding: '8px 18px',
                  background: text.trim() && !submitting ? C.green : C.bgMuted,
                  border: 'none', borderRadius: 10,
                  color: text.trim() && !submitting ? '#fff' : C.textMuted,
                  fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                  cursor: text.trim() && !submitting ? 'pointer' : 'default',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'background 0.2s',
                }}
              >
                {submitting ? 'Sending…' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Track Selector Modal ────────────────────────────────────────────────────

function TrackSelectorModal({ onSelectTrack }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.55)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '0 16px',
      }}
    >
      <div
        style={{
          background: '#fff', borderRadius: 16, padding: '40px 32px',
          width: '100%', maxWidth: 480,
          boxShadow: '0 12px 60px rgba(0,0,0,0.24)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textAlign: 'center',
        }}
      >
        <h2 style={{
          fontSize: 24, fontWeight: 700, color: C.text,
          marginBottom: 12, margin: '0 0 12px 0',
        }}>
          What are you preparing for?
        </h2>
        <p style={{
          fontSize: 14, color: C.textMuted, marginBottom: 32,
          lineHeight: 1.6, margin: '0 0 32px 0',
        }}>
          Choose your path and we'll start with a beginner question.
        </p>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <button
            onClick={() => onSelectTrack('pm')}
            style={{
              padding: '14px 24px', height: 48,
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Product Management
          </button>

          <button
            onClick={() => onSelectTrack('ds')}
            style={{
              padding: '14px 24px', height: 48,
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Data Science
          </button>

          <button
            onClick={() => onSelectTrack('consulting')}
            style={{
              padding: '14px 24px', height: 48,
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Consulting
          </button>

          <button
            onClick={() => onSelectTrack('projectmanagement')}
            style={{
              padding: '14px 24px', height: 48,
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Project Management
          </button>
        </div>
      </div>
    </div>
  );
}

const TEASER_LEN = 120;

function BlurredAnswer({ text, bgColor = 'rgb(236,247,241)' }) {
  const { user, requireAuth } = useAuth();
  const hasMore = text.length > TEASER_LEN;
  const teaser = hasMore ? text.slice(0, TEASER_LEN) : text;
  const rest = hasMore ? text.slice(TEASER_LEN) : '';

  const containerStyle = {
    maxWidth: 720,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  // Only show full answer if user is logged in
  if (user) {
    return <div style={containerStyle}><FormattedAnswer text={text} /></div>;
  }

  // For non-logged-in users, always show blurred version (even for short answers)
  return (
    <div>
      <div style={containerStyle}><FormattedAnswer text={teaser} /></div>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ ...containerStyle, filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
          <FormattedAnswer text={rest} />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 0%, ${bgColor} 55%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingTop: 48,
        }}>
          <button
            onClick={() => requireAuth('Sign up to read the full expert answer')}
            style={{
              padding: '10px 24px', minHeight: 44,
              background: C.green, border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            Sign up to read full answer
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={open ? C.green : C.textMuted} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ScoreBadge({ score, attempts }) {
  const color = score >= 70 ? C.success : score >= 40 ? C.yellow : '#CF222E';
  const bg = score >= 70 ? C.successLight : score >= 40 ? C.yellowLight : 'rgba(211,47,47,0.07)';
  const border = score >= 70 ? C.successBorder : score >= 40 ? C.yellowBorder : 'rgba(211,47,47,0.18)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <span style={{
        padding: '2px 8px',
        background: bg, border: `1px solid ${border}`,
        borderRadius: 20, fontSize: 10,
        color, fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600, letterSpacing: 0.5,
      }}>
        {score}
      </span>
      {attempts > 1 && (
        <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ×{attempts}
        </span>
      )}
    </div>
  );
}

function QuestionCard({ question, questionId, index, isOpen, onToggle, onPractice, practiceData, onReport, tts, user }) {
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);

  useEffect(() => {
    if (!tts.isSpeaking) {
      setIsSpeakingQuestion(false);
      setIsSpeakingAnswer(false);
    }
  }, [tts.isSpeaking]);

  const handleSpeakQuestion = (e) => {
    e.stopPropagation();
    if (tts.isSpeaking) {
      tts.stop();
      setIsSpeakingQuestion(false);
    } else {
      tts.speak(question.q);
      setIsSpeakingQuestion(true);
    }
  };

  const handleSpeakAnswer = (e) => {
    e.stopPropagation();
    if (!user) return; // Only authenticated users can listen to expert answers
    if (tts.isSpeaking) {
      tts.stop();
      setIsSpeakingAnswer(false);
    } else {
      tts.speak(question.a);
      setIsSpeakingAnswer(true);
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: `1px solid ${isOpen ? C.greenBorder : C.border}`,
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: isOpen ? '0 2px 16px rgba(22,163,74,0.07)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Question row */}
      <button
        onClick={() => {
          if (!user) {
            onPractice();
          } else {
            onToggle();
          }
        }}
        style={{
          width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16,
          padding: '18px 22px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Number badge */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: isOpen ? C.green : C.bgMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: isOpen ? '#fff' : C.text,
          transition: 'background 0.2s, color 0.2s', marginTop: 1,
        }}>
          {index + 1}
        </div>

        {/* Question text + Listen button */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{
            flex: 1, fontSize: 15, lineHeight: 1.65,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: C.text, fontWeight: isOpen ? 600 : 500,
            transition: 'font-weight 0.1s',
          }}>
            {question.q}
          </span>
          {tts.isSupported && (
            <button
              onClick={handleSpeakQuestion}
              title={isSpeakingQuestion ? "Stop listening" : "Listen to question"}
              className="listen-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '5px 12px',
                background: 'linear-gradient(135deg, #c084fc 0%, #a78bfa 35%, #d4a017 75%, #f5c842 100%)',
                border: 'none',
                borderRadius: 20,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'all 0.2s',
                flexShrink: 0,
                marginTop: 2,
                minHeight: 44,
                opacity: isSpeakingQuestion ? 1 : 0.9,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.88';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = isSpeakingQuestion ? '1' : '0.9';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isSpeakingQuestion ? '■ Stop' : '▶ Listen'}
            </button>
          )}
        </div>

        {/* Score badge (if practiced) */}
        {practiceData && (
          <ScoreBadge score={practiceData.best_score} attempts={practiceData.attempts} />
        )}

        <ChevronIcon open={isOpen} />
      </button>

      {/* Answer panel */}
      {user && isOpen && (
        <div style={{
          borderTop: `1px solid ${C.greenBorder}`,
          background: C.greenLight,
          animation: 'fadeUp 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ padding: '20px 22px 16px' }}>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                padding: '3px 10px', background: '#8250DF', color: '#fff',
                borderRadius: 20, fontSize: 10, fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5,
              }}>
                Expert Answer
              </span>
              {tts.isSupported && user && (
                <button
                  onClick={handleSpeakAnswer}
                  title={isSpeakingAnswer ? "Stop listening" : "Listen to answer"}
                  className="listen-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    background: 'linear-gradient(135deg, #c084fc 0%, #a78bfa 35%, #d4a017 75%, #f5c842 100%)',
                    border: 'none',
                    borderRadius: 20,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#fff',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.2s',
                    minHeight: 44,
                    opacity: isSpeakingAnswer ? 1 : 0.9,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.88';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = isSpeakingAnswer ? '1' : '0.9';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isSpeakingAnswer ? '■ Stop' : '▶ Listen'}
                </button>
              )}
            </div>
            <BlurredAnswer text={question.a} />
          </div>
          {/* Practice button + Report link */}
          <div style={{ padding: '0 22px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onPractice(); }}
                style={{
                  padding: '10px 22px',
                  background: C.green, border: 'none', borderRadius: 12,
                  color: '#fff', fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                  transition: 'background 0.2s',
                  boxShadow: '0 1px 2px rgba(22,163,74,0.3)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.greenHover}
                onMouseLeave={e => e.currentTarget.style.background = C.green}
              >
                Practice This Question
              </button>
              {practiceData && (
                <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Best: {practiceData.best_score}/100 · {practiceData.attempts} attempt{practiceData.attempts !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onReport(); }}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: 11, color: C.textMuted, cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5,
                textDecoration: 'underline', textUnderlineOffset: 3,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.green}
              onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
            >
              Report Issue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── New helper components ────────────────────────────────────────────────────

function BottomSheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 301,
        background: '#fff', borderRadius: '20px 20px 0 0',
        height: '85vh', display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.3s cubic-bezier(0.22,1,0.36,1)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E0E0E0', margin: '12px auto 4px', flexShrink: 0 }} />
        {children}
      </div>
    </>
  );
}

function FilterSidebar({ open, onClose, children }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 300 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301,
        width: 400, background: '#fff',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 32px rgba(0,0,0,0.12)',
        animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {children}
      </div>
    </>
  );
}

function FilterDropdown({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: C.textMuted, marginBottom: 8 }}>
        {label}
      </label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        style={{
          width: '100%', minHeight: 44,
          padding: '12px 14px', fontSize: 15, fontWeight: 500,
          border: `1.5px solid ${C.border}`, borderRadius: 12,
          background: C.bg, color: C.text,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          cursor: 'pointer', transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#C67F00'}
        onBlur={e => e.target.style.borderColor = C.border}
      >
        {options.map(opt => (
          <option key={opt.id} value={opt.id || ''}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Helper: Count matching questions for a filter state ───────────────────
function countQuestionsForFilterState(selectedRole, filterState, pmQuestions, PM_LEVELS, DS_LEVELS, consultingQuestions, projectManagementQuestions, PROJECTMANAGEMENT_LEVELS) {
  const { category, expLevel, company, difficulty, domain, track } = filterState;

  const role = ROLES[selectedRole] || ROLES.pm;

  // Build categoryChips dynamically for DS
  let categoryChips;
  if (selectedRole === 'ds') {
    const dsLevel = pmQuestions['Data Scientist'];
    categoryChips = dsLevel ? buildDSCategoryChips(dsLevel) : [];
  } else if (selectedRole === 'consulting') {
    categoryChips = CONSULTING_CATEGORY_CHIPS;
  } else if (selectedRole === 'projectmanagement') {
    categoryChips = PROJECTMANAGEMENT_CATEGORY_CHIPS;
  } else {
    categoryChips = PM_CATEGORY_CHIPS;
  }

  // For DS, dynamically get all category keys from the Data Scientist level
  let dataCats;
  if (selectedRole === 'ds') {
    const dsLevel = pmQuestions['Data Scientist'];
    dataCats = dsLevel ? Object.keys(dsLevel).filter(k => Array.isArray(dsLevel[k])) : [];
  } else if (selectedRole === 'consulting') {
    dataCats = ['case_interview'];
  } else {
    dataCats = ['product', 'behavioral', 'ai', 'ai_technical'];
  }

  let subcategoryFilter = null;
  if (category) {
    const chip = categoryChips.find(c => c.id === category);
    if (chip) {
      dataCats = chip.dataKeys;
      subcategoryFilter = chip.subcategory;
    }
  }

  let levelsToShow = role.levels || PM_LEVELS;
  let dsLevelsToShow = null;

  if (selectedRole === 'ds' && expLevel && role.expLevelChips && role.expLevelChips.length > 0) {
    const chip = role.expLevelChips.find(c => c.id === expLevel);
    if (chip && chip.id) {
      const levelMap = {
        'junior_ds': ['junior_ds'],
        'mid_ds': ['mid_ds'],
        'senior_ds': ['senior_ds'],
        'lead_ds': ['lead_ds'],
        'head_ds': ['head_ds'],
      };
      dsLevelsToShow = new Set(levelMap[chip.id] || []);
    }
  } else if (expLevel && role.expLevelChips && role.expLevelChips.length > 0) {
    const chip = role.expLevelChips.find(c => c.id === expLevel);
    if (chip) {
      const allowed = new Set(chip.levels);
      if (selectedRole === 'pm') allowed.add('Company Prep');
      levelsToShow = (role.levels || PM_LEVELS).filter(l => allowed.has(l));
    }
  }

  let count = 0;
  for (const level of levelsToShow) {
    const bank = selectedRole === 'consulting' ? consultingQuestions[level] : selectedRole === 'projectmanagement' ? projectManagementQuestions[level] : pmQuestions[level];
    if (!bank) continue;
    for (const cat of dataCats) {
      const questions = bank[cat] || [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        // For DS, filter by question.level if expLevel filter is set
        if (selectedRole === 'ds' && dsLevelsToShow && !dsLevelsToShow.has(q.level)) {
          continue;
        }

        const effectiveDifficulty = q.difficulty || getDifficulty(level);
        if (difficulty && effectiveDifficulty !== difficulty) continue;
        if (company) {
          if (selectedRole === 'consulting') {
            const firms = (q.companies || []).map(c => c.toLowerCase());
            const chipLabel = (CONSULTING_COMPANY_CHIPS.find(c => c.id === company)?.label || '').toLowerCase();
            if (!firms.some(f => f.includes(chipLabel) || chipLabel.includes(f.split(' ')[0]))) continue;
          } else {
            if (!q.company || q.company.toLowerCase() !== company.toLowerCase()) continue;
          }
        }
        if (domain) {
          if (selectedRole === 'consulting') {
            const chip = CONSULTING_DOMAIN_CHIPS.find(c => c.id === domain);
            if (chip && chip.subcategories) {
              if (!chip.subcategories.includes(q.subcategory)) continue;
            }
          } else {
            if (!q.domain || q.domain.toLowerCase() !== domain.toLowerCase()) continue;
          }
        }
        if (subcategoryFilter && q.subcategory && q.subcategory !== subcategoryFilter) continue;
        if (selectedRole === 'pm' && track) {
          const trackLabel = CAREER_TRACK_CHIPS.find(c => c.id === track)?.label;
          if (trackLabel && (!q.tracks || !q.tracks.includes(trackLabel))) continue;
        }
        count++;
      }
    }
  }
  return count;
}

function FilterContent({
  filterCategory, setFilterCategory,
  filterExpLevel, setFilterExpLevel,
  filterCompany, setFilterCompany,
  filterDifficulty, setFilterDifficulty,
  filterDomain, setFilterDomain,
  resultCount,
  onApply,
  onClearAll,
  selectedRole,
  pmQuestions,
  selectedTrack,
  setSelectedTrack,
}) {

  const role = ROLES[selectedRole] || ROLES.pm;

  // Build DS category chips dynamically from the Data Scientist data
  let categoryChips;
  if (selectedRole === 'ds') {
    const dsLevel = pmQuestions['Data Scientist'];
    categoryChips = dsLevel ? buildDSCategoryChips(dsLevel) : [];
  } else if (selectedRole === 'consulting') {
    categoryChips = CONSULTING_CATEGORY_CHIPS;
  } else if (selectedRole === 'projectmanagement') {
    categoryChips = PROJECTMANAGEMENT_CATEGORY_CHIPS;
  } else {
    categoryChips = PM_CATEGORY_CHIPS;
  }

  const categoryOptions = [
    { id: '', label: 'All' },
    ...categoryChips.map(c => ({ id: c.id, label: c.label })),
  ].filter(opt =>
    opt.id === '' ||
    countQuestionsForFilterState(selectedRole, { category: opt.id, expLevel: filterExpLevel, company: filterCompany, difficulty: filterDifficulty, domain: filterDomain, track: selectedTrack }, pmQuestions, PM_LEVELS, DS_LEVELS, consultingQuestions, projectManagementQuestions, PROJECTMANAGEMENT_LEVELS) > 0
  );

  const expLevelOptions = !role.expLevelChips || role.expLevelChips.length === 0
    ? []
    : [
        { id: '', label: 'All' },
        ...(role.expLevelChips || []),
      ].filter(opt =>
        opt.id === '' ||
        countQuestionsForFilterState(selectedRole, { category: filterCategory, expLevel: opt.id, company: filterCompany, difficulty: filterDifficulty, domain: filterDomain, track: selectedTrack }, pmQuestions, PM_LEVELS, DS_LEVELS, consultingQuestions, projectManagementQuestions, PROJECTMANAGEMENT_LEVELS) > 0
      );

  const companyChips = selectedRole === 'ds'
    ? DS_COMPANY_CHIPS
    : selectedRole === 'consulting'
    ? CONSULTING_COMPANY_CHIPS
    : PM_COMPANY_CHIPS;
  const companyOptions = [
    { id: '', label: 'All' },
    ...companyChips,
  ].filter(opt =>
    opt.id === '' ||
    countQuestionsForFilterState(selectedRole, { category: filterCategory, expLevel: filterExpLevel, company: opt.id, difficulty: filterDifficulty, domain: filterDomain, track: selectedTrack }, pmQuestions, PM_LEVELS, DS_LEVELS, consultingQuestions, projectManagementQuestions, PROJECTMANAGEMENT_LEVELS) > 0
  );

  const domainChips = selectedRole === 'ds'
    ? DS_DOMAIN_CHIPS
    : selectedRole === 'consulting'
    ? CONSULTING_DOMAIN_CHIPS
    : selectedRole === 'projectmanagement'
    ? PROJECTMANAGEMENT_DOMAIN_CHIPS
    : PM_DOMAIN_CHIPS;
  const domainOptions = [
    { id: '', label: 'All' },
    ...domainChips,
  ].filter(opt =>
    opt.id === '' ||
    countQuestionsForFilterState(selectedRole, { category: filterCategory, expLevel: filterExpLevel, company: filterCompany, difficulty: filterDifficulty, domain: opt.id, track: selectedTrack }, pmQuestions, PM_LEVELS, DS_LEVELS, consultingQuestions, projectManagementQuestions, PROJECTMANAGEMENT_LEVELS) > 0
  );

  const difficultyOptions = selectedRole === 'projectmanagement'
    ? [
        { id: '', label: 'All' },
        { id: 'Medium', label: 'Medium' },
        { id: 'Hard', label: 'Hard' },
      ].filter(opt =>
        opt.id === '' ||
        countQuestionsForFilterState(selectedRole, { category: filterCategory, expLevel: filterExpLevel, company: filterCompany, difficulty: opt.id, domain: filterDomain, track: selectedTrack }, pmQuestions, PM_LEVELS, DS_LEVELS, consultingQuestions, projectManagementQuestions, PROJECTMANAGEMENT_LEVELS) > 0
      )
    : [
      { id: '', label: 'All' },
      { id: 'Easy', label: 'Easy' },
      { id: 'Medium', label: 'Medium' },
      { id: 'Difficult', label: 'Difficult' },
    ].filter(opt =>
      opt.id === '' ||
      countQuestionsForFilterState(selectedRole, { category: filterCategory, expLevel: filterExpLevel, company: filterCompany, difficulty: opt.id, domain: filterDomain, track: selectedTrack }, pmQuestions, PM_LEVELS, DS_LEVELS, consultingQuestions, projectManagementQuestions, PROJECTMANAGEMENT_LEVELS) > 0
    );

  const trackOptions = selectedRole === 'pm'
    ? [
        { id: '', label: 'All' },
        ...CAREER_TRACK_CHIPS,
      ].filter(opt =>
        opt.id === '' ||
        countQuestionsForFilterState(selectedRole, { category: filterCategory, expLevel: filterExpLevel, company: filterCompany, difficulty: filterDifficulty, domain: filterDomain, track: opt.id }, pmQuestions, PM_LEVELS, DS_LEVELS, consultingQuestions, projectManagementQuestions, PROJECTMANAGEMENT_LEVELS) > 0
      )
    : [];

  const activeCount = (filterCategory ? 1 : 0) + (filterExpLevel ? 1 : 0) + (filterCompany ? 1 : 0) + (filterDomain ? 1 : 0) + (filterDifficulty ? 1 : 0) + (selectedTrack ? 1 : 0);

  return (
    <>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Filters</span>
        <button
          onClick={onClearAll}
          style={{ fontSize: 14, color: C.green, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
        >
          Clear All
        </button>
      </div>

      {/* Scrollable sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        {trackOptions.length > 1 && (
          <FilterDropdown label="Career Track" value={selectedTrack} onChange={setSelectedTrack} options={trackOptions} />
        )}
        {expLevelOptions.length > 1 && (
          <FilterDropdown label="Experience Level" value={filterExpLevel} onChange={setFilterExpLevel} options={expLevelOptions} />
        )}
        <FilterDropdown label="Category" value={filterCategory} onChange={setFilterCategory} options={categoryOptions} />
        <FilterDropdown label="Difficulty" value={filterDifficulty} onChange={setFilterDifficulty} options={difficultyOptions} />
        <FilterDropdown label="Company" value={filterCompany} onChange={setFilterCompany} options={companyOptions} />
        <FilterDropdown label="Domain" value={filterDomain} onChange={setFilterDomain} options={domainOptions} />
        <div style={{ height: 20 }} />
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px', borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, background: '#fff',
      }}>
        <span style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {activeCount > 0 ? `${activeCount} filter${activeCount !== 1 ? 's' : ''} applied` : 'No filters applied'}
        </span>
        <button
          onClick={onApply}
          style={{
            padding: '11px 22px', background: C.green, border: 'none', borderRadius: 12,
            color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: '0 1px 4px rgba(22,163,74,0.3)',
          }}
        >
          Apply
        </button>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PracticeQA({ user, profile, checkSession, onSessionUsed }) {
  const { requireAuth } = useAuth();
  const tts = useTextToSpeech();

  const [selectedRole, setSelectedRole] = useState(() => {
    const stored = sessionStorage.getItem('ia:selectedRole');
    if (stored && ROLES[stored]) {
      sessionStorage.removeItem('ia:selectedRole');
      return stored;
    }
    return 'pm';
  });

  useEffect(() => {
    const role = ROLES[selectedRole];
    const titlePrefix = selectedRole === 'pm' ? 'PM' : role?.titleSuffix?.split(' ')[0] || 'Interview';
    const title = `${titlePrefix} Interview Questions & Answers | InterviewAlpha.ai`;
    document.title = title;
    return () => { document.title = 'Interview Questions & Answers 2026 | AI Mock Interview Practice | InterviewAlpha.ai™'; };
  }, [selectedRole]);

  // Handle new_user=true by showing track selector modal
  useEffect(() => {
    if (localStorage.getItem('ia_show_track_selector') === 'true') {
      console.log('[PracticeQA] useEffect: Found ia_show_track_selector flag, showing track selector modal');
      localStorage.removeItem('ia_show_track_selector');

      // Clear new_user param from URL
      const params = new URLSearchParams(window.location.search);
      if (params.get('new_user') === 'true') {
        params.delete('new_user');
        const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }

      setShowTrackSelector(true);
    }
  }, []);

  const [search, setSearch] = useState('');
  const [isPopularSearch, setIsPopularSearch] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterExpLevel, setFilterExpLevel] = useState(null);
  const [filterCompany, setFilterCompany] = useState(null);
  const [filterDomain, setFilterDomain] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState(() => {
    console.log('[PracticeQA] initializer running - localStorage has ia_sample_question:', !!localStorage.getItem('ia_sample_question'));

    // Check for score_token in URL first (from email verification redirect)
    const params = new URLSearchParams(window.location.search);
    const scoreToken = params.get('score_token');
    if (scoreToken) {
      console.log('[PracticeQA] Found score_token in URL, showing placeholder for score restoration');
      return {
        question: { q: 'Loading your score...' },
        questionId: 'pending',
        designation: 'pending',
        category: 'pending',
        pending: true
      };
    }

    // Check for new_user=true (Flow 2 - direct signup after email verification)
    // Don't auto-load question here, let useEffect handle it and show track selector instead
    const newUser = params.get('new_user');
    if (newUser === 'true') {
      console.log('[PracticeQA] Found new_user=true, will show track selector modal');
      // Set flag for useEffect to show track selector (can't rely on URL param due to timing)
      localStorage.setItem('ia_show_track_selector', 'true');
      // Return null - track selector will handle loading the question
      return null;
    }

    // Check for pending score from post-signup attempt
    const pendingScore = localStorage.getItem('ia:pending_score');
    if (pendingScore) {
      try {
        const parsed = JSON.parse(pendingScore);
        if (parsed.question && parsed.questionId) {
          localStorage.removeItem('ia:pending_score');
          return {
            question: parsed.question,
            questionId: parsed.questionId,
            designation: parsed.question.designation || 'practice',
            category: parsed.question.category || 'practice',
          };
        }
      } catch(e) {
        localStorage.removeItem('ia:pending_score');
      }
    }
    // Synchronously load pending homepage featured question before first render.
    // This prevents flash of generic Practice browser UI when user returns after auth.
    const sampleQ = localStorage.getItem('ia_sample_question');
    if (sampleQ) {
      localStorage.removeItem('ia_sample_question');
      try {
        const parsed = JSON.parse(sampleQ);
        return {
          question: parsed,
          questionId: parsed.questionId || 'landing-sample',
          designation: 'sample',
          category: parsed.category || 'sample',
        };
      } catch(e) {
        return {
          question: { q: sampleQ, a: '' },
          questionId: 'landing-sample',
          designation: 'sample',
          category: 'sample',
        };
      }
    }
    // Also check sessionStorage for quick question passed via sessionStorage
    const raw = sessionStorage.getItem('ia:quickQuestion');
    if (raw) {
      sessionStorage.removeItem('ia:quickQuestion');
      try { return JSON.parse(raw); } catch {}
    }
    return null;
  });
  const [practiceStats, setPracticeStats] = useState({});
  const [reportTarget, setReportTarget] = useState(null);
  const [showWelcome, setShowWelcome] = useState(() => {
    const flag = sessionStorage.getItem('ia:welcome');
    if (flag) { sessionStorage.removeItem('ia:welcome'); return true; }
    return false;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  console.log('[PracticeQA] render - practiceQuestion:', practiceQuestion?.questionId, '| question exists:', !!practiceQuestion);

  // Resize listener for isMobile
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Load practice stats for current user
  useEffect(() => {
    console.log('[PracticeQA] user useEffect fired - user:', user?.id);
    if (!user) return;
    supabase
      .from('practice_attempts')
      .select('question_id, score')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return;
        const stats = {};
        for (const row of data) {
          if (!stats[row.question_id]) stats[row.question_id] = { best_score: row.score, attempts: 1 };
          else {
            stats[row.question_id].attempts += 1;
            if (row.score > stats[row.question_id].best_score) stats[row.question_id].best_score = row.score;
          }
        }
        setPracticeStats(stats);
      });
  }, [user]);

  // Handle track selection from modal - load appropriate beginner question
  const handleTrackSelection = (track) => {
    let role = 'pm';
    let level = 'Associate PM';
    let category = 'product';
    let questionsSource = pmQuestions;

    if (track === 'pm') {
      role = 'pm';
      level = 'Associate PM';
      category = 'product';
      const pmQuestionBank = pmQuestions['Associate PM'];
      if (pmQuestionBank && pmQuestionBank.product) {
        const allQuestions = pmQuestionBank.product;
        if (allQuestions.length > 0) {
          const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
          setPracticeQuestion({
            question: randomQuestion,
            questionId: `associate-pm-product-${Math.random().toString(36).substr(2, 9)}`,
            designation: level,
            category: category,
          });
          setShowTrackSelector(false);
          return;
        }
      }
    } else if (track === 'ds') {
      role = 'ds';
      level = 'Data Scientist';
      // Get first available category from Data Scientist
      const dsLevel = pmQuestions['Data Scientist'];
      if (dsLevel) {
        // Find first non-empty category
        const availableCategories = Object.keys(dsLevel).filter(k => Array.isArray(dsLevel[k]) && dsLevel[k].length > 0);
        if (availableCategories.length > 0) {
          const selectedCategory = availableCategories[0];
          const allQuestions = dsLevel[selectedCategory];
          if (allQuestions.length > 0) {
            const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
            setPracticeQuestion({
              question: randomQuestion,
              questionId: `data-scientist-${selectedCategory}-${Math.random().toString(36).substr(2, 9)}`,
              designation: level,
              category: selectedCategory,
            });
            setShowTrackSelector(false);
            return;
          }
        }
      }
    } else if (track === 'consulting') {
      role = 'consulting';
      level = consultingQuestions && consultingQuestions['Analyst'] ? 'Analyst' : (Object.keys(consultingQuestions || {})[0] || 'Analyst');
      // Get first available consulting question
      const consultingLevel = consultingQuestions[level];
      if (consultingLevel && consultingLevel.case_interview) {
        const allQuestions = consultingLevel.case_interview;
        if (allQuestions.length > 0) {
          const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
          setPracticeQuestion({
            question: randomQuestion,
            questionId: `consulting-analyst-${Math.random().toString(36).substr(2, 9)}`,
            designation: level,
            category: 'case_interview',
          });
          setShowTrackSelector(false);
          return;
        }
      }
    }
  };

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const role = ROLES[selectedRole] || ROLES.pm;

    // Build categoryChips dynamically for DS
    let categoryChips;
    if (selectedRole === 'ds') {
      const dsLevel = pmQuestions['Data Scientist'];
      categoryChips = dsLevel ? buildDSCategoryChips(dsLevel) : [];
    } else if (selectedRole === 'consulting') {
      categoryChips = CONSULTING_CATEGORY_CHIPS;
    } else if (selectedRole === 'projectmanagement') {
      categoryChips = PROJECTMANAGEMENT_CATEGORY_CHIPS;
    } else {
      categoryChips = PM_CATEGORY_CHIPS;
    }

    // For DS, dynamically get all category keys from the Data Scientist level
    let dataCats;
    if (selectedRole === 'ds') {
      const dsLevel = pmQuestions['Data Scientist'];
      dataCats = dsLevel ? Object.keys(dsLevel).filter(k => Array.isArray(dsLevel[k])) : [];
    } else if (selectedRole === 'consulting') {
      dataCats = ['case_interview'];
    } else {
      dataCats = ['product', 'behavioral', 'ai', 'ai_technical'];
    }

    let subcategoryFilter = null;
    if (filterCategory) {
      const chip = categoryChips.find(c => c.id === filterCategory);
      if (chip) {
        dataCats = chip.dataKeys;
        subcategoryFilter = chip.subcategory;
      }
    }

    let levelsToShow = role.levels || PM_LEVELS;
    let dsLevelsToShow = null; // For DS, map expLevel to question.level values

    // For DS, map expLevel filter to DS level values
    if (selectedRole === 'ds' && filterExpLevel && role.expLevelChips && role.expLevelChips.length > 0) {
      const chip = role.expLevelChips.find(c => c.id === filterExpLevel);
      if (chip && chip.id) {
        // Map expLevel chip ID to actual question.level values
        const levelMap = {
          'junior_ds': ['junior_ds'],
          'mid_ds': ['mid_ds'],
          'senior_ds': ['senior_ds'],
          'lead_ds': ['lead_ds'],
          'head_ds': ['head_ds'],
        };
        dsLevelsToShow = new Set(levelMap[chip.id] || []);
      }
    }

    // For PM, continue using existing logic
    if (selectedRole !== 'ds' && filterExpLevel && role.expLevelChips && role.expLevelChips.length > 0) {
      const chip = role.expLevelChips.find(c => c.id === filterExpLevel);
      if (chip) {
        const allowed = new Set(chip.levels);
        if (selectedRole === 'pm') allowed.add('Company Prep');
        levelsToShow = (role.levels || PM_LEVELS).filter(l => allowed.has(l));
      }
    }

    const results = [];
    const searchLower = search.toLowerCase();

    for (const level of levelsToShow) {
      const bank = selectedRole === 'consulting' ? consultingQuestions[level] : selectedRole === 'projectmanagement' ? projectManagementQuestions[level] : pmQuestions[level];
      if (!bank) continue;
      for (const cat of dataCats) {
        const questions = bank[cat] || [];
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (search && (isPopularSearch ? !q.q.toLowerCase().includes(searchLower) : (!q.q.toLowerCase().includes(searchLower) && !q.a.toLowerCase().includes(searchLower)))) continue;

          // For DS, filter by question.level if expLevel filter is set
          if (selectedRole === 'ds' && dsLevelsToShow && !dsLevelsToShow.has(q.level)) {
            continue;
          }

          // Difficulty filter
          const effectiveDifficulty = q.difficulty || getDifficulty(level);
          if (filterDifficulty && effectiveDifficulty !== filterDifficulty) continue;

          // Company filter
          if (filterCompany) {
            if (selectedRole === 'consulting') {
              const firms = (q.companies || []).map(c => c.toLowerCase());
              const chipLabel = (CONSULTING_COMPANY_CHIPS.find(c => c.id === filterCompany)?.label || '').toLowerCase();
              if (!firms.some(f => f.includes(chipLabel) || chipLabel.includes(f.split(' ')[0]))) continue;
            } else {
              if (!q.company || q.company.toLowerCase() !== filterCompany.toLowerCase()) continue;
            }
          }

          // Domain filter
          if (filterDomain) {
            if (selectedRole === 'consulting') {
              const chip = CONSULTING_DOMAIN_CHIPS.find(c => c.id === filterDomain);
              if (chip && chip.subcategories) {
                if (!chip.subcategories.includes(q.subcategory)) continue;
              }
            } else {
              if (!q.domain || q.domain.toLowerCase() !== filterDomain.toLowerCase()) continue;
            }
          }

          // Subcategory filter (for Product Design vs Product Strategy)
          if (subcategoryFilter) {
            if (q.subcategory && q.subcategory !== subcategoryFilter) continue;
            // questions with no subcategory pass through (show in both)
          }

          // Career track filter (only for PM)
          if (selectedRole === 'pm' && selectedTrack) {
            const trackLabel = CAREER_TRACK_CHIPS.find(c => c.id === selectedTrack)?.label;
            if (trackLabel && (!q.tracks || !q.tracks.includes(trackLabel))) continue;
          }

          results.push({ key: `${level}-${cat}-${i}`, level, dataCategory: cat, question: q });
        }
      }
    }

    // Sort results by priority only when no search is active
    if (!search || search.trim() === '') {
      results.sort((a, b) => {
        const priorityA = getQuestionPriority(a.question, selectedRole);
        const priorityB = getQuestionPriority(b.question, selectedRole);
        return priorityA - priorityB;
      });
    }

    return results;
  }, [filterCategory, filterExpLevel, filterCompany, filterDomain, filterDifficulty, search, isPopularSearch, practiceStats, selectedRole, selectedTrack]);

  // ── Applied filter tags ────────────────────────────────────────────────────

  const appliedFilterTags = useMemo(() => {
    const role = ROLES[selectedRole] || ROLES.pm;

    // Build categoryChips dynamically for DS
    let categoryChips;
    if (selectedRole === 'ds') {
      const dsLevel = pmQuestions['Data Scientist'];
      categoryChips = dsLevel ? buildDSCategoryChips(dsLevel) : [];
    } else if (selectedRole === 'consulting') {
      categoryChips = CONSULTING_CATEGORY_CHIPS;
    } else if (selectedRole === 'projectmanagement') {
      categoryChips = PROJECTMANAGEMENT_CATEGORY_CHIPS;
    } else {
      categoryChips = PM_CATEGORY_CHIPS;
    }
    const domainChips = selectedRole === 'ds'
      ? DS_DOMAIN_CHIPS
      : selectedRole === 'consulting'
      ? CONSULTING_DOMAIN_CHIPS
      : selectedRole === 'projectmanagement'
      ? PROJECTMANAGEMENT_DOMAIN_CHIPS
      : PM_DOMAIN_CHIPS;

    const tags = [];
    if (filterCategory) tags.push({ key: `cat-${filterCategory}`, label: categoryChips.find(c => c.id === filterCategory)?.label || filterCategory, prefix: 'cat', val: filterCategory });
    // For DS, don't show expLevel in tags since we ignore that filter (show all DS questions regardless)
    if (filterExpLevel && selectedRole !== 'ds') tags.push({ key: `exp-${filterExpLevel}`, label: role.expLevelChips?.find(e => e.id === filterExpLevel)?.label || filterExpLevel, prefix: 'exp', val: filterExpLevel });
    if (filterCompany) tags.push({ key: `cmp-${filterCompany}`, label: filterCompany, prefix: 'cmp', val: filterCompany });
    if (filterDomain) tags.push({ key: `dom-${filterDomain}`, label: domainChips.find(d => d.id === filterDomain)?.label || filterDomain, prefix: 'dom', val: filterDomain });
    if (filterDifficulty) tags.push({ key: `dif-${filterDifficulty}`, label: filterDifficulty, prefix: 'dif', val: filterDifficulty });
    if (selectedTrack && selectedRole === 'pm') tags.push({ key: `trk-${selectedTrack}`, label: CAREER_TRACK_CHIPS.find(c => c.id === selectedTrack)?.label || selectedTrack, prefix: 'trk', val: selectedTrack });
    return tags;
  }, [filterCategory, filterExpLevel, filterCompany, filterDomain, filterDifficulty, selectedRole]);

  const removeFilterTag = (prefix, val) => {
    if (prefix === 'sort') setSortBy(null);
    if (prefix === 'cat') setFilterCategory(null);
    if (prefix === 'exp') setFilterExpLevel(null);
    if (prefix === 'cmp') setFilterCompany(null);
    if (prefix === 'dom') setFilterDomain(null);
    if (prefix === 'dif') setFilterDifficulty(null);
    if (prefix === 'trk') setSelectedTrack(null);
  };

  const clearAllFilters = () => {
    setFilterCategory(null);
    setFilterExpLevel(null);
    setFilterCompany(null);
    setFilterDomain(null);
    setFilterDifficulty(null);
    setSelectedTrack(null);
  };

  const toggleCard = (key) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // ── Practice mode ──────────────────────────────────────────────────────────

  if (practiceQuestion) {
    const currentIdx = filtered.findIndex(f => f.key === practiceQuestion.questionId);
    const nextItem = currentIdx !== -1 && currentIdx < filtered.length - 1 ? filtered[currentIdx + 1] : null;
    const handleNextQuestion = nextItem ? () => setPracticeQuestion({
      question: nextItem.question,
      questionId: nextItem.key,
      designation: nextItem.level,
      category: nextItem.dataCategory,
    }) : null;

    const refreshStats = () => {
      if (!user) return;
      supabase.from('practice_attempts').select('question_id, score').eq('user_id', user.id)
        .then(({ data }) => {
          if (!data) return;
          const stats = {};
          for (const row of data) {
            if (!stats[row.question_id]) stats[row.question_id] = { best_score: row.score, attempts: 1 };
            else { stats[row.question_id].attempts += 1; if (row.score > stats[row.question_id].best_score) stats[row.question_id].best_score = row.score; }
          }
          setPracticeStats(stats);
        });
    };

    return (
      <PracticeMode
        question={practiceQuestion.question}
        questionId={practiceQuestion.questionId}
        designation={practiceQuestion.designation}
        category={practiceQuestion.category}
        user={user}
        profile={profile}
        checkSession={checkSession}
        onSessionUsed={onSessionUsed}
        onNextQuestion={() => { setPracticeQuestion(null); refreshStats(); }}
        onBack={() => { setPracticeQuestion(null); refreshStats(); }}
      />
    );
  }

  // ── Filter props bundle ────────────────────────────────────────────────────

  const filterContentProps = {
    filterCategory, setFilterCategory,
    filterExpLevel, setFilterExpLevel,
    filterCompany, setFilterCompany,
    filterDomain, setFilterDomain,
    filterDifficulty, setFilterDifficulty,
    selectedTrack, setSelectedTrack,
    resultCount: filtered.length,
    onApply: () => setShowFilters(false),
    onClearAll: clearAllFilters,
    selectedRole,
    pmQuestions,
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, overflow: showTrackSelector ? 'hidden' : 'visible' }}>
      <style>{globalStyles}</style>

      {reportTarget && (
        <ReportIssueModal
          questionId={reportTarget}
          user={user}
          onClose={() => setReportTarget(null)}
        />
      )}

      {showTrackSelector && (
        <TrackSelectorModal
          onSelectTrack={handleTrackSelection}
        />
      )}

      {/* Filter panel */}
      {showFilters && isMobile && (
        <BottomSheet open onClose={() => setShowFilters(false)}>
          <FilterContent {...filterContentProps} />
        </BottomSheet>
      )}
      {showFilters && !isMobile && (
        <FilterSidebar open onClose={() => setShowFilters(false)}>
          <FilterContent {...filterContentProps} />
        </FilterSidebar>
      )}

      <div style={{ maxWidth: 860, margin: '0 auto', padding: isMobile ? '20px 16px 60px' : '40px 28px 60px', visibility: showTrackSelector ? 'hidden' : 'visible' }}>

        {/* Welcome banner */}
        {showWelcome && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
            padding: '16px 20px', marginBottom: 24,
            background: C.greenLight, border: `1px solid ${C.greenBorder}`,
            borderRadius: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <div style={{ fontSize: 14, color: C.success, lineHeight: 1.6 }}>
              <strong>Welcome!</strong> Try answering a question below  . tap <strong>'Practice This Question'</strong> on any question to get AI feedback.
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                background: 'none', border: 'none', fontSize: 18, color: C.textMuted,
                cursor: 'pointer', lineHeight: 1, flexShrink: 0, padding: 0,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 400, color: C.text, marginBottom: 6, margin: 0 }}>
            Practice Q&amp;A
          </h2>
          <p style={{ fontSize: 15, color: C.textMuted, margin: '6px 0 0' }}>
            Expert questions across all levels
          </p>
        </div>

        {/* Role selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 16, fontWeight: 500, color: C.text, display: 'block', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            I'm preparing for
          </label>
          <select
            value={selectedRole}
            onChange={e => {
              setSelectedRole(e.target.value);
              setFilterExpLevel(null);
              setFilterCategory(null);
              setSearch('');
              setIsPopularSearch(false);
              setExpandedKeys(new Set());
            }}
            style={{
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '100%' : '240px',
              minWidth: isMobile ? '100%' : '240px',
              height: 48,
              fontSize: 16,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              padding: '12px 16px',
              border: `1.5px solid ${C.border}`,
              borderRadius: 12,
              background: C.bg,
              color: C.text,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${C.textMuted.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
              paddingRight: 40,
            }}
          >
            <option value="pm">{ROLES.pm.label}</option>
            <option value="ds">{ROLES.ds.label}</option>
            <option value="consulting">{ROLES.consulting.label}</option>
            <option value="projectmanagement">{ROLES.projectmanagement.label}</option>
            <optgroup label="Coming Soon">
              <option value="finance" disabled>{ROLES.finance.label}</option>
              <option value="sales" disabled>{ROLES.sales.label}</option>
              <option value="general" disabled>{ROLES.general.label}</option>
            </optgroup>
          </select>
        </div>

        {/* 1. Search bar + Filters button */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: C.bg, border: `1.5px solid ${C.border}`,
            borderRadius: 12, padding: '0 16px',
            height: isMobile ? 48 : 44,
            flex: 1,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setIsPopularSearch(false); setExpandedKeys(new Set()); }}
              placeholder="Search questions..."
              style={{ flex: 1, border: 'none', background: 'transparent', color: C.text, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {search && (
              <button onClick={() => { setSearch(''); setIsPopularSearch(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>

          {/* Filters button */}
          <button
            onClick={() => setShowFilters(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 20px', height: isMobile ? 48 : 44,
              background: appliedFilterTags.length > 0 ? C.greenLight : C.bg,
              border: `1px solid ${appliedFilterTags.length > 0 ? C.greenBorder : C.border}`,
              borderRadius: 8, cursor: 'pointer',
              fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: appliedFilterTags.length > 0 ? C.success : C.text,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
          </button>
        </div>

        {/* Popular keywords chips - separate row */}
        {POPULAR_KEYWORDS[selectedRole] && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span style={{ fontSize: 12, color: '#999999', fontWeight: 500 }}>Popular:</span>
            {POPULAR_KEYWORDS[selectedRole].map(keyword => (
              <button
                key={keyword}
                onClick={() => { setSearch(keyword); setIsPopularSearch(true); setExpandedKeys(new Set()); }}
                style={{
                  padding: '6px 12px',
                  background: '#F0F0F0',
                  border: '1px solid #E0E0E0',
                  borderRadius: 20,
                  fontSize: 12,
                  color: '#333333',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#E8E8E8';
                  e.currentTarget.style.borderColor = '#D0D0D0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#F0F0F0';
                  e.currentTarget.style.borderColor = '#E0E0E0';
                }}
              >
                {keyword}
              </button>
            ))}
          </div>
        )}

        {/* 4. Applied filter tags */}
        {appliedFilterTags.length > 0 && (
          <div className="filter-tags-row" style={{ marginBottom: 12 }}>
            {appliedFilterTags.map(tag => (
              <span key={tag.key} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px',
                background: C.greenLight, border: `1px solid ${C.greenBorder}`,
                borderRadius: 20, fontSize: 12, color: C.success,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {tag.label}
                <button
                  onClick={() => removeFilterTag(tag.prefix, tag.val)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.success, padding: 0, fontSize: 15, lineHeight: 1 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 5. Question list or empty state */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '72px 24px', color: C.textMuted }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: C.text, marginBottom: 10 }}>
              No questions found
            </div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>
              Try adjusting your filters or search something else.
            </div>
            <button
              onClick={() => { setSearch(''); setIsPopularSearch(false); clearAllFilters(); }}
              style={{
                padding: '12px 28px', background: C.green, border: 'none',
                borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((item, displayIndex) => (
              <QuestionCard
                key={item.key}
                question={item.question}
                questionId={item.key}
                index={displayIndex}
                isOpen={expandedKeys.has(item.key)}
                onToggle={() => toggleCard(item.key)}
                onPractice={() => setPracticeQuestion({
                  question: item.question,
                  questionId: item.key,
                  designation: item.level,
                  category: item.dataCategory,
                })}
                practiceData={practiceStats[item.key] || null}
                onReport={() => requireAuth('Sign up to report question issues', () => setReportTarget(item.key))}
                tts={tts}
                user={user}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
