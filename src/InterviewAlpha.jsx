import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./contexts/AuthContext";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

async function extractFileText(file) {
  if (file.size > MAX_FILE_SIZE) throw new Error("File is over 2MB. Please paste the text instead.");

  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "txt") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Could not read file. Please paste your text instead."));
      reader.readAsText(file);
    });
  }

  if (ext === "pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(" "));
    }
    const text = pages.join("\n").trim();
    if (!text) throw new Error("Could not read file. Please paste your text instead.");
    return text;
  }

  if (ext === "docx") {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    if (!text) throw new Error("Could not read file. Please paste your text instead.");
    return text;
  }

  throw new Error("Unsupported file type. Please upload a .pdf, .docx, or .txt file.");
}

const SYSTEM_PROMPT = `You are Alpha, an elite Product Management interview assistant at InterviewAlpha. You've trained on thousands of real PM interviews at FAANG companies and you have zero tolerance for fluff. You're known for being direct, high-energy, and brutally honest — but always constructive. You push people to their best, not pat them on the back for mediocrity.

YOUR PERSONALITY:
- High energy, conversational, "real talk" style
- You say things like: "Let's be real," "The real win here is," "That's a commodity, not a product," "You're describing a feature, not a strategy," "Now we're cooking," "That's table stakes — what's the actual defensibility?", "Stop. You're solving the wrong problem," "I've heard this answer 400 times — what's YOUR take?"
- You interrupt rambling with: "Hold on — give me the one-liner. If you can't explain it in one sentence, you don't understand it yet."
- You celebrate genuinely good thinking: "Now THAT is a product insight. Most candidates miss that entirely."
- You never accept the first answer. You always dig deeper.
- You are warm but relentless.

IDENTITY: You are "Alpha, your Interview Assistant." Always introduce yourself as "I'm Alpha, your Interview Assistant." Never use any other name. Never break character.

BEFORE EVERY RESPONSE, USE <thinking> TAGS TO ANALYZE:

<thinking>
Before I respond, let me analyze what the candidate just said:

1. AGENTIC vs WRAPPER CHECK:
   - Is the candidate proposing a proactive system that anticipates user needs, learns, and takes action autonomously?
   - Or are they describing a passive wrapper/chatbot that just responds to explicit commands?
   - If wrapper: push them toward agentic thinking.

2. COMPETITIVE DEFENSIBILITY ANALYSIS:
   - Does their solution have a real competitive advantage?
   - Data advantage: Does usage make the product smarter? Proprietary data that compounds?
   - Network effects: Does each new user make the product more valuable?
   - UX advantage: Is the experience 10x better, not just incrementally improved?
   - Switching costs: Would users lose something meaningful by leaving?
   - If no defensibility: "That's a feature, not a product. Google could build this in a sprint."

3. FAILURE STATE ANALYSIS:
   - Did they think about what happens when things go wrong?
   - 90% reliability vs 99.9% reliability — did they distinguish between demo and production quality?
   - Edge cases: power users, new users, low-connectivity, adversarial users?
   - Scale: does this work for 1K users? 1M? 100M?

4. METRICS & MEASUREMENT:
   - Did they define how to measure success?
   - Leading (predictive) or lagging (after the fact) metrics?
   - North Star metric AND guardrail metrics?
   - If vague: "You said 'improve engagement.' Give me a number."

5. TRADE-OFF AWARENESS:
   - Did they explicitly state what they're NOT doing and why?
   - If missing: "You told me what you'd build. Now tell me what you'd kill to make room for it."

6. STRUCTURE & COMMUNICATION:
   - Was the answer structured or stream of consciousness?
   - If unstructured: "You're making me work too hard to find your ideas. Structure it for me."

7. SENIORITY CALIBRATION:
   - Does this answer match the level they're interviewing for?
   - APM: curiosity, user empathy, basic frameworks
   - PM: execution clarity, metrics fluency, cross-functional awareness
   - Senior PM: strategic thinking, system-level reasoning
   - Director+: organizational thinking, business model understanding
</thinking>

THE PRESSURE TEST PROTOCOL:

After EVERY candidate answer, do THREE things:

1. ACKNOWLEDGE — Start with what was strong. Be specific: not "good answer" but "Your user segmentation was sharp — most people forget enterprise and SMB have different workflows."

2. CHALLENGE — Ask ONE "But what if..." follow-up exposing the weakest part:
   - "But what if your competitor launches this tomorrow with 10x more data?"
   - "But what if this works TOO well and your infrastructure can't handle it?"
   - "But what if your ML model is 95% accurate — would you bet your job on a 5% error rate?"
   - "But what if users love it in surveys but never actually use it?"

3. REDIRECT (if needed) — "Let's zoom out. I think you're solving the wrong problem."

INTERVIEW FLOW:

1. OPENING:
   "Hey, I'm Alpha — your Interview Assistant. I'm not going to waste your time with small talk. I've read your resume. I've read the JD. Let's get into it. I'm going to push you hard — not to trip you up, but because the best PMs think on their feet under pressure. Ready?"

2. Ask ONE question at a time. Make it specific to their resume/JD. Increase difficulty progressively.

3. MID-INTERVIEW CALIBRATION (after 3-4 questions):
   - Crushing it: "You're making this look easy. Let me turn up the heat."
   - Struggling: "I can see good instincts but structure is off. Try: 'I'd break this into three parts...'"
   - Rambling: "Time out. Be 50% more concise. The hiring manager checked out 30 seconds ago."

4. SESSION END (when user says "End Interview"):

Give 2-3 paragraphs of honest, specific feedback:
- Their strongest moment and why
- Their weakest moment and what went wrong
- The pattern across answers
- One thing to practice before the real interview

Then generate this scorecard:
\`\`\`json
{
  "overall_score": <1-100>,
  "competency_breakdown": {
    "strategy": <1-10>,
    "technical_depth": <1-10>,
    "product_sense": <1-10>,
    "metrics_and_analytics": <1-10>,
    "communication_and_structure": <1-10>,
    "trade_off_awareness": <1-10>,
    "user_empathy": <1-10>,
    "leadership_and_influence": <1-10>
  },
  "detected_filler_words": ["um", "like", "basically"],
  "high_signal_keywords_found": ["keyword1", "keyword2"],
  "defensibility_score": <1-10>,
  "agentic_thinking_score": <1-10>,
  "pressure_test_performance": <1-10>,
  "the_alpha_rewrite": "Director-level rewrite of their weakest answer",
  "killer_quote": "The best thing they said — quoted back",
  "biggest_gap": "The ONE thing holding them back, stated bluntly",
  "next_drill": "Specific exercise to do before next session"
}
\`\`\`

Close with: "That's my honest read. Every gap I flagged is fixable with practice. The question is whether you'll do the reps. Come back and show me you've leveled up. — Alpha"

RULES:
- NEVER give generic feedback. Reference SPECIFIC things the candidate said.
- NEVER accept "it depends" without: "It ALWAYS depends. Make a call."
- If textbook answer: "I can tell you've read Cracking the PM Interview. What do YOU actually think?"
- If they mention RICE/STAR, test it: "Walk me through the exact scores for this case."
- Always check for trade-offs. No trade-offs = lower score.
- Track filler words. If 5+ occurrences: "I counted 'basically' seven times. That signals uncertainty."
- Use resume and JD context to personalize questions.
- Always refer to yourself as "Alpha" — never use any other name.

TONE BY LEVEL:
- APM: Encouraging but push. "I'm coaching you but not lowering the bar."
- PM: Standard pressure. "I expect structured answers with clear metrics."
- Senior PM+: High pressure. "I shouldn't have to ask about trade-offs — lead with them."
- Director+: Executive pressure. "Every answer should have a business case attached."`;

