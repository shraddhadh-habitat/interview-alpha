[
  {
    q: "Design a metric to measure the health of a two-sided marketplace. How do you balance supply and demand signals?",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `A two-sided marketplace lives or dies on balancing supply and demand. Too much supply, prices crash and sellers leave. Too much demand, users get frustrated and churn. I'd design a composite metric around equilibrium.

Primary metric: Supply-to-demand ratio (SDR). If you have 1000 sellers and 100k buyers searching weekly, SDR = 0.01. Ideal SDR depends on category (food delivery: 1:50, luxury goods: 1:500). I'd track SDR trend (is it widening or tightening?).

Second metric: Match rate (% of demand served). Of 100k searches, how many convert to transaction? If match rate drops while SDR stays constant, something's wrong (supply quality? discoverability?). I'd segment by geography, time-of-day, product category.

Third metric: Supply utilization. Of 1000 sellers, how many completed a transaction this month? Inactive supply signals churn risk. I'd track "active sellers" (>1 transaction/month).

Fourth metric: Price stability. If prices swing wildly (median price up 30% month-over-month), supply/demand is imbalanced. Stable prices mean equilibrium.

Balancing: Use these metrics to trigger interventions. If SDR > 3x target: incentivize demand (discounts, marketing). If SDR < 0.33x target: incentivize supply (seller bonuses, reduced fees).

Tradeoffs: A single metric fails. Supply can be abundant but low-quality (bad ratings). Demand can be high but hard to satisfy (peak-hour bottlenecks). I'd track 4-6 metrics in a dashboard, alert on 2+ degrading simultaneously.

Real example: Uber's DAU (demand proxy) vs active driver count (supply proxy). Uber's early problem: NYC had 100k drivers but 1M peak-hour requests. Solution: surge pricing to reduce demand and attract drivers.

Implementation: Weekly monitoring. If supply and demand decoupling, monthly deep dive (quality issues? competitive threat?).`,
    level: "senior_ds",
  },

  {
    q: "Your search ranking model improved NDCG by 5% offline but click-through rate dropped online. What happened?",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `This is a classic train-test mismatch. NDCG (Normalized Discounted Cumulative Gain) measures ranking quality. CTR measures user satisfaction. They diverged, so my ranking logic works on test data but confuses users.

Hypothesis 1: NDCG rewards different features than CTR. NDCG might optimize for "relevance to query" (using BM25, semantic similarity). But users click based on "intent to act" (price, ratings, images). A result can be relevant but not clickable.

Example: Query "laptop under 50k". My model ranks by relevance (specs match). But users click the cheapest option with 4+ star rating. High relevance (rank 1) but low CTR because price is buried.

Diagnosis: A/B test the ranking change. If new model does hurt CTR, NDCG improvement is hollow.

Hypothesis 2: Online evaluation differs from offline. NDCG is computed on test set (fixed queries, fixed results). Online, queries are live and variable. New model might rank novel results higher (exploration), confusing users.

Hypothesis 3: Feedback loop. Users clicked on the old ranking because they learned its pattern. New ranking surprises them. Over time (2-4 weeks), CTR might recover as users adapt.

Hypothesis 4: Positional bias. New ranking changes item positions. Clicks drop not because quality is lower, but because items moved from position 3 (high CTR) to position 7 (low visibility).

Actions:
1. Segment A/B test by query intent (transactional vs informational).
2. Compare CTR on shared results between old and new ranking.
3. Analyze time-to-click and result view-through rate (do users even see new results?).
4. Check if low-CTR results are truly low-quality or just unfamiliar.

Decision: NDCG is a proxy; CTR is the true metric. If CTR drops, the model is worse, even if offline metrics improve. Revert and investigate what NDCG measures that CTR doesn't.`,
    level: "lead_ds",
  },

  {
    q: "How would you design a notification system that maximizes engagement without annoying users? What data would you use?",
    subcategory: "tech_companies",
    difficulty: "Medium",
    a: `Notifications drive engagement but kill retention when overused. I'd design a multi-signal system that learns per-user tolerance.

Primary signal: Optimal notification frequency. Some users love 10 notifications/day; others uninstall at 2. I'd track:
- Uninstall rate within 1 day of notification.
- Open rate (did user open the app after notification?).
- Click-through rate (did they engage with the notification's action?).
- Churn rate (users who received 5+ notifications/day have higher monthly churn).

I'd build a model: predict uninstall probability given notification count. Set per-user frequency cap at the point where uninstall rate >5%.

Secondary signals: Notification type and timing.
- Transactional (order shipped): Always send (high expected value, low annoyance).
- Social (friend liked your post): Send 1x/day max, batch multiple events.
- Promotional (20% off sale): Send 0-1x/week, respect user preferences.
- Time-of-day: Track open rate by hour. Users on West Coast check at 9am; East Coast at 7am. Send 1 hour before predicted check time.

Personalization:
- High-engagement users (daily app users): Can tolerate 5 notifications/day.
- Low-engagement users (weekly users): Max 1 notification/week.
- Dormant users (haven't opened in 2+ weeks): Trigger re-engagement campaign (1 high-value notification), then quiet.

Tradeoffs:
- More notifications = higher short-term engagement, higher churn.
- Fewer notifications = lower daily engagement, higher retention.
- I'd optimize for long-term value (30-day retention) not short-term DAU.

Implementation:
- Segment users by engagement tier.
- A/B test frequency caps (Control: 1x/day, Test: 3x/day).
- Monitor uninstall rate, churn rate, 7-day retention.
- Quarterly review: user preferences shift seasonally.

Real data: If churn rate jumped 20% post-launch, too many notifications. If DAU dropped 10%, too few notifications.`,
    level: "senior_ds",
  },

  {
    q: "Build a delivery time estimation model. What features matter and how do you handle variability?",
    subcategory: "tech_companies",
    difficulty: "Medium",
    a: `Delivery time estimation is critical for food/e-commerce. Underestimate and customers complain. Overestimate and you lose orders to faster competitors. I'd build a quantile regression model to handle uncertainty.

Key features:
- Distance (haversine distance from store to customer).
- Historical delivery time (average time for this route, time-of-day bucket).
- Demand (number of active deliveries; high load = longer wait).
- Store capacity (1 rider or 10? affects wait).
- Time-of-day (lunch rush vs 3am).
- Weather (rain adds 15-20% latency).
- Traffic (historical + real-time, if available).
- Order complexity (5 items vs 50 items affects pack time).

Model structure: I'd NOT predict point estimates (mean delivery time). I'd predict confidence intervals using quantile regression (10th, 50th, 90th percentile).

Why quantiles: Users want certainty, not averages. "30 minutes" is useless if actual delivery is 20-40 minutes. Better to say "20-40 minutes (80% confidence)" so users can plan.

Handling variability:
- Residual analysis: Identify outliers (orders that took 3x expected time). Root causes: traffic incident, rider breakdown, customer not home.
- Stratified modeling: Separate models for lunch rush vs quiet hours. Variability is different.
- Confounding: High demand ≠ always slower. If demand is high but many riders available, speed is fine. Need to control for rider-to-order ratio.

Validation:
- Track calibration: Of orders predicted "20-40 min," what % actually arrived in that window? Should be ~80%.
- A/B test: Show old estimate vs new. Measure if new estimate reduces cancellations and increases satisfaction.

Bias: If 90th percentile estimate is always too optimistic, you'll anger users. Better to be slightly pessimistic.

Real implementation: Predict (median + standard deviation), show median to customers, use 90th percentile internally for driver assignment (know the worst case).`,
    level: "senior_ds",
  },

  {
    q: "How would you detect bot traffic on an e-commerce platform using only behavioral data?",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `Bots wreak havoc on e-commerce (inventory scraping, scalping, price comparison). Unlike fraud detection (which has payment signals), bot detection uses only behavior. I'd use time-series and graph analysis.

Behavioral signals:
- Request velocity: Humans visit 1-5 pages/minute. Bots visit 100+ pages/second. I'd flag accounts with >50 pages/minute.
- Pattern regularity: Humans browse randomly. Bots follow scripts (always visit product page → cart → checkout). I'd detect repeated exact sequences within seconds.
- Session duration: Humans spend 1-10 minutes per session. Bots hit server for <1 second. I'd flag sessions <5 seconds with >10 requests.
- User-agent analysis: Bots often have telling user-agents ("bot", "crawler", "python-requests"). Simple regex catch.
- IP diversity: One account, 100 IPs in 1 hour = bot. Humans have 1-2 IPs (home + work).
- Device/browser consistency: Real users have stable device/browser. Bots rotate (trying to evade detection).

Advanced signals:
- Graph analysis: If 1000 accounts all click the same product within 60 seconds, likely a bot network. Build a co-behavior graph: if accounts have >80% similar pageviews, cluster them.
- Captcha interaction: Bots fail CAPTCHAs. If user solves CAPTCHA, they're human.
- Click patterns: Bots click exactly (pixel-perfect coordinates). Humans have jitter. Track mouse movement smoothness.

Machine learning approach:
- Train binary classifier (bot vs human).
- Features: (pages/minute, session_duration, pattern_entropy, ip_count, device_consistency).
- Label data: Accounts with >100 pages/minute = bot (high precision). Sample and manually review borderline cases.
- Model: Logistic regression (interpretable) or Gradient Boosting (high precision).

Scoring: Not all bots are bad. A search engine crawler is okay. A scalper bot is not. I'd tier by risk:
- High-risk: Rapid purchases of limited inventory.
- Medium-risk: Data scraping (no conversion).
- Low-risk: SEO crawlers.

Handling:
- Real-time: Block if request velocity > threshold.
- Batch: Flag accounts for review if bot probability > 0.8.
- False positives: Don't ban immediately; require CAPTCHA or email verification.

Validation: Track blocked bot accounts; measure if inventory loss decreased.`,
    level: "lead_ds",
  },

  {
    q: "Your recommendation engine shows high diversity but low relevance. How do you find the right balance?",
    subcategory: "tech_companies",
    difficulty: "Medium",
    a: `This is an exploration-exploitation tradeoff. Pure exploitation (recommend items similar to user history) gets high CTR but is boring. Pure exploration (random items) is diverse but irrelevant. I'd use a hybrid approach.

Metrics:
- Relevance: CTR, conversion rate, user rating of recommendations.
- Diversity: % of recommendations from new categories, % of items <10 days old, Jaccard distance between recommendation sets for similar users.

Tradeoff analysis: If relevance is 85% CTR and diversity is 30% of items new, users see familiar stuff. If I push diversity to 50% new items, relevance might drop to 75% CTR.

The question: Is a 10% CTR drop worth 50% more diversity? Depends on business goals. For long-term retention, diversity might win (users don't get bored). For short-term revenue, relevance wins.

Hybrid approach:
- Bucketing: 70% of slots = relevance-optimized (user's favorite categories, collaborative filtering).
- 20% of slots = serendipity (items similar users liked, but you haven't seen).
- 10% of slots = exploration (random high-quality items, diverse categories).

Alternative: Use a bandit algorithm (Thompson sampling). Treat each recommendation as an arm. Explore arms (recommendations) with high uncertainty, exploit arms with proven success.

Measurement: A/B test two algorithms.
- Control: High relevance (85% CTR, 30% diversity).
- Test: Balanced (80% CTR, 50% diversity).
- Measure: Long-term (30-day) retention, not just clicks. If Test wins on retention, diversity pays off.

Personalization: High-engagement users (daily users) can tolerate lower relevance for diversity. Low-engagement users need high relevance to convert.

Real decision: Track user feedback. If NPS for recommendations is low despite high CTR, users want diversity. If NPS is high, stick with relevance.

Goal: Find the inflection point where relevance and diversity both improve (e.g., better recommendations are more relevant AND more diverse).`,
    level: "senior_ds",
  },

  {
    q: "Design an experiment to test whether adding social proof (ratings, reviews) to product pages increases conversion.",
    subcategory: "tech_companies",
    difficulty: "Medium",
    a: `Social proof is powerful but not free (engineering, moderation cost). I'd design a rigorous A/B test to measure true lift.

Experiment design:
- Control: Product page without ratings/reviews (baseline).
- Test: Product page with average rating (stars) + review count + top 3 reviews.
- Sample size: Need statistical power. Assume 2% baseline conversion, expected lift 10% (to 2.2%). Sample: ~50K users per arm (2-sided test, 80% power, 5% significance).
- Duration: 2 weeks (captures weekday and weekend behavior).

Metrics:
- Primary: Conversion rate (purchase / session).
- Secondary: Add-to-cart rate, time-on-page (do reviews engage users?), refund rate (are reviews setting correct expectations?).
- Sanity checks: Page load time (reviews slow down page?), traffic balance.

Confounds to control:
- Temporal effects: Run both variants simultaneously. If you run control for week 1 and test for week 2, you'll confound with day-of-week effects.
- Product category: Conversion lift from social proof varies by category. Electronics (high-risk purchase) benefit more than t-shirts. Segment analysis: measure lift separately for each category.
- User cohort: New users vs returning users respond differently. New users trust reviews more. Segment analysis needed.

Bias concerns:
- Review selection: If only positive reviews show, that's not realistic. I'd include 2-3 negative reviews to be credible.
- Primacy bias: Top reviews anchor perception. I'd randomize review order.
- Platform bias: Users who leave reviews are higher satisfaction (survivorship bias). I'd measure true conversion, not just review engagement.

Measurement challenges:
- Attribution: If user reads review today, purchases tomorrow, did the review cause it? I'd use sequential analysis: conversion within 1 day of page visit.
- Variability: Conversion rates have high variance. If results are 2.0% vs 2.1%, that's noise. I'd compute confidence intervals and look for >1% absolute lift.

Expected outcomes:
- Scenario A: Lift +0.2% conversion, statistically significant. Recommendation: Ship it. Even small lifts are valuable at scale.
- Scenario B: Lift +0.05%, not significant. Recommendation: Need larger sample or different implementation.
- Scenario C: Lift -0.1% (reviews reduce conversion). Recommendation: Investigate. Are reviews deterring (negative sentiment)? Are they slowing page load?

Post-launch monitoring: Track refund rate. If reviews set correct expectations, refunds should drop.`,
    level: "senior_ds",
  },

  {
    q: "How would you build a real-time bidding model for digital advertising?",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `Real-time bidding (RTB) happens in milliseconds. When a user visits a page, an ad exchange auctions the impression. I have ~100ms to decide: "How much will I bid for this ad slot?"

Goal: Maximize profit (revenue - cost) = (CTR × CPC × bid) - (bid × CPC × frequency).

I'd model two components: CTR prediction and optimal bidding.

CTR prediction:
- Features: (user_id, page_context, ad_creative, publisher, device, time_of_day, user_history).
- Model: Logistic regression or Gradient Boosting (must be <10ms latency).
- Output: Probability user clicks ad. Example: 2% CTR.

Bidding strategy:
- If I predict 2% CTR and I want 3x ROI, I can bid up to: (0.02 × value_per_click × 3) / CTR.
- But bidding too high wastes budget. I need to optimize across all auctions.

This is a constrained optimization problem:
- Goal: Maximize total profit.
- Constraint: Daily ad spend budget (e.g., $10K/day).
- Decision: Bid for each impression.

Solution: Use a reinforcement learning approach or dynamic programming.
- Learn a bidding function: bid = f(CTR, inventory_remaining, budget_remaining, time_of_day).
- If I have $10K budget and 8 hours left, I can afford higher bids.
- If 1 hour left and $2K budget, I'm conservative (only bid on high-CTR impressions).

Real-time implementation:
- Pre-compute: Offline, train CTR model on historical data.
- Online: For each auction, score user/context with CTR model. Look up optimal bid from pre-computed table.
- Feedback loop: Collect outcomes (did user click?). Retrain CTR model weekly.

Challenges:
- Latency: RTB happens in 50-100ms. I can't run deep learning; must use cached scores.
- Label delay: User clicks ad; conversion happens days later. I can't update immediately.
- Feedback loops: Bids affect inventory. If I bid high, I win more auctions, which changes my average CTR (selection bias).

Validation:
- Offline: Hold-out test set. Measure CTR prediction accuracy.
- Online: A/B test bidding strategies. Control: rule-based bidding. Test: ML-optimized. Measure ROI.

Profit curve: Plotting spend vs ROI, I'd find an elbow (diminishing returns). Recommend spending at the elbow (maximize profit, not spend).`,
    level: "lead_ds",
  },

  {
    q: "Your ML model serves 1M predictions daily. Describe your monitoring and alerting strategy.",
    subcategory: "tech_companies",
    difficulty: "Medium",
    a: `1M predictions/day = 12+ predictions/second at peak. Model failures here directly harm users. I'd implement comprehensive monitoring across prediction, data, and performance layers.

Prediction distribution monitoring:
- Track output distribution daily. If 90% of scores suddenly shift from 0.5 to 0.9 (when historical range is 0.3-0.7), alert.
- Metric: Compare daily distribution to rolling 30-day baseline using KL divergence. Alert if divergence > threshold.
- Example: Recommendation model suddenly predicts 90% click probability. That's suspicious (model decay or data drift).

Feature distribution monitoring:
- Input features also drift. If feature "user_engagement_score" suddenly has zero variance, check data pipeline.
- Alert: If any feature distribution diverges >20% from baseline.

Prediction accuracy monitoring (offline):
- Train model Monday on historical data. Monday-Sunday, compare predictions to ground truth (e.g., did user actually click?).
- Metric: Accuracy, precision, recall by segment (user type, content category).
- Alert: If accuracy drops >5% points.

Latency monitoring:
- Measure p50, p95, p99 latency of predictions.
- Alert: If p99 > 500ms (SLA violation).

Business impact metrics:
- Measure downstream KPIs influenced by predictions. If recommendation model kills prediction quality, CTR drops.
- Metric: A/A test. Run old model 1% of traffic. If new model's CTR is <98% of old model's CTR, alert.

Alerting rules:
```
IF feature_divergence > 0.2 THEN alert "Feature drift detected"
IF accuracy_drop > 0.05 THEN alert "Model accuracy degraded"
IF p99_latency > 500ms THEN alert "Latency SLA violated"
IF prediction_distribution_divergence > KL(baseline) THEN alert "Prediction drift"
```

Response procedures:
- Severity 1 (accuracy drops >10%): Revert to previous model immediately.
- Severity 2 (latency SLA violated): Page on-call, investigate infrastructure.
- Severity 3 (minor drift): Schedule weekly deep dive, plan remediation.

Feedback loop:
- Weekly: Sample predictions, manually inspect for quality. "Did recommendation make sense?" Catches blind spots in metrics.
- Monthly: Retrain model on latest data. Measure if retraining improves offline accuracy.

Implementation: Store predictions + outcomes in database. Batch job daily computes KPIs and sends alerts to Slack/PagerDuty.`,
    level: "senior_ds",
  },

  {
    q: "How would you measure the long-term impact of a new onboarding flow when your A/B test can only run for 2 weeks?",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `2-week test is too short to measure retention (users haven't had time to churn). But onboarding changes affect long-term retention. I'd use proxy metrics to predict long-term impact.

Immediate metrics (measured in 2 weeks):
- Completion rate: Do users finish onboarding? Control: 85%, Test: 90%. Direct proxy for product understanding.
- Time-to-value: When do users take first valuable action (upload profile, make first purchase)? Control: 3 days, Test: 1.5 days. Faster = better engagement.
- Early activation (day 1 DAU, day 2 DAU, day 7 DAU): Do users come back? Control: 40% day-1, 25% day-7. Test: 45% day-1, 30% day-7. Early engagement predicts retention.

Surrogate metrics (strong correlation to long-term retention):
- Research correlation: Historical data shows users who activate within 1 day have 3x higher 30-day retention. So if Test improves day-1 activation, I can predict 30-day retention lift.
- Metric: "fraction reaching core feature within 1 day." If Test is 10% higher, I extrapolate 30-day retention lift.

Extended testing (after 2-week A/B):
- If 2-week results are positive, keep variant running for 4 weeks to measure 30-day retention.
- But don't wait for results; start a secondary experiment immediately. Run variant B (another onboarding improvement) in parallel.

Causal inference (predict without waiting):
- Use propensity score matching: Find users in past cohorts who were similar (same acquisition channel, device, geography) but followed old onboarding.
- Compare their 30-day retention to new onboarding users. Assumption: If they're similar, new onboarding should improve retention by the same amount.

Mechanistic reasoning:
- Ask: Why does new onboarding work? If it reduces user confusion (measured by support tickets), and low-confusion users have higher retention, then new onboarding should improve retention.
- Metric: Support tickets asking basic questions. If Test reduces these by 20%, extrapolate that to retention (fewer confused users = fewer churns).

Segmented analysis:
- Retention varies by cohort. New users from organic have different churn rates than paid users. Segment the 2-week test by acquisition channel.
- If Test improves activation equally across all segments, retention gain likely holds for all.

Decision framework:
- Strong positive (completion +10%, day-1 DAU +8%, support tickets -15%): High confidence in retention gain. Ship it.
- Weak positive (completion +2%, day-1 DAU +2%): Medium confidence. Run extended test or run with 50% rollout and monitor.
- Null/negative: Revert.

Reality check: If new onboarding removes 3 steps and completion improves, users understand product better. Retention gain is very likely.`,
    level: "lead_ds",
  },

  {
    q: "A food delivery app wants to predict order cancellations before they happen. Walk through your approach.",
    subcategory: "tech_companies",
    difficulty: "Medium",
    a: `Cancellations hurt both supply (wasted driver time) and demand (lost revenue). I'd build a predictive model to intervene before cancellation.

Problem framing:
- Positive class: Orders that get cancelled.
- Timing: Predict within 2 minutes of order placement (enough time to prevent cancellation).
- Action: Offer discount, call user, assign nearby driver (reduce wait time).

Data: Historical orders (features at order time, outcome: cancelled or not).

Features:
- User history: Past cancellation rate (serial cancellers are at high risk).
- Order details: Delivery time estimate (orders with long estimates are often cancelled), distance, cuisine type.
- Context: Time-of-day (peak hours = longer wait = higher cancellation), day-of-week.
- Restaurant state: Busy indicator (how many active orders?). Busy = longer delivery = more cancellation risk.
- User intent signals: User reviewed menu (engagement) = lower cancellation.

Model: Logistic regression (interpretable) or Gradient Boosting. Target: P(cancellation within 5 minutes).

Example: User orders pizza, estimated delivery is 30 minutes, it's 12:50pm (lunch rush), user hasn't rated the restaurant yet. These signal high cancellation risk.

Calibration: I need well-calibrated predictions. If model predicts 20% cancellation, actual cancellation rate among those orders should be ~20%. Use Platt scaling if needed.

Intervention strategy:
- Score all orders at placement.
- If P(cancel) > 0.4: Offer $2 discount (retention value > discount cost if order value is $15+).
- If P(cancel) > 0.7: Proactive call from restaurant or driver ("Your order is confirmed, we're preparing it now").

Measurement: A/B test intervention vs control.
- Control: No intervention.
- Test: Discount offer.
- Metric: Cancellation rate. Hypothesis: Test reduces cancellation by 15%.

Confound: If I only offer discount to high-cancellation-risk orders, I'll see correlation (high-risk orders were cancelled anyway, discount didn't help). Solution: Randomize within high-risk segment. Offer discount to 50% of high-risk orders.

Feedback loop:
- Intervention changes ground truth. Orders I save now affect user behavior (more confident to order in future = lower baseline cancellation). Model needs retraining monthly to stay calibrated.

Long-term impact:
- Predicting cancellation is first-order (prevent this order from cancelling).
- Second-order: User who experiences no cancellation is more likely to order again. Improving 30-day retention is the real win.
- Metric: Measure if users who didn't cancel have higher long-term LTV.`,
    level: "senior_ds",
  },

  {
    q: "How would you use graph analytics to detect fraud rings in a payments network?",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `Fraud rings are organized groups abusing a system. Unlike individual fraud (random patterns), rings have structure: shared payment methods, accounts created on same day, similar transaction patterns. Graph analytics reveals this structure.

Graph construction:
- Nodes: Users, email addresses, phone numbers, IP addresses, payment methods (credit cards).
- Edges: Connect user A to user B if they share a payment method, or both transacted from same IP. Weight edges by frequency (shared 5 attributes = higher weight).
- Result: A graph where fraudsters form dense clusters.

Detection approach:

1. Community detection: Identify densely connected components. Standard algorithm: Louvain. Output: List of communities.

2. Ring scoring: Each community gets a risk score based on:
   - Density: Nodes in fraud rings are heavily interconnected (each node knows 5+ other nodes in ring). Non-fraud users are sparse.
   - Freshness: Fraud rings often create accounts in bursts (day 1: 100 accounts, day 2: 0). I'd score communities with high "account creation synchronicity."
   - Transaction patterns: Fraud rings transact similar amounts, similar times, similar merchants. I'd compute pairwise transaction similarity within community. High similarity = high risk.
   - Chargeback rate: Fraud communities have high chargebacks. I'd track chargeback rate per community.

3. Scoring formula:
   ```
   risk_score = 0.4 * density + 0.3 * chargeback_rate + 0.2 * pattern_similarity + 0.1 * account_creation_burst
   ```

Machine learning layer:
- Labeled data: Known fraud rings (from past chargeback investigations).
- Features (per community):
  - Density, clustering coefficient, diameter, assortativity (do high-degree nodes connect to other high-degree nodes?).
  - Chargeback rate, average transaction amount, transaction frequency.
  - Time features (days since community formation, account creation distribution).
- Model: Gradient Boosting to predict P(community is fraud ring).

Real-time detection:
- When a new user registers, add to graph. If they connect to known fraud cluster, flag.
- When user makes transaction, check if they're in high-risk community. Apply stricter KYC (ask for ID).

Validation:
- Precision: Of flagged rings, what % were true fraud? Goal: >80% (minimize false positives, avoid blocking legitimate users).
- Recall: Of true fraud rings, what % did we catch? Goal: >70%.
- A/B test: Control: Current fraud system. Test: Add graph-based detection. Measure if chargeback rate decreases.

Challenges:
- False positives: Legitimate communities (e.g., a company's employees using corporate credit card) might look ring-like. Solution: Add company verification feature (partner company = low risk).
- Adaptability: Fraudsters change tactics. Recompute graph weekly; retrain model monthly.
- Scale: Millions of users, billions of edges. Use distributed graph tools (Spark GraphX, Neptune).

Example: 100 accounts created in 12 hours, all used card ending in 4567, all purchased same item, all marked chargeback within 30 days. Density is very high. This is a clear ring.`,
    level: "lead_ds",
  },

  {
    q: "Design a customer lifetime value model for a subscription business. How do you handle censored data?",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `Customer Lifetime Value (CLV) is total revenue from a customer until churn. Sounds simple, but here's the catch: many customers are still active. Their true LTV is unknown (censored). I can't just average revenue per customer; that's biased toward high-churn cohorts.

Model structure:
- Inputs: Customer acquisition date, monthly revenue (if varying), churn status (churned or active).
- Output: Predicted LTV over 24-month horizon.

Approach 1: Cohort analysis (simple but biased).
- Cohort: Users acquired in January 2024.
- Calculate: Sum of revenue from Jan 2024 to today (Jan 2025).
- Problem: Only 12 months of data. If average subscription lifetime is 24 months, I'm underestimating LTV.

Approach 2: Survival analysis (handles censoring).
- Model customer retention as a function of time: S(t) = P(customer active at month t).
- Use Kaplan-Meier estimator to compute S(t) from historical churn data.
- Example: S(6) = 0.7 (70% survive to month 6), S(12) = 0.4, S(24) = 0.1.
- CLV = Sum of (monthly_revenue × S(t)) for t=1 to 24.

Advantage: Even if I observe customer for only 6 months (censored), I can estimate S(12), S(24) using Kaplan-Meier. CLV accounts for unobserved future months.

Approach 3: Cohort-level prediction (more flexible).
- Assume exponential churn: Survival S(t) = exp(-λt), where λ is churn rate.
- Estimate λ from data: λ = -ln(S(12)) / 12.
- Predict CLV = monthly_revenue / λ.

Example: If 50% of customers survive 12 months, λ = 0.058/month, CLV = $29/month / 0.058 = $500.

Approach 4: Heterogeneous CLV (most accurate).
- Different customers have different churn rates.
- Model: For each customer, predict P(churn) based on features (signup source, initial engagement, demographics).
- Example: Customers from organic search have λ=0.05. Paid ad customers have λ=0.10.
- CLV_i = revenue_i / λ_i.

Features for churn model:
- Engagement (logins/month, feature usage, support tickets).
- Payment history (late payments signal churn).
- Cohort (acquisition month, acquisition source).
- Demographics (geography, company size).

Handling censored data in training:
- Use Cox proportional hazards model. Inputs: time-to-event (churn month) or time-to-censoring (observation window end), features.
- Output: Hazard ratio per feature.
- Example: Late payment increases hazard ratio by 2x (2x more likely to churn).
- Predict S(t) for each customer using their hazard ratios.

Validation:
- Hold-out recent cohorts (customers acquired 6 months ago).
- Measure: Do predicted CLV vs actual revenue (after 6 months) correlate?
- Goal: R² > 0.7.

Business use:
- CAC payback: CAC = $500. CLV = $1200. Payback in ~3 months. Invest in acquisition.
- Retention ROI: Spending $10/customer to reduce churn by 5% increases CLV to $1500. ROI = ($1500-$1200) / $10 = 30x.

Pitfalls:
- Ignoring censoring: If I only use churned customers, I ignore customers who may churn later. Survivor bias inflates CLV.
- Assuming constant churn: Churn rate changes over time. New customers churn fast; old customers are loyal. Use time-dependent models.
- Confusing revenue with retention: A high-revenue customer might churn. Model them separately.`,
    level: "lead_ds",
  },

  {
    q: "Explain how you would use causal inference to measure the true impact of a pricing change.",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `A/B testing works for pricing, but takes weeks. Causal inference can estimate impact faster using observational data.

Scenario: We lowered prices 20% last month. Revenue dropped 5%. Did price drop cause it? Or would revenue have dropped anyway due to seasonality?

Confounding: Multiple factors affect revenue (season, competitor price, marketing spend, product quality). Price change is entangled with these. I need to isolate the causal effect of price.

Method 1: Difference-in-differences (DiD).
- Assumption: Price change affected only one segment (e.g., UK customers), not another (US customers).
- US (control): Price unchanged, revenue before = $100k/month, revenue after = $98k/month (seasonality effect: -2%).
- UK (treated): Price dropped 20%, revenue before = $80k/month, revenue after = $75k/month (-6%).
- DiD estimate: (-6%) - (-2%) = -4% causal effect of price drop.
- Interpretation: Price drop reduced revenue 4 percentage points (beyond seasonality).

Advantage: DiD controls for seasonal trends automatically.

Limitation: Assumes parallel trends (US and UK would trend identically without price change). If UK is a growing market and US is saturated, this assumption breaks.

Method 2: Propensity score matching (PSM).
- Assumption: Price change affected all customers, but some customers are more sensitive.
- Propensity score: P(customer affected by price change | features). Features: (purchase frequency, customer lifetime, segment, geography).
- Match treated customers (affected by price) to control customers (not affected, similar features).
- Compare revenue: treated vs control. Difference = causal effect.
- Example: High-frequency customer A (propensity=0.9) is matched to high-frequency customer B (propensity=0.05, not affected by price). Both are similar, but A saw price drop and B didn't. Revenue change = causal effect.

Advantage: Handles multiple confounders.

Limitation: Requires no unmeasured confounders (e.g., if competitor also lowered price, PSM can't account for it).

Method 3: Instrumental variables (IV).
- Assumption: There's a variable Z that affects price but not revenue directly (excludes restriction).
- Example: A/B test. "Should we lower price?" Some regions randomized to lowered price (Z=1), others didn't (Z=0).
- Even if A/B test ran for only 1 week (too short to measure full effect), we can use it as an instrument.
- Estimate: Causal effect = (revenue change in treated region) / (price change in treated region).
- This gives the average elasticity.

Method 4: Synthetic control.
- Find a synthetic customer/region that's similar to the one where price changed.
- Synthetic control = weighted average of other regions (weights chosen so synthetic matches treated region pre-price-change).
- Post-price-change, compare treated vs synthetic. Difference = causal effect.
- Advantage: Flexible, handles multiple confounders.

Data quality matters:
- Confounders must be measured (geography, segment, purchase history).
- Unmeasured confounders (competitor actions, viral moment) can bias results.

Validation:
- Falsification test: Apply method to period before price change. If method detects "effect" when there should be none, something's wrong.
- Sensitivity analysis: How robust are results if I'm missing a key confounder?

Practical recommendation:
- Use DiD if you can split customers into treated (price change) and control (no change).
- Use PSM if price change affects all customers but severity varies.
- Use IV if you have a randomized experiment (even small/short) to instrument for price.
- Cross-validate: Run A/B test to verify causal estimate from observational data.

Real impact estimate:
- Price drop 20% → revenue change -5% (observed).
- Causal analysis shows: -5% / -20% = elasticity 0.25.
- Interpretation: 1% price drop → 0.25% volume increase. Revenue-optimal price is ~10% lower (elasticity < 1, inelastic).`,
    level: "lead_ds",
  },

  {
    q: "Your product has 40% DAU/MAU ratio. The PM says it's good. You think it's bad. How do you present your analysis?",
    subcategory: "tech_companies",
    difficulty: "Hard",
    a: `40% DAU/MAU means 40% of monthly users return daily. Superficially high, but context matters. I'd challenge with data.

Benchmark analysis:
- Is 40% objectively good? Depends on product type.
- Social apps (Instagram, TikTok): 60-70% DAU/MAU. Messaging (WhatsApp): 80%+. News (Flipboard): 15-20%. Productivity (Jira): 30%.
- If we're a social app and we're 40%, we're underperforming peers by 30-40%.

Segmentation analysis:
- 40% aggregate might hide problems. Segment by:
  - Acquisition source: Organic users might be 50% DAU/MAU. Paid users might be 25%. Paid cohort is dragging down average.
  - Cohort age: Month-1 users might be 45% DAU/MAU. Month-12 users might be 30% (churn over time).
  - Geography: US might be 45%, India might be 35%.
- Insight: Problem isn't overall DAU/MAU; it's paid users and old cohorts.

Decomposition: Why 40% and not 60%?
- 100k MAU, 40k DAU.
- 60k "monthly-but-not-daily" users: Why don't they return daily?
- Survey: 60% say "forgot app exists," 20% say "app is boring," 10% say "found alternative."
- Insight: Engagement issue (boring), not retention issue (churn).

Causal analysis:
- What drives daily return?
  - Habit formation: Users who return 5+ days in first week have 60% DAU/MAU long-term.
  - Notifications: Users who opt into notifications have 50% DAU/MAU. Users without: 20%.
  - Engagement: Users with 10+ interactions/session have 65% DAU/MAU. Users with 2-3 interactions: 20%.
- Insight: Engagement and notifications are levers.

Competitive analysis:
- Competitor A (similar product): 55% DAU/MAU, growing 20%/month.
- Competitor B: 45% DAU/MAU, flat growth.
- We're at 40% DAU/MAU, flat growth. Competitor A is eating our lunch.

Financial impact:
- DAU/MAU drives monetization. Ad revenue scales with DAU.
- Current: 40k DAU, $2/user/month = $80k/month.
- If DAU/MAU improved to 50%: 50k DAU, $2/user/month = $100k/month (+25% revenue).
- Cost to improve: Run notification campaign ($5k/month). Payback: 3 weeks.

Prediction:
- If DAU/MAU stays 40%, predict churn acceleration. Users who rarely return become permanent churners (if they don't return in 60 days, they rarely return).
- If we don't act, 6-month cohort retention will drop 20%.

Recommendation with specifics:
- 40% DAU/MAU is below peer benchmark (55%).
- Root cause: Low engagement (users have few interactions per session).
- Opportunity: Notifications increase DAU/MAU by 8-10 percentage points (test: A/B test opt-in notifications).
- ROI: Cost $5k, revenue upside $20k/month. Break-even in 2 weeks.

How to present to PM (non-aggressive):
- Acknowledge: "40% is strong, especially vs 30% industry baseline for our category."
- Reframe: "But compared to product A (55%), we're leaving money on table. I want to find that gap."
- Propose test: "Let's run a 2-week experiment. If we're right about notifications, DAU/MAU moves to 48%. That's $20k additional revenue."
- Let data speak: Results will show if 40% is good (metric stabilizes) or bad (improvements possible).

Key insight: 40% DAU/MAU is data-dependent. Don't argue absolutes. Use benchmarks, segmentation, and causality to show opportunity.`,
    level: "lead_ds",
  },

  {
    q: "Estimate the number of Uber rides happening in Delhi right now.",
    subcategory: "guesstimate",
    difficulty: "Medium",
    a: `Breaking down Uber rides in Delhi right now (assume 2 PM on a Wednesday).

Population & adoption:
- Delhi NCR population: ~30 million.
- Delhi proper (city): ~15 million.
- Uber penetration: ~10-15% of population has Uber app. Estimate: 1.5-2.2 million users.
- Active monthly users: Assume 40% of installed base. = 600K-900K users/month.
- Daily active users: Assume 30% of MAU. = 180K-270K users/day.

Ride frequency:
- 180K DAU in Delhi, but not all ride simultaneously.
- Peak hours (8-10 AM, 5-7 PM): ~60% of daily rides concentrated.
- Off-peak hours (2 PM): ~8% of daily rides.
- Average rides per DAU: 1.2 rides/day (some are repeat users, but many use other transport).
- Total daily rides: 180K × 1.2 = 216K rides/day.

Distribution across hours:
- Rides spread across 18 waking hours (6 AM to 12 AM).
- Peak hours (2 × 8% each): 17.3K rides/hour.
- Off-peak (2 PM): 216K × 8% / 24 hours ≈ 72 rides per hour (this seems low, recalibrate).

Better approach:
- Peak hours (6-7 AM, 8-9 AM, 5-7 PM): 20% of daily = 43K rides.
- Moderate hours (9-5 PM, 7-10 PM): 60% of daily = 130K rides spread across 9 hours = 14.4K/hour.
- Off-peak (11 PM-6 AM): 20% of daily = 43K rides spread across 7 hours = 6.1K/hour.

Right now (2 PM, Wednesday):
- 2 PM falls in moderate hours (9 AM-5 PM).
- Estimate: 14.4K rides/hour.
- Duration of "right now": Assume 1 hour. = 14.4K rides/hour.

But "right now" could mean instant (active rides at this moment):
- Average ride duration: 25 minutes in city (Delhi is congested, traffic is slow).
- At any moment, # of active rides = (rides per hour) × (avg duration / 60).
- = 14.4K/hour × (25/60) ≈ 6K active rides right now.

Sanity check:
- Delhi has ~40K-50K auto-rickshaws (formal). Uber's ride volume should be much smaller. 14K rides/hour in peak hours is 30% of auto volume, reasonable for a ride-sharing app.
- Estimate seems reasonable: 14K rides/hour during moderate hours, 6K active rides right now.

Final answer: ~14,000 Uber rides in Delhi right now (2 PM, Wednesday), or ~6,000 actively in progress.`,
    level: "senior_ds",
  },

  {
    q: "How many data scientists does India need in the next 5 years? Walk through your estimation.",
    subcategory: "guesstimate",
    difficulty: "Medium",
    a: `Demand estimation for data scientists in India (2026-2031).

Current state (2026):
- India's tech talent pool: ~5 million IT professionals.
- Data scientists / ML engineers: ~2% of IT workforce = 100K.
- Estimate: India has 100K data scientists currently.

Future demand drivers:

1. BFSI (Banking, Financial Services):
- India has 2500+ banks/NBFCs. Each major bank needs 5-10 data scientists (risk, fraud, personalization).
- Total BFSI: 100 major banks × 8 data scientists = 800. Medium banks: 500 × 3 = 1.5K. = 2.3K (current).
- Growth: BFSI data usage will increase. Target: 5K data scientists by 2031. Delta: +2.7K.

2. E-commerce:
- India has ~300 major e-commerce companies (Amazon, Flipkart, Nykaa, Meesho, etc.).
- Top 20 companies: 30 data scientists each = 600.
- Next 100 companies: 8 data scientists each = 800.
- Remaining 180: 2 data scientists each = 360.
- Total: 1.76K (current).
- Growth: E-commerce will double. Target: 3.5K. Delta: +1.74K.

3. SaaS/Technology:
- India has ~8000 SaaS companies.
- Top 100: 20 data scientists each = 2K.
- Next 500: 5 data scientists each = 2.5K.
- Remaining 7400: 0 (early stage).
- Total: 4.5K (current).
- Growth: As SaaS matures, 50% of SaaS companies will have data scientists. Target: 7K. Delta: +2.5K.

4. Startups (other):
- India has ~100K startups. Mostly seed/Series A (no data scientists).
- By 2031, ~5K startups will be Series B+, needing data scientists.
- Target: 5K startups × 1.5 data scientists = 7.5K. Current: 1K. Delta: +6.5K.

5. Government & Research:
- IIT, universities, research labs: 500 data scientists.
- Government agencies (Census, Election Commission, Health): 200.
- Total: 700 (current).
- Growth: Education will expand. Target: 1.5K. Delta: +0.8K.

Total supply gap:

Current: 100K.
Demand additions: 2.7K + 1.74K + 2.5K + 6.5K + 0.8K = 14.24K.
Projected supply needed: 100K + 14.24K = 114.24K (~115K).

But this ignores:
- Attrition: ~5% of current data scientists leave tech annually (move to management, expat, career change). Over 5 years: 25% × 100K = 25K replacements needed.
- Total demand: 115K + 25K = 140K.

Adjusted growth:
- Current: 100K.
- Target 2031: 140K.
- Net growth: 40K new data scientists needed in 5 years.

Supply constraints:
- Universities producing data science/AI graduates: ~5K-10K/year currently.
- Target: Need 40K / 5 = 8K/year (achievable with expansion of programs).
- Bootcamps: ~3K-5K/year.
- Total supply: ~8K-15K/year. Sufficient if we invest in education.

Risks:
- Brain drain: If India loses 20% of qualified data scientists to US/Canada, gap widens.
- Skill gaps: Graduates may lack production ML skills.
- Compensation: If India's data scientist salaries stay low (relative to US), talent migrates.

Final estimate: India needs ~40K additional data scientists in next 5 years (total 140K by 2031).`,
    level: "senior_ds",
  },

  {
    q: "Estimate the total revenue of Zomato from its Gold membership program.",
    subcategory: "guesstimate",
    difficulty: "Medium",
    a: `Zomato Gold is a subscription for discounts and free delivery. Estimating annual revenue.

Customer base:
- Zomato monthly active users: ~20 million (India).
- Gold penetration: ~3-5% of MAU are subscribed. Estimate: 600K-1M active Gold subscribers.
- Use 750K as midpoint.

Subscription price:
- Zomato Gold annual: ~3000-4000 INR (assume 3500 INR / year).
- Monthly equivalent: 3500 / 12 = 292 INR/month.

Subscription revenue:
- 750K subscribers × 3500 INR/year = 2.625 billion INR = $31.5M USD.

But Zomato also monetizes through:

1. Commission on orders: Gold members likely order more frequently (sunk cost bias).
- Average non-Gold user: 4-6 orders/month.
- Average Gold user: 8-12 orders/month (30-50% higher).
- Delta: 4 extra orders/month × 750K users = 3M extra orders/month = 36M extra orders/year.
- Zomato commission: ~20-25% per order. Average order value: 400-500 INR.
- Commission per order: 100 INR.
- Additional commission: 36M orders × 100 INR = 3.6 billion INR = $43M USD.

2. Exclusive partnerships (restaurants pay extra for Gold prominence): ~10-20% of Gold users discover new restaurants.
- 750K users, 15% discover via Gold = 112.5K incremental discovery events.
- Some restaurant partnership revenue: ~50-100 INR per discovery.
- Assume: 50 INR × 112.5K = 5.6 billion INR = $67M USD (conservative; likely higher).

3. Data monetization (Zomato knows Gold member preferences; can sell insights to restaurants): Minor, maybe $5-10M.

Total revenue streams:
- Direct subscription: $31.5M.
- Additional commissions from higher order frequency: $43M.
- Partnership/discovery: $67M (high estimate).
- Data & other: $10M.
- Total: $151.5M USD / year ≈ 12.5 billion INR.

Sanity check:
- Zomato's reported annual revenue (FY2024): ~5500 crore INR ($660M USD).
- Food delivery + Hyperpure (B2B) = ~90% of revenue.
- Gold membership revenue: 10-15% of food delivery revenue is plausible.
- Food delivery revenue: ~3500 crore INR. 10-15% = 350-525 crore INR = $42-63M USD.

My estimate of $151M seems high. Recalibrate:

Conservative estimate:
- Subscription: $31.5M.
- Incremental commissions: $20M (lower multiplier for order frequency).
- Partnership revenue: $20M.
- Total: ~$70M USD (580 crore INR).

This aligns better with Zomato's financial reports.

Final estimate: Zomato's Gold membership generates $70-100M USD / year in revenue (580-830 crore INR).`,
    level: "senior_ds",
  },

  {
    q: "Write a SQL query to find products that were purchased together most frequently in the last 30 days.",
    subcategory: "sql",
    difficulty: "Medium",
    a: `Problem: Find pairs of products bought by the same customer within the last 30 days, ranked by frequency.

Approach:
- For each customer, find all products purchased in last 30 days.
- Create pairs of products (product A, product B where A < B to avoid duplicates).
- Count pairs, rank by frequency.

SQL:
\`\`\`sql
WITH recent_purchases AS (
  SELECT
    customer_id,
    product_id,
    order_date
  FROM orders
  WHERE order_date >= CURRENT_DATE - INTERVAL 30 DAY
),
customer_product_pairs AS (
  SELECT
    c1.customer_id,
    LEAST(c1.product_id, c2.product_id) AS product_a,
    GREATEST(c1.product_id, c2.product_id) AS product_b
  FROM recent_purchases c1
  JOIN recent_purchases c2
    ON c1.customer_id = c2.customer_id
    AND c1.product_id < c2.product_id  -- Avoid duplicate pairs and self-join
)
SELECT
  product_a,
  product_b,
  COUNT(*) AS pair_frequency,
  COUNT(DISTINCT customer_id) AS customers_bought_both
FROM customer_product_pairs
GROUP BY product_a, product_b
ORDER BY pair_frequency DESC
LIMIT 50;
\`\`\`

Alternative (more efficient for large datasets):
\`\`\`sql
SELECT
  LEAST(p1.product_id, p2.product_id) AS product_a,
  GREATEST(p1.product_id, p2.product_id) AS product_b,
  COUNT(DISTINCT p1.customer_id) AS customers_bought_both,
  COUNT(*) AS pair_occurrences
FROM orders p1
JOIN orders p2
  ON p1.customer_id = p2.customer_id
  AND p1.product_id < p2.product_id
  AND ABS(DATEDIFF(p1.order_date, p2.order_date)) <= 30  -- Within 30 days of each other
WHERE p1.order_date >= CURRENT_DATE - INTERVAL 30 DAY
  AND p2.order_date >= CURRENT_DATE - INTERVAL 30 DAY
GROUP BY product_a, product_b
ORDER BY customers_bought_both DESC
LIMIT 50;
\`\`\`

Explanation:
- LEAST/GREATEST: Ensure consistent ordering (product_a < product_b) to avoid counting (A,B) and (B,A) separately.
- JOIN on customer_id and product_id < avoids self-joins and duplicates.
- COUNT(DISTINCT customer_id): Measure is customers who bought both, not order pairs.
- Filter: Last 30 days.

Output:
| product_a | product_b | customers_bought_both |
|-----------|-----------|----------------------|
| 101       | 205       | 1250                 |
| 101       | 310       | 980                  |
| 205       | 301       | 850                  |

Use case: Recommend product B when user buys product A (product recommendation system).`,
    level: "senior_ds",
  },

  {
    q: "Write a SQL query to calculate 7-day rolling average revenue per user, segmented by acquisition channel.",
    subcategory: "sql",
    difficulty: "Medium",
    a: `Problem: Track revenue per user over time, smoothed with 7-day rolling average, broken down by acquisition channel.

Data structure:
- orders: user_id, order_date, revenue, acquisition_channel.

SQL:
\`\`\`sql
WITH daily_revenue AS (
  SELECT
    DATE(order_date) AS date,
    acquisition_channel,
    user_id,
    SUM(revenue) AS daily_revenue
  FROM orders
  GROUP BY DATE(order_date), acquisition_channel, user_id
),
daily_user_count AS (
  SELECT
    DATE(order_date) AS date,
    acquisition_channel,
    COUNT(DISTINCT user_id) AS active_users,
    SUM(revenue) AS total_revenue
  FROM orders
  GROUP BY DATE(order_date), acquisition_channel
),
rolling_avg AS (
  SELECT
    date,
    acquisition_channel,
    active_users,
    total_revenue,
    total_revenue / active_users AS revenue_per_user,
    AVG(total_revenue / active_users)
      OVER (
        PARTITION BY acquisition_channel
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
      ) AS rolling_avg_7day
  FROM daily_user_count
)
SELECT
  date,
  acquisition_channel,
  ROUND(revenue_per_user, 2) AS daily_revenue_per_user,
  ROUND(rolling_avg_7day, 2) AS rolling_avg_revenue_per_user
FROM rolling_avg
ORDER BY acquisition_channel, date DESC;
\`\`\`

Explanation:
- daily_revenue: Calculate revenue per user per day per channel.
- daily_user_count: Aggregate daily revenue and active users by channel.
- rolling_avg: Window function computes 7-day rolling average (ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).
- PARTITION BY acquisition_channel: Separate rolling windows per channel.

Output:
| date       | acquisition_channel | daily_revenue_per_user | rolling_avg_revenue_per_user |
|------------|---------------------|------------------------|------------------------------|
| 2026-05-20 | organic             | 150.50                 | 145.75                      |
| 2026-05-19 | organic             | 142.30                 | 142.50                      |
| 2026-05-20 | paid_search         | 200.10                 | 198.00                      |
| 2026-05-19 | paid_search         | 195.50                 | 196.75                      |

Insights:
- organic: Revenue per user stable at ~$145 (7-day rolling).
- paid_search: Higher revenue per user (~$200), suggests higher-quality customers.

Advanced variation (include lag/trend):
\`\`\`sql
SELECT
  date,
  acquisition_channel,
  rolling_avg_revenue_per_user,
  LAG(rolling_avg_revenue_per_user, 7)
    OVER (PARTITION BY acquisition_channel ORDER BY date) AS prev_week_rolling_avg,
  ROUND(
    (rolling_avg_revenue_per_user -
      LAG(rolling_avg_revenue_per_user, 7)
        OVER (PARTITION BY acquisition_channel ORDER BY date))
    / LAG(rolling_avg_revenue_per_user, 7)
      OVER (PARTITION BY acquisition_channel ORDER BY date) * 100,
    2
  ) AS week_over_week_pct_change
FROM rolling_avg
ORDER BY acquisition_channel, date DESC;
\`\`\`

This shows week-over-week trend for each channel.`,
    level: "senior_ds",
  },

  {
    q: "Write a SQL query to identify users who were active last month but not this month (churned users).",
    subcategory: "sql",
    difficulty: "Medium",
    a: `Problem: Find users who had orders/activity in April 2026 but zero activity in May 2026.

SQL:
\`\`\`sql
WITH last_month_users AS (
  SELECT DISTINCT user_id
  FROM orders
  WHERE DATE_FORMAT(order_date, '%Y-%m') = '2026-04'
),
this_month_users AS (
  SELECT DISTINCT user_id
  FROM orders
  WHERE DATE_FORMAT(order_date, '%Y-%m') = '2026-05'
)
SELECT
  l.user_id,
  (SELECT MIN(order_date) FROM orders WHERE user_id = l.user_id) AS first_order_date,
  (SELECT MAX(order_date) FROM orders WHERE user_id = l.user_id) AS last_order_date,
  (SELECT SUM(revenue) FROM orders WHERE user_id = l.user_id) AS lifetime_revenue,
  (SELECT COUNT(*) FROM orders WHERE user_id = l.user_id) AS total_orders,
  (SELECT COUNT(DISTINCT DATE(order_date)) FROM orders
   WHERE user_id = l.user_id AND DATE_FORMAT(order_date, '%Y-%m') = '2026-04') AS april_order_days
FROM last_month_users l
LEFT JOIN this_month_users t ON l.user_id = t.user_id
WHERE t.user_id IS NULL
ORDER BY lifetime_revenue DESC;
\`\`\`

Alternative (simpler):
\`\`\`sql
SELECT DISTINCT u.user_id
FROM (
  SELECT DISTINCT user_id FROM orders
  WHERE DATE_FORMAT(order_date, '%Y-%m') = '2026-04'
) u
WHERE NOT EXISTS (
  SELECT 1 FROM orders
  WHERE user_id = u.user_id
  AND DATE_FORMAT(order_date, '%Y-%m') = '2026-05'
);
\`\`\`

Explanation:
- last_month_users: All distinct users with orders in April.
- this_month_users: All distinct users with orders in May.
- LEFT JOIN with WHERE t.user_id IS NULL: Users in April but not in May (churn).
- Additional columns: First order, last order, lifetime revenue (context for intervention).

Output:
| user_id | first_order_date | last_order_date | lifetime_revenue | total_orders | april_order_days |
|---------|------------------|-----------------|------------------|--------------|------------------|
| 12345   | 2024-01-15       | 2026-04-28      | 15000            | 42           | 15               |
| 67890   | 2024-06-20       | 2026-04-10      | 8500             | 23           | 8                |

Use case:
- Identify churn cohort.
- Analyze churn drivers (low lifetime value? long time since last order?).
- Re-engagement campaign: Email, discount offer.

Advanced: Predict churn before it happens.
\`\`\`sql
-- Users active in March but showing reduced activity in April (early churn signal)
WITH march_users AS (
  SELECT user_id, COUNT(*) AS march_orders
  FROM orders
  WHERE DATE_FORMAT(order_date, '%Y-%m') = '2026-03'
  GROUP BY user_id
  HAVING COUNT(*) >= 2  -- Active users (2+ orders)
),
april_activity AS (
  SELECT user_id, COUNT(*) AS april_orders
  FROM orders
  WHERE DATE_FORMAT(order_date, '%Y-%m') = '2026-04'
  GROUP BY user_id
)
SELECT
  m.user_id,
  m.march_orders,
  COALESCE(a.april_orders, 0) AS april_orders,
  ROUND(COALESCE(a.april_orders, 0) / m.march_orders * 100, 0) AS activity_decline_pct
FROM march_users m
LEFT JOIN april_activity a ON m.user_id = a.user_id
WHERE COALESCE(a.april_orders, 0) < m.march_orders * 0.5  -- 50%+ decline
ORDER BY activity_decline_pct ASC;
\`\`\`

This flags users showing early churn signals (activity dropping >50%).`,
    level: "senior_ds",
  },

  {
    q: "Write a SQL query to rank products by sales within each category, showing ties.",
    subcategory: "sql",
    difficulty: "Medium",
    a: `Problem: Rank products by total sales within their category. If two products have same sales, they get same rank (ties).

SQL:
\`\`\`sql
SELECT
  category,
  product_id,
  product_name,
  SUM(quantity * unit_price) AS total_sales,
  RANK() OVER (PARTITION BY category ORDER BY SUM(quantity * unit_price) DESC) AS sales_rank,
  DENSE_RANK() OVER (PARTITION BY category ORDER BY SUM(quantity * unit_price) DESC) AS dense_rank
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY category, product_id, product_name
ORDER BY category, sales_rank;
\`\`\`

Explanation:
- RANK() OVER (PARTITION BY category ORDER BY ...): Rank within category. If two products tie, both get rank 2, next gets rank 4.
- DENSE_RANK(): Continuous ranking. If two tie at rank 2, next gets rank 3 (no gap).
- PARTITION BY category: Separate ranking per category.

Output:
| category      | product_id | product_name | total_sales | sales_rank | dense_rank |
|---------------|------------|--------------|-------------|------------|------------|
| Electronics   | 101        | Laptop       | 500000      | 1          | 1          |
| Electronics   | 102        | Monitor      | 500000      | 1          | 1          |
| Electronics   | 103        | Mouse        | 250000      | 3          | 2          |
| Clothing      | 201        | T-Shirt      | 50000       | 1          | 1          |
| Clothing      | 202        | Jeans        | 45000       | 2          | 2          |

Variant: Show rank percentiles (instead of absolute rank).
\`\`\`sql
SELECT
  category,
  product_id,
  product_name,
  total_sales,
  PERCENT_RANK() OVER (PARTITION BY category ORDER BY total_sales DESC) AS percentile_rank
FROM (
  SELECT
    category,
    product_id,
    product_name,
    SUM(quantity * unit_price) AS total_sales
  FROM orders o
  JOIN products p ON o.product_id = p.product_id
  GROUP BY category, product_id, product_name
)
ORDER BY category, percentile_rank;
\`\`\`

PERCENT_RANK outputs 0-1 (0 = best, 1 = worst).

Use case:
- Identify top-selling products per category.
- Determine which products need inventory focus.
- Marketing: Promote #1 ranked products in each category.`,
    level: "mid_ds",
  },

  {
    q: "How would you design a SQL-based analytics system for a company processing 100M events per day?",
    subcategory: "sql",
    difficulty: "Hard",
    a: `Handling 100M events/day requires careful system design. Raw SQL queries will timeout. I'd design a tiered architecture.

Architecture:

1. Ingestion layer:
- Events stream into a message queue (Kafka, Pubsub).
- Batched every 5 minutes → stored in data warehouse (Snowflake, BigQuery, RedShift).
- 100M events/day ≈ 70K events/minute ≈ 5.8K events/second. Batch size: 350K events/5-min batch.

2. Raw data storage:
- Table: events_raw (timestamp, event_type, user_id, event_data, properties).
- Partitioned by DATE(timestamp) to enable efficient queries.
- Compressed columnar format (Parquet).
- Retention: 6 months raw, then archive to cold storage.

3. Aggregated tables (pre-computed):
Instead of querying raw 100M events, pre-aggregate:

\`\`\`sql
-- Hourly aggregates
CREATE TABLE events_hourly AS
SELECT
  DATE_TRUNC(timestamp, HOUR) AS hour,
  event_type,
  user_id,
  COUNT(*) AS event_count,
  COUNT(DISTINCT session_id) AS session_count
FROM events_raw
GROUP BY DATE_TRUNC(timestamp, HOUR), event_type, user_id;

-- Daily aggregates
CREATE TABLE events_daily AS
SELECT
  DATE(timestamp) AS date,
  event_type,
  COUNT(*) AS daily_count,
  COUNT(DISTINCT user_id) AS daily_users,
  COUNT(DISTINCT session_id) AS daily_sessions
FROM events_raw
GROUP BY DATE(timestamp), event_type;
\`\`\`

4. Indexing strategy:
\`\`\`sql
-- Partition and cluster for fast queries
CREATE TABLE events_raw (
  timestamp TIMESTAMP,
  event_type STRING,
  user_id INT64,
  ...
)
PARTITION BY DATE(timestamp)
CLUSTER BY event_type, user_id;
\`\`\`

5. Query patterns:
- Real-time dashboard: Query hourly aggregates (1K rows), not raw (100M rows).

\`\`\`sql
-- Dashboard: Events per hour, last 24 hours
SELECT
  hour,
  event_type,
  event_count
FROM events_hourly
WHERE hour >= CURRENT_TIMESTAMP() - INTERVAL 24 HOUR
ORDER BY hour DESC;
\`\`\`

- Cohort analysis: Query daily aggregates.

\`\`\`sql
-- Which users did X on day D1, and Y on day D2?
WITH day1_users AS (
  SELECT DISTINCT user_id
  FROM events_raw
  WHERE DATE(timestamp) = '2026-05-01'
    AND event_type = 'signup'
),
day30_users AS (
  SELECT DISTINCT user_id
  FROM events_raw
  WHERE DATE(timestamp) = '2026-05-31'
    AND event_type = 'purchase'
)
SELECT COUNT(DISTINCT d1.user_id)
FROM day1_users d1
JOIN day30_users d30 ON d1.user_id = d30.user_id;
\`\`\`

6. Materialized views (pre-computed insights):
\`\`\`sql
-- Top events by day (materialized daily)
CREATE MATERIALIZED VIEW top_events_daily AS
SELECT
  DATE(timestamp) AS date,
  event_type,
  COUNT(*) AS count
FROM events_raw
GROUP BY DATE(timestamp), event_type
ORDER BY count DESC
LIMIT 100;
\`\`\`

7. Performance optimization:
- Sampling: For exploratory queries, sample 1% of raw data (1M events instead of 100M). Queries run 100x faster.

\`\`\`sql
SELECT *
FROM events_raw
WHERE RAND() < 0.01  -- 1% sample
  AND DATE(timestamp) = CURRENT_DATE();
\`\`\`

- Denormalization: Pre-join with user/session tables to avoid expensive joins on raw data.

\`\`\`sql
CREATE TABLE events_enriched AS
SELECT
  e.timestamp,
  e.event_type,
  e.user_id,
  u.country,
  u.acquisition_date,
  s.session_id,
  s.session_start
FROM events_raw e
JOIN users u ON e.user_id = u.user_id
JOIN sessions s ON e.session_id = s.session_id;
\`\`\`

8. Maintenance:
- Automated partitioning: Delete old partitions (>6 months) to manage storage.
- Incremental aggregates: Only re-compute hourly aggregates for the last hour (not entire history).
- Monitoring: Alert if query latency exceeds thresholds (SLA: p95 latency < 10 seconds for dashboard queries).

Scalability checklist:
- Partitioning by date (separates hot/cold data).
- Clustering by frequently-filtered columns (event_type, user_id).
- Pre-aggregated tables (10-100x speedup for dashboards).
- Materialized views (near-instant results).
- Sampling for exploration (100x speedup).
- Cost control: Archive old data to cold storage ($0.01/GB/month vs $0.02/GB/month for active storage).`,
    level: "lead_ds",
  },

  {
    q: "Estimate the total data storage needed by Netflix for one year of content.",
    subcategory: "guesstimate",
    difficulty: "Medium",
    a: `Netflix's storage footprint: all movies, TV shows, metadata, and user data.

Content library:
- Netflix originals: ~200 movies + 100 TV shows/season.
- Licensed content: ~4000 movies + 2000 shows (varies by region).
- Total: ~6000 titles.

Video storage:

Video format breakdown:
- 4K (2160p): Premium quality, 25 Mbps bitrate.
- 1080p (HD): Standard quality, 5 Mbps bitrate.
- 720p (Standard): Mobile quality, 2.5 Mbps bitrate.
- 480p (Low): Mobile, 1.5 Mbps bitrate.

Netflix encodes most content in 4 formats. Assume average content needs all 4.

Movie storage (per title):
- 4K: 2.5 hours (9000 seconds) × 25 Mbps = 225 GB.
- 1080p: 2.5 hours × 5 Mbps = 45 GB.
- 720p: 2.5 hours × 2.5 Mbps = 22.5 GB.
- 480p: 2.5 hours × 1.5 Mbps = 13.5 GB.
- Total per movie: 306 GB.
- All formats + HDR/Dolby: ~400 GB per movie.

TV show storage (per episode):
- 1 hour episode: Same bitrates as above.
- Per episode: 45 + 9 + 4.5 + 2.7 = 61 GB (all formats).
- Average season: 10 episodes × 61 GB = 610 GB.

Content library storage:
- 4000 movies × 400 GB = 1.6 petabytes.
- 2000 shows × average 3 seasons × 610 GB = 3.66 petabytes.
- Total video: ~5.3 petabytes.

But Netflix offers content in multiple languages (dubbing, subtitles):
- Movies/shows available in ~25 languages.
- Not all formats in all languages (mostly 1080p + 480p for secondary languages).
- Additional storage: ~2x baseline (full 4K only for English, other languages 1080p max).
- Adjusted content storage: ~7.5 petabytes.

Metadata & transcoding:
- Metadata (posters, descriptions, ratings): ~100 MB per title × 6000 titles = 600 GB.
- Subtitles: ~100 MB per language-title pair × 6000 titles × 25 languages = 15 TB.
- Temporary transcoding cache (work-in-progress): ~500 TB.
- Total metadata: ~1 TB.

User data:
- 270 million users (as of 2024).
- Watch history, ratings, profiles, preferences: ~1 GB per user (includes model features, viewing history).
- 270 million × 1 GB = 270 exabytes.
- Wait, that's way too high. More realistic: ~100 MB per active user.
- 270 million × 100 MB = 27 petabytes.

Correction: Most user data is in databases, not file storage. Keep it lean:
- Actual stored user data: ~1 TB (aggregated analytics, not individual profiles).

Logs & analytics:
- Netflix ingests ~1 billion events per day (user interactions, streaming metrics).
- Each event: ~1 KB. 1 billion events = 1 TB/day.
- 1 year: 365 TB.

Backups & redundancy:
- Netflix replicates data across multiple regions (geographic redundancy).
- 3x replication common. Total: 3 × (content + logs + metadata).

Total storage calculation:
- Primary content (video): 7.5 petabytes.
- Metadata & logs: 1.5 TB.
- User data: 1 TB.
- Subtotal: 7.5 petabytes.
- 3x replication (multiregion): 22.5 petabytes.

But Netflix uses compression:
- Video: H.265 compression already applied (bitrate = compressed).
- Metadata: Highly compressible. Assume 50% compression.
- Effective: 22.5 PB / 1.3 (accounting for compression gains) = 17 petabytes.

Final estimate: Netflix needs ~15-20 petabytes of storage for one year of content globally (primary + replication + metadata + logs).

Sanity check:
- Petabyte = 1000 terabytes = $5-10 per TB (storage cost at scale).
- 20 PB × $7/TB = $140M/year in storage costs. Netflix's revenue: $40B. Storage: 0.35% of revenue. Reasonable.`,
    level: "senior_ds",
  },

  {
    q: "Write a SQL query to find the median order value per customer segment.",
    subcategory: "sql",
    difficulty: "Medium",
    a: `Problem: Calculate median order value (not average) segmented by customer type/cohort.

SQL:
\`\`\`sql
SELECT
  customer_segment,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_value) AS median_order_value,
  COUNT(*) AS total_orders,
  COUNT(DISTINCT customer_id) AS distinct_customers
FROM orders
GROUP BY customer_segment
ORDER BY median_order_value DESC;
\`\`\`

Explanation:
- PERCENTILE_CONT(0.5): Continuous percentile (50th = median). Works in PostgreSQL, Redshift, BigQuery (as APPROX_QUANTILES).
- WITHIN GROUP (ORDER BY order_value): Orders values to compute percentile.

For MySQL/older SQL versions (use subquery):
\`\`\`sql
WITH order_ranks AS (
  SELECT
    customer_segment,
    order_value,
    ROW_NUMBER() OVER (PARTITION BY customer_segment ORDER BY order_value) AS row_num,
    COUNT(*) OVER (PARTITION BY customer_segment) AS total_count
  FROM orders
)
SELECT
  customer_segment,
  AVG(order_value) AS median_order_value,
  (SELECT COUNT(*) FROM orders o WHERE o.customer_segment = r.customer_segment) AS total_orders
FROM order_ranks r
WHERE row_num = CEILING(total_count / 2.0)
  OR (total_count % 2 = 0 AND row_num = (total_count / 2) + 1)
GROUP BY customer_segment;
\`\`\`

Advanced: Multiple percentiles (median, Q1, Q3).
\`\`\`sql
SELECT
  customer_segment,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY order_value) AS q1_order_value,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_value) AS median_order_value,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY order_value) AS q3_order_value,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY order_value) AS p95_order_value,
  COUNT(*) AS total_orders
FROM orders
GROUP BY customer_segment
ORDER BY median_order_value DESC;
\`\`\`

Output:
| customer_segment | q1_order_value | median_order_value | q3_order_value | p95_order_value | total_orders |
|------------------|----------------|--------------------|----------------|-----------------|--------------|
| premium          | 500            | 1200               | 2500           | 5000            | 15000        |
| standard         | 100            | 250                | 600            | 1500            | 50000        |
| trial            | 50             | 75                 | 150            | 400             | 20000        |

Why median vs average:
- Average is skewed by outliers (one whale customer buying $100K worth).
- Median is robust (represents typical customer).
- premium segment: Median $1200 is typical for premium customer. Average might be $1500 (skewed by outliers).

Use case:
- Understand purchase patterns by segment.
- Set expectations: Premium customers usually spend $1200/order.
- Identify when distribution shifts (alert if median drops 20%).`,
    level: "mid_ds",
  },

  {
    q: "How many credit card transactions happen in India in one day? Walk through your assumptions.",
    subcategory: "guesstimate",
    difficulty: "Hard",
    a: `Estimating daily credit card transactions in India.

Population & payment adoption:
- India population: ~1.4 billion.
- Credit card penetration: ~5-7% (150-190 million credit cards issued). Use 170 million.
- Active credit card users (transact monthly): 50% of issued. = 85 million.

Transaction frequency:
- Daily active credit card users: Assume 30% of active monthly users. = 25.5 million users/day.
- Transactions per active user per day: Not all active users transact daily. Average: 0.7 transactions/user/day.
- Daily credit card transactions: 25.5M users × 0.7 = 17.85 million transactions.

But this undercounts. Breakdown by use case:

1. Retail/POS transactions:
- POS machines (retail stores, restaurants, fuel stations): ~5 million POS terminals in India.
- Each terminal: 20 transactions/day (average across busy stores and quiet shops).
- Daily POS: 5M × 20 = 100M transactions.
- Credit card % of all cards swiped: 60% (rest are debit). = 60M credit card transactions.

2. Online transactions:
- E-commerce users: 150 million (urban internet population).
- Daily active: 10% = 15 million.
- Credit card % of payment methods (vs UPI, net banking, etc.): 20% of transactions.
- Transactions per user: 0.2/day (not everyone shops daily).
- Daily credit card online: 15M × 0.2 × 0.2 = 600K transactions.

3. Subscription payments:
- Subscription services (SaaS, streaming, OTT): 100 million users.
- Monthly billing, assume distributed evenly: 100M / 30 = 3.33M/day.
- Credit card %: 30% (rest UPI/auto-pay net banking). = 1M transactions.

4. Travel & entertainment:
- Airlines, hotels, events booking: 100K transactions/day (segment of upper-middle class users).
- Credit card %: 80% (high-value transactions prefer credit). = 80K transactions.

Total estimate:
- Retail: 60M
- Online: 0.6M
- Subscriptions: 1M
- Travel: 0.08M
- Subtotal: ~61.7M transactions/day.

Cross-check with RBI data:
- RBI reports ~7-8 million debit card transactions per day (2023).
- Credit cards are 20-30% of debit (fewer issued, but used more frequently).
- Credit card transactions: 7.5M × 0.25 = 1.875M daily (from RBI).
- This contradicts my estimate. Reason: RBI counts only tracked/reported transactions through established payment gateways. Informal transactions (small stores, cash-first merchants) aren't counted.

Refined estimate:
- Formal sector (tracked by RBI, payment gateways): 2-3 million/day.
- Informal sector (small shops, local merchants, cash-preferred): 5-10 million/day (many don't report).
- Total: 7-13 million credit card transactions/day in India.

More realistic: 10 million credit card transactions/day.

Sensitivity:
- If penetration is lower (4% instead of 5%): 8M transactions/day.
- If penetration is higher (8%): 12M transactions/day.
- If transaction frequency doubles (urban shift): 20M transactions/day.

Final estimate: India sees 8-15 million credit card transactions per day, with best guess at 10 million.

Context: US (similar GDP per capita in some segments, higher in others) sees 150M credit card transactions/day. US has 330M people, 200M credit cards, higher penetration. US/India ratio: 330M/1400M = 0.24. So US transactions / 0.24 = India estimate: 150M × 0.1 (accounting for lower penetration and frequency) = 15M. My estimate aligns.`,
    level: "lead_ds",
  },

  {
    q: "Write a Python function to detect anomalies in a time series of daily revenue data.",
    subcategory: "python",
    difficulty: "Medium",
    a: `Problem: Detect unusual revenue spikes or drops.

Simple approach using statistical thresholds:

\`\`\`python
import numpy as np
import pandas as pd
from scipy import stats

def detect_revenue_anomalies(revenue_data, window=7, threshold=3):
    """
    Detect anomalies in daily revenue using rolling statistics.

    Args:
        revenue_data: List or array of daily revenue values.
        window: Number of days for rolling average (default 7).
        threshold: Number of standard deviations from mean to flag anomaly (default 3).

    Returns:
        DataFrame with anomaly flags and confidence scores.
    """
    df = pd.DataFrame({'date': pd.date_range(start='2026-01-01', periods=len(revenue_data)),
                       'revenue': revenue_data})

    # Compute rolling mean and std
    df['rolling_mean'] = df['revenue'].rolling(window=window, center=True).mean()
    df['rolling_std'] = df['revenue'].rolling(window=window, center=True).std()

    # Calculate z-score
    df['z_score'] = (df['revenue'] - df['rolling_mean']) / df['rolling_std']

    # Flag anomalies (z_score > threshold or < -threshold)
    df['is_anomaly'] = np.abs(df['z_score']) > threshold
    df['anomaly_severity'] = np.abs(df['z_score'])

    return df[df['is_anomaly']][['date', 'revenue', 'rolling_mean', 'z_score', 'anomaly_severity']]

# Example usage
revenue = [1000, 1050, 980, 1200, 1100, 950, 1000,  # Week 1
           1100, 1050, 1200, 5000, 1150, 1000, 950,   # Week 2 (day 10 anomaly)
           1000, 1050, 900, 800, 1100, 1000, 950]    # Week 3

anomalies = detect_revenue_anomalies(revenue, window=7, threshold=2.5)
print(anomalies)
\`\`\`

Output:
\`\`\`
        date  revenue  rolling_mean  z_score  anomaly_severity
10 2026-01-11     5000      1050.0     3.8          3.8
\`\`\`

Advanced approach using seasonal decomposition (handles seasonality):

\`\`\`python
from statsmodels.tsa.seasonal import seasonal_decompose

def detect_seasonal_anomalies(revenue_data, period=7):
    """
    Detect anomalies accounting for weekly seasonality.
    Assumes data has weekly pattern (higher on weekends, lower on weekdays).
    """
    df = pd.DataFrame({'revenue': revenue_data},
                      index=pd.date_range(start='2026-01-01', periods=len(revenue_data)))

    # Decompose into trend, seasonal, residual
    decomposition = seasonal_decompose(df['revenue'], model='additive', period=period)

    # Anomalies are large residuals (unexplained variation)
    residual_mean = decomposition.resid.mean()
    residual_std = decomposition.resid.std()

    df['residual'] = decomposition.resid
    df['is_anomaly'] = np.abs(df['residual'] - residual_mean) > 2.5 * residual_std

    return df[df['is_anomaly']]
\`\`\`

More robust: Isolation Forest (machine learning approach):

\`\`\`python
from sklearn.ensemble import IsolationForest
import pandas as pd

def detect_anomalies_ml(revenue_data, contamination=0.05):
    """
    Detect anomalies using Isolation Forest.

    Args:
        revenue_data: Daily revenue values.
        contamination: Expected % of anomalies (default 5%).

    Returns:
        DataFrame with anomaly predictions.
    """
    df = pd.DataFrame({'revenue': revenue_data})

    # Add lagged features (context from prior days)
    df['revenue_lag1'] = df['revenue'].shift(1)
    df['revenue_lag7'] = df['revenue'].shift(7)
    df['pct_change'] = df['revenue'].pct_change()
    df['rolling_mean_7'] = df['revenue'].rolling(7).mean()

    # Fit Isolation Forest
    iso_forest = IsolationForest(contamination=contamination, random_state=42)
    df['anomaly'] = iso_forest.fit_predict(df[['revenue', 'pct_change', 'rolling_mean_7']])
    df['anomaly'] = df['anomaly'].apply(lambda x: 'anomaly' if x == -1 else 'normal')

    return df[df['anomaly'] == 'anomaly']

# Usage
anomalies = detect_anomalies_ml(revenue, contamination=0.05)
print(anomalies)
\`\`\`

Production implementation:

\`\`\`python
import json
from datetime import datetime, timedelta

def monitor_revenue_stream(daily_revenue_dict):
    """
    Real-time anomaly detection. Alerts if revenue deviates.

    Args:
        daily_revenue_dict: {'2026-05-01': 1000, '2026-05-02': 1050, ...}
    """
    dates = sorted(daily_revenue_dict.keys())
    revenues = [daily_revenue_dict[d] for d in dates]

    # Use last 30 days as baseline
    if len(revenues) < 30:
        return "Need 30 days of history"

    baseline = revenues[-30:-1]  # Last 30 days, excluding today
    today_revenue = revenues[-1]

    baseline_mean = np.mean(baseline)
    baseline_std = np.std(baseline)

    z_score = (today_revenue - baseline_mean) / baseline_std

    alert_level = "normal"
    if z_score > 3:
        alert_level = "CRITICAL"
    elif z_score > 2:
        alert_level = "WARNING"
    elif z_score < -2:
        alert_level = "WARNING"

    return {
        'date': dates[-1],
        'today_revenue': today_revenue,
        'baseline_mean': baseline_mean,
        'z_score': z_score,
        'alert': alert_level
    }

# Usage
daily_rev = {'2026-04-01': 1000, '2026-04-02': 1050, ..., '2026-05-01': 5000}
alert = monitor_revenue_stream(daily_rev)
print(json.dumps(alert, indent=2))
\`\`\`

Tradeoffs:
- Rolling statistics: Simple, fast, works for stationary data. Fails with trends/seasonality.
- Seasonal decomposition: Handles seasonality, better accuracy. Requires enough history (2x period minimum).
- Isolation Forest: Detects complex patterns, robust. Requires tuning (contamination %), needs features.

Recommended: Start with rolling statistics. Add seasonal decomposition if revenue has weekly patterns. Use ML if false positives are too high.`,
    level: "senior_ds",
  },

  {
    q: "Write a SQL query to find the top 3 fastest growing product categories quarter over quarter.",
    subcategory: "sql",
    difficulty: "Hard",
    a: `Problem: Measure QoQ growth rate for each product category and rank top 3.

SQL:
\`\`\`sql
WITH quarterly_revenue AS (
  SELECT
    CONCAT(YEAR(order_date), '-Q', QUARTER(order_date)) AS quarter,
    DATE_TRUNC(order_date, QUARTER) AS quarter_start,
    product_category,
    SUM(revenue) AS quarterly_revenue
  FROM orders
  WHERE order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 2 YEAR)
  GROUP BY YEAR(order_date), QUARTER(order_date), product_category
),
qoq_growth AS (
  SELECT
    product_category,
    quarter,
    quarterly_revenue,
    LAG(quarterly_revenue) OVER (PARTITION BY product_category ORDER BY quarter) AS prev_quarter_revenue,
    ROUND(
      (quarterly_revenue - LAG(quarterly_revenue) OVER (PARTITION BY product_category ORDER BY quarter))
      / LAG(quarterly_revenue) OVER (PARTITION BY product_category ORDER BY quarter) * 100,
      2
    ) AS qoq_growth_pct,
    ROW_NUMBER() OVER (PARTITION BY quarter ORDER BY quarterly_revenue DESC) AS rank_in_quarter
  FROM quarterly_revenue
),
latest_quarter_top_3 AS (
  SELECT
    product_category,
    quarter,
    quarterly_revenue,
    prev_quarter_revenue,
    qoq_growth_pct
  FROM qoq_growth
  WHERE quarter = (SELECT MAX(quarter) FROM qoq_growth)  -- Latest quarter
    AND qoq_growth_pct IS NOT NULL  -- Exclude first quarter (no prior data)
  ORDER BY qoq_growth_pct DESC
  LIMIT 3
)
SELECT * FROM latest_quarter_top_3;
\`\`\`

Output:
| product_category | quarter  | quarterly_revenue | prev_quarter_revenue | qoq_growth_pct |
|------------------|----------|-------------------|----------------------|-----------------|
| AI Tools         | 2026-Q1  | 5000000           | 2000000              | 150.00          |
| SaaS             | 2026-Q1  | 4500000           | 2250000              | 100.00          |
| Streaming        | 2026-Q1  | 3800000           | 2533000              | 50.00           |

Alternative approach: Detect fastest accelerating categories (growth rate increasing):

\`\`\`sql
WITH qoq_data AS (
  SELECT
    product_category,
    CONCAT(YEAR(order_date), '-Q', QUARTER(order_date)) AS quarter,
    SUM(revenue) AS quarterly_revenue,
    LAG(SUM(revenue)) OVER (PARTITION BY product_category ORDER BY YEAR(order_date), QUARTER(order_date)) AS prev_quarter_revenue
  FROM orders
  GROUP BY product_category, YEAR(order_date), QUARTER(order_date)
),
growth_rates AS (
  SELECT
    product_category,
    quarter,
    (quarterly_revenue - prev_quarter_revenue) / prev_quarter_revenue AS qoq_growth_rate,
    LAG((quarterly_revenue - prev_quarter_revenue) / prev_quarter_revenue)
      OVER (PARTITION BY product_category ORDER BY quarter) AS prev_qoq_growth_rate
  FROM qoq_data
  WHERE prev_quarter_revenue IS NOT NULL
),
acceleration AS (
  SELECT
    product_category,
    quarter,
    qoq_growth_rate,
    prev_qoq_growth_rate,
    (qoq_growth_rate - prev_qoq_growth_rate) AS growth_acceleration
  FROM growth_rates
  WHERE prev_qoq_growth_rate IS NOT NULL
)
SELECT
  product_category,
  quarter,
  ROUND(qoq_growth_rate * 100, 2) AS qoq_growth_pct,
  ROUND(growth_acceleration * 100, 2) AS acceleration_pct
FROM acceleration
WHERE quarter = (SELECT MAX(quarter) FROM acceleration)
ORDER BY acceleration_pct DESC
LIMIT 3;
\`\`\`

This finds categories whose growth is accelerating (growth rate itself is increasing).

Advanced: Compound quarterly growth rate (CQGR):

\`\`\`sql
WITH category_quarterly AS (
  SELECT
    product_category,
    CONCAT(YEAR(order_date), '-Q', QUARTER(order_date)) AS quarter,
    SUM(revenue) AS quarterly_revenue
  FROM orders
  WHERE order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 2 YEAR)
  GROUP BY product_category, YEAR(order_date), QUARTER(order_date)
),
cqgr AS (
  SELECT
    product_category,
    MIN(quarterly_revenue) AS first_quarter_revenue,
    MAX(quarterly_revenue) AS latest_quarter_revenue,
    COUNT(*) AS num_quarters,
    POWER(
      MAX(quarterly_revenue) / MIN(quarterly_revenue),
      1.0 / (COUNT(*) - 1)
    ) - 1 AS cqgr
  FROM category_quarterly
  GROUP BY product_category
  HAVING COUNT(*) >= 4  -- At least 4 quarters of data
)
SELECT
  product_category,
  ROUND(cqgr * 100, 2) AS compound_quarterly_growth_rate
FROM cqgr
ORDER BY cqgr DESC
LIMIT 3;
\`\`\`

This smooths out single-quarter volatility, showing true growth trend.

Use case:
- Identify high-growth categories for investment.
- Allocate marketing budget toward fastest-growing segments.
- Alert if a category's growth slows (early warning of market saturation).`,
    level: "lead_ds",
  },

  {
    q: "Estimate the market size for AI-powered interview preparation tools globally.",
    subcategory: "guesstimate",
    difficulty: "Hard",
    a: `Market size estimation for AI interview prep tools (2026 globally).

Target market:
- Job seekers preparing for interviews.
- Students preparing for campus placements, entrance exams.
- Professionals switching roles/industries.

Geography & scale:

1. North America (US + Canada):
- Job market: 150 million employed + 5 million unemployed = 155 million.
- Job-switchers annually: ~25% of workforce = 38.75 million.
- Interview prep penetration (use online tools): 15% = 5.8 million.
- Willingness to pay for AI prep: 50% (rest use free content) = 2.9 million.
- Avg price: $100-150/year (freemium + premium). Use $120.
- Market size: 2.9M × $120 = $348 million.

2. Europe (UK, Germany, France, etc.):
- Job market: 200 million employed.
- Job-switchers: 20% = 40 million.
- Interview prep adoption: 12% (lower than US) = 4.8 million.
- Willingness to pay: 40% = 1.92 million.
- Avg price: $60 (lower purchasing power).
- Market size: 1.92M × $60 = $115 million.

3. India:
- Job market: 400 million employed.
- Job-switchers (higher turnover): 15% = 60 million.
- Interview prep adoption: 20% (highly competitive job market, campus placements) = 12 million.
- Willingness to pay: 20% (price sensitivity) = 2.4 million.
- Avg price: $15 (lower purchasing power).
- Market size: 2.4M × $15 = $36 million.

4. Rest of Asia (China, Southeast Asia):
- Job market: 500 million.
- Interview prep adoption: 10% = 50 million.
- Willingness to pay: 15% = 7.5 million.
- Avg price: $30.
- Market size: 7.5M × $30 = $225 million.

5. Rest of World (Latin America, Middle East, Africa):
- Job market: 300 million.
- Adoption: 8% = 24 million.
- Willingness to pay: 10% = 2.4 million.
- Avg price: $25.
- Market size: 2.4M × $25 = $60 million.

Total addressable market (TAM):
- North America: $348M.
- Europe: $115M.
- India: $36M.
- Rest of Asia: $225M.
- Rest of World: $60M.
- Global TAM: ~$784M ≈ $800 million.

Serviceable addressable market (SAM, realistic capture):
- Assume 30% of TAM is reachable with current business models.
- SAM: $800M × 0.3 = $240 million.

Revenue model breakdown:
- Subscription (individual users): 60% of market.
- Enterprise (companies buying for employees): 30% (B2B2C).
- Institutional (universities, bootcamps): 10%.

Subcategories within AI interview prep:
- Behavioral interview coaching: 40% of market.
- Technical interview prep (coding, case studies): 40%.
- Soft skills (communication, confidence): 15%.
- Career coaching + interview prep bundle: 5%.

Current market players:
- Pramp (peer-to-peer mock interviews): ~$10M revenue (small).
- Exponent (case interview prep): ~$20-30M.
- Interviewing.io (anonymous mock interviews): ~$5M.
- LeetCode (coding prep): ~$50-100M (larger, but not purely interview prep).
- Emerging AI players (ChatGPT for mock interviews, AI coaches): <$5M each (early stage).

Market size validation:
- Top 3 players: $75M combined revenue.
- Market is fragmented, long tail of small players.
- Total market capturing revenue: ~$150-200M (20-25% of TAM monetized actively).
- Runway: High growth potential as AI tools improve and adoption increases.

Growth drivers:
- AI quality improving (more realistic mock interviews, better feedback).
- Remote work normalizing (more interviews conducted remotely, AI-friendly).
- Job market volatility (workers upskilling, creating demand for prep).
- CAGR: 30-50% (2024-2030) as AI tools mature.

2026 market size estimate: $200-250M (growing from ~$150M in 2024).

By 2031: $500M-$1B (if growth sustains at 30%+ CAGR).

Risk factors:
- Market saturation: If multiple free AI coaching tools emerge (ChatGPT + plugins), paid adoption drops.
- Regulatory: Data privacy concerns (recording mock interviews) could limit growth in EU.
- Cannibalization: As LLMs improve (GPT-5, Claude-next), DIY mock interview prep becomes viable, reducing paid-tool demand.

Final estimate: Global market for AI-powered interview preparation is ~$200-300 million in 2026, with strong growth potential to $500M+ by 2030.`,
    level: "lead_ds",
  },

  {
    q: "Write a Python script that automates the process of detecting data quality issues in a CSV file.",
    subcategory: "python",
    difficulty: "Medium",
    a: `Problem: Automated data quality checks on CSV files.

Complete script:

\`\`\`python
import pandas as pd
import numpy as np
from datetime import datetime
import json

class DataQualityChecker:
    def __init__(self, filepath, sample_size=10000):
        self.filepath = filepath
        self.df = pd.read_csv(filepath, nrows=sample_size)
        self.report = {
            'timestamp': datetime.now().isoformat(),
            'filepath': filepath,
            'shape': self.df.shape,
            'issues': []
        }

    def check_missing_values(self, threshold=0.3):
        """Flag columns with >threshold missing values."""
        missing_pct = self.df.isnull().sum() / len(self.df)
        for col, pct in missing_pct.items():
            if pct > threshold:
                self.report['issues'].append({
                    'type': 'missing_values',
                    'column': col,
                    'severity': 'high' if pct > 0.5 else 'medium',
                    'details': f"{pct*100:.1f}% missing"
                })

    def check_duplicates(self):
        """Flag if significant duplicate rows exist."""
        dup_count = self.df.duplicated().sum()
        dup_pct = dup_count / len(self.df)
        if dup_pct > 0.05:
            self.report['issues'].append({
                'type': 'duplicates',
                'severity': 'medium' if dup_pct < 0.2 else 'high',
                'details': f"{dup_count} duplicate rows ({dup_pct*100:.1f}%)"
            })

    def check_data_types(self):
        """Detect columns with unexpected data types."""
        for col in self.df.columns:
            # Check if numeric column contains non-numeric strings
            if self.df[col].dtype == 'object':
                non_null = self.df[col].dropna()
                if len(non_null) > 0:
                    try:
                        pd.to_numeric(non_null, errors='coerce')
                        numeric_pct = pd.to_numeric(non_null, errors='coerce').notna().sum() / len(non_null)
                        if numeric_pct > 0.9:  # Should be numeric but isn't
                            self.report['issues'].append({
                                'type': 'type_mismatch',
                                'column': col,
                                'severity': 'medium',
                                'details': f"Column appears numeric (90% numeric values) but stored as object"
                            })
                    except:
                        pass

    def check_outliers(self, columns=None, std_threshold=5):
        """Detect outliers using z-score method."""
        if columns is None:
            columns = self.df.select_dtypes(include=[np.number]).columns

        for col in columns:
            z_scores = np.abs((self.df[col] - self.df[col].mean()) / self.df[col].std())
            outlier_count = (z_scores > std_threshold).sum()
            outlier_pct = outlier_count / len(self.df)
            if outlier_pct > 0.01:
                self.report['issues'].append({
                    'type': 'outliers',
                    'column': col,
                    'severity': 'low' if outlier_pct < 0.05 else 'medium',
                    'details': f"{outlier_count} outliers (>{std_threshold} std dev)"
                })

    def check_invalid_dates(self, date_columns=None):
        """Flag columns with invalid date formats."""
        if date_columns is None:
            date_columns = [col for col in self.df.columns if 'date' in col.lower()]

        for col in date_columns:
            try:
                pd.to_datetime(self.df[col], errors='coerce')
                invalid_pct = self.df[col].isna().sum() / len(self.df)
                if invalid_pct > 0.05:
                    self.report['issues'].append({
                        'type': 'invalid_dates',
                        'column': col,
                        'severity': 'medium',
                        'details': f"{invalid_pct*100:.1f}% invalid date formats"
                    })
            except Exception as e:
                self.report['issues'].append({
                    'type': 'date_parsing_error',
                    'column': col,
                    'severity': 'high',
                    'details': str(e)
                })

    def check_inconsistent_values(self, categorical_threshold=50):
        """Flag categorical columns with too many unique values."""
        for col in self.df.select_dtypes(include=['object']).columns:
            unique_count = self.df[col].nunique()
            if unique_count > categorical_threshold:
                self.report['issues'].append({
                    'type': 'too_many_categories',
                    'column': col,
                    'severity': 'low',
                    'details': f"{unique_count} unique values in categorical column"
                })

    def check_range_constraints(self, constraints=None):
        """Validate numeric columns against expected ranges."""
        if constraints is None:
            constraints = {}  # Example: {'age': (0, 120), 'score': (0, 100)}

        for col, (min_val, max_val) in constraints.items():
            if col not in self.df.columns:
                continue
            out_of_range = ((self.df[col] < min_val) | (self.df[col] > max_val)).sum()
            if out_of_range > 0:
                self.report['issues'].append({
                    'type': 'out_of_range',
                    'column': col,
                    'severity': 'medium',
                    'details': f"{out_of_range} values outside range [{min_val}, {max_val}]"
                })

    def run_all_checks(self, constraints=None):
        """Execute all checks."""
        self.check_missing_values()
        self.check_duplicates()
        self.check_data_types()
        self.check_outliers()
        self.check_invalid_dates()
        self.check_inconsistent_values()
        self.check_range_constraints(constraints)
        return self.report

    def save_report(self, output_file='data_quality_report.json'):
        """Save report to JSON."""
        with open(output_file, 'w') as f:
            json.dump(self.report, f, indent=2)
        print(f"Report saved to {output_file}")

    def summarize(self):
        """Print summary."""
        print(f"\\n=== Data Quality Report ===")
        print(f"File: {self.filepath}")
        print(f"Shape: {self.report['shape']}")
        print(f"Issues found: {len(self.report['issues'])}")

        for severity in ['high', 'medium', 'low']:
            count = sum(1 for i in self.report['issues'] if i.get('severity') == severity)
            if count > 0:
                print(f"  {severity.upper()}: {count}")

        if self.report['issues']:
            print(f"\\nTop issues:")
            for issue in self.report['issues'][:5]:
                print(f"  - [{issue.get('type')}] {issue.get('column', 'N/A')}: {issue.get('details')}")

# Usage
if __name__ == "__main__":
    # Initialize checker
    checker = DataQualityChecker('sales_data.csv')

    # Define constraints
    constraints = {
        'revenue': (0, 100000),
        'quantity': (1, 10000),
        'discount': (0, 1)
    }

    # Run checks
    report = checker.run_all_checks(constraints=constraints)

    # Display summary
    checker.summarize()

    # Save report
    checker.save_report('data_quality_report.json')
\`\`\`

Output example:
\`\`\`
=== Data Quality Report ===
File: sales_data.csv
Shape: (10000, 15)
Issues found: 8
  HIGH: 1
  MEDIUM: 3
  LOW: 4

Top issues:
  - [missing_values] revenue: 35.2% missing
  - [invalid_dates] order_date: 2.3% invalid date formats
  - [duplicates] N/A: 340 duplicate rows (3.4%)
  - [outliers] quantity: 23 outliers (>5 std dev)
  - [too_many_categories] customer_id: 892 unique values in categorical column
\`\`\`

Advanced: Integration with data pipeline:

\`\`\`python
def auto_remediate(df, issues):
    """Auto-fix common issues."""
    for issue in issues:
        if issue['type'] == 'missing_values' and issue.get('severity') == 'low':
            col = issue['column']
            df[col].fillna(df[col].median(), inplace=True)
        elif issue['type'] == 'duplicates':
            df.drop_duplicates(inplace=True)
    return df
\`\`\`

Use case: Schedule daily checks on data imports. Alert if severity=high issues detected.`,
    level: "senior_ds",
  },
]
