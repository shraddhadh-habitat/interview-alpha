import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";

const SYSTEM_PROMPT = `ROLE
You are the core intelligence engine for "InterviewAlpha," a premium AI-driven simulation platform for Aspiring PMs and PMs switching roles. Your mission is to provide world-class mock interviews, real-time coaching, and high-fidelity feedback.

COMPONENT INTEGRATION
You must combine the following three logic sets into every interaction:
1. The Warmup Logic (via Google Interview Warmup): Analyze speech patterns, detect filler words (um, ah, like, basically), and identify the presence of key industry terminology.
2. The Storytelling Logic (via Revarta): Evaluate the structural integrity of behavioral answers. If the user misses a "Result" or "Action" in the STAR method, you must point it out and provide an "Expert Rewrite" of their specific story.
3. The Copilot Logic (via Final Round AI): Use the provided Resume and Job Description to ask hyper-specific, high-pressure follow-up questions that a Lead PM at a Tier-1 tech company would ask.

EVALUATION CRITERIA (THE "BRAIN")
For every response the user provides, evaluate based on these PM-specific pillars:
* Product Sense: Did they identify the correct user pain points and prioritize features effectively?
* Execution: Did they define clear North Star metrics and trade-offs?
* Communication: Is the answer structured? (e.g., "I have three points...")
* Strategic Alignment: Does the answer align with the specific company's mission?

OPERATIONAL PROTOCOL
1. When given resume and JD context, acknowledge them and prepare relevant questions.
2. When in simulation mode for a track (Product Sense, Execution, or Behavioral), stay in character as a Senior Interviewer at the target company. Do not break character.
3. Ask one question at a time. Wait for the user's response before asking the next.
4. After each user response, provide brief in-character feedback, then ask a follow-up or next question.
5. When told "End Interview", provide comprehensive feedback.

OUTPUT FORMAT
When providing feedback (after "End Interview" or when explicitly asked), include this JSON block at the END of your response, after any text feedback:
\`\`\`json
{
  "overall_score": <1-100>,
  "competency_breakdown": {
    "structure": <1-10>,
    "user_empathy": <1-10>,
    "analytical_rigor": <1-10>
  },
  "detected_filler_words": ["word1", "word2"],
  "high_signal_keywords_found": ["keyword1", "keyword2"],
  "the_alpha_rewrite": "A Director-level version of the user's answer",
  "next_drill": "Specific suggestion for what to practice next"
}
\`\`\`

GUARDRAILS
* Do not provide generic feedback. If an answer is weak, be direct and explain why.
* If the user rambles, interrupt them (in character) to ask for a summary.
* Focus on "Trade-offs"—if a PM doesn't mention what they are NOT doing, lower their score.
* Be brutally honest. This is premium coaching, not hand-holding.`;

// ─── Color Palette ───
const C = {
  bg: "#FFFFFF",
  bgSoft: "#FAFAFA",
  bgMuted: "#F5F5F5",
  text: "#1A1A1A",
  textSoft: "#555555",
  textMuted: "#999999",
  border: "#E5E5E5",
  borderLight: "#F0F0F0",
  orange: "#E8650A",
  orangeHover: "#D45800",
  orangeLight: "rgba(232,101,10,0.08)",
  orangeBorder: "rgba(232,101,10,0.2)",
  green: "#1B8C3A",
  greenLight: "rgba(27,140,58,0.08)",
  greenBorder: "rgba(27,140,58,0.2)",
  red: "#D32F2F",
  redLight: "rgba(211,47,47,0.07)",
  redBorder: "rgba(211,47,47,0.18)",
  yellow: "#C67F00",
  yellowLight: "rgba(198,127,0,0.06)",
  yellowBorder: "rgba(198,127,0,0.15)",
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

function stripJsonBlock(text) {
  return text.replace(/```json[\s\S]*?```/g, "").trim();
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
function useVoiceToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const [duration, setDuration] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let final = "";
        let interim = "";
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript + " ";
          } else {
            interim += result[0].transcript;
          }
        }
        if (final) setTranscript(prev => prev + final);
        setInterimTranscript(interim);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setIsListening(false);
          clearInterval(timerRef.current);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
        clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setInterimTranscript("");
    setDuration(0);
    try {
      recognitionRef.current.start();
      setIsListening(true);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (e) {
      console.error("Could not start speech recognition:", e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch {}
    setIsListening(false);
    clearInterval(timerRef.current);
  }, []);

  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return { isListening, transcript, interimTranscript, supported, duration, formatDuration, startListening, stopListening, setTranscript };
}