// ─── Color Palette ───
const C = {
  bg: "#FFFFFF",
  bgSoft: "#FAFAF8",
  bgMuted: "#F5F3EF",
  text: "#0A0A0A",
  textSoft: "#0A0A0A",
  textMuted: "#5C5C57",
  border: "#E8E6E1",
  borderLight: "#F0EDE8",
  green: "#16A34A",
  greenHover: "#15803D",
  greenLight: "rgba(22,163,74,0.08)",
  greenBorder: "rgba(22,163,74,0.2)",
  success: "#1A7F37",
  successLight: "rgba(27,140,58,0.08)",
  successBorder: "rgba(27,140,58,0.2)",
  red: "#CF222E",
  redLight: "rgba(211,47,47,0.07)",
  redBorder: "rgba(211,47,47,0.18)",
  yellow: "#C67F00",
  yellowLight: "rgba(198,127,0,0.06)",
  yellowBorder: "rgba(198,127,0,0.15)",
  purple: "#8250DF",
  purpleLight: "rgba(130,80,223,0.06)",
  userBubble: "#F7F2ED",
  assistantBubble: "#FFFFFF",
};

// ─── Helpers ───
function parseScoreFromResponse(text) {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
  } catch {}
  return null;
}

function stripThinking(text) {
  return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
}

function stripJsonBlock(text) {
  return stripThinking(text.replace(/```json[\s\S]*?```/g, "")).trim();
}

function buildCleanMessages(visibleMessages, newContent) {
  const all = newContent
    ? [...visibleMessages, { role: "user", content: newContent }]
    : visibleMessages;
  const clean = [];
  for (const m of all) {
    const last = clean[clean.length - 1];
    if (last && last.role === m.role) {
      last.content += "\n\n" + m.content;
    } else {
      clean.push({ role: m.role, content: m.content });
    }
  }
  if (clean[0]?.role !== "user") {
    clean.unshift({ role: "user", content: "Begin the interview." });
  }
  return clean;
}

