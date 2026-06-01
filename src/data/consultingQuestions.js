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
  }
];