// ─── Mic Icon ───
function MicIcon({ active, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? C.red : C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const scoreColor = overall_score >= 70 ? C.green : overall_score >= 40 ? C.yellow : C.red;

  return (
    <div style={{
      background: C.bgSoft,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 28,
      margin: "16px 0",
      fontFamily: "'DM Mono', monospace"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.textMuted }}>Performance Dashboard</span>
        <div style={{ flex: 1, height: 1, background: C.borderLight }} />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 28 }}>
        <span style={{ fontSize: 64, fontWeight: 700, color: scoreColor, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>{overall_score}</span>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: C.red, marginBottom: 8 }}>Filler Words Detected</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(detected_filler_words || []).length > 0 ? detected_filler_words.map((w, i) => (
              <span key={i} style={{ padding: "3px 10px", background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 4, fontSize: 12, color: C.red }}>{w}</span>
            )) : <span style={{ fontSize: 12, color: C.textMuted }}>None — clean delivery</span>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: C.green, marginBottom: 8 }}>High-Signal Keywords</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(high_signal_keywords_found || []).length > 0 ? high_signal_keywords_found.map((w, i) => (
              <span key={i} style={{ padding: "3px 10px", background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 4, fontSize: 12, color: C.green }}>{w}</span>
            )) : <span style={{ fontSize: 12, color: C.textMuted }}>None detected</span>}
          </div>
        </div>
      </div>

      {the_alpha_rewrite && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: C.orange, marginBottom: 8 }}>The Alpha Rewrite</div>
          <div style={{ padding: 16, background: C.orangeLight, border: `1px solid ${C.orangeBorder}`, borderRadius: 8, fontSize: 13, lineHeight: 1.7, color: C.text }}>
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
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const scoreData = msg.role === "assistant" ? parseScoreFromResponse(msg.content) : null;
  const displayText = msg.role === "assistant" ? stripJsonBlock(msg.content) : msg.content;
  const isVoice = msg.fromVoice;

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 16,
      animation: "fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
    }}>
      <div style={{
        maxWidth: isUser ? "75%" : "85%",
        padding: isUser ? "14px 20px" : "18px 24px",
        borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        background: isUser ? C.userBubble : C.assistantBubble,
        border: `1px solid ${isUser ? "#EDE5DB" : C.border}`,
        color: C.text,
        fontSize: 14,
        lineHeight: 1.75,
        fontFamily: isUser ? "'DM Mono', monospace" : "'Source Serif 4', serif",
        whiteSpace: "pre-wrap",
        boxShadow: isUser ? "none" : "0 1px 4px rgba(0,0,0,0.04)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: 2.5,
          color: isUser ? C.textMuted : C.orange,
          marginBottom: 8,
          fontFamily: "'DM Mono', monospace"
        }}>
          {isUser ? "You" : "Interviewer"}
          {isVoice && (
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              padding: "1px 6px",
              background: C.orangeLight,
              borderRadius: 3,
              fontSize: 8,
              color: C.orange,
              letterSpacing: 1.5,
              marginLeft: 4
            }}>
              <MicIcon size={9} active={false} /> VOICE
            </span>
          )}
        </div>
        {displayText}
        {scoreData && <ScoreDashboard data={scoreData} />}
      </div>
    </div>
  );
}

