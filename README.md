# InterviewAlpha.ai

AI-powered interview coaching platform for Product Managers, Data Scientists, Consultants, Project Managers, Technical Writers, and Scrum Masters.

🌐 **Live:** [interviewalpha.in](https://interviewalpha.in)

---

## What is InterviewAlpha?

InterviewAlpha helps professionals prepare for senior interviews through:

- **AI-scored practice** — Answer questions and get scored across 8 competencies instantly
- **Expert rewrites** — See how a senior professional would have answered the same question
- **Voice and text modes** — Practice the way you think
- **1,500+ questions** — Across PM, Data Science, Consulting, Project Management, Technical Writing, and Scrum Master roles
- **Domain-specific prep** — Telecom, Fintech, Banking, Healthcare domains
- **Exclusive Prep** — JD and resume-based personalized questions (Pro)
- **ATS Checker and Resume Optimizer** — Get through screening before the interview starts
- **Salary Guide** — Know your worth before negotiating

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Database | Supabase (PostgreSQL) — Mumbai region |
| Auth | Supabase Auth |
| AI | Anthropic Claude API |
| Email | Resend |
| Payments | Razorpay |
| Analytics | PostHog |
| Hosting | Vercel |

---

## Architecture

Single Page Application (SPA) with serverless API functions.

```
src/
├── components/       # Reusable UI components
├── pages/            # Page-level components
├── data/             # Question banks (PM, DS, Consulting, Scrum Master etc.)
├── emails/           # Email templates
├── hooks/            # Custom React hooks
├── lib/              # Supabase client and utilities
api/                  # Serverless API functions (Vercel)
public/               # Static assets, robots.txt, sitemap.xml
```

---

## Pricing

| Plan | Price |
|------|-------|
| Free | 3 full sessions |
| Monthly | ₹1,299/month |
| Quarterly | ₹1,999/quarter |
| Yearly | ₹6,999/year |

---

## Features Roadmap

- [x] PM interview practice (1,000+ questions)
- [x] Data Science practice (241+ questions)
- [x] Consulting practice
- [x] Project Management practice
- [x] Technical Writing practice
- [x] Scrum Master practice (200+ questions)
- [x] ATS Checker
- [x] Resume Optimizer
- [x] Resume Templates
- [x] Salary Guide
- [x] Exclusive Prep (JD + resume based questions)
- [ ] React Router migration (separate URLs per page)
- [ ] Salary negotiation prep
- [ ] Referral call prep

---

## Contact

**Founder:** Shraddha Dudhgaonli  
**Email:** shraddha@interviewalpha.in  
**LinkedIn:** [linkedin.com/in/shraddhadudhgaonli](https://linkedin.com/in/shraddhadudhgaonli)  
**Website:** [interviewalpha.in](https://interviewalpha.in)

---

*Built by a solo founder using AI. 16 years of fintech product experience at Mastercard, Western Union, and UBS.*
