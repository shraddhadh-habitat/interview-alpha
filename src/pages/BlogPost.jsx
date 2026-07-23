import { useEffect } from 'react';

export default function BlogPost() {
  useEffect(() => {
    document.title = 'The Interview Feedback Black Hole | InterviewAlpha.ai Blog';
  }, []);

  const C = {
    text: '#1B1B18',
    textMuted: '#0A0A0A',
  };

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'blog' }));
  };

  const handleCTA = () => {
    window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }));
  };

  return (
    <div style={{
      background: '#FFFFFF',
      minHeight: '100vh',
      paddingTop: '40px',
      paddingBottom: '60px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @media (max-width: 768px) {
          .blog-post-container { padding: 0 20px !important; }
          .blog-post-title { font-size: 26px !important; }
          .blog-post-body { font-size: 16px !important; }
        }
      `}</style>

      <div className="blog-post-container" style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '0 40px',
      }}>
        {/* Back link */}
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            color: C.text,
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: '40px',
            textDecoration: 'underline',
            padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Back to Blog
        </button>

        {/* Article Header */}
        <article>
          <h1 className="blog-post-title" style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: '36px',
            fontWeight: 400,
            color: C.text,
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            The Interview Feedback Black Hole
          </h1>

          <p style={{
            fontSize: '18px',
            color: C.textMuted,
            marginBottom: '24px',
            lineHeight: 1.6,
          }}>
            Why the $4.5 billion interview prep industry solves the wrong problem, and what it means for the future of career development
          </p>

          <div style={{
            display: 'flex',
            gap: '24px',
            fontSize: '14px',
            color: C.text,
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}>
            <span>InterviewAlpha.ai</span>
            <span>May 21, 2026</span>
            <span>8 min read</span>
          </div>

          <div style={{
            height: '1px',
            background: 'rgba(27, 27, 24, 0.1)',
            marginBottom: '40px',
          }} />

          {/* Article Body */}
          <div className="blog-post-body" style={{ fontSize: '17px' }}>
            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              There is a structural failure at the center of how people prepare for job interviews, and almost nobody talks about it because the incentives of the companies involved make it invisible.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              Every year, millions of candidates sit across from interviewers at Google, McKinsey, Goldman Sachs, Amazon, and hundreds of other companies. They answer questions about product strategy, data modeling, behavioral leadership, and market estimation. Then they go home and wait. A week later, most of them receive some version of the same email: "We've decided to move forward with other candidates."
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              That's it. No explanation. No feedback. No indication of whether the candidate was close or miles away. The candidate is left to wonder: was it my structure? My metrics thinking? My communication? Was I too junior? Too theoretical? Too safe?
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              This is the Feedback Black Hole, and it is not a bug. It is a feature of how hiring works.
            </p>

            <h2 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: C.text,
              marginTop: '48px',
              marginBottom: '16px',
            }}>
              Why Companies Don't Give Feedback
            </h2>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The standard explanation is legal risk. If a company tells you that your analytical thinking was weak, and you happen to belong to a protected class, that feedback becomes discoverable in a lawsuit. The safer move, legally, is to say nothing.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              But the legal explanation, while true, understates the structural reality. Companies don't give feedback because the economics don't support it. A Google recruiter managing 40 open roles doesn't have 30 minutes per rejected candidate to write thoughtful evaluations. The system is optimized for throughput on the company side, not for development on the candidate side.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              This creates an information asymmetry that defines the interview prep market.
            </p>

            <h2 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: C.text,
              marginTop: '48px',
              marginBottom: '16px',
            }}>
              The Interview Prep Industry's Misdirection
            </h2>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The interview prep industry, now estimated at over $4.5 billion globally, has positioned itself as the solution. Platforms like Exponent, Pramp, and dozens of course providers offer frameworks, sample answers, and peer practice sessions. The implicit promise is: learn the right frameworks, memorize enough examples, and you'll pass.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              This is the wrong solution to the wrong problem.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The problem was never that candidates lacked frameworks. Any motivated person can search for the CIRCLES framework or STAR method in five minutes. The problem is that candidates have no way to know how their specific answers perform against the bar that interviewers actually use.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              Consider the parallel to sports. A tennis player doesn't improve by reading about proper backhand technique. They improve by hitting backhands and getting immediate, specific feedback: your racket face was open, your follow-through was short, your weight was on the wrong foot. The entire architecture of athletic improvement is built on tight feedback loops.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              Interview preparation has no feedback loop. You read a framework, you practice with a friend who doesn't know the evaluation criteria, and you walk into the interview hoping for the best. When you get rejected, you have no data point to improve on. You just repeat the cycle.
            </p>

            <h2 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: C.text,
              marginTop: '48px',
              marginBottom: '16px',
            }}>
              The AI Inflection Point
            </h2>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              This is where the technology story gets interesting.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              Large language models, specifically the current generation of models, have a capability that maps directly onto this problem: they can evaluate unstructured text against a rubric with a level of consistency and specificity that was previously only available from expensive human coaches.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The key insight is not that AI can generate sample answers. Every chatbot can do that. The insight is that AI can read your specific answer to a specific question and tell you, with reasonable accuracy, that your problem definition was strong but your trade-off analysis was missing, your metrics were too vague, and your prioritization logic didn't account for constraints.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              This is the feedback loop that the entire interview prep industry has been missing.
            </p>

            <h2 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: C.text,
              marginTop: '48px',
              marginBottom: '16px',
            }}>
              What InterviewAlpha.ai Is Actually Building
            </h2>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              InterviewAlpha.ai is built on a thesis that most people in the interview prep space haven't articulated: the value is not in the questions or the frameworks. The value is in the per-answer, per-competency feedback that closes the loop between practice and improvement.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The product works like this: you pick a question from thousands across Product Management, Data Science, and soon other roles. You answer it in your own words. The AI scores your response across eight competencies, including structure, metrics quality, trade-off analysis, user empathy, and communication clarity. You see what you did well, what you missed, and how a more experienced professional might have approached the same problem.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              This is fundamentally different from what the existing market offers. Other platforms give you videos to watch or peers to practice with who don't know the rubric either. InterviewAlpha.ai gives you the rubric, applied to your actual answer, every time you practice.
            </p>

            <h2 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: C.text,
              marginTop: '48px',
              marginBottom: '16px',
            }}>
              The Economic Logic
            </h2>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The unit economics of this model deserve attention because they explain why this approach wasn't viable until recently.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              A human interview coach charges between $100 and $500 per hour. At that rate, a candidate might afford three to five sessions before an important interview. Each session covers maybe two to three questions with feedback. That's six to fifteen data points of feedback across an entire preparation cycle.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              With an AI-powered feedback system, the cost per evaluation drops to roughly the cost of an API call, which today is a few cents. A candidate paying a modest monthly subscription can practice dozens of questions with individualized feedback. The ratio of feedback per dollar spent shifts by two orders of magnitude.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              This doesn't eliminate human coaches. A great coach brings pattern recognition, emotional support, and company-specific insider knowledge that AI cannot replicate. But it does mean that the baseline level of feedback, the fundamental loop of practice-evaluate-improve, is now accessible to anyone with internet access, not just those who can afford premium coaching.
            </p>

            <h2 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: C.text,
              marginTop: '48px',
              marginBottom: '16px',
            }}>
              The Platform Question
            </h2>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The interesting strategic question for InterviewAlpha.ai is whether per-answer feedback is a feature or a platform.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              If it's a feature, the large incumbents will eventually integrate AI feedback into their existing products and InterviewAlpha.ai will face a distribution disadvantage.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              If it's a platform, meaning the data from millions of practice answers creates a proprietary understanding of what distinguishes strong candidates from weak ones across roles, levels, companies, and competencies, then InterviewAlpha.ai builds a moat that scales with usage. Every answer evaluated makes the next evaluation better. Every pattern detected across thousands of candidates for a specific role at a specific company creates intelligence that no generic AI model can replicate.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The company's expansion from Product Management to Data Science, and soon to Consulting, Finance, Sales, and General Management, suggests the team is building for breadth across career paths. This is a platform bet.
            </p>

            <h2 style={{
              fontSize: '22px',
              fontWeight: 600,
              color: C.text,
              marginTop: '48px',
              marginBottom: '16px',
            }}>
              What This Means for Candidates
            </h2>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              For individual candidates, the practical implication is straightforward: the era of practicing in a vacuum is ending. If you're preparing for an interview and you're still reading sample answers without testing your own responses against a structured rubric, you're training the way athletes trained before video replay.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The candidates who will have an advantage are not the ones who read the most frameworks. They're the ones who write the most answers and get the most feedback. The tight loop of attempt, evaluate, and adjust, repeated dozens of times across different question types and competencies, will produce a level of interview readiness that no amount of passive studying can match.
            </p>

            <p style={{
              color: C.text,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}>
              The Feedback Black Hole was structural. The technology to fill it now exists. The only question is how quickly candidates will shift from studying frameworks to actually practicing with feedback, and how quickly the prep industry will restructure around this reality.
            </p>
          </div>

          {/* CTA Card */}
          <div style={{
            background: '#FDCD34',
            borderRadius: '12px',
            padding: '32px',
            marginTop: '60px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '18px',
              fontWeight: 700,
              color: C.text,
              marginBottom: '20px',
              margin: '0 0 20px 0',
            }}>
              Stop reading about interviews. Start practicing.
            </p>
            <button
              onClick={handleCTA}
              style={{
                background: '#1B1B18',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 32px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2A2A24'}
              onMouseLeave={e => e.currentTarget.style.background = '#1B1B18'}
            >
              Answer your first question
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
