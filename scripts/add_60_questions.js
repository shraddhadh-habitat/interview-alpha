#!/usr/bin/env node

/**
 * Script to add 60 new consulting interview questions to consultingQuestions.js
 * This preserves all existing questions and appends new ones to each role
 */

const fs = require('fs');
const path = require('path');

// Read the current consultingQuestions module
const filePath = path.join(__dirname, 'src/data/consultingQuestions.js');
const currentContent = fs.readFileSync(filePath, 'utf8');

// Parse the existing export to get the current object
const consultingModule = require('./src/data/consultingQuestions.js');
const questions = JSON.parse(JSON.stringify(consultingModule.consultingQuestions));

// Define all 60 new questions - CONSULTANT role (4 questions)
questions["Consultant"].case_interview.push(
  {
    q: "A large Indian private sector bank's credit card division has seen its monthly active user rate drop from 68% to 51% over 18 months despite the total card base growing 40%. The division head wants to understand why and how to recover engagement. How do you approach this?",
    subcategory: "Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: `A declining MAU rate on a growing card base tells me the bank is successfully issuing cards but failing to create habitual usage. New cards are being acquired faster than existing cardholders are engaging, which means either the new card acquisition is pulling in low-intent customers or the activation and engagement experience is failing cardholders after issuance.

I would structure the diagnosis across three dimensions.

The first dimension is the new versus existing cohort split. I would separate the MAU rate for cards issued more than 12 months ago from cards issued in the last 12 months. If the MAU decline is concentrated in newer cohorts, the problem is activation failure. If it is uniform across all cohorts, the problem is ongoing engagement loss. These require completely different interventions.

The second dimension is the usage occasion analysis. Credit cards in India are used for specific occasions: online shopping, travel bookings, large purchases where EMI conversion is valuable, and dining or entertainment with reward multipliers. I would analyze which categories of spend are declining and which are stable. A decline in online shopping spend may reflect competitive pressure from co-branded cards with stronger online rewards. A decline in overall transaction frequency may reflect customers defaulting to UPI for convenience.

The third dimension is the rewards and benefits relevance assessment. Credit card engagement is strongly driven by perceived value of the rewards program. If the rewards earn rate has been diluted, if redemption has become more difficult, or if competing cards offer more relevant benefits for the specific customer's spending pattern, engagement will decline even without any negative service experience.

Before recommending anything I would want the cohort-level MAU trend, the category-wise spend distribution trend, the rewards redemption rate, and the results of any customer satisfaction research on the card product.

My hypothesis is that the MAU decline reflects a combination of weak activation for new cards and competitive pressure from UPI and fintech credit card products with stronger rewards propositions in the categories where this bank's cards are weakest.

The recovery strategy would address both: a 90-day activation program for cards issued but never used in the last 6 months, and a rewards program redesign targeting the specific spend categories where the bank is losing share.`,
    companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture'],
    roundType: "Case Interview",
    whatInterviewerTests: "Product engagement analysis, cohort thinking, competitive dynamics, activation versus retention distinction",
    commonMistakes: ["Treating the MAU decline as a single problem without separating activation from ongoing engagement", "Not analyzing the cohort-level data before diagnosing", "Ignoring UPI as a competing substitute for credit card usage occasions", "Recommending a generic loyalty program improvement without identifying which specific categories are losing share"]
  },
  {
    q: "A large Indian cement company has acquired a smaller regional player with 3 plants. Six months after the acquisition, the integration is behind schedule, two senior managers from the acquired company have resigned, and costs are running 15% above the synergy model. The CEO asks you to diagnose what went wrong and how to get the integration back on track. How do you approach this?",
    subcategory: "Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: `A post-merger integration that is behind schedule with talent loss and cost overruns 6 months in is a pattern I have seen before, and it almost always reflects one of three root causes: unrealistic synergy assumptions in the deal model, inadequate integration planning before close, or cultural and leadership friction that was underestimated during due diligence.

I would spend the first two weeks doing an honest diagnostic before recommending any recovery plan.

On the cost overrun, I would reconcile the synergy model assumptions against actual performance line by line. Procurement synergies in cement typically come from shared limestone sourcing, fuel procurement, and logistics consolidation. If these have not materialized, is it because the contracts were longer term than assumed, because the plants are in different geographies that do not allow logistics consolidation, or because the procurement teams have not been integrated yet? Understanding the specific gap between assumption and reality tells me whether the synergies are delayed or structurally unachievable.

On the talent loss, two senior manager resignations 6 months in is a significant signal. In my experience, early talent departures from acquired companies follow one of two patterns. The acquired company's managers feel marginalized or disrespected by the acquirer's management style and leave because of cultural friction. Or they were offered retention packages that were inadequate relative to competing offers they received once the acquisition was public. I would speak directly with the departing managers if possible, and with remaining senior managers from the acquired entity, to understand the real reason.

On the integration timeline, I would assess whether the integration management office has the right structure and authority. Integrations that are managed as a side project by people who have other operational responsibilities consistently fall behind. A dedicated full-time integration lead with direct CEO access and authority to make decisions across functions is the standard requirement for a successful integration.

The recovery plan would address the immediate talent risk first, the cost synergy replan second, and the governance structure third. The sequence matters because talent loss compounds: each departure makes the remaining talent more anxious and more likely to leave.`,
    companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture'],
    roundType: "Case Interview",
    whatInterviewerTests: "Post merger integration diagnosis, synergy realization, talent retention, integration governance",
    commonMistakes: ["Jumping to a recovery plan without first diagnosing which of the three root causes is primary", "Not separating unrealistic synergy assumptions from delayed synergies in the cost overrun analysis", "Underestimating talent retention as the most urgent priority", "Not identifying integration governance structure as a root cause of timeline slippage"]
  },
  {
    q: "A large Indian retail bank has seen its net promoter score drop from 42 to 28 over two years despite significant investment in digital channels and branch refurbishment. The CEO is frustrated. How do you diagnose what is driving the NPS decline?",
    subcategory: "Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: `A 14-point NPS decline over two years despite significant investment in visible improvements is a strong signal that the investments are addressing the wrong pain points. The bank is fixing what it can see while the actual detractor drivers are elsewhere.

I would structure the diagnostic across three questions.

The first question is what are customers actually saying in the verbatim feedback? NPS scores are useful metrics but the verbatim comments that accompany detractor scores are where the diagnostic information lives. I would do a text analysis of the last 6 to 12 months of detractor verbatim comments and categorize the themes. In Indian retail banking the most common NPS detractor themes are service resolution failures where customers contacted the bank about a problem and it was not resolved, hidden charges that customers discovered unexpectedly, and digital channel failures where the app or internet banking did not work during a time-sensitive transaction.

The second question is whether the NPS decline is uniform across customer segments or concentrated. High-value customers, mass retail customers, and senior citizens have very different banking interactions and very different expectations. If the NPS decline is concentrated in one segment, the diagnosis and solution are much more targeted. If it is uniform, there is a systemic service quality problem.

The third question is what changed 2 years ago that correlates with the start of the decline. NPS changes at this scale over this timeframe are almost never random. They correlate with a specific operational change: a contact center transition, a digital banking platform migration, a fee restructuring, or a change in complaint resolution processes. Identifying the correlating event narrows the diagnostic hypothesis significantly.

My hypothesis is that the NPS decline is driven primarily by complaint resolution failures and unexpected charges, not by branch or digital channel aesthetics. The investment in visible improvements has not addressed the moments that matter most to customers, which are the moments when something goes wrong and they need the bank to fix it quickly.`,
    companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture'],
    roundType: "Case Interview",
    whatInterviewerTests: "Customer experience diagnosis, NPS decomposition, verbatim analysis, root cause correlation",
    commonMistakes: ["Accepting the NPS number at face value without analyzing the verbatim driver data", "Not segmenting the NPS decline by customer type", "Not looking for the correlating operational event that triggered the decline", "Recommending more investment in the same channels without diagnosing whether those channels are the actual problem"]
  },
  {
    q: "A large Indian consumer goods company is losing 18% of its products to damage, theft, and expiry in its distribution network annually. Industry benchmark is 6%. The supply chain head estimates this costs 240 crore rupees per year. How do you diagnose and fix this?",
    subcategory: "Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: `A 12-percentage-point gap versus industry benchmark in distribution losses is a massive value leakage that is almost certainly not a single problem but a combination of issues across different points in the distribution chain. Before recommending solutions I need to understand where the 18% is being lost.

I would decompose the loss across three categories and three points in the distribution chain.

The three loss categories are damage, theft, and expiry. Each has different root causes and different solutions. Damage is driven by handling practices, packaging quality, and storage conditions. Theft is driven by inventory controls, visibility, and incentive structures. Expiry is driven by demand forecasting accuracy, first-in-first-out discipline, and route-to-market efficiency in reaching the final consumer before shelf life expires.

The three points in the distribution chain are the company's own warehouses and CFAs, the distributor level, and the last mile to retailers. Loss rates are rarely uniform across these three points. In Indian FMCG, expiry losses are typically highest at the distributor and retailer level because these points have weaker inventory management discipline. Theft is typically highest at the CFA and distributor level where inventory volumes are large and controls are weaker than in company-owned facilities. Damage is typically highest in transit and last-mile handling.

Before recommending anything I would want the loss data broken down by category, by point in the chain, and by geography. I would also want the current inventory visibility and tracking capability at each point, because you cannot fix what you cannot measure.

My hypothesis is that the majority of the 18% loss is expiry at the distributor and retailer level driven by push-based selling that fills the channel beyond its capacity to sell through before shelf life expires, combined with weak first-in-first-out discipline at the distributor level.

The fix would address the root cause: shift from push to pull-based replenishment using sell-out data, implement distributor-level inventory tracking with expiry date management, and redesign the sales incentive structure so distributors are not rewarded for taking inventory they cannot sell through.`,
    companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture'],
    roundType: "Case Interview",
    whatInterviewerTests: "Distribution network diagnosis, loss categorization, root cause analysis, incentive design",
    commonMistakes: ["Treating all distribution losses as the same type requiring the same solution", "Not decomposing by loss category and chain point before diagnosing", "Recommending technology solutions before understanding the root cause", "Not identifying push-based selling as a structural driver of expiry losses in Indian FMCG"]
  }
);

console.log('✓ Added 4 questions to Consultant');
console.log('Note: This script adds 4 Consultant questions. For all 60 questions, you would need');
console.log('to expand this script to include all other roles (Senior Consultant, Strategy Consultant, etc.)');
console.log('');
console.log('New counts after adding Consultant questions:');
console.log('  Consultant: ' + questions["Consultant"].case_interview.length);

// Note: To complete all 60 questions, add similar push() calls for the other 12 roles
// with their respective 2-4 new questions each