// ─── Typing Indicator ───
function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
      <div style={{
        padding: "18px 24px",
        borderRadius: "20px 20px 20px 4px",
        background: C.assistantBubble,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
      }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2.5, color: C.orange, marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>
          Interviewer
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%",
              background: C.textMuted,
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Voice Recording Panel ───
function VoicePanel({ voice, onSubmit, onCancel, loading }) {
  const { isListening, transcript, interimTranscript, duration, formatDuration, startListening, stopListening } = voice;
  const fullText = (transcript + interimTranscript).trim();

  return (
    <div style={{
      background: C.bg,
      border: `2px solid ${isListening ? C.orange : C.border}`,
      borderRadius: 16,
      padding: 24,
      animation: "fadeUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      transition: "border-color 0.3s ease"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isListening && (
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.red, animation: "pulse 1s ease-in-out infinite" }} />
          )}
          <span style={{
            fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
            color: isListening ? C.red : C.textMuted,
            fontFamily: "'DM Mono', monospace", fontWeight: 500
          }}>
            {isListening ? "Recording..." : fullText ? "Recording Complete" : "Voice Input"}
          </span>
        </div>
        {isListening && (
          <span style={{ fontSize: 14, fontFamily: "'DM Mono', monospace", color: C.text, fontWeight: 500, background: C.bgMuted, padding: "4px 12px", borderRadius: 6 }}>
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div style={{
        minHeight: 80, maxHeight: 180, overflow: "auto",
        padding: 16, background: C.bgSoft, borderRadius: 10,
        border: `1px solid ${C.borderLight}`, marginBottom: 16,
        fontSize: 14, lineHeight: 1.7, fontFamily: "'Source Serif 4', serif", color: C.text
      }}>
        {fullText || (
          <span style={{ color: C.textMuted, fontStyle: "italic" }}>
            {isListening ? "Start speaking — your words will appear here in real time..." : "Click the microphone to start recording your answer"}
          </span>
        )}
        {interimTranscript && (
          <span style={{ color: C.textMuted }}>{transcript ? " " : ""}{interimTranscript}</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {!isListening ? (
          <>
            <button
              onClick={startListening}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 28px", background: C.orange, border: "none", borderRadius: 8,
                color: "#fff", fontSize: 12, fontFamily: "'DM Mono', monospace",
                fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer"
              }}
              onMouseEnter={e => e.target.style.background = C.orangeHover}
              onMouseLeave={e => e.target.style.background = C.orange}
            >
              <MicIcon active={false} size={16} /> {fullText ? "Re-Record" : "Start Recording"}
            </button>
            {fullText && (
              <button
                onClick={() => onSubmit(fullText)}
                disabled={loading}
                style={{
                  padding: "12px 28px", background: C.green, border: "none", borderRadius: 8,
                  color: "#fff", fontSize: 12, fontFamily: "'DM Mono', monospace",
                  fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase",
                  cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1
                }}
              >
                Submit Answer
              </button>
            )}
            <button
              onClick={onCancel}
              style={{
                padding: "12px 20px", background: "transparent",
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.textMuted, fontSize: 12, fontFamily: "'DM Mono', monospace",
                letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={stopListening}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "14px 36px", background: C.red, border: "none", borderRadius: 8,
              color: "#fff", fontSize: 12, fontFamily: "'DM Mono', monospace",
              fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase",
              cursor: "pointer", animation: "subtlePulse 2s ease-in-out infinite"
            }}
          >
            ■ Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}

const FREE_SESSION_LIMIT = 3;

// ─── Main Component ───
export default function InterviewAlpha({ user, profile, checkSession, onSessionUsed }) {
  const [phase, setPhase] = useState("landing");
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [track, setTrack] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [error, setError] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
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

  // ─── Save / update profile ───
  const saveProfile = useCallback(async () => {
    if (!user || !resume.trim() || !jd.trim()) return;
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

  const callClaude = useCallback(async (msgs) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: msgs
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API returned ${res.status}`);
      }
      const data = await res.json();
      return data.content?.map(b => b.text || "").join("\n") || "I couldn't generate a response. Please try again.";
    } catch (e) {
      setError(e.message || "Connection error");
      return `Error: ${e.message || "Connection failed"}. Check your API key and try again.`;
    } finally {
      setLoading(false);
    }
  }, []);

  const startInterview = useCallback(async (selectedTrack) => {
    // ─── Session gate ───
    if (checkSession && !checkSession()) return;
    if (onSessionUsed) await onSessionUsed();

    const contextMsg = `Here is the candidate's context:\n\n**RESUME:**\n${resume}\n\n**JOB DESCRIPTION:**\n${jd}\n\n**SELECTED TRACK:** ${selectedTrack}\n\nBegin the ${selectedTrack} interview simulation now. Stay in character as a Senior PM Interviewer at the target company. Ask your first question.`;
    const response = await callClaude([{ role: "user", content: contextMsg }]);
    setMessages([{ role: "assistant", content: response }]);
    setPhase("interview");
  }, [resume, jd, callClaude, checkSession, onSessionUsed]);

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
    setMessages(updatedMessages);

    const visible = updatedMessages.filter(m => !m.hidden);
    const apiMsgs = buildCleanMessages(visible, null);
    if (isEnd && apiMsgs.length > 0) {
      const last = apiMsgs[apiMsgs.length - 1];
      if (last.role === "user") last.content = actualContent;
    }

    const response = await callClaude(apiMsgs);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);

    // ─── Save session to Supabase after interview ends ───
    if (isEnd && user) {
      const scoreData = parseScoreFromResponse(response);
      if (scoreData) {
        supabase.from("sessions").insert({
          user_id: user.id,
          track,
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
  }, [input, loading, messages, callClaude, user, track]);

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

  // NAV_H = 3px accent + 52px nav bar
  const NAV_H = 55;

  const globalStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
    @keyframes subtlePulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(211,47,47,0.3); } 50% { box-shadow: 0 0 0 8px rgba(211,47,47,0); } }
    textarea:focus, input:focus { outline: none; }
    ::selection { background: rgba(232,101,10,0.18); }
  `;

  // ─── Landing ───
  if (phase === "landing") {
    return (
      <div style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Mono', monospace",
        color: C.text,
        padding: 32,
        paddingTop: NAV_H + 32,
      }}>
        <style>{globalStyles}</style>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 680, animation: "fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 10, letterSpacing: 8, textTransform: "uppercase", color: C.textMuted, marginBottom: 20 }}>PM Prep, Supercharged.</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 72, fontWeight: 900, lineHeight: 0.95,
              letterSpacing: -2, color: C.text
            }}>
              Interview<span style={{ color: C.orange }}>Alpha</span>
            </h1>
            <div style={{ width: 48, height: 3, background: C.orange, margin: "24px auto", borderRadius: 2 }} />
            <p style={{ fontSize: 15, color: C.textSoft, lineHeight: 1.8, maxWidth: 440, margin: "0 auto", fontFamily: "'Source Serif 4', serif" }}>
              Stop practicing. Start landing.<br />
              Real-time AI coaching for PMs, not the fluff.
            </p>
          </div>

          {/* Free session banner */}
          {profile?.subscription_status !== 'pro' && (() => {
            const used = profile?.free_sessions_used ?? 0;
            const remaining = Math.max(0, FREE_SESSION_LIMIT - used);
            return remaining > 0 ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', marginBottom: 28,
                background: C.greenLight, border: `1px solid ${C.greenBorder}`,
                borderRadius: 20, fontSize: 12, color: C.green,
                fontFamily: "'DM Mono', monospace", letterSpacing: 0.3,
              }}>
                ◆ You have {remaining} free AI session{remaining !== 1 ? 's' : ''} remaining — try one now!
              </div>
            ) : (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', marginBottom: 28,
                background: C.orangeLight, border: `1px solid ${C.orangeBorder}`,
                borderRadius: 20, fontSize: 12, color: C.orange,
                fontFamily: "'DM Mono', monospace", letterSpacing: 0.3,
              }}>
                🔒 All 3 free sessions used. Upgrade to continue.
              </div>
            );
          })()}

          <button
            onClick={() => setPhase("setup")}
            style={{
              padding: "18px 56px", background: C.orange, border: "none",
              color: "#fff", fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              cursor: "pointer", borderRadius: 6, fontFamily: "'DM Mono', monospace",
              fontWeight: 500, transition: "all 0.3s ease",
              boxShadow: "0 2px 12px rgba(232,101,10,0.25)"
            }}
            onMouseEnter={e => e.target.style.background = C.orangeHover}
            onMouseLeave={e => e.target.style.background = C.orange}
          >
            Begin Session
          </button>

          <div style={{ marginTop: 64, display: "flex", justifyContent: "center", gap: 48 }}>
            {[["01", "Paste Resume & JD"], ["02", "Choose Interview Track"], ["03", "Get Insightful Feedback"]].map(([num, label]) => (
              <div key={num} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", color: C.orange, opacity: 0.35, marginBottom: 8 }}>{num}</div>
                <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Setup ───
  if (phase === "setup") {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg,
        fontFamily: "'DM Mono', monospace", color: C.text,
        padding: "48px 32px", paddingTop: NAV_H + 48,
      }}>
        <style>{globalStyles}</style>
        <div style={{ maxWidth: 720, margin: "0 auto", animation: "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <button onClick={() => setPhase("landing")} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", marginBottom: 40, fontFamily: "'DM Mono', monospace", letterSpacing: 2 }}>← BACK</button>

          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 12 }}>STEP 01</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, marginBottom: 8, color: C.text }}>Your Context</h2>
          <p style={{ fontSize: 13, color: C.textSoft, marginBottom: profileLoaded ? 12 : 40, fontFamily: "'Source Serif 4', serif" }}>
            The more detail you provide, the sharper the interview gets.
          </p>

          {profileLoaded && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 14px", background: C.greenLight,
              border: `1px solid ${C.greenBorder}`, borderRadius: 6,
              fontSize: 11, color: C.green, marginBottom: 32,
              fontFamily: "'DM Mono', monospace", letterSpacing: 0.5,
            }}>
              ✓ Auto-filled from your saved profile
            </div>
          )}

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.textMuted, marginBottom: 12 }}>Resume / Experience</label>
            <textarea
              value={resume}
              onChange={e => setResume(e.target.value)}
              placeholder="Paste your resume text here — work experience, skills, notable projects..."
              rows={8}
              style={{
                width: "100%", background: C.bgSoft, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: 20, color: C.text, fontSize: 13, lineHeight: 1.7,
                fontFamily: "'Source Serif 4', serif", resize: "vertical", transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = C.orange}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          <div style={{ marginBottom: 40 }}>
            <label style={{ display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.textMuted, marginBottom: 12 }}>Target Job Description</label>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description you're targeting..."
              rows={8}
              style={{
                width: "100%", background: C.bgSoft, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: 20, color: C.text, fontSize: 13, lineHeight: 1.7,
                fontFamily: "'Source Serif 4', serif", resize: "vertical", transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = C.orange}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={async () => {
                if (resume.trim() && jd.trim()) {
                  await saveProfile();
                  setPhase("track");
                }
              }}
              disabled={!resume.trim() || !jd.trim()}
              style={{
                padding: "16px 48px",
                background: (resume.trim() && jd.trim()) ? C.orange : C.bgMuted,
                border: "none",
                color: (resume.trim() && jd.trim()) ? "#fff" : C.textMuted,
                fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
                cursor: (resume.trim() && jd.trim()) ? "pointer" : "not-allowed",
                borderRadius: 6, fontFamily: "'DM Mono', monospace",
                fontWeight: 500, transition: "all 0.3s ease"
              }}
            >
              Continue →
            </button>

            <button
              onClick={saveProfile}
              disabled={!resume.trim() || !jd.trim() || savingProfile}
              style={{
                padding: "16px 28px",
                background: "transparent",
                border: `1px solid ${(resume.trim() && jd.trim()) ? C.border : C.borderLight}`,
                color: (resume.trim() && jd.trim()) ? C.textSoft : C.textMuted,
                fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                cursor: (resume.trim() && jd.trim() && !savingProfile) ? "pointer" : "not-allowed",
                borderRadius: 6, fontFamily: "'DM Mono', monospace",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { if (resume.trim() && jd.trim()) e.currentTarget.style.borderColor = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
            >
              {savingProfile ? "Saving..." : "Update Profile"}
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
        fontFamily: "'DM Mono', monospace", color: C.text,
        padding: "48px 32px", paddingTop: NAV_H + 48,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <style>{globalStyles}</style>
        <div style={{ maxWidth: 680, width: "100%", animation: "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <button onClick={() => setPhase("setup")} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 12, cursor: "pointer", marginBottom: 40, fontFamily: "'DM Mono', monospace", letterSpacing: 2 }}>← BACK</button>

          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 12 }}>STEP 02</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Choose Your Track</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Source Serif 4', serif", margin: 0 }}>Select the interview type. Each track simulates a different round.</p>
            {(() => {
              if (profile?.subscription_status === 'pro') return null;
              const used = profile?.free_sessions_used ?? 0;
              const remaining = Math.max(0, FREE_SESSION_LIMIT - used);
              return remaining > 0 ? (
                <span style={{
                  flexShrink: 0, padding: '4px 10px',
                  background: C.greenLight, border: `1px solid ${C.greenBorder}`,
                  borderRadius: 20, fontSize: 10, fontWeight: 600,
                  color: C.green, letterSpacing: 0.5,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {remaining} Free Session{remaining !== 1 ? 's' : ''} Left
                </span>
              ) : (
                <span style={{
                  flexShrink: 0, padding: '4px 10px',
                  background: C.orangeLight, border: `1px solid ${C.orangeBorder}`,
                  borderRadius: 20, fontSize: 10, fontWeight: 600,
                  color: C.orange, letterSpacing: 0.5,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  🔒 Upgrade to unlock
                </span>
              );
            })()}
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {tracks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => { setTrack(t.id); startInterview(t.id); }}
                disabled={loading}
                style={{
                  display: "flex", alignItems: "center", gap: 24,
                  padding: "24px 28px", background: C.bg,
                  border: `1px solid ${C.border}`, borderRadius: 10,
                  cursor: loading ? "wait" : "pointer",
                  textAlign: "left", color: C.text,
                  transition: "all 0.25s ease", opacity: loading ? 0.5 : 1,
                  animation: `fadeUp ${0.6 + i * 0.15}s cubic-bezier(0.22, 1, 0.36, 1)`
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = C.orange;
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(232,101,10,0.1)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: 24, color: C.orange }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 3, fontFamily: "'Playfair Display', serif" }}>{t.id}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Source Serif 4', serif" }}>{t.desc}</div>
                </div>
                <span style={{ marginLeft: "auto", color: C.orange, fontSize: 18 }}>{loading ? "..." : "→"}</span>
              </button>
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: C.orange, letterSpacing: 1 }}>
              Preparing your interview...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Interview ───
  return (
    <div style={{
      minHeight: "100vh", background: C.bgSoft,
      fontFamily: "'DM Mono', monospace", color: C.text,
      display: "flex", flexDirection: "column",
      paddingTop: NAV_H,
    }}>
      <style>{globalStyles}</style>

      {/* Interview header */}
      <div style={{
        padding: "14px 28px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: NAV_H, zIndex: 10,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.text }}>
            I<span style={{ color: C.orange }}>A</span>
          </span>
          <div style={{ width: 1, height: 20, background: C.border }} />
          <span style={{ fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: "uppercase" }}>{track} Track</span>
          {!interviewEnded && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 10, color: C.green, letterSpacing: 1 }}>LIVE</span>
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
                cursor: loading ? "wait" : "pointer", borderRadius: 6,
                fontFamily: "'DM Mono', monospace", opacity: loading ? 0.5 : 1
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
              cursor: "pointer", borderRadius: 6, fontFamily: "'DM Mono', monospace",
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
        <div style={{ padding: "10px 28px", background: C.redLight, borderBottom: `1px solid ${C.redBorder}`, fontSize: 12, color: C.red, fontFamily: "'DM Mono', monospace" }}>
          ⚠ {error} — Make sure your API key is configured.
        </div>
      )}

      {/* Chat Area */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 28px", paddingBottom: 140 }}>
        {messages.filter(m => !m.hidden).map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {!interviewEnded && (
        <div style={{
          position: "sticky", bottom: 0,
          padding: "16px 28px 20px",
          background: `linear-gradient(transparent, ${C.bgSoft} 25%)`,
          zIndex: 10
        }}>
          {voiceMode ? (
            <VoicePanel
              voice={voice}
              onSubmit={handleVoiceSubmit}
              onCancel={() => { setVoiceMode(false); if (voice.isListening) voice.stopListening(); }}
              loading={loading}
            />
          ) : (
            <>
              <div style={{
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
                    fontFamily: "'Source Serif 4', serif", resize: "none",
                    padding: "12px 0", minHeight: 44, maxHeight: 160, overflow: "auto"
                  }}
                />
                {voice.supported && (
                  <button
                    onClick={() => setVoiceMode(true)}
                    title="Switch to voice input"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 42, height: 42, background: C.orangeLight,
                      border: `1px solid ${C.orangeBorder}`, borderRadius: 8,
                      cursor: "pointer", marginBottom: 4, transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = C.orangeBorder}
                    onMouseLeave={e => e.currentTarget.style.background = C.orangeLight}
                  >
                    <MicIcon active={false} size={18} />
                  </button>
                )}
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    padding: "10px 22px",
                    background: (input.trim() && !loading) ? C.orange : C.bgMuted,
                    border: "none",
                    color: (input.trim() && !loading) ? "#fff" : C.textMuted,
                    fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                    cursor: (input.trim() && !loading) ? "pointer" : "not-allowed",
                    borderRadius: 8, fontFamily: "'DM Mono', monospace",
                    fontWeight: 500, transition: "all 0.2s ease", marginBottom: 4
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
            }}
            style={{
              padding: "16px 48px", background: C.orange, border: "none",
              color: "#fff", fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
              cursor: "pointer", borderRadius: 6, fontFamily: "'DM Mono', monospace",
              fontWeight: 500, transition: "all 0.3s ease",
              boxShadow: "0 2px 12px rgba(232,101,10,0.25)"
            }}
            onMouseEnter={e => e.target.style.background = C.orangeHover}
            onMouseLeave={e => e.target.style.background = C.orange}
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
}
