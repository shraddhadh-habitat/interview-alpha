import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Footer from './Footer';

const C = {
  bg: '#FFFFFF',
  bgSoft: '#FAFAF8',
  bgMuted: '#F5F3EF',
  text: '#0A0A0A',
  textMuted: '#5C5C57',
  border: '#E8E6E1',
  green: '#16A34A',
  greenLight: 'rgba(22,163,74,0.08)',
  greenBorder: 'rgba(22,163,74,0.2)',
};

function LoggedOutView({ onStartInterview, onBrowse }) {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
      {/* SECTION 1 - HERO */}
      <section style={{
        padding: '96px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '100%',
      }}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          {/* Logo */}
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 32,
            letterSpacing: -1,
          }}>
            Interview<span style={{ color: C.green }}>Alpha</span><span style={{ fontSize: 16, verticalAlign: 'super', color: C.textMuted }}>™</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: 500,
            marginBottom: 20,
            lineHeight: 1.2,
            letterSpacing: -0.5,
          }}>
            Know exactly why you're getting rejected
          </h1>

          {/* Subhead */}
          <p style={{
            fontSize: '16px',
            color: C.textMuted,
            marginBottom: 40,
            lineHeight: 1.6,
            maxWidth: 540,
            margin: '0 auto 40px',
          }}>
            Alpha reads your resume, interviews you like a Senior PM, and scores you across 8 competencies. In 10 minutes, you'll know what to fix.
          </p>

          {/* Primary CTA */}
          <button
            onClick={onStartInterview}
            style={{
              height: 48,
              paddingLeft: 32,
              paddingRight: 32,
              background: 'var(--gradient-brand)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              marginBottom: 12,
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(168, 230, 207, 0.2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.88';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 230, 207, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(168, 230, 207, 0.2)';
            }}
          >
            Try a Free Interview
          </button>

          {/* Subtext */}
          <p style={{
            fontSize: 13,
            color: C.textMuted,
            marginBottom: 96,
          }}>
            No resume needed. No credit card.
          </p>
        </div>
      </section>

      {/* SECTION 2 - SOCIAL PROOF */}
      <section style={{
        padding: '64px 28px',
        background: C.bgMuted,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <blockquote style={{
            fontSize: 16,
            fontStyle: 'italic',
            color: C.text,
            marginBottom: 20,
            lineHeight: 1.7,
            borderLeft: `3px solid ${C.green}`,
            paddingLeft: 20,
            textAlign: 'left',
            maxWidth: 540,
            margin: '0 auto 20px',
          }}>
            "This is something amazing for product managers. I often find it difficult to find a resource where I can practice actual product sense questions."
          </blockquote>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 16 }}>
            Shrey C.
          </p>
          <p style={{ fontSize: 13, color: C.textMuted }}>
            Trusted by 150+ PMs preparing for Google, Amazon, Meta, Flipkart
          </p>
        </div>
      </section>

      {/* SECTION 3 - HOW IT WORKS */}
      <section style={{
        padding: '96px 28px',
        background: C.bg,
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: 64,
            fontFamily: "'Instrument Serif', serif",
          }}>
            How It Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}>
            {/* Step 1 */}
            <div style={{
              padding: 32,
              background: C.bgSoft,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              textAlign: 'center',
            }}>
              <div style={{
                width: 56,
                height: 56,
                background: 'var(--gradient-brand)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
                fontWeight: 700,
                color: '#FFFFFF',
              }}>
                1
              </div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                fontFamily: "'Instrument Serif', serif",
              }}>
                Pick a question
              </h3>
              <p style={{
                fontSize: 14,
                color: C.textMuted,
                lineHeight: 1.6,
              }}>
                Or let Alpha interview you
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              padding: 32,
              background: C.bgSoft,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              textAlign: 'center',
            }}>
              <div style={{
                width: 56,
                height: 56,
                background: 'var(--gradient-brand)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
                fontWeight: 700,
                color: '#FFFFFF',
              }}>
                2
              </div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                fontFamily: "'Instrument Serif', serif",
              }}>
                Answer (type or speak)
              </h3>
              <p style={{
                fontSize: 14,
                color: C.textMuted,
                lineHeight: 1.6,
              }}>
                Takes 2 minutes
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              padding: 32,
              background: C.bgSoft,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              textAlign: 'center',
            }}>
              <div style={{
                width: 56,
                height: 56,
                background: 'var(--gradient-brand)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
                fontWeight: 700,
                color: '#FFFFFF',
              }}>
                3
              </div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
                fontFamily: "'Instrument Serif', serif",
              }}>
                Get scored feedback
              </h3>
              <p style={{
                fontSize: 14,
                color: C.textMuted,
                lineHeight: 1.6,
              }}>
                8 competencies. Instant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - SCORECARD PREVIEW */}
      <section style={{
        padding: '96px 28px',
        background: C.bgMuted,
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: 40,
            fontFamily: "'Instrument Serif', serif",
          }}>
            What you'll get after every session
          </h2>

          <div style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 32,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
              marginBottom: 28,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: C.green,
                  marginBottom: 4,
                }}>
                  7/10
                </div>
                <p style={{
                  fontSize: 13,
                  color: C.textMuted,
                }}>
                  Structure
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#CF222E',
                  marginBottom: 4,
                }}>
                  4/10
                </div>
                <p style={{
                  fontSize: 13,
                  color: C.textMuted,
                }}>
                  Metrics
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: C.green,
                  marginBottom: 4,
                }}>
                  8/10
                </div>
                <p style={{
                  fontSize: 13,
                  color: C.textMuted,
                }}>
                  Trade-offs
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#C67F00',
                  marginBottom: 4,
                }}>
                  6/10
                </div>
                <p style={{
                  fontSize: 13,
                  color: C.textMuted,
                }}>
                  Communication
                </p>
              </div>
            </div>
            <div style={{
              paddingTop: 24,
              borderTop: `1px solid ${C.border}`,
              fontSize: 13,
              color: C.textMuted,
            }}>
              + Expert rewrite of your weakest answer
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - SECONDARY CTA */}
      <section style={{
        padding: '64px 28px',
        background: C.bg,
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 500,
          marginBottom: 24,
          fontFamily: "'Instrument Serif', serif",
        }}>
          Not ready for an interview? Browse first.
        </h2>
        <button
          onClick={onBrowse}
          style={{
            height: 44,
            paddingLeft: 28,
            paddingRight: 28,
            background: 'var(--gradient-brand)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s',
            marginBottom: 12,
            boxShadow: '0 1px 3px rgba(168, 230, 207, 0.2)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.88';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 230, 207, 0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(168, 230, 207, 0.2)';
          }}
        >
          Browse 1,100+ Questions
        </button>
        <p style={{
          fontSize: 13,
          color: C.textMuted,
          marginTop: 8,
        }}>
          Free access. No signup needed.
        </p>
      </section>

      {/* SECTION 6 - FOOTER */}
      <Footer />
    </div>
  );
}