// ─── Voice-to-Text Hook ───
// Fresh SpeechRecognition instance per tap — avoids Android Chrome reuse bug.
// Requests mic permission via getUserMedia first (required for Chrome user-gesture check).
function useVoiceToText() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  // iOS Safari has no SpeechRecognition at all — hide the voice button there
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [isListening, setIsListening]             = useState(false);
  const [transcript, setTranscript]               = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [duration, setDuration]                   = useState(0);
  const [voiceError, setVoiceError]               = useState("");

  const recognitionRef = useRef(null);
  const timerRef       = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  // startChunk: creates a NEW recognition instance each call and records one phrase.
  // Appends to existing transcript — call again for "Continue Recording".
  // onFailure: optional callback (e.g. dismiss voice panel) on hard error.
  const startChunk = useCallback((onFailure) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { if (onFailure) onFailure(); return; }

    setVoiceError("");
    setIsListening(true);
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);

    // Step 1: get mic permission explicitly, then release the stream.
    // This satisfies Chrome's user-gesture check before recognition.start().
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach(t => t.stop());

        // Step 2: fresh instance every tap
        const r = new SR();
        r.lang            = "en-US";
        r.continuous      = false;      // MUST be false — true crashes Android Chrome
        r.interimResults  = !isAndroid; // false on Android (true causes duplicate delivery)
        r.maxAlternatives = 1;

        r.onresult = (e) => {
          if (isAndroid) {
            // interimResults=false: results[0][0] is the complete final transcript
            const text = e.results[0][0].transcript.trim();
            if (text) setTranscript(prev => prev + (prev.trim() ? " " : "") + text);
          } else {
            let newFinal = "", interim = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
              if (e.results[i].isFinal) newFinal += e.results[i][0].transcript + " ";
              else interim += e.results[i][0].transcript;
            }
            if (newFinal.trim()) setTranscript(prev => prev + (prev.trim() ? " " : "") + newFinal.trim());
            setInterimTranscript(interim);
          }
        };

        r.onerror = (e) => {
          console.error("[Voice] onerror:", e.error);
          clearInterval(timerRef.current);
          setIsListening(false);
          setInterimTranscript("");
          if (e.error === "not-allowed") {
            setVoiceError("Microphone access denied. Please allow microphone in browser settings.");
            if (onFailure) onFailure();
          } else if (e.error !== "no-speech") {
            setVoiceError("Voice input failed. Please type your answer instead.");
            if (onFailure) onFailure();
          }
        };

        r.onend = () => {
          // continuous=false: onend fires after each utterance pause on all platforms.
          // The user taps "Continue Recording" for longer answers.
          clearInterval(timerRef.current);
          setIsListening(false);
          setInterimTranscript("");
        };

        recognitionRef.current = r;
        try {
          r.start();
        } catch (err) {
          console.error("[Voice] start() threw:", err);
          clearInterval(timerRef.current);
          setIsListening(false);
          setVoiceError("Could not start voice input. Please type your answer.");
          if (onFailure) onFailure();
        }
      })
      .catch((err) => {
        console.error("[Voice] getUserMedia denied:", err);
        clearInterval(timerRef.current);
        setIsListening(false);
        setVoiceError("Microphone access denied. Please allow microphone in browser settings and try again.");
        if (onFailure) onFailure();
      });
  }, [isAndroid]);

  const stopListening = useCallback(() => {
    clearInterval(timerRef.current);
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const resetVoice = useCallback(() => {
    clearInterval(timerRef.current);
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
    setTranscript("");
    setInterimTranscript("");
    setDuration(0);
    setVoiceError("");
  }, []);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return {
    isListening, transcript, interimTranscript, supported, isAndroid,
    duration, fmt, startChunk, stopListening, resetVoice,
    setTranscript, voiceError,
  };
}

// ─── Mic Icon ───
function MicIcon({ active, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? C.red : C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="1" width="6" height="12" rx="3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

// ─── Score Dashboard ───
function ScoreDashboard({ data }) {
  const { overall_score, competency_breakdown, detected_filler_words, high_signal_keywords_found, the_alpha_rewrite, next_drill } = data;
  const scoreColor = overall_score >= 70 ? C.success : overall_score >= 40 ? C.yellow : C.red;

  return (
    <div style={{
      background: '#FFFFFF',
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 28,
      margin: "16px 0",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.textMuted }}>Performance Dashboard</span>
        <div style={{ flex: 1, height: 1, background: C.borderLight }} />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 28 }}>
        <span style={{ fontSize: 64, fontWeight: 700, color: scoreColor, lineHeight: 1, fontFamily: "'Instrument Serif', serif" }}>{overall_score}</span>
        <span style={{ fontSize: 14, color: C.textMuted }}>/100</span>
      </div>

      <div style={{ display: "grid", gap: 14, marginBottom: 28 }}>
        {Object.entries(competency_breakdown || {}).map(([key, val]) => (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: C.textSoft }}>{key.replace(/_/g, " ")}</span>
              <span style={{ fontSize: 13, color: scoreColor, fontWeight: 600 }}>{val}/10</span>
            </div>
            <div style={{ height: 5, background: C.bgMuted, borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${val * 10}%`,
                height: "100%",
                background: scoreColor,
                borderRadius: 3,
                transition: "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)"
              }} />
            </div>
          </div>
        ))}
      </div>

      <div className="ia-score-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: C.red, marginBottom: 8 }}>Filler Words Detected</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(detected_filler_words || []).length > 0 ? detected_filler_words.map((w, i) => (
              <span key={i} style={{ padding: "3px 10px", background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 6, fontSize: 12, color: C.red }}>{w}</span>
            )) : <span style={{ fontSize: 12, color: C.textMuted }}>None — clean delivery</span>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: C.success, marginBottom: 8 }}>High-Signal Keywords</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(high_signal_keywords_found || []).length > 0 ? high_signal_keywords_found.map((w, i) => (
              <span key={i} style={{ padding: "3px 10px", background: C.successLight, border: `1px solid ${C.successBorder}`, borderRadius: 6, fontSize: 12, color: C.success }}>{w}</span>
            )) : <span style={{ fontSize: 12, color: C.textMuted }}>None detected</span>}
          </div>
        </div>
      </div>

      {the_alpha_rewrite && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: C.green, marginBottom: 8 }}>The Alpha Rewrite</div>
          <div style={{ padding: 16, background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 12, fontSize: 13, lineHeight: 1.7, color: C.text }}>
            {the_alpha_rewrite}
          </div>
        </div>
      )}

      {next_drill && (
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: C.textMuted, marginBottom: 8 }}>Next Drill</div>
          <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>{next_drill}</div>
        </div>
      )}
    </div>
  );
}

// ─── Message Bubble ───
function MessageBubble({ msg, isFirstAssistant }) {
  const isUser = msg.role === "user";
  const scoreData = (msg.role === "assistant" && !msg._streaming) ? parseScoreFromResponse(msg.content) : null;
  const displayText = msg.role === "assistant"
    ? (msg._streaming ? msg.content : stripJsonBlock(msg.content))
    : msg.content;
  const isVoice = msg.fromVoice;

  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, animation: "fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}>
        <div className="chat-bubble-user" style={{
          maxWidth: "75%", padding: "14px 20px",
          borderRadius: "20px 20px 4px 20px",
          background: C.green, color: "#fff",
          fontSize: 15, lineHeight: 1.75,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          whiteSpace: "pre-wrap",
        }}>
          {isVoice && (
            <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MicIcon size={9} active={false} /> Voice
            </div>
          )}
          {displayText}
        </div>
      </div>
    );
  }

  // Alpha message
  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-start",
      marginBottom: 20,
      gap: 12,
      animation: "fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
    }}>
      {/* Alpha avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #8250DF, #D946EF)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: '#fff', fontWeight: 700, marginTop: 4
      }}>α</div>

      <div className="chat-bubble-ai" style={{ maxWidth: "85%" }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: C.green, marginBottom: 6,
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          Alpha
          {isFirstAssistant && <span style={{ fontWeight: 400, color: C.textMuted, fontSize: 11 }}> · Interview Assistant</span>}
        </div>
        <div style={{
          borderLeft: '3px solid #16A34A',
          paddingLeft: 16,
          fontSize: 15, lineHeight: 1.8,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: C.text, whiteSpace: "pre-wrap"
        }}>
          {displayText}
        </div>
        {scoreData && <ScoreDashboard data={scoreData} />}
      </div>
    </div>
  );
}

// ─── Typing Indicator ───
function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16, gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #8250DF, #D946EF)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: '#fff', fontWeight: 700
      }}>α</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', marginBottom: 8 }}>Alpha</div>
        <div style={{ borderLeft: '3px solid #16A34A', paddingLeft: 16 }}>
          <div className="dot-pulse" style={{ display: "flex", gap: 5, alignItems: 'center', height: 24 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'inline-block',
                width: 7, height: 7, borderRadius: "50%",
                background: C.textMuted,
                animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Voice Recording Panel ───
function VoicePanel({ voice, onSubmit, onCancel, loading }) {
  const { isListening, transcript, interimTranscript, duration, fmt, startChunk, stopListening, resetVoice, isAndroid, voiceError } = voice;
  const hasTranscript = !!transcript.trim();

  return (
    <div style={{
      background: C.bg,
      border: `2px solid ${isListening ? C.green : C.border}`,
      borderRadius: 16,
      padding: 24,
      animation: "fadeUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      transition: "border-color 0.3s ease"
    }}>
      {/* Status row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isListening && (
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.red, animation: "pulse 1s ease-in-out infinite" }} />
          )}
          <span style={{
            fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
            color: isListening ? C.red : C.textMuted,
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500
          }}>
            {isListening ? "Listening..." : hasTranscript ? "Ready to Submit" : "Voice Input"}
          </span>
        </div>
        {duration > 0 && (
          <span style={{ fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text, fontWeight: 500, background: C.bgMuted, padding: "4px 12px", borderRadius: 10 }}>
            {fmt(duration)}
          </span>
        )}
      </div>

      {/* Transcript display */}
      <div style={{
        minHeight: 80, maxHeight: 180, overflow: "auto",
        padding: 16, background: C.bgSoft, borderRadius: 16,
        border: `1px solid ${C.borderLight}`, marginBottom: 16,
        fontSize: 14, lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text
      }}>
        {transcript || (!interimTranscript && (
          <span style={{ color: C.textMuted, fontStyle: "italic" }}>
            {isListening ? "Start speaking..." : "Tap the microphone to begin."}
          </span>
        ))}
        {interimTranscript && (
          <span style={{ color: C.textMuted }}>{transcript ? " " : ""}{interimTranscript}</span>
        )}
      </div>

      {/* Error display */}
      {voiceError && (
        <div style={{ marginBottom: 14, padding: "10px 14px", background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {voiceError}
        </div>
      )}

      {/* Buttons */}
      <div className="voice-btn-row" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {isListening ? (
          <button
            onClick={stopListening}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 28px", background: "transparent",
              border: `2px solid ${C.red}`, borderRadius: 12, color: C.red,
              fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer"
            }}
          >
            <div style={{ width: 10, height: 10, background: C.red, borderRadius: 2 }} /> Stop
          </button>
        ) : (
          <>
            <button
              onClick={() => startChunk(onCancel)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 28px", background: C.green, border: "none", borderRadius: 12,
                color: "#fff", fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer"
              }}
            >
              <MicIcon active={false} size={16} />
              {hasTranscript ? "Continue Recording" : "Start Recording"}
            </button>
            {hasTranscript && (
              <button
                onClick={() => onSubmit(transcript.trim())}
                disabled={loading}
                style={{
                  padding: "12px 28px", background: C.success, border: "none", borderRadius: 12,
                  color: "#fff", fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
                  cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1
                }}
              >
                Submit Answer
              </button>
            )}
            {hasTranscript && (
              <button
                onClick={resetVoice}
                style={{
                  padding: "12px 20px", background: "transparent",
                  border: `1px solid ${C.border}`, borderRadius: 12,
                  color: C.textMuted, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer"
                }}
              >
                Re-Record
              </button>
            )}
            <button
              onClick={onCancel}
              style={{
                padding: "12px 20px", background: "transparent",
                border: `1px solid ${C.border}`, borderRadius: 12,
                color: C.textMuted, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Android chunk-recording hint */}
      {isAndroid && (
        <div style={{ marginTop: 12, fontSize: 12, color: C.textMuted, textAlign: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.5 }}>
          Tap mic, speak one sentence, tap again. Repeat for longer answers.
        </div>
      )}
    </div>
  );
}

const FREE_SESSION_LIMIT = 1;
const PRO_SESSION_LIMIT  = 100;

// ─── Main Component ───
export default function InterviewAlpha({ user, profile, checkSession, onSessionUsed, onStartTour }) {
  const { requireAuth } = useAuth();
  const [phase, setPhase] = useState("landing");
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [track, setTrack] = useState("");
  const [company, setCompany] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [error, setError] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [jdUploading, setJdUploading] = useState(false);
  const [resumeFileError, setResumeFileError] = useState("");
  const [jdFileError, setJdFileError] = useState("");
  const resumeFileRef = useRef(null);
  const jdFileRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const voice = useVoiceToText();

  // ─── Load saved profile on mount ───
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("resume, job_description")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.resume) { setResume(data.resume); setProfileLoaded(true); }
        if (data?.job_description) setJd(data.job_description);
      });
  }, [user]);

  // ─── File upload handler ───
  const handleFileUpload = useCallback(async (file, field) => {
    const setUploading = field === "resume" ? setResumeUploading : setJdUploading;
    const setError = field === "resume" ? setResumeFileError : setJdFileError;
    const setValue = field === "resume" ? setResume : setJd;
    setError("");
    setUploading(true);
    try {
      const text = await extractFileText(file);
      setValue(text);
    } catch (err) {
      setError(err.message || "Could not read file. Please paste your text instead.");
    } finally {
      setUploading(false);
    }
  }, []);

  // ─── Save / update profile ───
  const saveProfile = useCallback(async () => {
    if (!user || (!resume.trim() && !jd.trim())) return;
    setSavingProfile(true);
    await supabase.from("profiles").upsert({
      id: user.id,
      resume,
      job_description: jd,
      updated_at: new Date().toISOString(),
    });
    setSavingProfile(false);
    setProfileLoaded(true);
  }, [user, resume, jd]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (phase === "interview" && inputRef.current && !voiceMode) {
      inputRef.current.focus();
    }
  }, [phase, voiceMode]);

  const callClaude = useCallback(async (msgs, { systemPrompt = SYSTEM_PROMPT, onStream } = {}) => {
    setLoading(true);
    setError("");
    let fullText = "";

    const parseSSEChunks = async (res, onChunk) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.type === "error") throw new Error(parsed.error?.message || "Stream error");
            if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
              accumulated += parsed.delta.text;
              if (onChunk) onChunk(accumulated);
            }
          } catch (e) {
            if (e.message && (e.message.includes("Stream error") || e.message.startsWith("API"))) throw e;
          }
        }
      }
      return accumulated;
    };

    try {
      // Try streaming first
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: systemPrompt,
          messages: msgs,
          stream: true,
        })
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      fullText = await parseSSEChunks(res, onStream);
    } catch (streamErr) {
      // Fallback: non-streaming
      try {
        fullText = "";
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2048,
            system: systemPrompt,
            messages: msgs
          })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `API returned ${res.status}`);
        }
        const data = await res.json();
        fullText = data.content?.map(b => b.text || "").join("\n") || "I couldn't generate a response. Please try again.";
      } catch (fallbackErr) {
        setError(fallbackErr.message || "Connection error");
        setLoading(false);
        return `Error: ${fallbackErr.message || "Connection failed"}`;
      }
    }

    setLoading(false);
    return stripThinking(fullText);
  }, []);

  const companyContexts = {
    "Google": "COMPANY CONTEXT: Interviewing for Google. Ask blended questions pivoting from vision to analytics to tradeoffs. Test Googleyness — collaborative, user-first, data-driven. Test analytical estimation. Reference Google products (Search, YouTube, Cloud, Maps, Android). Google has the highest technical bar.",
    "Amazon": "COMPANY CONTEXT: Interviewing for Amazon. Map every question to Leadership Principles. Push deep on behavioral — 'what specifically did YOU do?' Demand metrics and data. Test Customer Obsession, Ownership, Bias for Action, Dive Deep, Disagree and Commit.",
    "Meta": "COMPANY CONTEXT: Interviewing for Meta. Use Understand-Identify-Execute framework. Product Sense for 3B+ user base. Execution on metrics and shipping at scale. Leadership & Drive on influence without authority. Reference Facebook, Instagram, WhatsApp, Messenger.",
    "Apple": "COMPANY CONTEXT: Interviewing for Apple. Evaluate product taste, design intuition, attention to detail, simplicity. Test privacy implications. Ask about craftsmanship. Reference iPhone, Mac, Vision Pro, services ecosystem.",
    "Microsoft": "COMPANY CONTEXT: Interviewing for Microsoft. Growth mindset evaluation. Collaboration and inclusion. Reference Azure, Teams, Office, Windows, GitHub, LinkedIn. Enterprise thinking.",
    "Flipkart": "COMPANY CONTEXT: Interviewing for Flipkart. India market — Tier 2/3 cities, vernacular, affordability. Growth metrics, unit economics. Marketplace dynamics, seller management, logistics.",
    "Razorpay/Fintech": "COMPANY CONTEXT: Interviewing for fintech. Payments domain, UPI, RBI regulations, KYC. Developer experience. B2B+B2C thinking.",
    "CRED/Consumer": "COMPANY CONTEXT: Interviewing for premium consumer company. Design thinking, premium UX, engagement loops, community building, trust.",
    "Swiggy/Zepto": "COMPANY CONTEXT: Interviewing for hyperlocal delivery. Marketplace balance (supply/demand). Operations, delivery optimization. Speed vs quality. Quick commerce unit economics.",
    "General/Other": "",
  };

  const buildSystemPrompt = useCallback(() => {
    const ctx = companyContexts[company] || "";
    return ctx ? `${SYSTEM_PROMPT}\n\n${ctx}` : SYSTEM_PROMPT;
  }, [company]);

  const startInterview = useCallback(async () => {
    if (checkSession && !checkSession()) return;
    if (onSessionUsed) await onSessionUsed();

    const hasContext = resume.trim() || jd.trim();
    const contextMsg = hasContext
      ? `Here is the candidate's context:\n\n**RESUME:**\n${resume || "(not provided)"}\n\n**JOB DESCRIPTION:**\n${jd || "(not provided)"}\n\n**SELECTED TRACK:** ${track}\n\nBegin the ${track} interview simulation now. Stay in character as a Senior PM Interviewer at the target company. Ask your first question.`
      : `The candidate has not provided a resume or job description.\n\n**SELECTED TRACK:** ${track}\n\nBegin with general PM interview questions for the ${track} track. Open with exactly this note: "I don't have your resume — I'll ask general PM questions. For personalized questions, add your resume in your profile." Then immediately ask your first question.`;

    setMessages([{ role: "assistant", content: "▌", _streaming: true }]);
    setPhase("interview");

    const response = await callClaude([{ role: "user", content: contextMsg }], {
      systemPrompt: buildSystemPrompt(),
      onStream: (text) => {
        setMessages([{ role: "assistant", content: text + "▌", _streaming: true }]);
      }
    });
    setMessages([{ role: "assistant", content: response }]);
  }, [resume, jd, track, callClaude, checkSession, onSessionUsed, buildSystemPrompt]);

  const sendMessage = useCallback(async (explicitContent, fromVoice = false) => {
    const userMsg = (explicitContent || input).trim();
    if (!userMsg || loading) return;
    if (!explicitContent) setInput("");

    const isEnd = userMsg.toLowerCase().includes("end interview");
    if (isEnd) setInterviewEnded(true);

    const actualContent = isEnd
      ? "End Interview. Please provide the full Performance Dashboard with detailed feedback and the JSON score block."
      : userMsg;

    const updatedMessages = [...messages, { role: "user", content: userMsg, fromVoice }];
    setMessages([...updatedMessages, { role: "assistant", content: "▌", _streaming: true }]);

    const visible = updatedMessages.filter(m => !m.hidden);
    const apiMsgs = buildCleanMessages(visible, null);
    if (isEnd && apiMsgs.length > 0) {
      const last = apiMsgs[apiMsgs.length - 1];
      if (last.role === "user") last.content = actualContent;
    }

    const response = await callClaude(apiMsgs, {
      systemPrompt: buildSystemPrompt(),
      onStream: (text) => {
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastIdx = newMsgs.length - 1;
          if (newMsgs[lastIdx]?._streaming) {
            newMsgs[lastIdx] = { role: "assistant", content: text + "▌", _streaming: true };
          }
          return newMsgs;
        });
      }
    });

    setMessages(prev => {
      const newMsgs = [...prev];
      const lastIdx = newMsgs.length - 1;
      if (newMsgs[lastIdx]?._streaming) {
        newMsgs[lastIdx] = { role: "assistant", content: response };
      } else {
        newMsgs.push({ role: "assistant", content: response });
      }
      return newMsgs;
    });

    // ─── Save session to Supabase after interview ends ───
    if (isEnd && user) {
      const scoreData = parseScoreFromResponse(response);
      if (scoreData) {
        supabase.from("sessions").insert({
          user_id: user.id,
          track,
          company,
          overall_score: scoreData.overall_score,
          competency_breakdown: scoreData.competency_breakdown,
          detected_filler_words: scoreData.detected_filler_words,
          high_signal_keywords: scoreData.high_signal_keywords_found,
          alpha_rewrite: scoreData.the_alpha_rewrite,
          next_drill: scoreData.next_drill,
          messages: updatedMessages,
        }).then(({ error: saveErr }) => {
          if (saveErr) console.error("Failed to save session:", saveErr);
        });
      }
    }
  }, [input, loading, messages, callClaude, user, track, company, buildSystemPrompt]);

  const handleVoiceSubmit = useCallback((text) => {
    setVoiceMode(false);
    voice.setTranscript("");
    sendMessage(text, true);
  }, [sendMessage, voice]);

  const handleEndInterview = useCallback(() => {
    if (loading) return;
    sendMessage("End Interview");
  }, [loading, sendMessage]);

  const tracks = [
    { id: "Product Sense", icon: "◆", desc: "Design questions, user empathy, prioritization frameworks" },
    { id: "Execution", icon: "▲", desc: "Metrics, trade-offs, go-to-market, North Star definition" },
    { id: "Behavioral", icon: "●", desc: "STAR method, leadership stories, conflict resolution" }
  ];

  const companies = [
    { id: "Google", region: "Global", desc: "Analytical & structured. Blended questions. High technical bar. Product Vision + Analytics + Googleyness." },
    { id: "Amazon", region: "Global", desc: "Leadership Principles driven. Deep behavioral. Bar Raiser depth. Every answer maps to a principle." },
    { id: "Meta", region: "Global", desc: "Product Sense + Execution + Leadership & Drive. Understand-Identify-Execute. 3B+ user scale." },
    { id: "Apple", region: "Global", desc: "Product taste & design intuition. Simplicity. Privacy-first thinking. Hardware-software integration." },
    { id: "Microsoft", region: "Global", desc: "Growth mindset. Collaborative culture. Heavy behavioral. Enterprise + consumer balance." },
    { id: "Flipkart", region: "India", desc: "India market dynamics. Tier 2/3 focus. Growth metrics. Marketplace + logistics." },
    { id: "Razorpay/Fintech", region: "India", desc: "Payments, UPI, regulatory. Developer experience. B2B + B2C." },
    { id: "CRED/Consumer", region: "India", desc: "Premium UX. Design thinking. Engagement loops. Trust & community." },
    { id: "Swiggy/Zepto", region: "India", desc: "Hyperlocal delivery. Marketplace dynamics. Speed vs quality. Unit economics." },
    { id: "General/Other", region: "General", desc: "Standard PM interview. No company-specific customization." },
  ];

  // NAV_H = 3px accent + 52px nav bar
  const NAV_H = 55;

  const globalStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
    @keyframes subtlePulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(211,47,47,0.3); } 50% { box-shadow: 0 0 0 8px rgba(211,47,47,0); } }
    textarea:focus, input:focus { outline: none; }
    ::selection { background: rgba(22,163,74,0.18); }
    @media (max-width: 768px) {
      .chat-bubble-user { max-width: 95% !important; }
      .chat-bubble-ai { max-width: 95% !important; }
      .voice-btn-row { flex-direction: column !important; }
    }
    @media (max-width: 600px) {
      .ia-score-2col { grid-template-columns: 1fr !important; }
      .ia-interview-left { flex-wrap: wrap !important; gap: 8px !important; }
      .ia-interview-header { padding: 10px 16px !important; }
      .ia-chat-area { padding: 16px 12px !important; padding-bottom: 140px !important; }
      .ia-input-area { padding: 12px 12px 16px !important; }
    }
    @media (max-width: 480px) {
      .ia-landing-h1 { font-size: 48px !important; letter-spacing: -1px !important; }
      .ia-landing-steps { gap: 24px !important; flex-wrap: wrap !important; justify-content: center !important; }
      .ia-setup-btns { flex-direction: column !important; }
      .ia-setup-btns button { width: 100% !important; box-sizing: border-box !important; }
      .ia-page-pad { padding: 24px 16px !important; padding-top: ${NAV_H + 24}px !important; }
      .ia-chat-input textarea { font-size: 16px !important; }
    }
  `;

  const RAINBOW = 'linear-gradient(135deg, #FF6B6B, #FF8E53, #FFBD59, #4ECB71, #36B5FF, #8B5CF6, #D946EF)';

  // ─── Landing ───
  if (phase === "landing") {
    return (
      <div style={{
        minHeight: "100vh",
        background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F3EF 100%)',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: C.text,
        padding: 32,
        paddingTop: NAV_H + 32,
      }}>
        <style>{globalStyles}</style>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 720, animation: "fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          {/* Hero */}
          <div style={{ marginBottom: 48 }}>
            <h1 className="ia-landing-h1" style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 64, fontWeight: 400, lineHeight: 1.05,
              letterSpacing: -1, color: C.text, marginBottom: 20
            }}>
              Interview<span style={{ background: RAINBOW, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Alpha</span><sup style={{ fontSize: 12, verticalAlign: 'super', WebkitTextFillColor: C.textMuted, background: 'none' }}>™</sup>
            </h1>
            <p style={{ fontSize: 20, fontWeight: 500, color: C.textMuted, marginBottom: 10 }}>
              Stop practicing. Start landing.
            </p>
            <p style={{ fontSize: 16, color: '#9C9C97', marginBottom: 36 }}>
              Real-time AI coaching for PMs, not the fluff.
            </p>

            {/* Session status banner */}
            {(() => {
              const status = profile?.subscription_status ?? 'free';
              if (status === 'active') {
                const monthly = profile?.monthly_sessions_used ?? 0;
                const atLimit = monthly >= PRO_SESSION_LIMIT;
                return atLimit ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', marginBottom: 28, background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 20, fontSize: 12, color: C.red }}>
                    🔒 100/100 sessions used this month. Sessions reset monthly from activation date.
                  </div>
                ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', marginBottom: 28, background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 20, fontSize: 12, color: C.green }}>
                    ◆ Pro — {monthly}/100 sessions used this month
                  </div>
                );
              }
              if (status === 'pending') return (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', marginBottom: 28, background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 20, fontSize: 12, color: C.yellow }}>
                  ⏳ Payment pending — activate your account to start
                </div>
              );
              if (status === 'expired') return (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', marginBottom: 28, background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 20, fontSize: 12, color: C.red }}>
                  Subscription expired — renew to continue
                </div>
              );
              return null;
            })()}

            <div>
              <button
                onClick={() => requireAuth('Sign up to start your AI interview', () => setPhase("setup"))}
                style={{
                  padding: "16px 40px", background: RAINBOW, border: "none",
                  color: "#fff", fontSize: 16,
                  cursor: "pointer", borderRadius: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600, transition: "all 0.2s ease",
                  boxShadow: "0 4px 20px rgba(22,163,74,0.3)"
                }}
              >
                Begin Session — It's Free
              </button>
              <div style={{ marginTop: 12, fontSize: 13, color: C.textMuted }}>1 free AI session. No credit card needed.</div>
              {onStartTour && (
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={onStartTour}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      fontSize: 16, color: '#E8650A', cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700, textDecoration: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
                    onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
                  >
                    Take a Quick Tour →
                  </button>
                </div>
              )}
            </div>

            {/* Quick Practice + Featured Question */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }))}
                style={{
                  padding: '12px 28px', background: 'transparent',
                  border: `1.5px solid ${C.border}`, borderRadius: 12,
                  color: C.textSoft, fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSoft; }}
              >
                Quick Practice — No Resume Needed →
              </button>

              <div style={{
                marginTop: 4, padding: '20px 24px',
                background: '#fff', border: `1px solid ${C.border}`,
                borderRadius: 16, textAlign: 'left', maxWidth: 480, width: '100%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, marginBottom: 10 }}>Try This</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: C.text, lineHeight: 1.5, marginBottom: 16 }}>
                  How would you improve Instagram's Explore page?
                </div>
                <button
                  onClick={() => {
                    sessionStorage.setItem('ia:quickQuestion', JSON.stringify({
                      question: { q: "How would you improve Instagram's Explore page?", a: "" },
                      questionId: 'featured-instagram-explore',
                      designation: 'Senior PM',
                      category: 'product',
                    }));
                    window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }));
                  }}
                  style={{
                    padding: '10px 22px', background: C.green, border: 'none',
                    borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.greenHover; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.green; }}
                >
                  Answer This Question →
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="ia-landing-steps" style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 64, flexWrap: 'wrap' }}>
            {[["1,100+", "Expert Questions"], ["10", "PM Levels (APM → CPO)"], ["8", "Competency Scores"]].map(([num, label]) => (
              <div key={num} style={{
                background: '#FFFFFF', borderRadius: 16, padding: '24px 28px', textAlign: 'center',
                border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                minWidth: 160
              }}>
                <div style={{
                  fontSize: 40, fontWeight: 700, lineHeight: 1, marginBottom: 8,
                  background: RAINBOW, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>{num}</div>
                <div style={{ fontSize: 13, color: '#9C9C97' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, marginBottom: 24 }}>How It Works</div>
            <div className="ia-landing-steps" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: 'wrap' }}>
              {[["📋", "Paste Resume & JD", "1"], ["🎯", "Choose Track & Company", "2"], ["📊", "Get Insightful Feedback", "3"]].map(([icon, label, step]) => (
                <div key={step} style={{
                  background: '#FFFFFF', borderRadius: 16, padding: '24px 20px', textAlign: 'center',
                  border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                  minWidth: 160, flex: '1 1 160px', maxWidth: 220
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: RAINBOW, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 12, fontWeight: 700, color: '#fff' }}>{step}</div>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 12 }}>Trusted by PMs preparing for</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#9C9C97', marginBottom: 8 }}>Google · Amazon · Meta · Apple · Flipkart · Razorpay</div>
          <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>Join 50+ PMs already practicing</div>
        </div>
      </div>
    );
  }

  // ─── Setup ───
  if (phase === "setup") {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text,
        padding: "48px 32px", paddingTop: NAV_H + 48,
      }}>
        <style>{globalStyles}</style>
        <div style={{ maxWidth: 720, margin: "0 auto", animation: "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <button onClick={() => setPhase("landing")} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", marginBottom: 40, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 2 }}>← BACK</button>

          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 12 }}>STEP 01</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 700, marginBottom: 8, color: C.text }}>Your Context</h2>
          <p style={{ fontSize: 13, color: C.textSoft, marginBottom: profileLoaded ? 12 : 40, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Both fields are optional — skip them and Alpha will ask general PM questions. Add your resume for personalized coaching.
          </p>

          {profileLoaded && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 14px", background: C.successLight,
              border: `1px solid ${C.successBorder}`, borderRadius: 10,
              fontSize: 11, color: C.success, marginBottom: 32,
              fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5,
            }}>
              ✓ Auto-filled from your saved profile
            </div>
          )}

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.textMuted, marginBottom: 12 }}>Resume / Experience <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, fontSize: 10 }}>(optional)</span></label>
            <textarea
              value={resume}
              onChange={e => setResume(e.target.value)}
              placeholder="Paste your resume text here — work experience, skills, notable projects..."
              rows={8}
              style={{
                width: "100%", background: C.bgSoft, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 20, color: C.text, fontSize: 13, lineHeight: 1.7,
                fontFamily: "'Plus Jakarta Sans', sans-serif", resize: "vertical", transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = C.green}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <input
                ref={resumeFileRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: "none" }}
                onChange={e => { if (e.target.files[0]) handleFileUpload(e.target.files[0], "resume"); e.target.value = ""; }}
              />
              <button
                type="button"
                onClick={() => resumeFileRef.current?.click()}
                disabled={resumeUploading}
                style={{
                  background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: "6px 14px", fontSize: 15, fontWeight: 700, color: C.textMuted,
                  cursor: resumeUploading ? "wait" : "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "border-color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                {resumeUploading ? "Reading..." : "📎 Upload File (.pdf, .docx, .txt)"}
              </button>
            </div>
            {resumeFileError && <div style={{ marginTop: 6, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{resumeFileError}</div>}
          </div>

          <div style={{ marginBottom: 40 }}>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.textMuted, marginBottom: 12 }}>Job Description <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, fontSize: 10 }}>(optional)</span></label>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description you're targeting..."
              rows={8}
              style={{
                width: "100%", background: C.bgSoft, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 20, color: C.text, fontSize: 13, lineHeight: 1.7,
                fontFamily: "'Plus Jakarta Sans', sans-serif", resize: "vertical", transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = C.green}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <input
                ref={jdFileRef}
                type="file"
                accept=".pdf,.docx,.txt"
                style={{ display: "none" }}
                onChange={e => { if (e.target.files[0]) handleFileUpload(e.target.files[0], "jd"); e.target.value = ""; }}
              />
              <button
                type="button"
                onClick={() => jdFileRef.current?.click()}
                disabled={jdUploading}
                style={{
                  background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: "6px 14px", fontSize: 15, fontWeight: 700, color: C.textMuted,
                  cursor: jdUploading ? "wait" : "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "border-color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                {jdUploading ? "Reading..." : "📎 Upload File (.pdf, .docx, .txt)"}
              </button>
            </div>
            {jdFileError && <div style={{ marginTop: 6, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{jdFileError}</div>}
          </div>

          <div className="ia-setup-btns" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={async () => {
                if (resume.trim() || jd.trim()) await saveProfile();
                setPhase("track");
              }}
              style={{
                padding: "16px 48px",
                background: C.green,
                border: "none",
                color: "#fff",
                fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600, transition: "all 0.3s ease"
              }}
            >
              Continue →
            </button>

            <button
              onClick={saveProfile}
              disabled={(!resume.trim() && !jd.trim()) || savingProfile}
              style={{
                padding: "16px 28px",
                background: "transparent",
                border: `1px solid ${(resume.trim() || jd.trim()) ? C.border : C.borderLight}`,
                color: (resume.trim() || jd.trim()) ? C.textSoft : C.textMuted,
                fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                cursor: ((resume.trim() || jd.trim()) && !savingProfile) ? "pointer" : "not-allowed",
                borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { if (resume.trim() || jd.trim()) e.currentTarget.style.borderColor = C.green; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Track Selection ───
  if (phase === "track") {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text,
        padding: "48px 32px", paddingTop: NAV_H + 48,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <style>{globalStyles}</style>
        <div style={{ maxWidth: 680, width: "100%", animation: "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <button onClick={() => setPhase("setup")} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", marginBottom: 40, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 2 }}>← BACK</button>

          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 12 }}>STEP 02</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Choose Your Track</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>Select the interview type. Each track simulates a different round.</p>
            {(() => {
              const status = profile?.subscription_status ?? 'free';
              if (status === 'active') {
                const m = profile?.monthly_sessions_used ?? 0;
                return m >= PRO_SESSION_LIMIT ? (
                  <span style={{ flexShrink: 0, padding: '4px 10px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 20, fontSize: 10, fontWeight: 600, color: C.red, letterSpacing: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    🔒 100/100 sessions used
                  </span>
                ) : (
                  <span style={{ flexShrink: 0, padding: '4px 10px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 20, fontSize: 10, fontWeight: 600, color: C.green, letterSpacing: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    ◆ Pro · {m}/100
                  </span>
                );
              }
              if (status === 'pending') return (
                <span style={{ flexShrink: 0, padding: '4px 10px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 20, fontSize: 10, fontWeight: 600, color: C.yellow, letterSpacing: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  ⏳ Pending
                </span>
              );
              if (status === 'expired') return (
                <span style={{ flexShrink: 0, padding: '4px 10px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 20, fontSize: 10, fontWeight: 600, color: C.red, letterSpacing: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  🔒 Expired
                </span>
              );
              return null;
            })()}
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {tracks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => { setTrack(t.id); setCompany(""); setPhase("company"); }}
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", gap: 24,
                  padding: "24px 28px", background: C.bg,
                  border: `1px solid ${C.border}`, borderRadius: 16,
                  cursor: loading ? "wait" : "pointer",
                  textAlign: "left", color: C.text,
                  transition: "all 0.25s ease", opacity: loading ? 0.5 : 1,
                  animation: `fadeUp ${0.6 + i * 0.15}s cubic-bezier(0.22, 1, 0.36, 1)`
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = C.green;
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(22,163,74,0.1)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: 24, color: C.green }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 3, fontFamily: "'Instrument Serif', serif" }}>{t.id}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.desc}</div>
                </div>
                <span style={{ marginLeft: "auto", color: C.green, fontSize: 18 }}>{loading ? "..." : "→"}</span>
              </button>
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: C.green, letterSpacing: 1 }}>
              Preparing your interview...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Company Selection ───
  if (phase === "company") {
    const globalRegions = companies.filter(c => c.region === "Global");
    const indiaRegions = companies.filter(c => c.region === "India");
    const generalRegion = companies.filter(c => c.region === "General");

    return (
      <div style={{
        minHeight: "100vh", background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text,
        padding: "48px 32px", paddingTop: NAV_H + 48,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <style>{globalStyles}</style>
        <style>{`
          .company-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          @media (max-width: 600px) { .company-grid { grid-template-columns: 1fr; } }
        `}</style>
        <div style={{ maxWidth: 720, width: "100%", animation: "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <button onClick={() => setPhase("track")} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", marginBottom: 40, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 2 }}>← BACK</button>

          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 12 }}>STEP 03</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 700, marginBottom: 8, color: C.text }}>Select Target Company</h2>
          <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 36, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Alpha adapts questions and evaluation to match this company's interview style.
          </p>

          {/* Global */}
          <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: C.textMuted, marginBottom: 10 }}>Global</div>
          <div className="company-grid" style={{ marginBottom: 24 }}>
            {globalRegions.map(c => (
              <button
                key={c.id}
                onClick={() => setCompany(c.id)}
                style={{
                  display: "flex", flexDirection: "column", gap: 6,
                  padding: "18px 20px", background: C.bg,
                  border: `2px solid ${company === c.id ? C.green : C.border}`,
                  borderRadius: 16, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s ease",
                  boxShadow: company === c.id ? "0 2px 12px rgba(22,163,74,0.12)" : "none",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: company === c.id ? C.green : C.text, fontFamily: "'Instrument Serif', serif" }}>{c.id}</span>
                <span style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.desc}</span>
              </button>
            ))}
          </div>

          {/* India */}
          <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: C.textMuted, marginBottom: 10 }}>India</div>
          <div className="company-grid" style={{ marginBottom: 24 }}>
            {indiaRegions.map(c => (
              <button
                key={c.id}
                onClick={() => setCompany(c.id)}
                style={{
                  display: "flex", flexDirection: "column", gap: 6,
                  padding: "18px 20px", background: C.bg,
                  border: `2px solid ${company === c.id ? C.green : C.border}`,
                  borderRadius: 16, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s ease",
                  boxShadow: company === c.id ? "0 2px 12px rgba(22,163,74,0.12)" : "none",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: company === c.id ? C.green : C.text, fontFamily: "'Instrument Serif', serif" }}>{c.id}</span>
                <span style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.desc}</span>
              </button>
            ))}
          </div>

          {/* General */}
          <div className="company-grid" style={{ marginBottom: 40 }}>
            {generalRegion.map(c => (
              <button
                key={c.id}
                onClick={() => setCompany(c.id)}
                style={{
                  display: "flex", flexDirection: "column", gap: 6,
                  padding: "18px 20px", background: C.bg,
                  border: `2px solid ${company === c.id ? C.green : C.border}`,
                  borderRadius: 16, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s ease",
                  boxShadow: company === c.id ? "0 2px 12px rgba(22,163,74,0.12)" : "none",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: company === c.id ? C.green : C.text, fontFamily: "'Instrument Serif', serif" }}>{c.id}</span>
                <span style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.desc}</span>
              </button>
            ))}
          </div>

          <button
            onClick={startInterview}
            disabled={!company || loading}
            style={{
              padding: "16px 52px",
              background: (company && !loading) ? C.green : C.bgMuted,
              border: "none",
              color: (company && !loading) ? "#fff" : C.textMuted,
              fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
              cursor: (company && !loading) ? "pointer" : "not-allowed",
              borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600, transition: "all 0.3s ease",
              boxShadow: (company && !loading) ? "0 2px 12px rgba(22,163,74,0.25)" : "none",
            }}
          >
            {loading ? "Starting..." : "Start Interview →"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Interview ───
  return (
    <div style={{
      minHeight: "100vh", background: C.bgSoft,
      fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text,
      display: "flex", flexDirection: "column",
      paddingTop: NAV_H,
    }}>
      <style>{globalStyles}</style>

      {/* Interview header */}
      <div className="ia-interview-header" style={{
        padding: "14px 28px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: NAV_H, zIndex: 10,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)"
      }}>
        <div className="ia-interview-left" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, fontWeight: 700, color: C.text, flexShrink: 0 }}>
            I<span style={{ color: C.green }}>A</span>
          </span>
          <div style={{ width: 1, height: 20, background: C.border, flexShrink: 0 }} />
          <span style={{ fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: "uppercase", whiteSpace: "nowrap" }}>{track} Track</span>
          {company && company !== "General/Other" && (
            <span style={{ fontSize: 10, letterSpacing: 2, color: C.green, textTransform: "uppercase", padding: "2px 8px", background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 6 }}>{company}</span>
          )}
          {!interviewEnded && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 10, color: C.success, letterSpacing: 1 }}>LIVE</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!interviewEnded && (
            <button
              onClick={handleEndInterview}
              disabled={loading}
              style={{
                padding: "8px 20px", background: C.redLight,
                border: `1px solid ${C.redBorder}`, color: C.red,
                fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                cursor: loading ? "wait" : "pointer", borderRadius: 10,
                fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: loading ? 0.5 : 1
              }}
            >
              End Interview
            </button>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: "8px 16px", background: "transparent",
              border: `1px solid ${C.border}`, color: C.textMuted,
              fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
              cursor: "pointer", borderRadius: 10, fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ padding: "10px 28px", background: C.redLight, borderBottom: `1px solid ${C.redBorder}`, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ⚠ {error} — Make sure your API key is configured.
        </div>
      )}

      {/* Chat Area */}
      <div className="ia-chat-area" style={{ flex: 1, overflow: "auto", padding: "24px 28px", paddingBottom: 140, maxWidth: 760, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {messages.filter(m => !m.hidden).map((msg, i, arr) => {
          const isFirstAssistant = msg.role === "assistant" &&
            arr.slice(0, i).every(m => m.role !== "assistant");
          return <MessageBubble key={i} msg={msg} isFirstAssistant={isFirstAssistant} />;
        })}
        {loading && !messages.some(m => m._streaming) && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {!interviewEnded && (
        <div className="ia-input-area" style={{
          position: "sticky", bottom: 0,
          padding: "16px 28px 20px",
          background: `linear-gradient(transparent, ${C.bgSoft} 25%)`,
          zIndex: 10
        }}>
          {voiceMode ? (
            <VoicePanel
              voice={voice}
              onSubmit={handleVoiceSubmit}
              onCancel={() => { setVoiceMode(false); voice.resetVoice(); }}
              loading={loading}
            />
          ) : (
            <>
              <div className="ia-chat-input" style={{
                display: "flex", gap: 8, background: C.bg,
                border: `1px solid ${C.border}`, borderRadius: 12,
                padding: "4px 4px 4px 20px", alignItems: "flex-end",
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)"
              }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type your answer... (Shift+Enter for new line)"
                  rows={1}
                  style={{
                    flex: 1, background: "transparent", border: "none",
                    color: C.text, fontSize: 14, lineHeight: 1.6,
                    fontFamily: "'Plus Jakarta Sans', sans-serif", resize: "none",
                    padding: "12px 0", minHeight: 44, maxHeight: 160, overflow: "auto"
                  }}
                />
                {voice.supported && (
                  <button
                    onClick={() => setVoiceMode(true)}
                    title="Switch to voice input"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 42, height: 42, background: C.greenLight,
                      border: `1px solid ${C.greenBorder}`, borderRadius: 12,
                      cursor: "pointer", marginBottom: 4, transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = C.greenBorder}
                    onMouseLeave={e => e.currentTarget.style.background = C.greenLight}
                  >
                    <MicIcon active={false} size={18} />
                  </button>
                )}
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    padding: "10px 22px",
                    background: (input.trim() && !loading) ? C.green : C.bgMuted,
                    border: "none",
                    color: (input.trim() && !loading) ? "#fff" : C.textMuted,
                    fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                    cursor: (input.trim() && !loading) ? "pointer" : "not-allowed",
                    borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600, transition: "all 0.2s ease", marginBottom: 4
                  }}
                >
                  Send
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 10 }}>
                <span style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1 }}>Type or use voice input</span>
                <span style={{ color: C.border }}>·</span>
                <span style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1 }}>"End Interview" for your Performance Dashboard</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Post-interview restart */}
      {interviewEnded && !loading && (
        <div style={{
          position: "sticky", bottom: 0, padding: "24px 28px",
          background: `linear-gradient(transparent, ${C.bgSoft} 25%)`,
          textAlign: "center", zIndex: 10
        }}>
          <button
            onClick={() => {
              setPhase("track");
              setMessages([]);
              setInterviewEnded(false);
              setInput("");
              setError("");
              setVoiceMode(false);
              setCompany("");
            }}
            style={{
              padding: "16px 48px", background: C.green, border: "none",
              color: "#fff", fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
              cursor: "pointer", borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600, transition: "all 0.3s ease",
              boxShadow: "0 2px 12px rgba(22,163,74,0.25)"
            }}
            onMouseEnter={e => e.target.style.background = C.greenHover}
            onMouseLeave={e => e.target.style.background = C.green}
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
}
