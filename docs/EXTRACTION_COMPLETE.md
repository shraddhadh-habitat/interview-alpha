# Consulting Interview Questions Extraction - COMPLETE

## Summary

Successfully extracted **ALL 30 consulting interview questions** from the transcript.

**Location of source data:** `C:\Users\Shrad\.claude\projects\C--Users-Shrad-interview-alpha\9aea64bb-6ab6-4873-b995-a93563c0c55e.jsonl` (Line 2083)

**Structured output file:** `C:\Users\Shrad\.claude\projects\C--Users-Shrad-interview-alpha\all_30_questions_complete.json`

---

## Questions Breakdown by Role (2 per role, 15 roles total)

### All 30 Questions Organized by Role

1. **SENIOR CONSULTANT** (2 questions)
   - Q1: Sponsor change mid-engagement (insurance transformation)
   - Q2: Conflict of interest - renewable energy project setup

2. **BUSINESS CONSULTANT** (2 questions)
   - Q1: Airline catering food wastage reduction
   - Q2: Power generation sector procurement cycle optimization

3. **TRANSFORMATION CONSULTANT** (2 questions)
   - Q1: Pharmaceutical company ERP consolidation (6 acquisitions)
   - Q2: Retail bank customer activation (35% 90-day churn)

4. **TECHNOLOGY CONSULTANT** (2 questions)
   - Q1: Real-time fraud detection system implementation
   - Q2: Legacy policy administration systems modernization (200 systems)

5. **ADVISORY CONSULTANT** (2 questions)
   - Q1: First-generation entrepreneur succession planning (2,000 crore F&B)
   - Q2: Highway project contract risk management (15,000 crore NHAI)

6. **RISK CONSULTANT** (2 questions)
   - Q1: NBFC rapid loan growth risk assessment (5,000 to 25,000 crore)
   - Q2: Wealth management unauthorized transactions fraud response

7. **HUMAN CAPITAL CONSULTANT** (2 questions)
   - Q1: IT services division spinoff (12,000 employees)
   - Q2: Public sector bank rapid hiring program (8,000 people)

8. **CORPORATE STRATEGY CONSULTANT** (2 questions)
   - Q1: Private sector bank home loan market share growth (4% to target)
   - Q2: Consumer electronics smartphone market entry

9. **DIGITAL CONSULTANT** (2 questions)
   - Q1: Newspaper group digital transformation (3M print, 8M digital users)
   - Q2: FMCG kirana store real-time visibility (45% of sales)

10. **SUPPLY CHAIN CONSULTANT** (2 questions)
    - Q1: Pharmaceutical company FDA inspection failure recovery (40 countries)
    - Q2: Retail chain expansion supply chain scaling (200 new stores)

11. **CONSULTANT** (2 questions)
    - Q1: Private bank NIM compression (3.8% to 2.9%)
    - Q2: Dairy company margin decline due to raw milk costs

12. **STRATEGY CONSULTANT** (2 questions)
    - Q1: Insurance company market share growth (12% to 20% target)
    - Q2: Conglomerate new data center business entry

13. **MANAGEMENT CONSULTANT** (2 questions)
    - Q1: Market sizing - electric two-wheelers India 2027
    - Q2: FMCG premium personal care brand distribution strategy

14. **OPERATIONS CONSULTANT** (2 questions)
    - Q1: Public sector bank back office quality improvement (4.2% error rate)
    - Q2: Home appliance manufacturer inventory reduction (45 vs 28 days)

15. **FINANCIAL ADVISORY CONSULTANT** (2 questions)
    - Q1: LBO evaluation (12x EBITDA, 65% leverage, FMCG)
    - Q2: Fintech PE exit strategy (IPO vs strategic vs secondary)

---

## Complete Field List for Each Question

Each question includes:
- **q** - The case question (complete text)
- **subcategory** - Role name
- **difficulty** - "Hard" (all are Hard)
- **domain** - "consulting" (all are consulting)
- **a** - Complete expert answer with detailed reasoning
- **companies** - List of consulting firms (4-6 per question)
- **roundType** - Interview format (Case Interview, Transaction Advisory, etc.)
- **whatInterviewerTests** - Skills and competencies evaluated
- **commonMistakes** - Array of 4 typical candidate mistakes

---

## Questions Already Added (as per your notes)

Based on your statement, **8 questions have already been added**:

1. **Senior Consultant Q1** - Sponsor change ✓
2. **Business Consultant Q1** - Airline catering wastage ✓
3. **Business Consultant Q2** - Power procurement ✓
4. **Transformation Consultant Q1** - Pharma ERP ✓
5. **Transformation Consultant Q2** - Bank activation ✓
6. **Technology Consultant Q1** - Fraud detection ✓

**Note:** You mentioned 8 questions, but only 6 are clearly identifiable from the question texts extracted. The remaining 2 need verification against the actual file.

---

## Remaining Questions to Add

**Total Remaining: 22-24 questions** (depending on verification of the 2 Senior Consultant questions)

These 22-24 questions need to be added to `src/data/consultingQuestions.js`:

**ROLES WITH ALL QUESTIONS REMAINING:**
- Advisory Consultant (2)
- Risk Consultant (2)
- Human Capital Consultant (2)
- Corporate Strategy Consultant (2)
- Digital Consultant (2)
- Supply Chain Consultant (2)
- Consultant (2)
- Strategy Consultant (2)
- Management Consultant (2)
- Operations Consultant (2)
- Financial Advisory Consultant (2)

**ROLES PARTIALLY ADDED:**
- Senior Consultant: 0-2 remaining (depends on verification)
- Transformation Consultant: 0-1 remaining (depends on verification)
- Technology Consultant: 1 remaining (Q2 system modernization)

---

## Files Generated

1. **all_30_questions_complete.json** - Complete structured data (valid JSON, ready to import)
2. **30_QUESTIONS_SUMMARY.txt** - Summary breakdown
3. **30_QUESTIONS_DETAILED.txt** - Full text of all questions with all fields

---

## Next Steps

1. Verify which of the 8 "already added" questions actually exist in the codebase
2. Add remaining questions to `src/data/consultingQuestions.js`
3. For each role, append to existing `case_interview` array or create if missing
4. Ensure all field mappings match existing questions exactly
5. Test loading all questions in the UI
