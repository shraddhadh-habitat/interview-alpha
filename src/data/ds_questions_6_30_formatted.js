// Data Scientist Questions 6-30: Expert Answers
// Format matches existing pmQuestions.js structure
// Each question: 200-250 words, conversational, with clarifying questions (except behavioral/metrics/tradeoffs)

export const DS_QUESTIONS_6_30 = [
  // Q6: ML Question - Batch vs Real-time Prediction
  {
    q: "What is the difference between batch prediction and real-time prediction? How do you decide?",
    subcategory: "machine_learning",
    difficulty: "Medium",
    a: `Batch prediction processes many samples at once (daily/hourly), while real-time prediction scores individual requests instantly. Before choosing, I'd ask: What's the latency tolerance? Is prediction needed before a user action, or after?

Batch prediction works when decisions can wait. Example: Email spam filtering checks new mail every 30 minutes. You accumulate messages, score them in bulk, apply labels. Efficient, cheap, low infrastructure needs.

Real-time prediction is needed when users see results immediately. Example: Search ranking  -  user types a query, expect results in <500ms. Batch can't work; you need synchronous serving.

Tradeoff 1: Cost vs latency. Batch is cheaper (amortize inference across many samples). Real-time requires low-latency infrastructure (GPUs, caching, optimized code).

Tradeoff 2: Feature freshness. Batch uses day-old features; real-time uses current data. Real-time catches changes instantly but requires feature engineering at request time.

Decision framework: If latency requirement is <1 second, you need real-time. If decisions impact user experience immediately (ads, recommendations), real-time. If decisions are advisory (daily digest emails), batch suffices.

Hybrid approach: Pre-compute expensive components (embeddings) in batch, serve simple scoring in real-time. Example: Nightly update user embeddings; at request time, score current item against cached embedding.

Implementation: Real-time uses REST endpoints or RPC. Batch uses Spark/distributed systems. Monitor real-time latency percentiles (p95, p99), not averages  -  users care about worst-case.

My default: Start batch. If latency becomes a constraint, add real-time layer.`,
    level: "mid_ds",
  },

  // Q7: ML Question - Model Fails on Production
  {
    q: "Your model works perfectly on historical data but fails on new data. What went wrong?",
    subcategory: "machine_learning",
    difficulty: "Hard",
    a: `This is data drift or concept drift. I'd diagnose systematically across three layers: distribution, behavior, and assumptions.

Distribution shift: Is production data different from training? Compare feature statistics (mean, quantiles) for training vs production. If training used 2023 data and you're in 2024, user behavior shifted. Seasonality changes, new user cohorts, technology shifts. I'd compute KL divergence on feature distributions. If divergent, that's your problem.

Behavioral change: User patterns evolve. A model trained to predict "user will click ad" might fail if ad format changed. Or purchasing patterns shifted post-recession. I'd examine user cohorts: new users, returning users, by geography. Performance often degrades on newer cohorts.

Assumption violations: Did you assume all data was labeled correctly? If training data has label noise and production is cleaner (or vice versa), models fail. Did you assume independence? If production has temporal correlation, predictions correlate unpredictably.

Feedback loop failure: Did the model's own predictions change the ground truth? In lending, approving loans changes their outcomes, which changes training data for the next model. Model is technically right but causally wrong.

Fixes: Implement monitoring (track feature distributions, prediction distributions weekly). Retrain frequently (weekly/daily depending on drift). Use domain knowledge to identify likely changes. Set up alerts: if feature X diverges >10%, investigate.

Preventive: Always validate models on held-out recent data, not just historical. Cross-validate with time-based splits (train on 2023, test on 2024), not random splits.`,
    level: "senior_ds",
  },

  // Q8: ML Question - LLMs Explained to PM
  {
    q: "Explain LLMs to a product manager. What can they do and what can't they do?",
    subcategory: "machine_learning",
    difficulty: "Medium",
    a: `I'd start with: LLMs are pattern-recognition engines trained on internet text. They're very good at generating fluent, contextually-relevant text. They're not good at tasks requiring grounding in reality or exact computation.

What they excel at: Writing, summarization, translation, answering questions about text, coding assistance, brainstorming. They're useful when approximate, fluent output suffices.

Real examples: "Draft a customer service response"  -  great. "Summarize this 50-page document"  -  great. "Write product copy"  -  great. "Classify 10,000 support tickets"  -  works but needs validation.

What they fail at: Counting (ask GPT to count words in a sentence, it often fails). Arithmetic beyond simple operations. Factual recall (they hallucinate confidently). Real-time data (knowledge cutoff is old). Private information they weren't trained on. Tasks requiring multi-step logic or external tool integration.

Critical limitations: Hallucinations. LLMs generate plausible-sounding text even when false. A customer asks "Is Product X compatible with iOS 14?" and the model invents an answer. Dangerous for customer support.

Cost and latency. LLMs are expensive to run ($0.01-1 per inference). Latency is high (1-5 seconds typically). Not suitable for millisecond-latency applications.

When to use: Customer support (draft responses, classify tickets), content generation, code suggestions, internal tools. When to avoid: financial advice without verification, legal guidance, anything requiring factual accuracy, real-time systems.

My recommendation: LLMs are powerful assistants, not replacements. Pair them with human review, fact-checking, and grounding in real data.`,
    level: "mid_ds",
  },

  // Q9: ML Question - Logistic Regression vs Neural Network
  {
    q: "How do you choose between a simple logistic regression and a complex neural network?",
    subcategory: "machine_learning",
    difficulty: "Medium",
    a: `I'd start with a clarifying question: What's the cost of errors, and what operational burden can we sustain?

My default: Start simple (logistic regression). It's fast to train, easy to explain, often performs well. If it fails, complexity is justified. If it works, ship it.

Logistic regression works when: The relationship between features and target is roughly linear. You have moderate data (100K-1M samples). You need to explain decisions ("User X has 95% churn risk because engagement dropped 30%"). You need fast inference (<10ms).

Neural networks win when: Data is massive (10M+ samples) and relationships are highly non-linear. Raw features are unstructured (images, text). You need state-of-the-art performance and can afford engineering overhead.

Tradeoff 1: Performance vs interpretability. A neural network might achieve 92% accuracy vs 85% for logistic regression. Is that 7% worth months of debugging, retraining complexity, and "we can't explain this decision"? For high-stakes decisions (medical diagnosis, loan approvals), interpretability often wins.

Tradeoff 2: Training time and cost. Logistic regression trains in seconds on a laptop. Neural networks require GPUs, hours of tuning, ongoing maintenance.

Practical approach: Logistic regression baseline takes 1-2 days. If it gets 80% accuracy and the problem needs 95%, invest in neural networks. If it gets 85% and business is happy, move on.

Reality check: I've seen teams use neural networks where logistic regression + feature engineering would suffice. Resist overcomplexity. Start simple. Iterate toward complexity only when necessary.

My recommendation: Logistic regression + good features beats a poorly-tuned neural network every time.`,
    level: "senior_ds",
  },

  // Q10: ML Question - Old Training Data Validity
  {
    q: "Your training data is 2 years old. How do you assess if your model is still valid?",
    subcategory: "machine_learning",
    difficulty: "Hard",
    a: `Two years is a long time. User behavior, seasonality, external events shift. I'd assess validity systematically.

Step 1: Gather recent labeled data (if possible). Score the model on recent data. Does accuracy match the original? If original was 85% and recent is 72%, the model degraded. Quantify the gap.

Step 2: Compare feature distributions. For each feature used in training, compute statistics (mean, quantiles) for 2-year-old data vs today. If distributions diverged significantly, underlying patterns likely changed.

Step 3: Check if the prediction target itself changed. Example: Model predicts "churn in next 30 days." Did churn rate change? (Maybe retention improved company-wide.) Did churn patterns change? (Maybe the cohort that churned 2 years ago is different today.)

Step 4: Examine business context. What changed? Did product features launch? Did market shift? Did user demographics change? Did a competitor enter? These change the relationships your model learned.

Step 5: Segmentation check. Model might work for some user segments but not others. Performance might degrade for new users but hold for existing users.

Step 6: Live validation (if possible). A/B test: use the old model for 10% of traffic. Compare outcomes vs business heuristics. If the model performs worse than a simple rule, it's stale.

Practical decision: If accuracy dropped >10%, retrain. If computational cost is low, retrain annually regardless. If you're unsure, use the model for low-stakes decisions only until you can validate.

Preventive: Never train a model and shelve it for years. Plan for retraining. Monitor prediction distributions in production. Set up automated retraining pipelines.`,
    level: "lead_ds",
  },

  // Q11: Statistics - A/B Test at p=0.04
  {
    q: "An A/B test shows 2% improvement with p-value 0.04. Should we ship? Walk me through your reasoning.",
    subcategory: "statistics",
    difficulty: "Hard",
    a: `P-value 0.04 means: if there's no true effect, we'd see this result (or more extreme) 4% of the time by chance. Conventionally, p<0.05 is "significant," so technically, yes, we found an effect.

But I'd push back on three fronts:

First, practical significance. A 2% improvement on what metric? If conversion goes from 50% to 51%, that's 2% absolute improvement. If it goes 3% to 3.06%, that's 2% relative improvement. Magnitude matters. On $100M revenue, 2% is $2M. On $1M, it's $20K. Is it worth engineering effort to ship?

Second, p-value is fragile at 0.04. I'm at the edge of significance. This suggests either a weak true effect, or we got lucky. A borderline p-value needs scrutiny: What was the sample size? Did we run the test long enough (at least 1 week, ideally 2 to smooth day-of-week effects)? Did we peek mid-way and decide to continue (multiple comparisons inflates false positive risk)?

Third, secondary metrics and business context. Did the improvement come with tradeoffs? Did engagement drop? Did retention suffer? Did operational complexity increase? A 2% conversion lift is worthless if it damages long-term metrics.

My decision framework: If the 2% lift is on a core metric (revenue, retention), persists across user segments, secondary metrics are neutral or positive, and engineering cost is low, ship it. If it's on a vanity metric, driven by one user segment, or expensive to maintain, don't.

Realistic answer: Two years of shipping marginal wins (2-3% each) compounds. But single tests below p=0.05 carry false positive risk. I'd want Bayesian perspective before committing.`,
    level: "lead_ds",
  },

  // Q12: Statistics - Correlation vs Causation
  {
    q: "How do you explain correlation vs causation to a marketing team that wants to increase spend based on a correlation?",
    subcategory: "statistics",
    difficulty: "Medium",
    a: `Marketing comes in: "Social media engagement is correlated 0.8 with conversions. Let's increase social spend." I'd start with empathy: they see a pattern and want to exploit it. Good instinct, wrong reasoning.

Correlation: Variable A and B move together. Social engagement and conversions both go up during sales events. That's correlation.

Causation: Changes in A cause changes in B. But a third variable (sales event) causes both. It's a confound, not causation.

I'd use this example: Ice cream sales correlate with drowning deaths. Should lifeguards reduce staffing? No. Summer causes both.

Real business example: "Users who watch educational videos convert at 2x rate." Confound? Users who watch videos are inherently more engaged, more likely to convert anyway. Education videos didn't cause conversion; engagement-level did.

How to rule out causation: A/B test. Randomly assign marketing spend to social vs control. If social spend causally drives conversions, treatment group converts more. If it's just correlation, control group converts equally.

Alternative if you can't A/B test: Use causal inference techniques (instrumental variables, propensity score matching) to control for confounds. Or find a natural experiment.

What I'd recommend: "Let's A/B test increasing social spend on 10% of users. Measure conversion impact. If it works, expand. If not, we'll know the correlation was spurious." This is cheap insurance against wasting budget.

Why it matters: Correlation-based decisions lead to wasted spend. You increase social budget, but the confound (engagement level) isn't addressed, so conversions don't improve. Causation is the only thing that moves the needle.`,
    level: "senior_ds",
  },

  // Q13: Statistics - Metric Improvement with Seasonality
  {
    q: "Your metric improved but you're not sure if it's because of your change or seasonality. How do you separate the effects?",
    subcategory: "statistics",
    difficulty: "Hard",
    a: `This is a classic confound. Let me use an example: Q4 revenue is up 20% after we launched a marketing campaign. Did the campaign work, or is Q4 naturally higher (holidays)?

Approach 1: Historical comparison. What was Q4 growth last year, the year before? If Q4 typically grows 15-18%, and we're at 20%, the campaign might have added 2-5%. If Q4 is usually flat and we're up 20%, the campaign likely worked.

Approach 2: Segmentation by seasonality. If seasonality affects all cohorts equally, I'd segment by user acquisition date. New users acquired during the campaign have no historical baseline, so you can measure their conversion cleanly. Existing users have historical behavior; compare them to same periods last year.

Approach 3: Difference-in-differences. Find a control group unaffected by your change. Example: You run a campaign in US only. Use EU (no campaign) as control. Measure: growth in US - growth in EU. The difference isolates your campaign's effect from seasonality (which affects both regions).

Approach 4: Time series decomposition. Use statistical methods (STL decomposition, ARIMA) to separate trend, seasonality, and residuals. The residual is unexplained variation (hopefully your campaign).

Approach 5: Bayesian prior. Before the campaign, what was Q4 seasonality? Express that as a prior distribution. After the campaign, update with new data. The posterior gives your belief about the campaign's true effect.

I'd rank them: A/B test (cleanest), difference-in-differences (good if can't A/B test), historical comparison (practical if clean baselines exist).

In practice: Most teams do historical + segmentation, which catches major seasonality but not all confounds.`,
    level: "lead_ds",
  },

  // Q14: Statistics - Selection Bias Examples
  {
    q: "What is selection bias? Give 3 examples from real business scenarios.",
    subcategory: "statistics",
    difficulty: "Medium",
    a: `Selection bias occurs when the sample differs systematically from the population you're trying to understand. Your data isn't representative.

Example 1: Survivorship bias. A company analyzes "what made our successful customers successful." They interview 100 customers who stayed long-term and spent money. But they ignore 1,000 customers who churned. Conclusion: "Successful customers are highly engaged at signup." Problem: that's selection bias. Churn customers were also engaged initially; you're not seeing why they left. Population (all customers) differs from sample (successful survivors).

Business impact: You optimize onboarding for engagement, but engagement doesn't prevent churn for customers who leave.

Example 2: Self-selection bias. You survey customers: "How satisfied are you?" Only satisfied customers respond (goodwill). Dissatisfied customers ignore surveys. Your average satisfaction is biased upward. Conclusion: "Customers are 4.5/5 satisfied." Reality: you're asking a biased subset. Population = all customers; sample = motivated responders.

Business impact: You think product is fine. You miss problems affecting the silent majority.

Example 3: Response bias in A/B tests. You run an experiment offering discounts to half your users. But users who see the discount and engage are systematically different (price-sensitive, deal-hunting) from users who ignore it. You measure conversion on the discount group only. Conclusion: "Discount increases conversion 5%." Reality: discount-responsive users self-select; non-responsive users (perhaps loyal, high-LTV) aren't captured.

How to spot and fix: Always define your population precisely (all customers? active customers? new customers?). Ensure sample matches. Use random sampling. If that's impossible, weight the sample to match population distributions.`,
    level: "senior_ds",
  },

  // Q15: Statistics - Hypothesis Testing Explained
  {
    q: "Explain hypothesis testing to someone who has never taken a statistics course.",
    subcategory: "statistics",
    difficulty: "Easy",
    a: `I'd use a legal analogy. Hypothesis testing is like a trial.

Null hypothesis (H0): The defendant is innocent. We assume this is true.

Alternative hypothesis (H1): The defendant is guilty.

You present evidence. If evidence is strong enough, you reject the null hypothesis (declare guilty). If evidence is weak, you fail to reject the null (not guilty verdict).

Key: You never "prove" innocence. You only decide if evidence is sufficient to declare guilt. Same in statistics.

Business example: Company thinks a new feature will increase user retention. They run an experiment on 10,000 users.

H0: The feature has no effect. Retention is the same as before (maybe 50%).

H1: The feature increases retention.

They run the test, find 51% retention in treatment group. Is 51% strong evidence? Or could it be luck (random noise)?

This is where p-value comes in. P-value answers: "If the feature truly has no effect, what's the probability I'd observe this result by chance?"

If p-value is 0.02, that means: "If there's no real effect, I'd see this result 2% of the time just from random luck."

Threshold: Typically, if p<0.05, we say "evidence is strong enough, we believe the feature works."

Important: A p-value is NOT the probability that your hypothesis is true. It's the probability of observing your result given that the null hypothesis is true (flipped logic, which confuses people).

Practical takeaway: Low p-value = evidence for your alternative hypothesis. High p-value = not enough evidence; stick with the null.

Common mistake: p-value 0.06 is not much different from 0.04. Both are borderline. Don't think of 0.05 as a hard cliff.`,
    level: "junior_ds",
  },

  // Q16: Statistics - Handling Outliers
  {
    q: "Your data has extreme outliers. How do you decide whether to keep, cap, or remove them?",
    subcategory: "statistics",
    difficulty: "Medium",
    a: `Outliers matter. I'd ask: Are they errors, or real phenomena?

Real outliers: A customer makes a $100K purchase while the median is $500. That's real. A 10-year customer with 0 engagement is unusual but legitimate.

Errors: A user's age is recorded as -5 years. Temperature reading is 500°C in a location that never exceeds 40°C. Typos, sensor failures, data entry mistakes.

My decision framework:

Step 1: Validate. Are outliers data quality issues or real? Check the source. A $100K transaction might be real (confirmed by payment processor). A 500°C temperature is likely an error (impossible).

Step 2: Understand impact. How much do outliers distort your analysis? If predicting median purchase amount, outliers matter little. If predicting mean (average), one $100K sale inflates the average significantly.

Step 3: Decide based on the task:

Keep: If outliers represent real, important phenomena. Example: predicting customer lifetime value  -  the $100K customer is valuable and real. Ignoring them underestimates true value.

Remove: If outliers are errors, and their impact is large. Example: 0.1% of temperature readings are impossible values (sensor failures). Remove them; they're noise.

Cap (winsorization): If outliers are real but extreme. Example: salary data has $10M outliers (CEOs). Capping them at 99th percentile (say, $500K) keeps their influence while preventing extreme distortion. Useful for models sensitive to scale (linear regression, neural networks).

Transform: Log transformation can compress outliers. Instead of raw values, use log(value). Reduces leverage of extreme values without removing them.

Step 4: For models, test both. Train with and without outliers. Measure validation performance. If including outliers hurts generalization, remove them. If it helps, keep them.

Bottom line: Don't blindly remove outliers. Understand them first. They're often the most interesting data points.`,
    level: "senior_ds",
  },

  // Q17: Statistics - Comparing Distributions
  {
    q: "How do you measure if two distributions are significantly different? What test do you use and why?",
    subcategory: "statistics",
    difficulty: "Hard",
    a: `The answer depends on the data type and assumptions. Let me walk through the logic.

For comparing means of two groups: t-test (assumes normal distribution, continuous data). Example: Control group has average CTR 5%, treatment 5.5%. T-test tells you if the 0.5% difference is statistically significant.

Assumptions matter: If data is non-normal or sample size is small, t-test can fail. For safety, use Mann-Whitney U test (non-parametric, doesn't assume normality).

For comparing distributions overall (not just means): Kolmogorov-Smirnov test. It compares the cumulative distribution functions (CDFs) of two groups. Useful if you care whether entire distributions differ, not just centers.

For proportions (categorical data): Chi-square test. Example: Does proportion of users who convert differ between control and treatment? Chi-square compares observed vs expected frequencies.

For time series or dependent samples: Paired t-test (accounts for correlation between measurements).

Practical recommendation: For A/B test results (comparing treatment vs control), I'd use:
 -  Two-sample t-test if data is roughly normal and large sample
 -  Mann-Whitney U if you're uncertain about normality
 -  Chi-square if the metric is a proportion (conversion rate, yes/no)

But honestly, with large samples (1000+ per group), t-test is robust even for non-normal data (Central Limit Theorem). I'd default to t-test unless there's reason not to.

Why not always use one test? Different tests have different power (ability to detect true effects) under different data distributions. A test powerful for normal data might miss effects in heavy-tailed data.

My workflow: Run simple t-test first. If p-value is clearly <0.01 or >0.1, you don't need advanced tests. If it's borderline (0.04-0.06), validate with Mann-Whitney. If both agree, you're confident.`,
    level: "lead_ds",
  },

  // Q18: Statistics - Statistical vs Practical Significance
  {
    q: "Explain the difference between statistical significance and practical significance with a business example.",
    subcategory: "statistics",
    difficulty: "Medium",
    a: `Statistical significance: The result is unlikely due to chance (p<0.05).

Practical significance: The result matters for business decisions.

These don't always align.

Example: Large e-commerce site tests a checkout layout change. New layout has 2% higher conversion rate. With 500K test users, this difference has p<0.001 (statistically significant). But practically: revenue increase is $50K monthly on a $50M revenue base (0.1%). Is it worth the engineering cost to maintain a new checkout flow? Maybe not.

Another angle: Testing on 100M users (huge sample), you might find a 0.1% difference with p<0.05. Technically significant, practically trivial.

Reverse scenario: Small startup (10K monthly users) tests a feature that improves conversion by 10%. With small sample size, p=0.08 (not statistically significant). But 10% improvement is huge for a startup; should they deploy? Maybe (as a beta), then monitor as more data arrives.

Why the difference exists: Statistical significance depends on sample size. Large samples detect tiny effects. Small samples miss large effects by chance.

Business framework: Statistical significance is necessary but not sufficient. Ask:

1. Effect size: How big is the improvement? (2% is small; 10% is large)
2. Confidence: How confident are we? (p<0.05 vs p<0.001)
3. Cost: How much effort to ship and maintain?
4. Risk: What's the downside if we're wrong?
5. Precedent: Does this 0.1% lift matter given 50 other features moving the needle?

Decision: Statistical significance + practical significance + cost < benefit = ship.

In practice: I'd set a minimum effect size before running the test. "We'll only ship if conversion improves >1%," regardless of p-value. This prevents chasing statistically significant noise.`,
    level: "senior_ds",
  },

  // Q19: Case Study - Spotify Listening Hours Drop
  {
    q: "Spotify's weekly listening hours dropped 10% last month. How would you investigate?",
    subcategory: "case_studies",
    difficulty: "Hard",
    a: `A 10% drop is severe. I'd structure the investigation in 48 hours.

Step 1 (immediate): Verify the signal. Is it real or a measurement issue? Check: Did tracking change? Did data pipeline break? Confirm the metric across multiple sources (app logs, web logs, backend events). If all sources show the drop, it's real.

Step 2 (4 hours): Segment to isolate cause. A 10% drop likely has a single root or two compounded issues. Break down by:
 -  Geography (US, EU, Asia): Did one region drop more?
 -  Playlist type (Discover Weekly, Release Radar, Liked Songs): Did users stop engaging with discovery features?
 -  Device (mobile, web, desktop): Did app quality degrade?
 -  User cohort (new, old, premium vs free): Did one group churn?
 -  Content type (music vs podcasts): Did one category drop?

Step 3 (8 hours): Timeline analysis. When exactly did the drop occur? Sudden drop (within hours) suggests a feature deployment, outage, or algorithmic change. Gradual decline (over weeks) suggests longer-term trend (seasonality, competition, market change).

Cross-reference: What shipped in the week before? Algorithm update? UI redesign? Pricing change?

Step 4: User behavior signals. Did users abandon features? (Stop using Discover Weekly?) Did session length drop, or just frequency? Did users switch to competitors (infer from app uninstalls)?

Step 5: External factors. Is this seasonal? (Summer vacation? Holiday?). Did major competitor launch? Did platform outage occur?

Root cause often: Combination. New feature (poor UX) + seasonal dip + competitor action.

Fix: If feature-driven, rollback or iterate. If seasonal, this is expected. If competitive, improve recommendations.

Communication: Flag to leadership immediately with segmentation data, not just "listening hours down 10%."`,
    level: "lead_ds",
  },

  // Q20: Case Study - ML Project ROI
  {
    q: "How would you measure the ROI of a machine learning project to justify continued investment?",
    subcategory: "case_studies",
    difficulty: "Hard",
    a: `ROI = (Benefit - Cost) / Cost. For ML projects, benefits are indirect and costs are often underestimated.

Step 1: Quantify benefit. What business metric improves? Examples:
 -  Recommendation system: measure incremental revenue per user. If model adds $2/user/month and there are 10M users, benefit is $20M monthly.
 -  Churn prediction: measure intervention effectiveness. If model identifies 10K at-risk customers, and retention campaign saves 2K at $1K LTV per customer, benefit is $2M.
 -  Fraud detection: measure fraud prevented. If model catches fraud worth $500K/month at 80% precision, benefit is $400K.

Step 2: Quantify cost. Include:
 -  Data infrastructure (storage, pipelines, ETL): $500K/year
 -  ML engineering (salaries, tools): $1M/year
 -  Monitoring and retraining: $200K/year
 -  Opportunity cost (team could work on other projects)

Total: $1.7M/year for this example.

Step 3: Calculate ROI. If benefit is $20M and cost is $1.7M, ROI = ($20M - $1.7M) / $1.7M = 1076% (annual return).

Step 4: Reality-check with incrementality. Would this benefit exist without the model? If Spotify doesn't have recommendations, they lose some users but not all revenue. Measure incrementally: revenue with model - revenue with simple baseline.

Step 5: Consider risk and time-to-value. An ML project costs $1.7M upfront but might take 6 months to show benefit. Compare to an engineering project costing $500K that ships in 2 months. The engineering project might have better ROI when accounting for time value of money.

Communication: Show the calculation. "This model generates $20M in value at $1.7M cost. Break-even is 1 month. I recommend continuation."

Gotchas: Benefits often grow over time. Costs can compound if the model requires constant retraining. Set up quarterly reviews to reassess.`,
    level: "lead_ds",
  },

  // Q21: Case Study - New Country Launch
  {
    q: "Your company wants to launch in a new country. What data would you analyze to decide which country?",
    subcategory: "case_studies",
    difficulty: "Hard",
    a: `I'd need to clarify: What's the business model? (SaaS, marketplace, ads?). What's the product? Who are target users? But I'll assume a B2C product and walk through a framework.

Market size: Population, internet penetration, target demographic (age, income). Example: India has 1.4B people but lower income; Canada has 40M people but higher purchasing power. Use GDP per capita as proxy for willingness-to-pay.

Competitive landscape: Who else operates there? Are they dominant, or is there room for new entry? Use app store rankings, company reports.

Regulatory environment: Are there restrictions (data privacy, payment methods, content)? EU has GDPR (cost and complexity); China has censorship and payment restrictions.

Customer acquisition cost (CAC) and conversion rate: This varies by market. Get data from competitors, reports, or pilot tests. Some markets have high CAC (saturated, competitive) or low conversion (low trust in digital products).

Unit economics: Revenue per user - costs per user. Example: SaaS product generates $10/user/month (subscription). Cost to acquire is $50. Payback period is 5 months. If regulatory costs add $100/user in this country, unit economics break.

Cohort data (if available): If your company operates elsewhere, analyze: Which countries have highest lifetime value? Fastest growth? Lowest churn? Replicate that pattern.

Decision framework: Rank countries by:
 -  TAM (Total Addressable Market): How many potential customers?
 -  Favorability: Regulatory ease, competitive intensity, customer acquisition ease?
 -  Unit economics: Will you make money?

Recommendation: Pilot in 1-2 high-potential countries. Allocate $500K to marketing, learn CAC and conversion rate. Extend only if unit economics work.

Red flags: Tiny TAM, high regulatory burden, high CAC, low conversion.`,
    level: "lead_ds",
  },

  // Q22: Case Study - Is ML the Right Solution?
  {
    q: "A product team asks you to build a model. How do you decide if ML is even the right solution?",
    subcategory: "case_studies",
    difficulty: "Medium",
    a: `Too many teams jump to "let's build a model" without asking if it's necessary. I'd push back with questions.

First: What problem are we solving? Be specific. "User retention is low" is vague. "New users under age 25 churn at 40% by day 30" is concrete.

Second: Is the problem actually hard? Can a rule or heuristic solve it?

Example: "We want to recommend products." Simple rule: "Show items popular in user's category." A/B test this against a baseline. If it performs decently, ship it. Don't build an ML model if the rule works.

Contrast: "We want to predict rare fraud within 100ms." A rule-based system might catch 70% of fraud; an ML model catches 90%. The 20% improvement justifies the complexity.

Third: Do we have data? ML requires historical data to learn from. New product? No churn data. Cold-start problem: rules or manual curation might be better.

Fourth: What's the cost of being wrong? Recommendation system wrong → annoyed user. Credit decision wrong → financial loss. Loan approvals need higher accuracy, which might justify ML. Recommendations might be fine with simple rules.

Fifth: Operational burden. ML requires monitoring, retraining, debugging drifting models. Rule-based systems are simpler to maintain. If the team can't sustain ML infrastructure, use rules.

My recommendation: Start with the simplest solution. Measure baseline. If you beat it with the simple approach, ship that. If the simple approach caps out and you need more accuracy, then invest in ML.

Questions to ask: "What's the baseline (no ML)?" "How much would 10% improvement in accuracy impact business?" "Do we have data to train on?" "Can the team maintain this long-term?" If answers suggest ML isn't justified, don't build it.`,
    level: "senior_ds",
  },

  // Q23: Case Study - DAU Up, Revenue Flat
  {
    q: "Your dashboard shows DAU is up 15% but revenue is flat. What's happening?",
    subcategory: "case_studies",
    difficulty: "Hard",
    a: `DAU up but revenue flat is a classic disconnect. I'd segment relentlessly.

Hypothesis 1: You're acquiring low-monetization users. Segment DAU increase by acquisition channel. Did organic grow more than paid? Organic users might be less engaged, lower purchase intent. Did international users increase? Emerging markets have lower purchasing power.

Fix: Examine the cohorts that drove DAU growth. If they're low-monetization, re-optimize acquisition toward high-monetization cohorts.

Hypothesis 2: Existing users decreased spending. Segment by user tenure. Did daily active older users drop, while new users increased? If old users (high LTV) churned and new users (low monetization) replaced them, DAU looks good but revenue suffers.

Check: Did product change drive old users away? (Feature removal, price increase, new friction?)

Hypothesis 3: Monetization leakage. More users, but fewer convert. Segment by funnel stage. Did click-through-rate drop (users engage but don't click ads)? Did conversion rate drop (click but don't buy)? Did average order value drop (purchase smaller items)?

Fix depends: If CTR dropped, ads might be misplaced. If conversion dropped, product quality or trust issue. If AOV dropped, price elasticity or inventory issue.

Hypothesis 4: Mix shift. You now have more free users and fewer premium users. Calculate: Revenue per user (ARPU). If ARPU stayed flat while DAU grew, you're acquiring free users. Flat revenue despite DAU growth means new users monetize at lower rate.

Check subscription split: free vs premium ratio.

Hypothesis 5: Short-term boost, long-term loss. DAU spike from marketing campaign, but those users churn quickly (low LTV). Revenue flat because new users don't stick long enough to generate revenue.

Fix: Measure cohort retention. Isolate the cohorts acquired during the DAU spike. Do they retain? Do they convert? If not, the growth is hollow.

My recommendation: Calculate revenue per DAU for each day. If it's trending down, the issue is clear (more users, lower monetization). Segment by acquisition source, user tenure, geography to locate the low-monetization segment. Re-optimize toward higher-monetization users.`,
    level: "lead_ds",
  },

  // Q24: Case Study - Analytics for Product Launch
  {
    q: "How would you set up analytics for a product launching from zero? What do you track from day one?",
    subcategory: "case_studies",
    difficulty: "Medium",
    a: `Day 1 analytics is about learning quickly with minimal infrastructure. I'd focus on three metrics.

Primary (North Star): What are you optimizing for? For a social app: daily active users (DAU). For SaaS: free-to-paid conversion. For marketplace: GMV (gross merchandise value). Pick one that reflects product-market fit. Don't track 20 metrics; pick one.

Secondary (activation funnel): How do users get from signup to value? Track step-by-step. Example: installs → signup → first action → day-1 return → day-7 return. Identify where people drop. If 50% don't complete signup, your onboarding is broken.

Tertiary (business metrics): Revenue (if applicable), cost-per-user (to validate unit economics).

Infrastructure (day 1): Don't over-engineer. A simple event logging system suffices. For mobile app: use Firebase or Mixpanel. For web: Google Analytics. Log events: user_signup, feature_usage, purchase, churn_signal.

What to log from day 1:

Core events:
 -  Signup (timestamp, source: organic/paid/referral)
 -  First action (which feature did they use?)
 -  Engagement (time-in-app, features used per session)
 -  Conversion (purchase, subscription, or business goal)
 -  Churn signal (uninstall, 3-day inactivity, explicit disengagement)

Contextual data:
 -  Device (iOS/Android/web)
 -  Geography
 -  User cohort (new, returning)
 -  Attribution (where did user come from?)

Don't track: Everything. Too much noise. Start with core, add signals as questions arise.

Alerts: Set up dashboards tracking daily DAU, signup rate, conversion rate. Alert if any drop >20% (catches issues).

Iteration: Week 1, measure DAU and funnel. Identify biggest drop-off. Fix it. Iterate. Week 2, revisit. This rapid feedback loop beats overthinking analytics.

Avoid: Vanity metrics (total signups is useless; care about retention). Complex cohorts (you don't have data yet). Premature optimization (focus on learning first).`,
    level: "senior_ds",
  },

  // Q25: Case Study - CEO vs Marketing Conversion Rate
  {
    q: "The CEO says our conversion rate is 3%. The marketing team says it's 8%. Both are using the same database. What's going on?",
    subcategory: "case_studies",
    difficulty: "Hard",
    a: `Classic metric definition mismatch. Same data, different denominator or numerator.

Question 1: What's the numerator (conversions)?
 -  CEO might count: "Users who purchased anything in the past month." = 1000 conversions.
 -  Marketing might count: "Users who clicked 'Buy Now' button." = 2600 clicks (includes multi-click users, cart abandoners).
These are different populations.

Question 2: What's the denominator (conversion rate = conversions / total)?
 -  CEO might use: "Total monthly active users." = 30,000. Rate = 1000/30,000 = 3.3%.
 -  Marketing might use: "Users who reached checkout page." = 32,500. Rate = 2600/32,500 = 8%.

Same numerator (conversions), different denominators → different rates.

This is common. CEO focuses on the entire user base ("engagement metric"). Marketing focuses on qualified traffic ("user intent").

Other causes:

Time window: CEO counts "conversions this month." Marketing counts "conversions in the past 14 days" (overlapping periods). Different numerators.

Device: CEO includes mobile + desktop. Marketing counts desktop-only (where conversion is higher). 8% on desktop, 2% on mobile, blended 3%.

Attribution: CEO assigns conversion to the user's first source. Marketing assigns to the last click before conversion. Same user converts; different credit.

Bot/spam: CEO filters bot traffic (real conversions). Marketing counts all traffic including bots (inflates denominator, deflates rate).

How to resolve:

1. Agree on definitions upfront. Write it down: "Conversion = purchase completed, not initiated. Denominator = unique users who visited product pages in the past 30 days."

2. Compute both definitions. Show them side-by-side: "By CEO definition, conversion rate is 3%. By marketing definition, it's 8%."

3. Agree which to use as the North Star. (Usually the CEO definition, since it reflects business impact.)

4. Implement tracking to ensure both teams use the same database query/definition. Use a shared metric (calculated once, used everywhere).`,
    level: "lead_ds",
  },

  // Q26: Behavioral - Data Insight Changed Decision
  {
    q: "Tell me about a time you delivered a data insight that changed a business decision.",
    subcategory: "behavioral",
    difficulty: "Medium",
    a: `Context: I was working at a SaaS company (fraud detection), and the CEO wanted to tighten KYC (know-your-customer) requirements to reduce fraud. Stricter requirements meant more users would fail verification.

Data discovery: I analyzed the prior 12 months of fraudulent accounts. I expected fraud to correlate with weak KYC. Instead, I found: 60% of fraud came from accounts that passed strict KYC verification (sophisticated fraudsters, real documentation). Tightening KYC wouldn't help.

The deeper insight: Fraud correlated with behavioral signals after account creation (unusual transaction patterns, rapid money movement), not verification difficulty.

I segmented fraud by category: 60% behavioral anomalies (post-signup signals), 25% identity theft (stolen documents that passed KYC), 15% chargebacks (legitimate purchases reversed).

Recommendation: Instead of tightening KYC, invest in post-signup monitoring (real-time transaction analysis). I showed a cost-benefit model: tightening KYC would reduce fraud by ~15%, but lose 8% of legitimate users. Behavioral monitoring would reduce fraud by ~65% without harming legitimate users.

Result: CEO shifted strategy. The company built a real-time transaction monitoring system. Fraud dropped 60%, and user acquisition actually improved (because onboarding was easier).

Key to success: I didn't just report the data. I framed it as a business decision (speed to market vs fraud prevention vs user acquisition). I showed the math. I offered a recommendation with clear tradeoffs.

Lesson: Data insights matter when they change behavior. That required understanding the CEO's actual problem (reduce fraud without losing users), not just answering the literal question (should we tighten KYC?).`,
    level: "senior_ds",
  },

  // Q27: Behavioral - Difficult Stakeholder
  {
    q: "Describe a time you had to work with a difficult stakeholder who didn't trust data.",
    subcategory: "behavioral",
    difficulty: "Medium",
    a: `Context: Working as a data analyst for a marketing director. I was tasked to measure the impact of a $2M paid campaign. Preliminary results showed the campaign underperformed benchmarks (2% ROI vs 5% expected).

The challenge: The director dismissed my finding. "The data is wrong. My intuition says this campaign is working. Maybe your attribution model is broken." No interest in diving into the methodology.

Approach: I didn't argue back (never works). Instead, I asked questions to understand their skepticism. "What results were you expecting? What would convince you the campaign is working or not?"

They said: "I know the campaign drove traffic. I can see engagement metrics."

Aha. We were measuring different things. They were tracking engagement (clicks, time-on-site). I was tracking ROI (revenue). Those diverged.

I proposed: Let's segment the data. "Which channels within the campaign drove engagement?" We found: Social ads drove huge clicks but zero revenue. Search ads drove low volume but high revenue. The campaign was imbalanced toward low-ROI channels.

Recommendation: Reallocate budget from social to search. Don't kill the campaign; optimize it.

Result: They respected that approach (acknowledged their metric, reframed the problem). Budget was rebalanced. ROI improved to 3.8% (not 5%, but much better). Most importantly, they trusted the next analysis because we started from their perspective, not ours.

Key lesson: Stakeholder distrust often comes from misalignment on definitions or goals. Before trying to convince someone, understand what would convince them. Meet them where they are.`,
    level: "senior_ds",
  },

  // Q28: Behavioral - Biggest Failure
  {
    q: "Tell me about your biggest data science failure. What happened and what did you learn?",
    subcategory: "behavioral",
    difficulty: "Hard",
    a: `Context: Early in my career, I built a customer churn prediction model for a subscription company. Model had 88% accuracy on test data. I was confident.

Deployment and failure: We deployed the model to identify at-risk customers for a retention campaign. But the model's predictions didn't match reality. Customers we predicted would churn kept paying. Customers we predicted would stay, churned.

Root cause analysis: I realized I'd made a critical error during training. I trained the model on "customers who have already churned" vs "customers who stayed." But this meant my training data had a huge bias: I was learning patterns in churned customers, not predictive signals of future churn.

Example: A feature was "customer opened support ticket last month." High support ticket count = high probability of churn (in historical data). But that's correlation, not causation. Customers who opened support tickets were already in distress; by the time they opened a ticket, they were likely to churn anyway.

Real predictive signal I missed: Customers who decreased usage frequency gradually (slow engagement decline) were at risk. But I didn't capture gradual patterns because I only had snapshots.

Consequence: The retention campaign contacted customers who weren't actually at risk. Resources wasted. False positives hurt because contacting low-churn-risk customers can actually annoy them, accelerating churn.

Lesson 1: Understand your training data distribution. Am I learning "who churned" or "who will churn"? Temporal dynamics matter. If features are collected after the event, they're not predictive.

Lesson 2: Validate on recent cohorts, not just overall accuracy. A cohort acquired 6 months ago is the true test of predictability.

Lesson 3: Talk to the business to understand the causal mechanism. Why do people churn? Ask 10 churned customers. Their reasons might not match your model's features.

Since then, I always:
 -  Spend time understanding data causality, not just correlation.
 -  Validate on holdout recent data (time-based split).
 -  A/B test models in production before full deployment.
 -  Build feedback loops (flag predicted churners, measure actual churn, retrain).`,
    level: "lead_ds",
  },

  // Q29: Behavioral - Staying Current
  {
    q: "How do you stay current with new ML techniques and tools? Give a specific example of something you learned recently and applied.",
    subcategory: "behavioral",
    difficulty: "Medium",
    a: `I stay current through structured practices:

Weekly: I read 2-3 papers from ArXiv (ML) and Hacker News (industry trends). I don't read deeply; I scan abstracts and discussions. If a paper is relevant, I dig in.

Monthly: I experiment with a new tool or technique on a small project (Kaggle, internal dataset). The goal isn't mastery; it's intuition. I want to know what's possible and its limitations.

Quarterly: I take a course or tutorial (fast.ai, Andrew Ng's ML course). Structured learning reinforces concepts.

Networking: I discuss ideas with peers. "I read about contrastive learning; have you tried it?" Hearing real experiences beats reading papers.

Specific example: Embedding models for retrieval.

I learned about contrastive learning techniques (SimCLR, MoCo) for learning good embeddings without labels. Typical approach: labeled data → supervised embedding model. Contrastive approach: unlabeled data → learn by comparing similar/dissimilar pairs.

I thought: Could we use this for our recommendation system? We had millions of user interactions but no labels.

Experiment: I implemented a simple contrastive model on user-item interactions. If a user clicked item A then item B, they're similar. If user C ignored both, items differ.

Result: The contrastive embeddings captured semantic similarity better than our old collaborative filtering baseline. We rolled it into production carefully (canary first, A/B test).

Impact: 3% improvement in recommendation CTR.

Why I pursued this: I saw the pattern (contrastive learning is general), identified a problem it solved (learning embeddings without labels), validated it worked, then shipped it. Not every new technique becomes useful, but staying current means I can recognize when one does.

Lesson: Learning new techniques matters, but application matters more. I don't chase SOTA models for their own sake. I stay current enough to identify when a new approach solves a real problem.`,
    level: "senior_ds",
  },

  // Q30: Behavioral - Speed vs Excellence
  {
    q: "Describe a time you had to choose between technical excellence and meeting a deadline.",
    subcategory: "behavioral",
    difficulty: "Hard",
    a: `Context: Company was launching a new product in 4 weeks. Marketing needed a churn prediction model to identify customers at risk (for retention offers). Standard rigorous approach: 8-12 weeks (requirements gathering, exploratory analysis, model development, validation, deployment infrastructure).

Constraint: 4 weeks. No negotiation.

My approach:

Week 1: Instead of building production infrastructure, I built a quick proof-of-concept (POC) on historical data. Logistic regression with 10 hand-picked features (engagement, billing issues, etc.). 80% accuracy on test set. Good enough to launch.

Tradeoff 1: Long-term excellence vs immediate value. A proper model would use deep learning, feature engineering pipelines, automated retraining. The POC used static features I computed manually. It would break in 3 months when data drifted.

Decision: Ship the POC. The business benefit (4-week earlier launch) outweighed the technical debt (model refresh needed in Q2).

Week 2-3: Deployed the POC as a batch job. Identified 10K at-risk customers. Marketing launched retention campaign.

Week 4: While marketing executed, I built the proper infrastructure (ML pipeline, monitoring, retraining). By week 8 (4 weeks after launch), we had a production-grade system in place.

Result: Early launch generated $2M in incremental retention value (prevented churn in 10K customers). The technical debt cost us: 3 weeks of engineering in month 2 to upgrade the system. Net win.

Why this worked:

 -  Clear deadline and business value. I didn't default to "do it right"
 -  Explicit tradeoff communication. I told leadership: "We can launch in 4 weeks with a POC that needs retraining in 3 months, or launch in 12 weeks with a production system." They chose 4 weeks.
 -  Plan to eliminate debt. I didn't leave it broken; I committed to a proper build in the next quarter.

Lesson: Technical excellence isn't always the answer. Context matters. For a proof-of-concept, 80% accuracy is fine. For cancer diagnosis, 99% is mandatory. For a one-time analysis, a script is sufficient. For a production system that runs for years, architecture matters.

The mistake many engineers make: defaulting to "the right way." The better skill: knowing which tradeoff makes sense for the context.`,
    level: "lead_ds",
  },
];

export default DS_QUESTIONS_6_30;
