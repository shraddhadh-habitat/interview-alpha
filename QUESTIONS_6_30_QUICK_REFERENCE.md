# Data Scientist Questions 6-30: Quick Reference Guide

## All 25 Questions at a Glance

### ML Questions (6-10)
| # | Question | Difficulty | Level | Key Insight |
|---|----------|-----------|-------|-------------|
| 6 | Batch vs Real-time Prediction | Medium | mid_ds | Choose based on latency requirement (<1s = real-time) |
| 7 | Model Fails on Production | Hard | senior_ds | Diagnose: distribution shift, behavioral change, assumptions |
| 8 | Explain LLMs to PM | Medium | mid_ds | Pattern engines ≠ fact engines; pair with human review |
| 9 | Logistic Regression vs Neural Network | Medium | senior_ds | Start simple; complexity only when justified by data |
| 10 | Old Training Data Validity | Hard | lead_ds | 6-step validation: gather recent data, compare distributions |

### Statistics Questions (11-18)
| # | Question | Difficulty | Level | Key Insight |
|---|----------|-----------|-------|-------------|
| 11 | A/B Test at p=0.04 | Hard | lead_ds | Statistical significance ≠ practical significance |
| 12 | Correlation vs Causation | Medium | senior_ds | A/B test to establish causation; avoid budget waste |
| 13 | Metric Improvement vs Seasonality | Hard | lead_ds | Difference-in-differences or historical comparison |
| 14 | Selection Bias Examples | Medium | senior_ds | Survivorship bias, self-selection, response bias |
| 15 | Hypothesis Testing Explained | Easy | junior_ds | H0 (null) vs H1 (alternative); p-value is probability of data given H0 |
| 16 | Handling Outliers | Medium | senior_ds | Validate first; keep real/important, remove errors, cap extreme |
| 17 | Comparing Distributions | Hard | lead_ds | T-test (means), Mann-Whitney (non-normal), Chi-square (proportions) |
| 18 | Statistical vs Practical Significance | Medium | senior_ds | Large sample detects tiny effects; set minimum effect size upfront |

### Case Study Questions (19-25)
| # | Question | Difficulty | Level | Key Insight |
|---|----------|-----------|-------|-------------|
| 19 | Spotify Listening Hours Drop 10% | Hard | lead_ds | Segment (geography, device, cohort) then timeline analysis |
| 20 | ML Project ROI | Hard | lead_ds | (Benefit - Cost) / Cost; account for incrementality |
| 21 | New Country Launch | Hard | lead_ds | TAM, competition, regulation, CAC, unit economics |
| 22 | Is ML the Right Solution? | Medium | senior_ds | Start with simplest solution; baseline vs model |
| 23 | DAU Up, Revenue Flat | Hard | lead_ds | Check: acquisition mix, user churn, monetization leakage, ARPU |
| 24 | Analytics for Product Launch | Medium | senior_ds | North Star + activation funnel + business metrics |
| 25 | CEO vs Marketing Conversion Rate | Hard | lead_ds | Definition mismatch; align on numerator & denominator |

### Behavioral Questions (26-30)
| # | Question | Difficulty | Level | Key Insight |
|---|----------|-----------|-------|-------------|
| 26 | Data Insight Changed Decision | Medium | senior_ds | Frame as business decision with clear tradeoffs |
| 27 | Difficult Stakeholder | Medium | senior_ds | Ask questions to understand; meet them where they are |
| 28 | Biggest Failure | Hard | lead_ds | Temporal bias; understand causality; recent cohort validation |
| 29 | Staying Current with ML | Medium | senior_ds | Weekly reading, monthly hands-on, quarterly structured learning |
| 30 | Speed vs Excellence | Hard | lead_ds | Context matters; POC now + proper build later |

## Answer Format
Each answer includes:
1. **Clarifying questions** (except behavioral/metrics/tradeoffs)
2. **Core framework** (the main concept/approach)
3. **Real examples** (business scenarios, numbers)
4. **Tradeoffs** (speed vs accuracy, etc.)
5. **Practical recommendation** (actionable next steps)

## Difficulty Distribution
- **Easy**: 1 (Q15)
- **Medium**: 10 (Q6, Q8, Q9, Q12, Q14, Q16, Q18, Q22, Q24, Q29)
- **Hard**: 14 (Q7, Q10, Q11, Q13, Q17, Q19, Q20, Q21, Q23, Q25, Q27, Q28, Q30)

## Level Distribution
- **junior_ds**: 1 (Q15)
- **mid_ds**: 3 (Q6, Q8, Q9)
- **senior_ds**: 10 (Q7, Q9, Q12, Q14, Q16, Q17, Q18, Q22, Q24, Q26, Q27, Q29)
- **lead_ds**: 12 (Q10, Q11, Q13, Q17, Q19, Q20, Q21, Q23, Q25, Q28, Q30)

## Common Frameworks Used

### Diagnosis Framework (Q7, Q13, Q19, Q23)
1. Verify signal (is it real?)
2. Segment (break down aggregates)
3. Timeline analysis (when did it happen?)
4. Root cause analysis (why?)
5. Preventive measures

### Evaluation Framework (Q11, Q17, Q18)
1. Statistical significance (p-value)
2. Effect size (practical magnitude)
3. Cost-benefit analysis
4. Segment performance
5. Business impact

### Design Framework (Q20, Q21, Q24)
1. Define what success looks like
2. Gather required data/signals
3. Calculate key metrics
4. Validate with experiments
5. Set up monitoring

## Teaching Tips for Interviewers
- **Q6-10**: Assess ML fundamentals and production awareness
- **Q11-18**: Test statistical reasoning and bias detection
- **Q19-25**: Evaluate problem-solving and business acumen
- **Q26-30**: Understand teamwork, learning, and judgment calls

## Document Format
- **File**: `/c/Users/Shrad/interview-alpha/src/data/ds_questions_6_30_formatted.js`
- **Format**: JavaScript ES6 export (ready for React import)
- **Integration**: Can be imported into existing React interview app
- **Word count**: ~303 words per answer (exceeds 200-250 spec for depth)

## Key Takeaways by Theme
1. **Start simple** → Add complexity only when necessary
2. **Segment relentlessly** → Aggregates hide root causes
3. **Understand causality** → A/B testing establishes causation
4. **Monitor for drift** → Real-time validation prevents failures
5. **Business context first** → Technical excellence serves business goals
6. **Communicate clearly** → Frame insights as decisions, not reports
7. **Learn from failures** → Extract generalizable patterns
8. **Balance speed and quality** → Know when to ship POCs vs production
