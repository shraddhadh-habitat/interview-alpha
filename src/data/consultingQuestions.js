export const consultingQuestions = [
  {
    q: "A leading quick service restaurant chain in India has seen profits drop 30% over two years despite flat revenue. The CEO has hired you. How do you approach this?",
    subcategory: "Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "This is a profitability problem with flat revenue, which tells me the issue is on the cost side. But before jumping there, I would look at two dimensions. First, is revenue truly flat or is there a mix shift underneath? Revenue could be flat because high-margin dine-in is declining and low-margin delivery is growing. Second, on costs, I would split into fixed and variable. Fixed includes rent, salaries, and central overhead. Variable includes raw materials, packaging, and delivery commissions. My hypothesis is a combination of two things. One, aggregator commissions from Swiggy and Zomato have grown as delivery volume increased. Two, raw material inflation has not been passed on through pricing. Before going further I would want cost breakdown year on year, channel mix shift between dine-in takeaway and delivery, and unit economics at the store level. If aggregator dependency, push a direct ordering channel with a loyalty program. If raw material costs, look at supplier renegotiation and selective menu repricing on low-elasticity items.",
    companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture', 'IBM Consulting', 'Capgemini Invent', 'Cognizant Consulting', 'Infosys Consulting'],
    roundType: "Case Interview",
    whatInterviewerTests: "Problem structuring, hypothesis-driven thinking, business judgment, prioritization",
    commonMistakes: ["Jumping to solutions without structuring first", "Treating revenue as truly flat without checking mix shifts", "Not separating fixed and variable costs", "Forgetting to ask for data before recommending"]
  },
  {
    q: "You are three weeks into a cost transformation project at a large Indian manufacturing company. The CFO loved the initial findings but the plant heads are resisting your recommendations. The engagement partner asks you to handle the next client meeting. How do you approach it?",
    subcategory: "Senior Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "This is as much a change management problem as an analytical one. The resistance from plant heads tells me they either do not trust the data, feel threatened by the recommendations, or were not involved enough in the process. Before the meeting I would do three things. Have individual conversations with two or three plant heads to understand their specific objections. Check if our recommendations account for operational realities we may have missed. And reframe our output from findings to options, giving plant heads agency in choosing how to respond. In the meeting I would lead with acknowledgment. Say something like you are closer to these operations than anyone and we want to pressure test our thinking with you. That changes the dynamic from presenting at them to problem solving together. I would walk through the data transparently, show the burning platform, and present two or three options with tradeoffs rather than one recommendation. The goal of this meeting is not to win the argument. It is to get plant heads to co-own at least one recommendation so implementation has a chance.",
    companies: ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture', 'IBM Consulting', 'Capgemini Invent', 'Publicis Sapient'],
    roundType: "Case Interview with Leadership Component",
    whatInterviewerTests: "Stakeholder management, change management thinking, client handling, implementation mindset",
    commonMistakes: ["Treating this as purely a presentation challenge", "Going in with the same deck hoping for a different reaction", "Escalating to the partner without attempting direct engagement first", "Not acknowledging the plant heads domain expertise"]
  },
  {
    q: "Estimate the market size for electric vehicle charging infrastructure in India over the next five years. Your client is considering entering this space.",
    subcategory: "Management Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "I would size this from the demand side using an adoption curve approach rather than top-down reports since the market is nascent. India has roughly 300 million registered vehicles today with two-wheelers dominant at around 75 percent. In five years with current policy tailwinds and falling battery costs I would estimate EV penetration at 15 to 20 percent of new vehicle sales translating to roughly 20 to 25 million EVs on the road by 2028. Not every EV needs a public charger. Home charging handles most four-wheelers. But two-wheelers in dense urban areas and commercial fleets need public infrastructure. I would estimate one public charging point per 15 to 20 EVs for the addressable segment. That gives roughly 1 to 1.5 million public charging points needed. At an average installation cost of 50,000 to 2 lakh rupees per point the total capital market is somewhere between 5,000 crore and 30,000 crore over five years. Before recommending entry I would want to understand competitive intensity, the regulatory environment on pricing, and whether our client advantage is in hardware software or network operations.",
    companies: ['Accenture', 'Deloitte', 'EY', 'KPMG', 'PwC', 'IBM Consulting', 'Capgemini Invent'],
    roundType: "Case Interview",
    whatInterviewerTests: "Market sizing, bottom-up estimation, structured quantitative thinking, connecting analysis to strategic recommendation",
    commonMistakes: ["Starting from top-down numbers without building from first principles", "Ignoring the split between two-wheeler three-wheeler and four-wheeler charging needs", "Forgetting that home charging reduces public infrastructure need", "Not connecting market size to a strategic recommendation"]
  },
  {
    q: "A large Indian conglomerate with businesses in cement, real estate, and retail wants to enter financial services. Should they? If yes, how?",
    subcategory: "Strategy Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "I would structure this across three lenses. Market opportunity, right to win, and entry approach. On market opportunity, financial services in India is large and underpenetrated particularly in lending insurance and wealth management for the mass affluent segment. On right to win I would ask what the conglomerate brings that a standalone financial services player does not. Three potential advantages stand out. Customer base with millions of retail customers giving distribution and trust advantage. Data from retail and real estate transactions giving credit underwriting insight. And brand trust which matters in financial services. However financial services is operationally different from cement or retail and regulatory compliance is demanding. On entry approach I would recommend not building from scratch. The fastest path is a strategic acquisition of or partnership with an existing NBFC or insurance distribution company combined with a captive lending product tied to their existing customer base. The short answer is yes they should enter but with a focused beachhead in lending to their existing customers rather than a broad play across all of financial services.",
    companies: ['Strategy&', 'EY-Parthenon', 'Kearney', 'Oliver Wyman', 'Roland Berger', 'L.E.K. Consulting', 'Arthur D. Little'],
    roundType: "Strategy Case Interview",
    whatInterviewerTests: "Strategic clarity, right to win thinking, entry strategy, CEO-level judgment",
    commonMistakes: ["Treating this as a simple yes or no without exploring right to win", "Ignoring regulatory requirements and their complexity", "Recommending a full-stack build when acquisition is more pragmatic", "Not connecting existing assets to the financial services opportunity"]
  },
  {
    q: "A mid-size Indian bank is struggling with a 45-day turnaround time for SME loan approvals. Competitors are doing it in 10 days. How do you help them fix this?",
    subcategory: "Business Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "A 45-day turnaround versus a 10-day benchmark tells me this is a process and technology problem not just a capacity problem. I would start by mapping the end-to-end loan approval process and identify where time is being spent. Typically the bottlenecks are in three places. Document collection and verification which is manual and iterative. Credit underwriting which involves multiple levels of approval. And legal and technical appraisal which is outsourced and unmanaged. Before recommending anything I would want the process map with timestamps, rejection rate at each stage, and volume split between straightforward and complex cases. My hypothesis is that a large proportion of the 45 days is wasted in back-and-forth for documents and in sequential rather than parallel processing. The recommendations are three. First digitize document collection using account aggregator frameworks and GST data. Second introduce risk-based tiering where small clean applications go through a fast-track automated credit model. Third run legal and technical appraisals in parallel with credit underwriting. These changes together could bring turnaround to 12 to 15 days without adding headcount.",
    companies: ['IBM Consulting', 'Accenture', 'Deloitte', 'Cognizant Consulting', 'Infosys Consulting', 'Genpact', 'Capgemini Invent'],
    roundType: "Case Interview with Implementation Focus",
    whatInterviewerTests: "Process thinking, root cause analysis, practical problem solving, implementation realism",
    commonMistakes: ["Jumping to technology solutions without understanding where time is lost", "Ignoring the change management side of process redesign", "Not separating simple cases from complex ones", "Recommending a full system overhaul when targeted fixes deliver faster results"]
  },
  {
    q: "A large Indian public sector bank with 80,000 employees wants to become digital-first in three years. The new CEO has asked you to design the transformation roadmap. Where do you start?",
    subcategory: "Transformation Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "Three years to transform an 80,000-person public sector bank is ambitious. The biggest risk is not technology. It is change at scale inside an organization with strong legacy culture, union considerations, and regulatory constraints. I would structure the roadmap across three horizons. In the first six months the focus is on creating urgency and building the foundation. A baseline diagnostic of digital capability and customer experience gaps. And critically identifying 20 to 30 internal champions across business and IT who will drive change from within. External consultants cannot transform a public sector bank. Internal ownership is non-negotiable. In months 6 to 18 the focus shifts to proof points. Rather than transforming everything at once identify two or three customer journeys like home loan applications or account opening and redesign them end to end with a small agile team. Visible wins build political capital for harder changes. In months 18 to 36 scale what works, decommission legacy systems, and embed new ways of working. This is also where workforce reskilling becomes critical. With 80,000 employees the bank cannot hire its way to digital. The single most important success factor is governance. Every transformation I have seen fail in large public sector organizations failed because there was no empowered decision-making body that could cut through bureaucracy fast enough.",
    companies: ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture', 'Capgemini Invent', 'IBM Consulting'],
    roundType: "Case Interview with Organizational Change Component",
    whatInterviewerTests: "Change management at scale, phased transformation thinking, stakeholder complexity, realistic implementation planning",
    commonMistakes: ["Treating this as primarily a technology implementation", "Proposing a big bang transformation instead of a phased approach with early wins", "Underestimating union dynamics and regulatory approval timelines", "Not addressing talent reskilling at scale"]
  },
  {
    q: "A large cement manufacturer in India is running its plants at 68% utilization while the industry average is 82%. The COO wants to understand why and what to do. How do you approach this?",
    subcategory: "Operations Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "A 14-percentage-point gap versus industry is significant and could have multiple root causes. I would not assume it is purely a demand problem or purely an operations problem without data. I would structure my diagnosis across three areas. Demand side, supply side, and plant-level operations. On demand I would ask whether the 68% reflects a regional demand shortfall or a commercial problem like pricing or distribution gaps. On supply I would check for raw material constraints, power availability issues, or logistics bottlenecks forcing downtime. On plant operations I would look at planned versus unplanned downtime. In cement, unplanned maintenance shutdowns and kiln reliability are common culprits. I would also check if the product mix is creating inefficiencies like frequent grade changes requiring line reconfiguration. Before going further I would want plant-wise utilization breakdown, maintenance downtime logs for the last 12 months, and order fulfillment rates by region. My hypothesis is that the gap is a combination of geographic demand concentration that does not match plant locations and higher-than-industry unplanned downtime from deferred maintenance. Recommendations would likely include a predictive maintenance program, a distribution network review, and potentially capacity rationalization if certain plants are structurally uneconomic.",
    companies: ['Kearney', 'Deloitte', 'Accenture', 'PwC', 'EY', 'Bain & Company', 'Boston Consulting Group'],
    roundType: "Operations Case Interview",
    whatInterviewerTests: "Operations diagnosis, cost and capacity analysis, root cause thinking, quantitative reasoning",
    commonMistakes: ["Assuming low utilization is always a demand problem", "Not separating planned from unplanned downtime", "Ignoring plant-level granularity and treating all plants as having the same problem", "Recommending capacity additions when the issue is utilization of existing capacity"]
  },
  {
    q: "A large Indian retail chain with 500 stores wants to implement AI-driven demand forecasting to reduce inventory waste. The CTO is excited. The operations team is skeptical. How do you approach this engagement?",
    subcategory: "Technology Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "This is a case where the technology solution is relatively straightforward but the organizational challenge is the real problem. The CTO excitement and operations skepticism tell me adoption risk is higher than technical risk. I would structure my approach in three phases. First before any technology decision I would spend two weeks with the operations team to understand why they are skeptical. Is it distrust of data quality, fear of job impact, or past experience with failed IT projects? In my experience skepticism at this stage usually means the operations team has legitimate concerns that have not been heard. Second I would do a rapid diagnostic of the data foundation. AI-driven forecasting is only as good as the data feeding it. I would assess quality of historical sales data, integration between POS systems and inventory management, and consistency across all 500 stores. In Indian retail data quality is almost always a bigger problem than the algorithm. Third I would recommend a pilot approach. Pick 20 to 30 stores across different formats and geographies, run the AI model in parallel with the existing process for 90 days, and measure accuracy improvement and inventory reduction. The governance recommendation I would make is to create a joint business-technology steering committee so operations leaders feel ownership of the outcome.",
    companies: ['Accenture', 'Deloitte', 'IBM Consulting', 'Capgemini', 'Infosys Consulting', 'TCS Consulting', 'Wipro Consulting', 'Cognizant Consulting'],
    roundType: "Technology-Business Case Interview",
    whatInterviewerTests: "Technology-business bridge, adoption risk thinking, data foundation assessment, phased implementation judgment",
    commonMistakes: ["Treating this as purely a technology implementation project", "Skipping the data quality assessment and assuming clean data exists", "Proposing a full 500-store rollout without a pilot", "Not addressing organizational resistance explicitly in the plan"]
  },
  {
    q: "A family-owned Indian conglomerate is considering selling a minority stake to a global private equity firm. The promoter family is nervous. As their advisor, what would you tell them?",
    subcategory: "Advisory Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "This is a situation where my job is to give the family honest advice not tell them what they want to hear. I would structure my advisory around three questions. What does the PE firm bring beyond capital? What are the real governance and control implications? And is this the right time given the valuation environment? On what PE brings I would push the family to be specific. If they need growth capital for expansion that is a legitimate reason. If they want operational expertise or global access that the firm genuinely provides that is also valid. But if the primary motivation is to monetize and the family is not aligned on using the capital productively the deal is likely to create friction rather than value. On governance I would be direct. A minority PE investor will require board representation, information rights, and likely veto powers on certain decisions. That is a meaningful change for a family that has run this business independently. I would walk them through exactly what they are giving up in terms of decision-making speed and confidentiality. On timing I would look at current valuation relative to historical multiples and the PE firm fund lifecycle. My honest advice is that this decision is as much about readiness for a different kind of partnership as it is about financial terms. I would recommend they spend two to three months getting clear on what they actually want before negotiating term sheets.",
    companies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Protiviti', 'Alvarez & Marsal'],
    roundType: "Advisory Case and Fit Interview",
    whatInterviewerTests: "Client advisory judgment, intellectual honesty, ability to give clear directional advice, understanding of PE dynamics",
    commonMistakes: ["Treating this as a pure transaction question without addressing family dynamics", "Not explaining governance implications clearly", "Giving a generic pros and cons list instead of a clear directional recommendation", "Ignoring the exit scenario for the PE firm and its implications for the family"]
  },
  {
    q: "A large Indian private bank has just acquired a mid-size NBFC. The RBI has asked the bank to submit a risk integration report within 90 days. You are leading the risk workstream. How do you approach this?",
    subcategory: "Risk Consultant",
    difficulty: "Hard",
    domain: "consulting",
    a: "A 90-day regulatory deadline with an acquisition integration in progress is high-stakes and time-constrained. I would not try to boil the ocean. I would prioritize ruthlessly. In the first two weeks I would focus entirely on understanding what the RBI specifically expects in this report. I would review the acquisition approval conditions, any prior RBI observations on either entity, and the regulatory framework for NBFC-bank mergers. The three risk areas I would focus on are credit risk given that NBFC loan books often have different underwriting standards. Liquidity risk since NBFCs fund themselves very differently and the combined entity ALM profile will have changed materially. And operational risk particularly around integration of systems processes and people. For each area I would quickly assess the NBFC existing risk governance framework, identify gaps relative to bank-grade standards, and propose a time-bound remediation plan. The RBI will want to see not just what the risks are but what we are doing about them and by when. The critical success factor is access. We need the NBFC loan book data, treasury data, and internal audit reports within the first two weeks or we cannot meet the 90-day deadline. I would escalate immediately if that access is not forthcoming.",
    companies: ['EY', 'KPMG', 'Deloitte', 'PwC', 'Protiviti', 'Grant Thornton'],
    roundType: "Risk and Controls Case Interview",
    whatInterviewerTests: "Risk identification, regulatory awareness, controls thinking, structured risk assessment under time pressure",
    commonMistakes: ["Starting with a broad risk framework rather than what the RBI specifically requires", "Underestimating credit quality differences between NBFC and bank loan books", "Not flagging data access as a critical dependency upfront", "Treating this as a documentation exercise rather than a genuine risk assessment with remediation commitments"]
  }
];