function LoggedInView({ user, onStartInterview, onContinuePractice }) {
  const firstName = user?.user_metadata?.display_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <div style={{ background: C.bgSoft, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text, padding: '28px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Welcome Message */}
        <h1 style={{
          fontSize: 28,
          fontWeight: 500,
          marginBottom: 40,
          fontFamily: "'Instrument Serif', serif",
        }}>
          Welcome back, {firstName}!
        </h1>

        {/* Main CTA Card */}
        <div style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 40,
          marginBottom: 32,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 16,
            color: C.textMuted,
            marginBottom: 28,
            lineHeight: 1.6,
          }}>
            Ready to test yourself? Start a new interview session and get instant feedback on your answers.
          </p>
          <button
            onClick={onStartInterview}
            style={{
              height: 48,
              paddingLeft: 32,
              paddingRight: 32,
              background: '#1B1B18',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              marginRight: 12,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#0F0F0D'}
            onMouseLeave={e => e.currentTarget.style.background = '#1B1B18'}
          >
            Start Interview
          </button>
          <button
            onClick={onContinuePractice}
            style={{
              height: 48,
              paddingLeft: 28,
              paddingRight: 28,
              background: 'transparent',
              color: C.text,
              border: `1.5px solid ${C.border}`,
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.bgMuted}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Continue Practicing
          </button>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 32,
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 24,
            fontFamily: "'Instrument Serif', serif",
          }}>
            Keep practicing and get better every day
          </h2>
          <p style={{
            fontSize: 14,
            color: C.textMuted,
            lineHeight: 1.6,
          }}>
            Each answer you practice builds muscle memory. The more you interview, the more confident you'll be. Your recent sessions and scores are tracked in the Progress tab.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function HomePage({ user, onStartInterview, onBrowse, onContinuePractice }) {
  if (user) {
    return <LoggedInView user={user} onStartInterview={onStartInterview} onContinuePractice={onContinuePractice} />;
  }
  return <LoggedOutView onStartInterview={onStartInterview} onBrowse={onBrowse} />;
}
