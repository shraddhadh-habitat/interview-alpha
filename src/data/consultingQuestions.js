export const consultingQuestions = {
  "Consultant": {
    case_interview: [
      {
        q: "A leading quick service restaurant chain in India has seen profits drop 30% over two years despite flat revenue. The CEO has hired you. How do you approach this?",
        subcategory: "Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `I would frame this as a profitability problem and structure it across two dimensions before jumping to solutions.

First, I want to pressure test whether revenue is truly flat or whether there is a mix shift underneath. Revenue could appear flat while the channel mix is shifting from high-margin dine-in toward low-margin delivery aggregators. That would compress margins without showing up as a revenue decline.

Second, on the cost side, I would split into fixed and variable. Fixed costs include rent, salaries, and central overhead. Variable costs include raw materials, packaging, fuel, and aggregator commissions. My hypothesis going in is that the margin compression is driven by two things simultaneously. One, delivery volumes have grown and aggregator commissions from Swiggy and Zomato, which typically run at 25 to 30 percent of order value, are eating into margins. Two, raw material inflation over the past two years has not been passed on to customers through pricing because of competitive pressure.

Before I go further I would want three things from the client. The cost breakdown by line item year on year to see which line moved. The channel mix trend between dine-in, takeaway, and delivery. And unit economics at the store level to check whether this is a system-wide problem or concentrated in specific geographies or formats.

Once I have that data my recommendations would diverge based on what I find. If the issue is aggregator dependency, I would prioritize building a direct ordering channel with a loyalty program to shift volume away from aggregators. If it is raw material cost, I would look at supplier renegotiation, menu engineering to push higher-margin items, and selective price increases on low-elasticity products.

The key diagnostic question I would leave the CEO with is: are we losing margin because of how we sell, or because of what it costs us to deliver?`,
        companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture', 'IBM Consulting', 'Capgemini Invent', 'Cognizant Consulting', 'Infosys Consulting'],
        roundType: "Case Interview",
        whatInterviewerTests: "Problem structuring, hypothesis-driven thinking, business judgment, prioritization",
        commonMistakes: ["Jumping to solutions without structuring first", "Treating revenue as truly flat without checking mix shifts", "Not separating fixed and variable costs", "Forgetting to ask for data before recommending"]
      },
      {
        q: "A leading private hospital chain in India with 15 hospitals across tier 1 and tier 2 cities has seen its EBITDA margins fall from 18% to 11% over three years despite a 20% increase in revenue. The CEO has hired you. How do you approach this?",
        subcategory: "Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `I would frame this as a margin compression problem and structure it across two MECE dimensions before jumping to solutions.

First, I want to pressure test whether the revenue growth is masking a quality problem. Are the new revenues coming from lower-margin services, new hospitals that are still in ramp-up, or a patient mix shift toward lower-paying segments? Revenue growth with margin compression almost always has a mix story underneath it.

Second, on the cost side, I would split into fixed and variable and identify which cost lines are growing disproportionately relative to revenue. Staff costs, consumables, and depreciation on new hospital capex are the usual suspects.

My leading hypothesis is that the margin compression is driven by new hospital ramp-up costs being absorbed into the P&L before those facilities reach break-even occupancy, combined with a structural increase in staff costs as the company hired ahead of demand to support the expansion.

Before going further I would want four things. A hospital-wise P&L to separate mature hospitals from new ones. A cost breakdown by line item showing growth rates versus revenue growth. Occupancy rates by hospital and by specialty. And the revenue mix split between insurance, government, and out-of-pocket patients, because these have very different margin profiles.

My hypothesis is that if I strip out new hospitals still in ramp-up, the mature hospital portfolio is likely still generating margins close to the original 18%. The EBITDA dilution is coming from the expansion strategy itself, not from deterioration in the core business.

The strategic question I would put to the CEO is: are we investing in future margin or destroying current margin permanently? The answer shapes whether the recommendation is to slow expansion, accelerate break-even at new hospitals, or change the revenue mix in the existing portfolio.`,
        companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture', 'IBM Consulting', 'Capgemini Invent'],
        roundType: "Case Interview",
        whatInterviewerTests: "Profitability diagnosis, MECE structuring, hypothesis-driven thinking, mix shift analysis",
        commonMistakes: ["Treating the margin decline as purely a cost problem without examining revenue mix", "Not separating mature hospitals from new ramp-up hospitals", "Missing patient mix shift as a margin driver", "Jumping to headcount reduction without understanding the expansion investment thesis"]
      },
      {
        q: "A leading Indian telecom company has seen its average revenue per user drop 40% over three years despite subscriber numbers growing 25%. The CEO wants to understand the economics and what to do about it.",
        subcategory: "Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `This is a classic volume-versus-value tension that the Indian telecom sector has experienced acutely since the Jio disruption. Revenue per user falling 40% while subscribers grow 25% tells me the company is acquiring more customers but at dramatically lower monetization per customer. The aggregate revenue picture depends on the relative magnitude of these two forces, but the margin picture is almost certainly deteriorating because network and spectrum costs scale with subscribers while revenue per user has collapsed.

I would structure the diagnosis across three dimensions.

The first dimension is the revenue per user decomposition. ARPU is a blended number that hides important mix effects. I would decompose it into prepaid versus postpaid, voice versus data, and urban versus rural. My hypothesis is that subscriber growth is concentrated in prepaid, rural, and data-only segments where ARPU is structurally lower, while the high-ARPU postpaid urban base has been partially lost to competition. If this hypothesis is correct, the ARPU decline is partly a mix problem rather than pure pricing pressure, and the response is different.

The second dimension is the competitive and pricing environment. Has the ARPU decline been driven by the company's own pricing decisions, by competitive price matching following Jio's entry, or by a regulatory intervention? Understanding this determines whether ARPU recovery is within the company's control or constrained by competitive and regulatory dynamics.

The third dimension is the cost structure. A 40% ARPU decline is devastating to margins if costs have not adjusted proportionally. I would look at the cost per subscriber trend, the network utilization rate, and the debt service burden from spectrum and infrastructure investment to understand the financial sustainability of the current position.

Before recommending anything I would want the ARPU decomposition by segment, the market share trend by customer segment, the contribution margin per subscriber by segment, and the debt maturity profile.

My likely recommendations would have two parts. A revenue recovery strategy focused on accelerating postpaid migration for high-usage prepaid subscribers through bundled offerings, device financing, and loyalty programs. And a cost optimization strategy focused on network sharing arrangements with competitors, tower monetization, and opex reduction to bring the cost structure in line with the new ARPU reality.

The strategic question I would leave with the CEO is whether this is a business that can be independently viable at current ARPU levels, or whether consolidation is the only path to a sustainable return on the spectrum and infrastructure investment.`,
        companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture', 'IBM Consulting', 'Capgemini Invent'],
        roundType: "Case Interview",
        whatInterviewerTests: "Revenue decomposition, mix shift analysis, competitive dynamics, strategic options under margin pressure",
        commonMistakes: ["Treating ARPU as a single number without decomposing by segment", "Focusing only on revenue recovery without addressing the cost structure", "Not recognizing that consolidation may be the only viable strategic option", "Ignoring the debt burden from prior spectrum investment in the financial analysis"]
      },
      {
        q: "A large Indian two-wheeler manufacturer has dominated the commuter segment for 20 years but has missed the electric vehicle transition. Competitors have launched EVs and are gaining share among younger urban buyers. The CEO asks you for a turnaround strategy.",
        subcategory: "Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Missing a technology transition is one of the most dangerous strategic positions a company can be in, and the response needs to be both urgent and carefully sequenced. The risk of moving too slowly is obvious. The less obvious risk is moving too fast and destroying the profitable ICE business that funds the EV transition before the EV business can stand on its own.

I would structure the turnaround strategy across three parallel tracks.

The first track is defending and milking the existing ICE commuter business. The commuter segment that this company has dominated for 20 years is not going away immediately. Rural and semi-urban buyers in India have slower EV adoption curves due to charging infrastructure gaps and total cost of ownership concerns. I would protect this base through aggressive pricing, distribution expansion in tier 3 and tier 4 markets where EV penetration is lowest, and product refreshes that extend the ICE portfolio's life. The cash flows from this business fund the EV investment.

The second track is an accelerated EV entry strategy. The company is behind but not out. The question is whether to build, buy, or partner. Building from scratch is the slowest option. Acquiring a funded EV startup that has already solved battery management, motor control, and software integration would compress the timeline by two to three years. A joint venture with an established battery manufacturer would address the single largest cost and technology risk in EV manufacturing. I would recommend a combination: acquire a domestic EV startup for speed and talent, and partner with a Korean or Japanese battery manufacturer for supply security.

The third track is the brand repositioning for younger urban buyers. The company's brand is associated with reliability and value for money, which are the right attributes for the commuter segment but not compelling for the aspirational urban EV buyer. The brand needs a sub-brand or a new brand entirely for the EV lineup, with a distinct visual identity, a digital-first go-to-market model, and a direct sales channel to complement the existing dealer network.

The sequencing is critical. Month one to six should focus on finalizing the acquisition or partnership and committing to a specific EV launch timeline. Month six to eighteen should focus on product development and building the charging ecosystem partnership. Month eighteen to thirty-six should be the EV launch with the new brand, targeted at the top 20 cities where EV adoption is already happening.

The financial model I would show the CEO needs to be explicit about the cross-subsidy: the ICE business will fund the EV investment for three to five years before the EV business reaches contribution margin break-even. The board needs to understand and commit to this before the strategy is launched.`,
        companies: ['McKinsey & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture', 'IBM Consulting'],
        roundType: "Case Interview",
        whatInterviewerTests: "Technology transition strategy, build-buy-partner analysis, portfolio management, brand strategy",
        commonMistakes: ["Abandoning the ICE business too quickly and losing the cash flows that fund EV investment", "Recommending a full EV pivot without addressing the charging infrastructure constraint in rural markets", "Not distinguishing between the commuter and aspirational urban buyer segments", "Underestimating the timeline and investment required for EV product development and certification"]
      }
    ]
  },
  "Senior Consultant": {
    case_interview: [
      {
        q: "You are three weeks into a cost transformation project at a large Indian manufacturing company. The CFO loved the initial findings but the plant heads are resisting your recommendations. The engagement partner asks you to handle the next client meeting. How do you approach it?",
        subcategory: "Senior Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `This is primarily a change management and trust problem, not an analytical one. The resistance from plant heads tells me one of three things is happening. They do not trust the data. They feel the recommendations threaten their authority or headcount. Or they were not involved enough in the process and feel the findings were done to them rather than with them.

My approach to the meeting would have three parts.

Before the meeting I would have individual conversations with at least two plant heads to understand their specific objections. Resistance is rarely uniform. One plant head may have a data quality concern. Another may be worried about job losses. Understanding this before the room helps me address the real concern rather than the stated one. I would also do a self-critical check on whether our recommendations missed any operational realities that the plant heads can see and we cannot.

In the meeting I would open by acknowledging their expertise explicitly. I would say something like: you have run these plants for years and know things about these operations that we cannot learn in three weeks. We want to pressure test our findings with you before we finalize anything. That one sentence changes the dynamic from us presenting conclusions to us seeking input.

I would then present two or three options with explicit tradeoffs rather than a single recommendation. People resist when they feel a decision is being made for them. They engage when they feel they have a choice and some agency in the outcome.

The goal of this meeting is not to win the argument. It is to leave with at least one plant head who co-owns a recommendation. Because when implementation begins, the only thing that matters is whether the people responsible for execution believe in the plan.`,
        companies: ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture', 'IBM Consulting', 'Capgemini Invent', 'Publicis Sapient'],
        roundType: "Case Interview with Leadership Component",
        whatInterviewerTests: "Stakeholder management, change management thinking, client handling, implementation mindset",
        commonMistakes: ["Treating this as purely a presentation challenge", "Going in with the same deck hoping for a different reaction", "Escalating to the partner without attempting direct engagement first", "Not acknowledging the plant heads domain expertise"]
      },
      {
        q: "You are leading a cost reduction engagement at a large Indian FMCG company. The analysis shows that closing 3 underperforming regional offices and centralizing operations will save 40 crore rupees annually. The regional heads have gone directly to the CEO to block the recommendation. How do you handle this?",
        subcategory: "Senior Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `This situation has two parallel problems that need to be managed simultaneously. The substantive problem of whether the recommendation is right, and the political problem of senior stakeholders bypassing the normal engagement process to kill a finding they do not like.

I would start by separating these two problems cleanly in my own mind before deciding how to respond, because conflating them leads to bad decisions in both dimensions.

On the substantive question, I would first do a genuine self-critical review of the recommendation. Regional heads often have legitimate knowledge about customer relationships, regulatory requirements, and operational dependencies that a consulting team working primarily with central data may have missed. Before defending the recommendation I would ask: is there anything in their objection that reflects a real operational risk we have not adequately modeled? If yes, the recommendation needs to be revised. Intellectual honesty here is not weakness. It is what separates a good consultant from one who defends findings regardless of new information.

On the political problem, the regional heads going directly to the CEO is a signal that the engagement process broke down somewhere. Either we did not involve them early enough in the analysis, we did not create a safe enough space for them to raise concerns through normal channels, or the change is genuinely threatening enough that they felt escalation was their only option. Understanding which of these is true shapes the response.

My approach would be to request a joint session with the CEO, the regional heads, and our team where we present the full analysis transparently including our assumptions, the sensitivity of the savings estimate, and the risks we modeled. I would explicitly invite the regional heads to present their concerns with data. This does three things. It demonstrates confidence in the analysis. It respects the regional heads by giving them a formal platform rather than dismissing their concerns. And it puts the decision back where it belongs, with the CEO, with full information.

The worst outcome would be to dig in defensively or to quietly water down the recommendation without surfacing the trade-offs explicitly. The CEO needs to make this decision with clear information about what the savings are, what the risks are, and what has been raised in objection.`,
        companies: ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture', 'IBM Consulting', 'Capgemini Invent', 'Publicis Sapient'],
        roundType: "Case Interview with Leadership Component",
        whatInterviewerTests: "Political navigation, intellectual honesty, stakeholder management, decision-making under pressure",
        commonMistakes: ["Defending the recommendation without genuinely considering the regional heads objections", "Treating this purely as a political problem and ignoring the substantive concerns", "Escalating aggressively rather than creating a collaborative resolution process", "Watering down the recommendation without transparent trade-off discussion"]
      }
    ]
  },
  "Management Consultant": {
    case_interview: [
      {
        q: "Estimate the market size for electric vehicle charging infrastructure in India over the next five years. Your client is considering entering this space.",
        subcategory: "Management Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `I would approach this as a demand-side estimation rather than using top-down industry reports, because this is a nascent market and published numbers vary wildly.

Let me build from the EV base up.

India has approximately 300 million registered vehicles today. Two-wheelers dominate at roughly 75 percent of the fleet. In five years, with current FAME subsidies, state EV policies, and falling battery costs, I would estimate EV penetration at 15 to 20 percent of new vehicle sales. That translates to roughly 20 to 25 million EVs on the road by 2028 across two-wheelers, three-wheelers, and four-wheelers.

Now I need to think about which of these actually need public charging infrastructure. Four-wheeler owners in metros largely charge at home or at office. Two-wheelers in dense urban areas and commercial fleet vehicles, which run multiple shifts, are the primary drivers of public charging demand. I would estimate that roughly 30 to 40 percent of the EV base needs regular access to public charging, giving me 7 to 10 million vehicles requiring public infrastructure.

On a ratio of one charging point per 15 to 20 vehicles in the addressable segment, I get approximately 500,000 to 700,000 public charging points needed by 2028.

At an average installation cost of 50,000 rupees for a slow charger to 5 lakh rupees for a fast DC charger, with a weighted average of roughly 1.5 lakh rupees, the total capital deployment opportunity is approximately 7,500 crore to 10,000 crore over five years.

The revenue opportunity on top of this is through electricity margins, subscription fees, and ancillary services.

Before recommending entry, I would want to understand three things. Whether our client's advantage is in hardware, software, or network operations, since these require very different capabilities. The competitive intensity from existing players like Tata Power EV, Ather, and ChargePoint. And the regulatory environment around electricity pricing at charging stations, which varies significantly by state.`,
        companies: ['Accenture', 'Deloitte', 'EY', 'KPMG', 'PwC', 'IBM Consulting', 'Capgemini Invent'],
        roundType: "Case Interview",
        whatInterviewerTests: "Market sizing, bottom-up estimation, structured quantitative thinking, connecting analysis to strategic recommendation",
        commonMistakes: ["Starting from top-down numbers without building from first principles", "Ignoring the split between two-wheeler three-wheeler and four-wheeler charging needs", "Forgetting that home charging reduces public infrastructure need", "Not connecting market size to a strategic recommendation"]
      },
      {
        q: "Estimate the number of chai tapris in India and the total annual revenue of the organized chai market.",
        subcategory: "Management Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `This is a two-part question and I would approach them separately.

For the number of chai tapris, I would build from the population up.

India has approximately 1.4 billion people. Urban population is roughly 35%, giving about 500 million urban residents. Rural population is 900 million.

In urban areas, chai consumption outside the home is a daily habit for working adults. I would estimate one chai tapri per 200 to 250 urban residents, accounting for clustering near offices, markets, and transport hubs. That gives approximately 2 to 2.5 million urban chai tapris.

In rural areas, chai consumption is more home-based but tapris exist near markets, truck stops, and village centers. I would estimate one tapri per 500 to 600 rural residents, giving approximately 1.5 to 1.8 million rural tapris.

Total estimate: approximately 3.5 to 4 million chai tapris across India. I would use 4 million as my working number.

For the organized chai market revenue, organized players like Chaayos, Chai Point, and MBA Chai Wala have roughly 5,000 to 6,000 outlets today concentrated in metro and tier 1 cities. Average revenue per outlet is approximately 15,000 to 20,000 rupees per day based on 150 to 200 transactions at an average ticket of 80 to 100 rupees. That gives approximately 2,700 crore to 4,000 crore rupees annually for the organized segment.

To put this in context, this is less than 1% of the total chai market which I would estimate at 50,000 crore to 75,000 crore rupees annually including unorganized tapris and home consumption. The organized segment has significant headroom for growth as urban consumers shift toward branded and consistent chai experiences.

The strategic insight for a client entering this space is that the opportunity is large but the competitive moat needs to be built on convenience and consistency, not just brand, because the unorganized tapri will always win on price and authenticity.`,
        companies: ['Accenture', 'Deloitte', 'EY', 'KPMG', 'PwC', 'IBM Consulting', 'Capgemini Invent'],
        roundType: "Guesstimate and Market Sizing",
        whatInterviewerTests: "Structured quantitative thinking, assumption articulation, urban versus rural segmentation, business judgment",
        commonMistakes: ["Not separating urban and rural chai consumption patterns", "Confusing the total chai market with the organized segment", "Not articulating assumptions clearly before calculating", "Missing the strategic insight that connects market sizing to a business recommendation"]
      },
      {
        q: "Estimate the total annual market size for corporate training and leadership development in India.",
        subcategory: "Management Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `I would approach this as a demand-side estimation built from the corporate employee base rather than from top-down industry numbers.

Let me start with the addressable corporate workforce.

India has approximately 500 million working people. However, the relevant market for formal corporate training and leadership development is the organized sector. I would estimate the organized sector workforce at approximately 50 to 60 million people, of which roughly 20 to 25 million are in roles and organizations where formal training budgets exist. Small and micro enterprises rarely have structured training programs. Large enterprises, mid-size companies, and the public sector are the primary buyers.

I would segment this further into three tiers with very different spending levels.

The first tier is large enterprises, defined as companies with more than 5,000 employees. India has approximately 500 to 700 such companies. Average training spend per employee in this segment is approximately 8,000 to 15,000 rupees per year based on typical HR budgets I would estimate at 1 to 2% of salary costs. With an average of 10,000 employees per large enterprise and 600 companies, this gives approximately 50 to 90 crore rupees per company, or 30,000 to 54,000 crore rupees for the large enterprise segment.

The second tier is mid-size enterprises with 500 to 5,000 employees. India has approximately 5,000 to 7,000 such companies. Average training spend per employee is lower at 3,000 to 6,000 rupees per year. With an average of 2,000 employees and 6,000 companies, this gives approximately 60 to 120 crore per company, or 3,600 to 7,200 crore rupees for this segment.

The third tier is the public sector and government enterprises. This is a significant and often underestimated buyer of training services. Central and state government training institutes, PSU leadership programs, and defense training collectively represent a market of approximately 5,000 to 8,000 crore rupees annually.

My total estimate for the corporate training and leadership development market in India is approximately 40,000 to 70,000 crore rupees annually, with large enterprises accounting for the majority of the spend.

To sense check this number: the global corporate training market is estimated at approximately 400 billion US dollars. India with roughly 3% of global GDP but a larger proportion of the global workforce should represent 2 to 4% of global training spend, or 8 to 16 billion US dollars, which is broadly consistent with my estimate of 40,000 to 70,000 crore rupees.

The strategic insight for a client entering this space is that the large enterprise segment has the largest absolute spend but the most entrenched incumbent relationships. The mid-size enterprise segment is underserved, more open to new entrants, and growing faster as Indian companies professionalize their HR functions.`,
        companies: ['Accenture', 'Deloitte', 'EY', 'KPMG', 'PwC', 'IBM Consulting', 'Capgemini Invent'],
        roundType: "Guesstimate and Market Sizing",
        whatInterviewerTests: "Segmentation approach, structured estimation, sense checking with global benchmarks, strategic insight extraction",
        commonMistakes: ["Starting with total workforce without narrowing to the organized sector where training budgets exist", "Not segmenting by company size since training spend per employee varies dramatically by tier", "Forgetting the public sector as a significant buyer", "Not providing a sense check against a global benchmark to validate the estimate"]
      },
      {
        q: "A leading Indian private hospital chain wants to expand into tier 2 and tier 3 cities. The CFO is concerned about viability. How do you assess whether this expansion makes financial and strategic sense?",
        subcategory: "Management Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Tier 2 and tier 3 hospital expansion is a question that several large Indian hospital chains have grappled with, and the track record is mixed. The strategic logic is compelling but the financial viability varies enormously by city, by specialty mix, and by the operating model chosen.

I would structure the assessment across four dimensions.

The first dimension is market demand validation. Not all tier 2 and tier 3 cities have equivalent healthcare demand or the same propensity to use private hospital services. I would assess each target city on three parameters: the disease burden and catchment population within a 50 to 100 kilometer radius, the current availability of quality private healthcare and the degree to which patients are traveling to metros for treatment, and the income distribution and insurance penetration in the catchment area, since insurance-backed patients are significantly more valuable economically than out-of-pocket patients.

The second dimension is the financial model for each city type. A 100-bed hospital in a tier 2 city has a fundamentally different economics than the same hospital in a metro. I would model the unit economics across three scenarios. The revenue model needs to account for average revenue per occupied bed day, which is typically 40 to 60% lower in tier 2 cities than metros due to lower pricing and insurance rates. The cost model needs to account for capital cost per bed, which can actually be lower than metros due to lower land and construction costs, and operating cost, which is also lower except for senior specialist doctors who command metro-equivalent salaries anywhere in India.

The third dimension is the operating model choice. There are three options with very different risk profiles. A full ownership model has the highest capital commitment and the highest potential return. An asset-light franchise or management contract model has lower capital commitment but also lower control and margin. A hub-and-spoke model where the chain operates a smaller secondary facility in the tier 2 city that refers complex cases to a nearby metro hub has the lowest capital requirement and the best alignment with the clinical reality that certain specialties cannot be staffed locally.

The fourth dimension is the specialty mix strategy. A general hospital in a tier 2 city will struggle to be financially viable. The chains that have succeeded in tier 2 and tier 3 expansion have done so with a focused specialty strategy, typically maternal and child health, orthopedics, and basic cardiac care, which have high volume, predictable demand, and do not require the depth of specialist talent that oncology or complex neurosurgery requires.

My recommendation to the CFO would be: the expansion is viable but only with a carefully selected subset of target cities, an asset-light or hub-and-spoke operating model for the first wave, and a focused specialty strategy rather than a full-service hospital model. A blanket expansion across all tier 2 and tier 3 cities with a full-service model is the path to the mixed track record that has plagued previous attempts at this strategy.`,
        companies: ['Accenture', 'Deloitte', 'EY', 'KPMG', 'PwC', 'IBM Consulting', 'Capgemini Invent'],
        roundType: "Case Interview",
        whatInterviewerTests: "Market entry evaluation, healthcare sector knowledge, financial modeling, operating model design",
        commonMistakes: ["Treating all tier 2 and tier 3 cities as equivalent without city-level demand validation", "Not modeling the revenue per bed day difference between metro and non-metro markets", "Recommending a full-service hospital model when a focused specialty model is more viable", "Ignoring the specialist talent constraint that limits which specialties can be operated profitably outside metros"]
      }
    ]
  },
  "Strategy Consultant": {
    case_interview: [
      {
        q: "A large Indian conglomerate with businesses in cement, real estate, and retail wants to enter financial services. Should they? If yes, how?",
        subcategory: "Strategy Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `I would structure this across three lenses before giving a directional answer: market attractiveness, the conglomerate's right to win, and the optimal entry approach.

On market attractiveness, financial services in India is large and structurally underpenetrated, particularly in lending, insurance, and wealth management for the mass affluent and emerging middle class. Regulatory conditions have improved with differentiated banking licenses, NBFC frameworks, and account aggregator infrastructure. So the market case is strong.

On right to win, this is the more important question. I would ask what this conglomerate has that a standalone financial services player does not. I see three potential structural advantages. First, distribution and trust: if they have millions of retail customers and real estate buyers, they have a pre-existing relationship and trust base that is expensive to build from scratch. Second, data: transaction data from retail and property purchases gives credit underwriting insight that traditional lenders lack. Third, brand: in financial services, brand trust is a genuine competitive moat, particularly in tier two and tier three markets.

However, there are real risks that I would be direct about. Financial services operations are fundamentally different from cement or retail. Regulatory compliance under RBI is demanding and unforgiving. Talent requirements are different. And conglomerates historically struggle with the cultural and governance shift required to run a regulated financial entity well.

On entry approach, my recommendation would be not to build from scratch. The fastest and lowest-risk path is a strategic acquisition of or minority stake in an existing NBFC or insurance distribution company, combined with a focused captive product tied to their existing customer base. For example, home loans to real estate buyers or working capital loans to retail vendors.

My overall answer is yes, they should enter, but with a focused beachhead strategy rather than a broad play across all of financial services. The worst outcome would be entering everywhere and building competitive advantage nowhere.`,
        companies: ['Strategy&', 'EY-Parthenon', 'Kearney', 'Oliver Wyman', 'Roland Berger', 'L.E.K. Consulting', 'Arthur D. Little'],
        roundType: "Strategy Case Interview",
        whatInterviewerTests: "Strategic clarity, right to win thinking, entry strategy, CEO-level judgment",
        commonMistakes: ["Treating this as a simple yes or no without exploring right to win", "Ignoring regulatory requirements and their complexity", "Recommending a full-stack build when acquisition is more pragmatic", "Not connecting existing assets to the financial services opportunity"]
      },
      {
        q: "A large Indian edtech company with 5 million paid subscribers grew 300% during the pandemic but has seen subscriber growth stall and churn increase over the last 18 months. The board wants a growth strategy for the next three years. What do you recommend?",
        subcategory: "Strategy Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `This is a post-pandemic normalization problem but the strategic response depends entirely on why churn is increasing and whether the core value proposition is still relevant.

I would structure the growth strategy analysis across three questions before making any recommendations.

The first question is: what is the underlying value proposition and is it still resonating? Pandemic growth was driven by forced digital adoption and fear of falling behind. That tailwind is gone. The question now is whether students and parents choose this platform because it genuinely improves outcomes, or because it was the only option available. Completion rates, exam results, and Net Promoter Score are the metrics that answer this.

The second question is: why is churn increasing? I would segment churn by cohort, by product type, and by geography. If churn is concentrated in recent cohorts it suggests an acquisition quality problem. If it is concentrated in older cohorts it suggests a product relevance problem. These require completely different interventions.

The third question is: what are the genuine growth vectors and do we have the right to win in each? I would assess three options. First, deepen penetration in the existing K-12 and competitive exam segment by improving outcomes and reducing churn before acquiring more customers. Second, expand into adjacent segments like upskilling and professional certification where willingness to pay is higher and the pandemic reversal has not hit as hard. Third, expand internationally into markets where the India edtech model is exportable.

My core recommendation is fix the leaky bucket before filling it. A company with rising churn that acquires more customers is running on a treadmill at increasing cost. The first 12 months should focus entirely on reducing churn in the existing base by improving outcomes, personalizing learning paths, and creating genuine switching costs through certifications and placement services. Only once churn is stabilized should growth investment shift to new acquisition and new segments.`,
        companies: ['Strategy&', 'EY-Parthenon', 'Kearney', 'Oliver Wyman', 'Roland Berger'],
        roundType: "Strategy Case Interview",
        whatInterviewerTests: "Competitive strategy, growth options framework, churn diagnosis, CEO-level thinking",
        commonMistakes: ["Jumping to new market recommendations without addressing churn", "Not segmenting churn to understand acquisition versus retention problems", "Treating edtech as a single category when K-12 and upskilling have very different economics", "Ignoring unit economics and customer lifetime value in the growth strategy"]
      },
      {
        q: "A leading Indian quick commerce company delivering groceries in 10 minutes has achieved 2 million daily orders but has never been profitable. Investors are pressuring for a path to profitability. How do you approach building that path?",
        subcategory: "Strategy Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Quick commerce profitability is one of the most discussed and least solved problems in Indian startup strategy right now. The fundamental tension is that the 10-minute promise requires a dense dark store network with high fixed costs, while the average order value in grocery is low and the customer's willingness to pay a delivery premium is limited.

I would structure the path to profitability analysis across four levers, each of which needs to be assessed for its realistic contribution given the competitive context.

The first lever is order economics improvement. The unit economics of quick commerce break down into delivery cost per order, dark store operating cost allocated per order, customer acquisition cost amortized per order, and gross margin on the products sold. I would model the current unit economics for the top and bottom quartile of dark stores to understand the range of what is achievable. In quick commerce, dark store density and order frequency per store are the primary drivers of unit economics. A dark store doing 500 orders per day has fundamentally different economics than one doing 150 orders per day.

The second lever is average order value increase. At the current average order value, many dark stores cannot be profitable regardless of operational efficiency. I would analyze the order value distribution and identify what percentage of orders are below the break-even threshold. Strategies to increase AOV include bundling, subscriptions that incentivize larger basket sizes, private label products with higher margins, and alcohol and fresh categories that command premium pricing.

The third lever is selective geographic rationalization. Not all cities and not all dark stores within cities are equal. I would recommend a store-by-store profitability model and a clear policy for closing or consolidating stores that cannot reach break-even within a defined timeline. Maintaining unprofitable dark stores to defend market share in geographies where the company is not the density leader is a cash destruction strategy.

The fourth lever is monetization beyond delivery fees. Advertising revenue from FMCG brands who want placement and prominence in the app is a high-margin revenue stream that scales with order volume. This is already material for Zomato and Swiggy and represents a genuinely differentiated path to profitability for quick commerce platforms.

My overall recommendation for the investor conversation would be a three-year profitability roadmap with specific milestones: unit economics break-even at the dark store level in the top 20% of stores within 12 months, contribution margin positive at the city level in the top 5 cities within 18 months, and company-level EBITDA positive within 36 months. Each milestone would have specific operational and financial metrics that investors can track.`,
        companies: ['Strategy&', 'EY-Parthenon', 'Kearney', 'Oliver Wyman', 'Roland Berger'],
        roundType: "Strategy Case Interview",
        whatInterviewerTests: "Unit economics thinking, path to profitability structuring, business model analysis, investor communication",
        commonMistakes: ["Focusing only on cost cutting without addressing the revenue and AOV side", "Not building a store-level model and treating all dark stores as having the same economics", "Recommending geographic expansion as a path to profitability when density improvement in existing markets is the real lever", "Underestimating advertising revenue as a profitability lever"]
      },
      {
        q: "A large Indian IT services company with 150,000 employees and revenues of 15,000 crore rupees is facing margin pressure as clients push for AI-driven productivity improvements that reduce the number of people needed on their contracts. The CEO needs a strategy to protect margins over the next three years.",
        subcategory: "Strategy Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `This is an existential strategic challenge for the Indian IT services industry, not just a margin management problem. The core business model of billing by the hour or by the headcount is under threat from AI tools that can do in hours what previously took weeks of human effort. A company that defends its current model too aggressively will lose clients. A company that embraces AI productivity without a new commercial model will simply earn less revenue for the same work.

I would structure the strategy across three interconnected choices that the CEO needs to make explicitly.

The first choice is the commercial model transition. The company needs to move from time-and-materials and fixed-headcount contracts toward outcome-based and value-based pricing. An AI-augmented team of 50 engineers delivering 200 engineers worth of output should not be priced at 50 engineers. It should be priced based on the business outcome it delivers. This is a fundamental renegotiation of how value is captured, and it requires a new sales motion, new contract structures, and new capabilities in business case quantification. This is the most important and most difficult change, and it will not happen without deliberate leadership commitment.

The second choice is the talent and capability mix. A company that deploys AI tools to replace junior engineers but retains the same senior-to-junior ratio is not capturing the full efficiency gain. The future talent model for IT services is fewer but higher-skilled people, augmented by AI tools, delivering more output. This means a deliberate shift in the talent pyramid: fewer entry-level roles, more AI engineers and architects, and a significant investment in reskilling the existing workforce. The people who cannot be reskilled need to be managed through attrition rather than mass layoffs, which would be reputationally damaging and operationally disruptive.

The third choice is where to play in the AI value chain. There are three positions available: being an AI implementer helping clients deploy AI tools, being an AI integrator building proprietary AI solutions on top of foundation models, or being an AI IP creator developing and licensing proprietary models and accelerators. The first position has the lowest margin and the highest competitive intensity. The third position has the highest margin but requires significant R&D investment and a fundamentally different business model. Most IT services companies will occupy the second position, but the specific AI domains and industry verticals where they build proprietary solutions will determine their competitive differentiation.

My recommendation for the three-year strategy would be: immediately begin the commercial model transition in new contracts and contract renewals, invest in building AI accelerators in the two or three industry verticals where the company has the deepest domain expertise, and manage the talent transition through a combination of reskilling investment and natural attrition rather than structural reorganization.`,
        companies: ['Strategy&', 'EY-Parthenon', 'Kearney', 'Oliver Wyman', 'Roland Berger', 'L.E.K. Consulting'],
        roundType: "Strategy Case Interview",
        whatInterviewerTests: "Business model transformation, AI strategy, commercial model design, talent strategy",
        commonMistakes: ["Treating this as a cost management problem rather than a business model transformation", "Not addressing the commercial model transition as the central strategic challenge", "Recommending mass layoffs rather than a managed talent transition", "Not distinguishing between the three positions in the AI value chain and their different margin and competitive implications"]
      }
    ]
  },
  "Business Consultant": {
    case_interview: [
      {
        q: "A mid-size Indian bank is struggling with a 45-day turnaround time for SME loan approvals. Competitors are doing it in 10 days. How do you help them fix this?",
        subcategory: "Business Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A 45-day turnaround against a 10-day benchmark is a 4x gap, which tells me this is a fundamental process design problem, not just a capacity or headcount issue. Adding people to a broken process makes it a more expensive broken process.

I would start by mapping the end-to-end loan approval journey from application submission to disbursement and identifying where time is actually spent. In my experience with Indian banks, the time loss typically concentrates in three places.

First, document collection and verification, which is manual, iterative, and involves multiple rounds of back-and-forth with the applicant. Each round can take three to five days.

Second, credit underwriting, which involves sequential approval hierarchies where each level can only act after the previous level is done. A loan may sit at the branch manager level for two days, then at the regional credit committee for five days, then at the central credit team.

Third, legal and technical appraisal, which is typically outsourced and unmanaged with no SLA enforcement.

Before recommending anything I would want three data points. The process map with actual timestamps at each stage from a sample of 20 to 30 recent cases. The rejection and rework rate at each stage, because high rework is often a bigger time sink than the process itself. And the volume split between simple and complex cases, because a one-size-fits-all process optimized for complex cases will always be slow for simple ones.

My hypothesis is that the 45 days is largely driven by document rework cycles and sequential credit approval, not by the actual time taken to evaluate creditworthiness.

The recommendations I would likely land on are three. First, integrate with account aggregator frameworks and GST data to pull financial information digitally and eliminate document collection rounds. Second, introduce risk-based tiering where loans below a certain size and risk threshold go through an automated credit scorecard with same-day approval, reserving committee time for genuinely complex cases. Third, run legal and technical appraisal in parallel with credit underwriting rather than sequentially.

These three changes, implemented together, could realistically bring the turnaround to 12 to 15 days without adding headcount and without compromising credit quality.`,
        companies: ['IBM Consulting', 'Accenture', 'Deloitte', 'Cognizant Consulting', 'Infosys Consulting', 'Genpact', 'Capgemini Invent'],
        roundType: "Case Interview with Implementation Focus",
        whatInterviewerTests: "Process thinking, root cause analysis, practical problem solving, implementation realism",
        commonMistakes: ["Jumping to technology solutions without understanding where time is lost", "Ignoring the change management side of process redesign", "Not separating simple cases from complex ones", "Recommending a full system overhaul when targeted fixes deliver faster results"]
      },
      {
        q: "A large Indian retail bank has 800 branches and wants to reduce its branch network to 500 over the next two years while maintaining customer satisfaction scores. How do you help them do this?",
        subcategory: "Business Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Reducing a branch network by 37% while maintaining customer satisfaction is fundamentally a customer migration problem, not a real estate or cost problem. The cost savings are the outcome. The challenge is migrating 300 branch-dependent customer segments to alternative channels without losing them or damaging the relationship.

I would structure this across three workstreams that need to run in parallel.

The first workstream is branch segmentation and prioritization. Not all 300 branches to be closed are equal. I would segment the existing 800 branches across three dimensions: customer transaction volume and revenue contribution, geographic proximity to the nearest alternative branch, and the digital readiness of the customer base in that catchment. Branches with low transaction volume, a nearby alternative, and a digitally active customer base are the easiest and lowest-risk closures. Branches in rural areas or semi-urban markets with elderly or low-income customer bases who are branch-dependent require either longer timelines or a different alternative channel strategy.

The second workstream is customer migration. For each branch being closed I would design a specific migration plan rather than a generic communication. This means identifying the top 20% of customers by revenue contribution at each closing branch and having relationship managers personally reach out to transition them. For the remaining 80% I would use a combination of digital onboarding campaigns, nearby branch transfer incentives, and Business Correspondent network expansion in markets where digital adoption is low. The customer satisfaction risk is highest in the 60 to 90 days before and after closure. Proactive communication and service availability during this window is critical.

The third workstream is channel readiness. Migrating customers from branches to digital only works if the digital channels can actually handle the transactions those customers need. I would do a transaction type analysis for each closing branch to understand what customers are actually doing there. Cash withdrawals and deposits require ATM or BC network alternatives. Complex transactions like loan applications or grievance resolution require either digital capability or relationship manager coverage. Closing branches before the alternative channels are ready guarantees customer satisfaction damage.

The financial model I would build for the client would show not just the gross savings from branch closure but also the investment required in digital channel improvement, BC network expansion, and customer retention to model the net savings realistically. Branch rationalization programs that ignore migration investment costs consistently underdeliver on their financial targets.`,
        companies: ['IBM Consulting', 'Accenture', 'Deloitte', 'Cognizant Consulting', 'Infosys Consulting', 'Genpact', 'Capgemini Invent'],
        roundType: "Case Interview with Implementation Focus",
        whatInterviewerTests: "Customer migration thinking, change sequencing, financial modeling realism, implementation risk management",
        commonMistakes: ["Treating this as a cost reduction exercise rather than a customer migration problem", "Not segmenting branches by closure risk and complexity before building a single plan", "Ignoring channel readiness as a prerequisite to closure", "Not modeling the investment required for migration in the net savings calculation"]
      }
    ]
  },
  "Transformation Consultant": {
    case_interview: [
      {
        q: "A large Indian public sector bank with 80,000 employees wants to become digital-first in three years. The new CEO has asked you to design the transformation roadmap. Where do you start?",
        subcategory: "Transformation Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Three years to transform an 80,000-person public sector bank is ambitious. The biggest risk is not technology selection or budget. It is change at scale inside an organization with entrenched legacy culture, union considerations, and a regulatory environment that requires approval for many operational changes.

I would structure the roadmap across three horizons, each with a different objective.

In the first six months the objective is diagnosis and foundation-building, not transformation. This means a rigorous baseline assessment of current digital capability, customer experience gaps versus private sector benchmarks, and the technology estate including which core systems are genuinely end-of-life versus which are functional but poorly integrated. Critically, it also means identifying 20 to 30 internal champions across business, IT, and operations who will drive change from within. No external consulting team can transform a public sector bank. Internal ownership at the working level is non-negotiable.

In months 6 to 18 the objective is proof points, not system-wide rollout. I would identify two or three high-visibility customer journeys, for example home loan application processing or account opening for new customers, and redesign them end-to-end with a small dedicated agile team. The goal is visible, measurable wins that build political capital for the harder and more disruptive changes that come later. Every transformation I have seen fail in large public sector organizations failed because it tried to change everything simultaneously and produced nothing visible in the first 18 months.

In months 18 to 36 the objective is scaling what works, decommissioning legacy systems that the proof points have made redundant, and embedding new ways of working. This is also where workforce reskilling becomes a critical workstream. With 80,000 employees, the bank cannot hire its way to digital capability. It needs to retrain at least a third of its workforce, particularly branch staff and back-office operations teams.

The single most important structural recommendation I would make to the CEO is governance. The transformation needs a dedicated program office with direct CEO sponsorship and the authority to make decisions quickly across business, IT, HR, and compliance without going through normal committee processes. Every public sector transformation I have seen fail had the same root cause: no empowered decision-making body that could cut through bureaucracy fast enough to maintain momentum.`,
        companies: ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture', 'Capgemini Invent', 'IBM Consulting'],
        roundType: "Case Interview with Organizational Change Component",
        whatInterviewerTests: "Change management at scale, phased transformation thinking, stakeholder complexity, realistic implementation planning",
        commonMistakes: ["Treating this as primarily a technology implementation", "Proposing a big bang transformation instead of a phased approach with early wins", "Underestimating union dynamics and regulatory approval timelines", "Not addressing talent reskilling at scale"]
      },
      {
        q: "A mid-size Indian manufacturing company with 12,000 employees has decided to implement an ERP system across all its plants and functions. Previous ERP implementations at similar companies have had a 60% failure rate. The CEO asks you what the most important factors are for success. What do you tell her?",
        subcategory: "Transformation Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `ERP implementations fail at a 60% rate not because the technology does not work but because organizations underestimate the degree to which ERP is a business transformation program that happens to involve software, not a software program that happens to affect business processes.

I would tell the CEO that success comes down to five factors, and that getting any one of them wrong significantly increases the failure probability.

The first factor is CEO-level sponsorship that is active, not ceremonial. ERP implementations require hundreds of decisions where business owners must change how they work to fit the system rather than customizing the system to fit how they currently work. Every time a plant head or function head refuses to change their process and demands a system customization instead, the implementation gets more expensive, more delayed, and more fragile. The only person who can consistently resolve these conflicts in favor of the standard process is the CEO. Passive sponsorship, where the CEO endorses the project but does not personally intervene in process disputes, is one of the most reliable predictors of ERP failure.

The second factor is dedicated full-time business resources on the implementation team. Companies consistently make the mistake of asking their best people to do the ERP implementation in addition to their day jobs. This guarantees both the implementation and the day job suffer. The business team members on an ERP implementation need to be fully released from their operational responsibilities for the duration of the project. This is expensive and disruptive, which is why it is consistently avoided, and consistently why implementations fail.

The third factor is a disciplined approach to customization. Every customization adds cost, time, and fragility. I would establish a governance rule at the start: no customization unless the business case is documented, approved at the CFO level, and the process owner has confirmed that the standard functionality genuinely cannot support the business requirement. In my experience, 70% of customization requests dissolve when this standard is applied because they reflect preference rather than necessity.

The fourth factor is a realistic timeline with genuine contingency. ERP implementations consistently run over time and budget because original plans are built on optimistic assumptions about data quality, process complexity, and user readiness. I would build the timeline from a bottoms-up assessment of each module and each plant, add 20% contingency to the most complex workstreams, and establish clear go or no-go criteria before each phase go-live.

The fifth factor is change management starting on day one, not month ten. User adoption is not a training problem. It is a motivation and trust problem. Users who understand why the change is happening, were involved in designing the new processes, and trust that the system will make their work better are far more likely to adopt it fully. Change management that starts when the system is ready to go live is too late.`,
        companies: ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture', 'Capgemini Invent', 'IBM Consulting'],
        roundType: "Case Interview with Organizational Change Component",
        whatInterviewerTests: "Transformation risk factors, change management depth, executive communication, implementation realism",
        commonMistakes: ["Focusing on technical factors rather than organizational and change management factors", "Not addressing CEO sponsorship as the single most critical success factor", "Underestimating the customization problem and its downstream consequences", "Treating change management as a phase rather than a continuous workstream from day one"]
      }
    ]
  },
  "Operations Consultant": {
    case_interview: [
      {
        q: "A large cement manufacturer in India is running its plants at 68% utilization while the industry average is 82%. The COO wants to understand why and what to do. How do you approach this?",
        subcategory: "Operations Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A 14-percentage-point gap versus industry average is significant and could have fundamentally different root causes depending on whether this is a demand problem, a supply problem, or a plant operations problem. I would not assume the answer without data.

I would structure my diagnosis across three MECE buckets.

The first bucket is demand-side factors. Is the 68% utilization a reflection of insufficient demand in the markets these plants serve, or a commercial execution problem where demand exists but the company is not winning it? I would look at market share trends in each geography, pricing competitiveness, and distribution reach. If competitors in the same geography are running at 82%, the demand is there and we are not capturing it.

The second bucket is supply-side constraints. Are there input constraints like limestone availability, power reliability, or logistics bottlenecks that are physically preventing the plants from running at higher utilization? In Indian cement, coal and power availability are common culprits for unplanned downtime.

The third bucket is plant-level operations. I would look separately at planned downtime from scheduled maintenance and unplanned downtime from equipment failures or process issues. Kiln reliability is the single biggest driver of utilization in cement manufacturing. Frequent unplanned kiln shutdowns can easily account for 10 to 15 percentage points of utilization loss. I would also look at whether product mix changes, for example frequent grade changes requiring line reconfiguration, are creating hidden downtime.

Before going further I would want four things. Plant-wise utilization breakdown to understand whether this is a system-wide problem or concentrated in specific plants. Maintenance downtime logs for the last 12 months separated into planned and unplanned. Market share data by geography. And a comparison of our input costs versus competitors to rule out a pricing problem masking as a volume problem.

My hypothesis going in is that this is a combination of geographic mismatch between plant locations and demand growth areas, plus higher-than-industry unplanned downtime from deferred maintenance investment.

Recommendations would depend on the data but would likely include a predictive maintenance program to reduce unplanned shutdowns, a distribution and pricing review in underperforming geographies, and potentially a capital allocation decision on whether certain structurally uneconomic plants should be rationalized rather than fixed.`,
        companies: ['Kearney', 'Deloitte', 'Accenture', 'PwC', 'EY', 'Bain & Company', 'Boston Consulting Group'],
        roundType: "Operations Case Interview",
        whatInterviewerTests: "Operations diagnosis, cost and capacity analysis, root cause thinking, quantitative reasoning",
        commonMistakes: ["Assuming low utilization is always a demand problem", "Not separating planned from unplanned downtime", "Ignoring plant-level granularity and treating all plants as having the same problem", "Recommending capacity additions when the issue is utilization of existing capacity"]
      },
      {
        q: "A large Indian airline is facing a 34% on-time performance rate against an industry benchmark of 72%. Every delayed flight costs the airline approximately 8 lakh rupees in penalties, crew costs, and passenger compensation. The COO has asked you to diagnose the problem and build a 90-day improvement plan.",
        subcategory: "Operations Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A 34% on-time performance against a 72% benchmark is not a marginal gap. It is a fundamental operational breakdown. Before building a 90-day plan I need to understand where delays are originating because the intervention is completely different depending on the root cause.

I would structure the diagnosis across four MECE buckets.

The first bucket is ground operations. Are delays originating on the ground from late pushback, slow turnaround, catering or fueling delays, or baggage loading? In Indian aviation, ground handling is frequently the primary source of delay particularly at congested airports like Delhi and Mumbai.

The second bucket is technical and maintenance delays. What proportion of delays are attributable to aircraft technical issues? A high technical delay rate suggests either an aging fleet, deferred maintenance, or inadequate spare parts inventory at outstations.

The third bucket is crew-related delays. Are delays driven by crew availability, rest requirement violations, or rostering failures? Airlines with tight schedules and minimal buffer are highly vulnerable to crew cascading delays.

The fourth bucket is external factors. What proportion of delays are driven by ATC, weather, or airport slot constraints that are genuinely outside the airline's control? These require different responses than operational fixes.

Before building the 90-day plan I would want delay data categorized by root cause across the last six months, on-time performance by route and aircraft type, and the cascading delay pattern to understand how a morning delay creates afternoon and evening failures.

My hypothesis is that the 34% on-time rate reflects tight turnaround schedules that do not account for Indian ground handling realities combined with a maintenance reliability issue generating unplanned technical delays.

The 90-day plan would have three parallel workstreams. First, extend minimum turnaround times on the worst-performing routes by 10 to 15 minutes to create buffer. Second, implement a daily operations control center review to intervene on at-risk flights before they become delays. Third, run a targeted maintenance reliability program on the aircraft types with the highest technical delay rates.

The financial case is clear. At 8 lakh rupees per delayed flight, improving on-time performance from 34% to 60% on 100 daily flights saves approximately 200 lakh rupees per day. The 90-day investment pays back in weeks.`,
        companies: ['Kearney', 'Deloitte', 'Accenture', 'PwC', 'EY', 'Bain & Company', 'Boston Consulting Group'],
        roundType: "Operations Case Interview",
        whatInterviewerTests: "Process efficiency, root cause diagnosis, cost quantification, 90-day planning",
        commonMistakes: ["Treating all delays as the same category rather than diagnosing by root cause", "Focusing only on ground operations without examining maintenance and crew factors", "Not quantifying the financial impact to build the business case", "Proposing a generic improvement program without specific timeline and measurable targets"]
      },
      {
        q: "A large Indian e-commerce company is spending 180 crore rupees per month on last-mile delivery but its net promoter score for delivery experience is 34, well below the industry benchmark of 62. The COO wants to fix both the cost and the experience simultaneously. How do you approach this?",
        subcategory: "Operations Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A high cost and a low NPS for the same function is a counter-intuitive situation that usually indicates the spending is going to the wrong things rather than simply too little or too much overall. If the company were spending 180 crore on genuinely good delivery, the NPS would be higher. The fact that both metrics are simultaneously bad suggests a structural inefficiency rather than a trade-off.

I would structure my diagnosis across three questions before touching either cost or experience.

The first question is: what is causing the NPS of 34? I would decompose the NPS drivers by analyzing customer feedback categories. In e-commerce delivery, NPS failures typically cluster around four root causes: late deliveries against the promised time window, damaged products, failed delivery attempts requiring the customer to pick up from a facility, and poor communication when something goes wrong. Understanding which of these is dominant determines the fix. A late delivery problem has a different solution than a damaged goods problem or a communication problem.

The second question is: where is the 180 crore being spent? I would break down the cost per order across the key cost components: first-mile pickup from seller to fulfillment center, fulfillment center operations, linehaul from fulfillment center to delivery hub, last-mile delivery from hub to customer, and failed delivery and returns processing. In Indian e-commerce, failed delivery attempts and returns are typically the highest cost-per-unit activities and also the highest drivers of poor NPS, which is where the connection between cost and experience usually lies.

The third question is: what does the delivery partner network look like? Is the company using owned delivery staff, third-party logistics providers, or a hybrid? The answer determines what levers are available. Owned staff can be trained, incentivized, and managed directly. Third-party providers require contractual mechanisms and SLA enforcement.

My hypothesis is that a significant portion of the 180 crore and the NPS damage is driven by failed first delivery attempts, which force redelivery attempts and customer pickups. Fixing the address quality problem at order placement, improving delivery time window communication, and giving delivery agents better real-time tools to locate addresses would simultaneously reduce cost by reducing failed attempts and improve NPS by reducing the primary frustration source.

I would recommend a 90-day diagnostic and pilot program: 30 days to map the cost and NPS drivers at the SKU and route level, 30 days to pilot specific interventions on the highest-impact routes, and 30 days to measure results and prepare a scaled rollout plan.`,
        companies: ['Kearney', 'Deloitte', 'Accenture', 'PwC', 'EY', 'Bain & Company', 'Boston Consulting Group'],
        roundType: "Operations Case Interview",
        whatInterviewerTests: "Cost and quality simultaneous optimization, root cause diagnosis, delivery operations knowledge, NPS decomposition",
        commonMistakes: ["Treating cost and NPS as separate problems rather than looking for the common root cause", "Not decomposing NPS drivers before recommending solutions", "Focusing on linehaul cost which is harder to reduce rather than failed delivery cost which is both high cost and high NPS impact", "Recommending technology solutions before understanding the process failure points"]
      },
      {
        q: "A large Indian textile manufacturer has three plants operating at different efficiency levels: Plant A at 91% OEE, Plant B at 74% OEE, and Plant C at 58% OEE. All three make similar products. The MD wants to understand why the gap exists and how to bring B and C to A's level.",
        subcategory: "Operations Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A 33-percentage-point OEE gap between the best and worst plant making similar products is a significant operational variance that almost certainly reflects differences in management practice, maintenance investment, and workforce skill rather than fundamental differences in equipment or product complexity.

OEE is the product of three factors: availability, which measures what percentage of planned time the equipment is actually running; performance, which measures whether the equipment is running at its rated speed; and quality, which measures the proportion of output that meets specification. A 58% OEE could be driven by low availability, low performance, or low quality, and the intervention is very different depending on which factor is the primary driver.

I would structure the diagnostic in two phases.

The first phase is OEE decomposition for each plant. I would break Plant B and Plant C's OEE into their availability, performance, and quality components and compare them against Plant A. If Plant B has 90% availability but 78% performance, the problem is speed loss due to minor stoppages or running below rated speed, which is a different problem than 70% availability due to frequent breakdowns. This decomposition tells me where to look, not just how bad the gap is.

The second phase is root cause analysis within each OEE component. For availability losses I would look at the breakdown frequency and duration log, planned maintenance compliance, and changeover time between product variants. For performance losses I would look at minor stoppage frequency, operator response time to machine alerts, and whether the equipment is being run below rated speed deliberately due to quality concerns. For quality losses I would look at the defect rate by product type and by time of day, which often reveals shift-specific quality management issues.

Beyond the OEE data I would want to spend time on the plant floor at Plant C specifically to understand the management practices and culture. In my experience, the largest OEE gaps between plants making similar products are driven by three factors that do not show up in data alone: the quality and engagement of the frontline shift supervisor, the discipline of the planned maintenance program, and the speed and quality of the response when equipment stops unexpectedly. Plant A at 91% OEE almost certainly has better practices in all three areas, and the improvement plan for B and C needs to transfer those practices, not just install new equipment.

My 12-month improvement plan for Plant C would focus on three things: implementing a structured total productive maintenance program starting with the highest-downtime equipment, training and coaching frontline supervisors on rapid response to stoppages, and establishing daily OEE review meetings that create accountability and visibility for every percentage point of loss.`,
        companies: ['Kearney', 'Deloitte', 'Accenture', 'PwC', 'EY', 'Bain & Company', 'Boston Consulting Group'],
        roundType: "Operations Case Interview",
        whatInterviewerTests: "OEE framework knowledge, manufacturing operations depth, root cause analysis, improvement planning",
        commonMistakes: ["Not decomposing OEE into availability, performance, and quality before diagnosing", "Jumping to equipment investment recommendations without understanding the management practice gaps", "Treating the three plants as having the same root cause for their OEE gap", "Underestimating the role of frontline supervision quality in OEE performance"]
      }
    ]
  },
  "Technology Consultant": {
    case_interview: [
      {
        q: "A large Indian retail chain with 500 stores wants to implement AI-driven demand forecasting to reduce inventory waste. The CTO is excited. The operations team is skeptical. How do you approach this engagement?",
        subcategory: "Technology Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `The CTO excitement and operations skepticism are both important signals and I would treat them as diagnostic information before designing the engagement approach.

The operations team's skepticism usually means one of three things. They do not trust the data quality that feeds the model. They have seen failed IT projects before and are protecting themselves from another one. Or they are worried about what happens to their jobs and their existing ways of working. Understanding which of these is driving the skepticism shapes everything that follows.

I would structure my engagement approach in three phases.

In the first two weeks, before any technology decision, I would spend time with the operations team doing structured listening. Not to sell the solution but to understand their world. What are the current forecasting methods? Where do they feel the current process fails them? What would a better outcome look like from their perspective? In my experience, skepticism at this stage almost always contains legitimate concerns that have not been heard.

In parallel during this phase I would run a rapid data quality diagnostic. AI-driven demand forecasting is only as good as the data that feeds it. I would assess the completeness and consistency of historical sales data across all 500 stores, the integration between POS systems and inventory management, and whether the data is clean enough to train a reliable model. In Indian retail, data quality problems, missing transaction records, inconsistent SKU coding, and unlinked returns, are almost always a bigger problem than the choice of algorithm. If the data is not ready, no amount of AI investment will deliver results.

In the second phase I would recommend a 90-day pilot across 20 to 30 stores selected to represent different formats, geographies, and product categories. The AI model runs in parallel with the existing forecasting process during the pilot. Operations team members participate in reviewing outputs and flagging where the model gets it wrong. This does two things. It generates proof of concept data. And it builds operations team ownership of the outcome rather than resistance to an imposed solution.

In the third phase, assuming the pilot demonstrates a meaningful improvement in forecast accuracy and inventory reduction, I would design the scaled rollout with an explicit change management workstream running alongside the technical implementation.

The governance recommendation I would make is a joint steering committee co-chaired by the CTO and the head of operations. Technology projects that do not have operations co-ownership at the governance level almost always fail during rollout even when they succeed technically.`,
        companies: ['Accenture', 'Deloitte', 'IBM Consulting', 'Capgemini', 'Infosys Consulting', 'TCS Consulting', 'Wipro Consulting', 'Cognizant Consulting'],
        roundType: "Technology-Business Case Interview",
        whatInterviewerTests: "Technology-business bridge, adoption risk thinking, data foundation assessment, phased implementation judgment",
        commonMistakes: ["Treating this as purely a technology implementation project", "Skipping the data quality assessment and assuming clean data exists", "Proposing a full 500-store rollout without a pilot", "Not addressing organizational resistance explicitly in the plan"]
      },
      {
        q: "A leading Indian private bank wants to migrate its core banking system from a 25-year-old legacy platform to a modern cloud-based core. The CTO estimates the migration will take 3 years and cost 500 crore rupees. The board is nervous. How do you advise them?",
        subcategory: "Technology Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Core banking system migrations are among the highest-risk technology programs a bank can undertake. Several major global banks have had catastrophic failures during core banking migrations that resulted in days of customer service outages, regulatory intervention, and reputational damage worth far more than the migration cost. The board's nervousness is appropriate.

My advice to the board would be structured around three questions they need to answer before approving this program.

The first question is: is the migration genuinely necessary now, or is it a solution in search of a problem? A 25-year-old core banking system is old but not necessarily failing. I would want to understand what specific business capabilities the current system is preventing the bank from delivering. If the answer is specific and quantified, for example the bank cannot launch certain product types, cannot support real-time payments at scale, or is spending 200 crore rupees annually on maintenance and workarounds, the migration case is strong. If the answer is more general, for example the system feels old or is hard to change, the risk-reward calculation is much less clear.

The second question is: is the 3-year timeline and 500 crore rupees estimate credible? In my experience, core banking migration estimates are almost always optimistic. The true complexity is typically discovered during data migration when years of accumulated data inconsistencies, exception handling rules, and undocumented product variants surface. I would recommend the board commission an independent technical due diligence on the estimate before approving the full program, and build in a minimum 30% contingency on both time and budget as a board-level expectation rather than a project-level risk.

The third question is: what is the migration strategy and how does it manage customer risk? There are three broad approaches. A big bang cutover where the old system is switched off and the new system goes live simultaneously carries maximum risk. A parallel running approach where both systems run simultaneously for a period is expensive but significantly safer. A strangler fig approach where the new system gradually takes over product by product and customer segment by customer segment is the lowest risk but the longest timeline. For a bank of this size, I would strongly advise against a big bang approach regardless of the cost and time implications.

My overall advice to the board would be: approve the program but with three conditions. An independent estimate validation before full budget release. A parallel running or strangler fig migration strategy as a non-negotiable architectural requirement. And a clear set of go or no-go criteria at each phase gate that the board reviews, not just the CTO.`,
        companies: ['Accenture', 'Deloitte', 'IBM Consulting', 'Capgemini', 'Infosys Consulting', 'TCS Consulting', 'Wipro Consulting', 'Cognizant Consulting'],
        roundType: "Technology-Business Case Interview",
        whatInterviewerTests: "Technology risk assessment, board-level advisory, migration strategy, cost-benefit thinking",
        commonMistakes: ["Not questioning whether the migration is necessary before evaluating how to do it", "Accepting the 3-year and 500 crore estimate without independent validation", "Not distinguishing between migration strategies and their risk profiles", "Underestimating the data migration complexity in a 25-year-old system"]
      }
    ]
  },
  "Advisory Consultant": {
    case_interview: [
      {
        q: "A family-owned Indian conglomerate is considering selling a minority stake to a global private equity firm. The promoter family is nervous. As their advisor, what would you tell them?",
        subcategory: "Advisory Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `My job in this situation is to give the family honest advice, not comfortable advice. The nervousness itself is important diagnostic information that I would explore before giving any directional view.

I would structure my advisory around four questions that I would work through with the family before they make any decision.

The first question is: what do you actually want from this transaction? Growth capital for expansion, partial liquidity for the promoters, operational expertise, or global market access are all legitimate motivations. But I have seen families enter PE negotiations without being internally aligned on the answer. If the patriarch wants capital for expansion and the next generation wants liquidity, the deal will create family conflict regardless of the financial terms.

The second question is: what does this PE firm specifically bring beyond capital? I would push the family to be concrete. If the firm has genuine expertise in their sector and a track record of helping portfolio companies enter new markets, that is differentiated value. If the primary value is just balance sheet, there may be cheaper and less governance-intensive ways to raise capital.

The third question is: are you prepared for what a minority PE investor actually means in practice? I would be direct about this. Board representation, information rights, quarterly reporting obligations, and veto powers on certain decisions are standard. Decision-making will be slower. Confidential business information will be shared regularly. For a family that has run this business with full autonomy for decades, this is a genuine cultural shift, not just a governance formality.

The fourth question is: is this the right time? I would look at the current valuation environment in their sector relative to historical multiples, and critically, the PE firm's fund lifecycle. A fund that is three years from its end date will need an exit in five to six years. The family needs to understand what that exit scenario looks like for them and whether they are comfortable with it.

My honest advice would be that this decision is as much about readiness for a different kind of partnership as it is about the financial terms. I would recommend the family spend two to three months getting genuinely aligned on what they want before entering any formal negotiation. Negotiating a term sheet without internal alignment is the fastest way to a bad outcome.`,
        companies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Protiviti', 'Alvarez & Marsal'],
        roundType: "Advisory Case and Fit Interview",
        whatInterviewerTests: "Client advisory judgment, intellectual honesty, ability to give clear directional advice, understanding of PE dynamics",
        commonMistakes: ["Treating this as a pure transaction question without addressing family dynamics", "Not explaining governance implications clearly", "Giving a generic pros and cons list instead of a clear directional recommendation", "Ignoring the exit scenario for the PE firm and its implications for the family"]
      },
      {
        q: "A large Indian infrastructure conglomerate is facing a hostile takeover bid from a foreign private equity consortium. The promoter family owns 38% and needs your advice on how to defend the company. What do you recommend?",
        subcategory: "Advisory Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A hostile takeover defense is one of the most high-stakes advisory situations and requires immediate action on multiple fronts simultaneously. The 38% promoter holding is significant but not enough on its own to block a determined acquirer if the remaining 62% is fragmented or institutionally held.

I would structure my advice across three immediate priorities and one medium-term structural recommendation.

The first immediate priority is understanding the bid and the shareholder register. Before recommending any defense I need to know three things precisely. What price is the consortium offering relative to the current market price and the intrinsic value of the business? Who holds the remaining 62% and what are their likely motivations — are they long-term institutional holders, short-term arbitrageurs who will tender at any reasonable premium, or retail shareholders who can be influenced through communication? And what is the regulatory approval timeline for this transaction, because that window defines how much time we have to mount a defense.

The second immediate priority is a white knight search. If the promoter family is committed to maintaining Indian ownership or operational independence, the fastest and most reliable defense is finding an alternative acquirer or strategic partner who would pay a fair price and preserve the company's independence. This needs to start within days, not weeks.

The third immediate priority is shareholder communication. The promoter family needs to articulate clearly and compellingly why the bid undervalues the company and what the long-term value creation plan is. Institutional shareholders who receive a credible and quantified counter-narrative are much less likely to tender. This communication needs to be specific — not generic statements about long-term value but concrete milestones, capital allocation plans, and return targets.

The medium-term structural recommendation is to increase the promoter stake above 51% before the next vulnerability window, either through a rights issue that dilutes other shareholders or through open market purchases. A 38% holding is structurally too low for a company of this profile in the current environment.

I would be direct with the promoter family about one thing: if the bid is at a genuinely fair or premium price and the family's primary motivation is personal control rather than shareholder value, the defense becomes legally and reputationally complex. The board's fiduciary duty is to shareholders, not to the promoter family's control preference.`,
        companies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Protiviti', 'Alvarez & Marsal'],
        roundType: "Advisory Case and Fit Interview",
        whatInterviewerTests: "M&A defense strategy, shareholder dynamics, fiduciary responsibility, crisis advisory under pressure",
        commonMistakes: ["Focusing only on legal defenses without addressing shareholder communication", "Not quantifying the intrinsic value case against the bid price", "Ignoring the fiduciary duty of the board to all shareholders", "Recommending a defense strategy without first understanding who holds the 62% and their motivations"]
      }
    ]
  },
  "Risk Consultant": {
    case_interview: [
      {
        q: "A large Indian private bank has just acquired a mid-size NBFC. The RBI has asked the bank to submit a risk integration report within 90 days. You are leading the risk workstream. How do you approach this?",
        subcategory: "Risk Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A 90-day regulatory deadline with an active acquisition integration is high pressure and requires ruthless prioritization from day one. The worst thing I could do is try to cover every risk dimension comprehensively and produce a report that is broad but shallow. The RBI will not accept that.

My first action in week one would be to get clarity on exactly what the RBI expects in this report. I would review the acquisition approval letter and any conditions attached to it, prior RBI inspection reports on both entities, and the regulatory circulars governing NBFC-bank mergers. The structure of our report should be driven by what the regulator wants to see, not by our internal risk framework preferences.

I would then prioritize three risk areas as the core of the report, because these are the areas where NBFC-bank integrations most commonly create systemic risk.

The first is credit risk. NBFC loan books are typically underwritten to different standards than bank loan books. NBFCs often have higher concentrations in specific sectors, shorter tenor products, and different provisioning practices. I would want a complete portfolio review of the NBFC loan book, a vintage analysis of defaults and recoveries, and a comparison of the combined entity's sector and borrower concentration against RBI prudential norms.

The second is liquidity risk. NBFCs fund themselves very differently from banks, often with a higher reliance on market borrowings and shorter-term funding. The combined entity's asset-liability maturity profile will have changed materially. I would model the new ALM position and identify any structural gaps that need to be addressed before the next regulatory review.

The third is operational risk, specifically around systems and process integration. Two entities running on different core banking or loan management systems creates reconciliation gaps, reporting errors, and control failures. I would map the critical operational processes in both entities and identify where integration gaps exist that could create regulatory reporting errors.

For each of these three areas I would produce a findings section that identifies the gaps and a remediation plan section that specifies what we are doing about each gap, who owns it, and by when. The RBI will judge this report not just on whether we identified risks but on whether we have credible plans to address them.

The critical enabler for all of this is data access. I need the NBFC loan book data, treasury position data, and internal audit reports from the last two years within the first ten days. I would make this a formal requirement with a specific deadline and escalate immediately to the engagement partner and client senior management if it is not forthcoming. Without that data, we cannot meet the 90-day deadline and the bank faces regulatory consequences.`,
        companies: ['EY', 'KPMG', 'Deloitte', 'PwC', 'Protiviti', 'Grant Thornton'],
        roundType: "Risk and Controls Case Interview",
        whatInterviewerTests: "Risk identification, regulatory awareness, controls thinking, structured risk assessment under time pressure",
        commonMistakes: ["Starting with a broad risk framework rather than what the RBI specifically requires", "Underestimating credit quality differences between NBFC and bank loan books", "Not flagging data access as a critical dependency upfront", "Treating this as a documentation exercise rather than a genuine risk assessment with remediation commitments"]
      },
      {
        q: "A large Indian public sector bank has been issued a show cause notice by RBI for persistent KYC compliance failures across 40% of its accounts. The MD has 30 days to respond. You are brought in on day 1. What do you do?",
        subcategory: "Risk Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A show cause notice from the RBI for KYC compliance failures is a serious regulatory event and the 30-day response window is extremely tight. The first priority is to understand exactly what the RBI has found before deciding how to respond, because a poorly constructed response that minimizes or misdirects can escalate the situation significantly.

In the first 48 hours I would focus entirely on two things. Understanding the precise nature and scope of the RBI's findings from the notice and from any examination report that accompanied it, and assembling the right team. This engagement requires a combination of regulatory compliance expertise, data analytics capability, and senior legal counsel who specializes in banking regulation. Starting without the right team is the fastest way to produce an inadequate response.

I would then structure the 30-day response workstream across three parallel tracks.

The first track is fact-finding and root cause analysis. I need to independently verify the scope of the KYC failures. Are the 40% of accounts flagged by RBI an accurate reflection of the actual compliance position, or is there a definitional or data quality issue in how RBI has categorized the accounts? I would run the bank's own KYC data through a clean-room analysis to establish the ground truth before drafting any response. I would also conduct a root cause analysis to understand whether the failures are concentrated in specific branches, specific account opening channels, specific time periods, or specific customer segments. Root cause clarity is essential for both the response and the remediation plan.

The second track is remediation planning. The RBI response will be judged not just on the explanation of how the failures occurred but on the credibility and completeness of the plan to fix them. I would develop a time-bound remediation plan with specific milestones, accountability owners, and measurable targets. The plan needs to be ambitious enough to demonstrate seriousness but realistic enough to be credible. Promising remediation that cannot be delivered in the stated timeline makes the regulatory relationship significantly worse.

The third track is response drafting. The response to RBI needs to acknowledge the failures clearly without minimizing them, demonstrate genuine understanding of root causes, present a credible remediation plan, and show what systemic controls improvements will prevent recurrence. The tone needs to be one of complete accountability combined with demonstrable competence in addressing the issue. Defensive or legalistic responses consistently worsen the regulatory relationship.

The MD needs to understand that the quality of this response will shape the RBI's posture toward the bank for the next several years. A strong response that demonstrates genuine remediation can prevent escalation to more severe regulatory action. A weak response that appears to minimize the issue will invite further scrutiny.`,
        companies: ['EY', 'KPMG', 'Deloitte', 'PwC', 'Protiviti', 'Grant Thornton'],
        roundType: "Risk and Controls Case Interview",
        whatInterviewerTests: "Regulatory crisis management, root cause analysis, remediation planning, stakeholder communication under pressure",
        commonMistakes: ["Jumping to drafting the response before understanding the full scope of the RBI findings", "Not conducting an independent verification of the compliance position before responding", "Producing a remediation plan that is aspirational rather than credible and time-bound", "Underestimating the importance of tone and accountability in the regulatory response"]
      }
    ]
  },
  "Human Capital Consultant": {
    case_interview: [
      {
        q: "A large Indian IT services company is losing its top 15% of performers to product companies and startups at a rate that has doubled over the last two years. The CHRO has asked you to diagnose why and propose solutions.",
        subcategory: "Human Capital Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Attrition of top performers is fundamentally different from average attrition and must be treated differently. These are people with options and they are actively choosing to leave. That is a signal worth taking seriously rather than explaining away.

I would structure the diagnosis across three MECE buckets: financial and economic factors, career and growth factors, and culture and work environment factors. I would resist the instinct to assume the answer before the diagnosis is complete because the solution for each bucket is very different.

On financial and economic factors, I would start with a total compensation benchmarking exercise comparing base salary, variable pay, equity participation, and long-term incentive structures against product companies and funded startups. IT services firms have a structural disadvantage on equity upside and variable compensation that has widened significantly as startup valuations have grown. But I would not assume compensation is the whole story, because compensation-only interventions have a high recidivism rate: people who leave for money tend to leave again for more money.

On career and growth factors, I would look at promotion velocity for top performers compared to the market, whether the company has meaningful technical leadership tracks or whether all career progression funnels into people management, and whether the work itself offers the kind of ownership and impact that product company roles offer. IT services work is often characterized by narrow scope, client-controlled timelines, and limited visibility into outcomes. This is a structural disadvantage versus product roles that is harder to fix than compensation.

On culture and work environment, I would conduct focused listening sessions with three groups: high performers who left in the last 12 months, high performers who are currently staying but have received external offers, and frontline managers. I would explicitly not rely on exit interview data as the primary source because people consistently give safe, socially acceptable answers on the way out. The most valuable data comes from those who stayed despite offers, because they can tell you what made them choose to stay.

My hypothesis going in is that this is primarily a career architecture and equity participation problem, not a salary problem. Companies that have successfully retained top talent in IT services have done so by creating a parallel technical track with genuine recognition and compensation parity with management tracks, giving top performers exposure to innovation or product-adjacent work with real ownership, and introducing some form of long-term retention instrument tied to business outcomes.

I would present the CHRO with a segmented retention strategy because the solution for a top technical architect is different from the solution for a high-potential delivery manager. A single retention program applied uniformly will under-serve both.`,
        companies: ['Mercer', 'Aon', 'Willis Towers Watson', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Korn Ferry'],
        roundType: "Organizational and People Strategy Case",
        whatInterviewerTests: "Organization design thinking, talent and incentives understanding, change management, people dynamics sensitivity",
        commonMistakes: ["Treating all attrition the same instead of segmenting by role type and performance tier", "Relying only on exit interview data which is notoriously unreliable", "Jumping straight to a salary increase recommendation", "Ignoring the role of direct managers who are often the proximate cause of top performer exits"]
      },
      {
        q: "A large Indian bank is merging with a smaller private bank. The combined entity will have 45,000 employees and significant role overlap across branches, operations, and middle office functions. The CHRO needs a workforce integration plan. How do you approach this?",
        subcategory: "Human Capital Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A bank merger workforce integration is one of the most complex human capital challenges because it combines the analytical rigor of organizational design with the emotional and legal complexity of managing people's careers and livelihoods. Getting this wrong destroys the value the merger was supposed to create.

I would structure the workforce integration plan across four sequential but overlapping phases.

The first phase is the diagnostic, which should ideally run in parallel with merger due diligence before closing. I would map the combined organization role by role to understand where there is genuine overlap and where there is complementarity. In a bank merger, branch network overlap is usually the most visible but middle office and operations functions often have the highest absolute number of redundant roles. I would also assess the talent quality in each overlapping function because a merger is an opportunity to keep the best people from both organizations, not just the acquirer's people by default.

The second phase is the organizational design decision. Before any individual is told their role is at risk the leadership team needs to make the macro organizational design choices: what does the combined operating model look like, how many layers of management are needed, what is the right span of control, and which functions will be centralized versus distributed. These decisions create the framework within which individual role decisions are made. Designing the organization from a blank sheet and then fitting people to it produces better outcomes than trying to merge two existing org charts.

The third phase is the individual placement process. I would establish clear, transparent, and consistently applied criteria for role selection decisions. This is both a fairness imperative and a legal imperative, particularly in a regulated entity like a bank where the RBI and labor regulators will scrutinize the process. People who are not selected for roles need to understand why, and the criteria need to be defensible. I would also design a voluntary separation scheme for eligible employees before moving to any involuntary separations, because voluntary schemes are less disruptive, less legally risky, and often surface employees who were planning to leave anyway.

The fourth phase is retention of critical talent. In every merger there is a group of people who are not at risk of redundancy but who will leave anyway because of uncertainty, cultural discomfort, or competitive poaching during the vulnerable integration period. Identifying these people early and putting specific retention measures in place, including stay bonuses, career path clarity, and direct senior leadership engagement, is as important as managing the redundancy process.

The single most important success factor I would emphasize to the CHRO is communication speed and transparency. Prolonged uncertainty is more damaging to productivity and talent retention than a difficult message delivered clearly and quickly.`,
        companies: ['Mercer', 'Aon', 'Willis Towers Watson', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Korn Ferry'],
        roundType: "Organizational and People Strategy Case",
        whatInterviewerTests: "Workforce integration design, organizational design thinking, change management, legal and regulatory awareness",
        commonMistakes: ["Starting with headcount reduction targets rather than organizational design", "Not running the diagnostic before the merger closes when possible", "Applying the acquirer's org structure to the combined entity rather than designing from scratch", "Underestimating the retention risk for critical talent who are not redundant but will leave anyway"]
      }
    ]
  },
  "Corporate Strategy Consultant": {
    case_interview: [
      {
        q: "A large Indian conglomerate operates across steel, power, and real estate. The board wants to know which businesses to double down on and which to exit over the next five years. How do you structure this analysis?",
        subcategory: "Corporate Strategy Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `This is a portfolio strategy question and the analytical framework I would use is a combination of industry attractiveness and competitive position, but applied with the specific context of this conglomerate rather than as a generic two-by-two matrix.

I would assess each business across three dimensions.

The first dimension is structural industry attractiveness over the next five years. For steel, I would look at demand drivers from infrastructure spending, housing, and the emerging EV supply chain, set against structural risks from overcapacity in the domestic market and the threat of cheap Chinese imports. The net view on steel is mixed. For power, the renewable energy transition is a strong tailwind and policy support is significant, but legacy thermal power assets face structural demand decline as the grid transitions. This creates a bifurcated picture within the power business itself. For real estate, the picture varies sharply by segment: affordable housing and Grade A commercial are structurally strong, luxury residential is cyclical and margin-compressed.

The second dimension is the conglomerate's competitive position within each business. Are they a cost leader or a differentiator? Do they have scale advantages, regulatory relationships, land banks, or raw material access that competitors would find difficult to replicate? A business can be in an attractive industry but still be a poor strategic fit if the company has no durable competitive advantage in it.

The third dimension is capital intensity and financial returns. I would look at ROCE for each business over the last five years and benchmark it against the weighted average cost of capital. Businesses that consistently generate returns below cost of capital are destroying value regardless of how strategically important they feel. This is often the most uncomfortable conversation with a conglomerate board because legacy businesses carry emotional and historical significance beyond their financial returns.

Based on this framework, my hypothesis for a typical conglomerate in this position is that renewable power generation warrants doubling down given the policy environment and long-term demand trajectory, legacy thermal power and commoditized residential real estate are candidates for exit or managed monetization, and steel requires a binary decision on whether the conglomerate has the scale and cost position to compete long-term or whether a strategic partnership with a larger player makes more sense.

I would structure the board presentation as a portfolio heat map showing each business on the two axes of industry attractiveness and competitive position, with clear strategic options and financial implications for each quadrant. The board needs to own this decision, which means presenting options with tradeoffs rather than a single recommendation.`,
        companies: ['EY-Parthenon', 'Strategy&', 'Deloitte', 'Accenture Strategy'],
        roundType: "Corporate Strategy Case and Fit Interview",
        whatInterviewerTests: "Portfolio strategy thinking, capital allocation judgment, long-term strategic clarity, ability to advise a board",
        commonMistakes: ["Applying a generic two-by-two matrix without making it specific to the context", "Ignoring family or promoter dynamics that often drive portfolio decisions in Indian conglomerates", "Not addressing capital allocation explicitly", "Treating exit as binary when partial monetization or partnerships may be more realistic"]
      },
      {
        q: "A leading Indian consumer goods company with strong brands in foods and personal care is considering acquiring a direct-to-consumer health and wellness startup that is growing at 80% year on year but has never been profitable. The acquisition price is 8x revenue. Should they do it?",
        subcategory: "Corporate Strategy Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `An 8x revenue multiple for a high-growth but unprofitable startup is a significant valuation and the decision requires a rigorous strategic and financial assessment rather than either reflexive enthusiasm for the growth rate or reflexive concern about the lack of profitability.

I would structure my assessment across four dimensions.

The first dimension is strategic fit and the right to win question. What specific capability or asset does this startup bring that the acquirer cannot build or buy more cheaply? In direct-to-consumer health and wellness, the valuable assets are typically the brand and community, the customer data and retention model, the formulation and product IP, and the digital acquisition capability. I would assess each of these against what the acquirer already has. If the acquirer already has strong brand building capability and digital marketing infrastructure, the incremental value of the acquisition is lower than if these are genuine gaps.

The second dimension is the quality of the 80% growth. Not all growth is equal. I would want to understand the unit economics at the cohort level. Is the growth profitable at the customer level even if the company overall is not, meaning the losses are driven by growth investment rather than structural margin problems? What are the customer acquisition costs and how are they trending as the company scales? What is the retention and repeat purchase rate? A direct-to-consumer business with strong cohort economics but high losses due to aggressive customer acquisition is very different from one where the unit economics are fundamentally broken.

The third dimension is the valuation justification. At 8x revenue I need to model what the company needs to achieve for this to be a value-creating acquisition. I would build a simple DCF with three scenarios. In the base case, what revenue growth and margin trajectory justifies the price? In the bear case, if growth slows to 30% due to category normalization or competitive pressure, what is the return? In the bull case, if the acquirer's distribution and brand support accelerates the company, what is the upside? The decision should be made with eyes open on the bear case return, not just the bull case narrative.

The fourth dimension is integration risk. Direct-to-consumer startups with strong growth cultures are notoriously difficult to integrate into large consumer goods companies. The entrepreneurial team that built the business often leaves within 18 months of acquisition, the agile operating model that drove the growth gets replaced by corporate processes, and the brand authenticity that attracted the customer base gets diluted. I would recommend a hands-off integration model where the startup operates as a standalone entity with light financial reporting requirements and a specific earn-out structure that retains the founding team for at least three years.

My overall recommendation would be conditional. If the unit economics are sound, if the bear case return is acceptable, and if the acquirer is genuinely committed to a hands-off integration model, this acquisition is strategically compelling. If any of those conditions cannot be met, the risk-reward at 8x revenue does not justify the price.`,
        companies: ['EY-Parthenon', 'Strategy&', 'Deloitte', 'Accenture Strategy'],
        roundType: "Corporate Strategy Case and Fit Interview",
        whatInterviewerTests: "Acquisition evaluation, unit economics analysis, integration risk, valuation thinking",
        commonMistakes: ["Being seduced by the 80% growth rate without examining the quality of growth", "Not building a bear case scenario to stress test the valuation", "Recommending a full integration when a standalone model is clearly more appropriate", "Ignoring the talent retention risk as a critical acquisition risk"]
      }
    ]
  },
  "Digital Consultant": {
    case_interview: [
      {
        q: "A leading Indian insurance company wants to move 60% of its policy servicing interactions from branches and call centers to digital channels within 18 months. How do you help them get there?",
        subcategory: "Digital Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Before I design a roadmap, I would want to understand whether this 60% target is driven by genuine customer preference data or by cost reduction objectives. That framing matters because the solution, the sequencing, and the success metrics are different depending on the answer.

I would structure my diagnostic around three questions before any roadmap work begins.

The first question is: which interactions are actually digitizable without degrading the customer experience? Insurance interactions are not homogeneous. Premium payment and policy document download are already largely digital in most insurers and getting the last 20% there is a UX and awareness problem. Policy renewal is moderately complex but digitizable with the right journey design. Claims, policy changes for critical illness, and grievance resolution involve high emotional stakes and complexity. Pushing these to a chatbot or a self-service portal without a seamless human escalation path is a recipe for customer attrition and regulatory complaints. I would map all interaction types on a matrix of volume, complexity, and emotional stakes before assigning any to a digital channel.

The second question is: what is currently preventing customers from using digital channels that already exist? Most insurers already have apps and web portals with single-digit adoption rates. The problem is rarely technology. It is usually awareness, trust, usability on lower-end devices, or the fact that the digital channel does not actually resolve the issue and forces a branch visit anyway. I would do a rapid audit of existing digital touchpoints and their completion rates before building anything new.

The third question is: what are the frontline staff incentive structures? Branch and call center staff are often implicitly or explicitly incentivized on interaction volume. If digital migration reduces their case counts, they have a personal economic reason to steer customers away from digital channels. This is consistently the most underestimated implementation risk in digital migration programs.

The roadmap I would recommend is phased across three six-month windows. In the first six months, fix what already exists. Improve the UX of current digital channels, add proactive communication campaigns directing customers to specific use cases where digital works well, and measure completion rates rigorously. In months 6 to 12, digitize the next tier of moderately complex interactions with human escalation paths built in from the start. In months 12 to 18, use behavioral data from the first two phases to identify the remaining interaction types and customer segments that are still going to branches and design targeted interventions.

I would also be transparent with the leadership team that 60% in 18 months is achievable for transactional and moderately complex interactions. High-trust, high-complexity interactions like critical illness claims will likely require a longer timeline and should not be forced into a digital-only channel in this window.`,
        companies: ['Deloitte Digital', 'Accenture Song', 'Publicis Sapient', 'Capgemini Invent', 'IBM Consulting'],
        roundType: "Digital Transformation Case with Customer Experience Component",
        whatInterviewerTests: "Customer journey thinking, digital channel strategy, behavior change vs technology, implementation realism",
        commonMistakes: ["Treating digital migration as a technology problem rather than a customer behavior change problem", "Not segmenting interactions by complexity and trust level before recommending digitization", "Ignoring frontline staff incentives which can make or break adoption", "Setting a uniform target without recognizing some interactions should not be fully digital"]
      },
      {
        q: "A large Indian retail bank has invested 200 crore rupees in a mobile banking app over the last two years. The app has 2 million downloads but only 180,000 monthly active users. The CEO wants to know why adoption is low and what to do. How do you approach this?",
        subcategory: "Digital Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A 9% monthly active user rate on 2 million downloads is a significant adoption failure and tells me users are downloading the app but not finding enough reason to use it regularly. This is a product-market fit and user experience problem, not a marketing or awareness problem. Spending more on promotion to drive more downloads will not solve this.

I would structure my diagnosis across three questions before recommending any solutions.

The first question is: why are users downloading but not activating? The gap between download and first meaningful use is the first conversion problem. I would analyze the onboarding flow specifically. How many steps does it take to complete KYC and link an account? What is the drop-off rate at each step? In Indian banking apps, the most common activation killers are a lengthy KYC process that requires physical documents, a mandatory branch visit to complete activation, or a video KYC flow that fails frequently on low-bandwidth connections. If the activation funnel is broken, no amount of feature investment will improve MAU.

The second question is: why are activated users not returning? For users who do complete activation, what are they using the app for and how often? I would look at the transaction type distribution in the active user base. If 90% of active user sessions are for balance checks and mini-statements, it tells me users trust the app for read-only tasks but not for transactions. This is a trust and reliability problem. If users are using the app but then calling the call center to complete the same transaction, it tells me the app journey is incomplete or confusing.

The third question is: what are users doing instead? Are they using competitors' apps, are they going to branches, or are they simply not doing the banking task at all? Competitive benchmarking of UX against HDFC, ICICI, and Kotak apps would tell me whether this is a relative quality problem or an absolute one.

Before recommending solutions I would want the activation funnel data with drop-off rates at each step, the feature usage distribution among active users, and the customer complaint and call center data categorized by task type to understand where the app is failing users in their moments of need.

My likely recommendations would focus on three things. First, radically simplify the onboarding flow to get users to their first successful transaction in under three minutes. Second, identify the three to five high-frequency use cases where the app experience is clearly inferior to competitors and fix those specifically rather than trying to improve everything simultaneously. Third, implement an in-app nudge and notification strategy to bring back lapsed users with specific, relevant reasons to return rather than generic promotional messages.

The 200 crore investment is already spent. The question now is how to extract value from it, and that requires fixing the product experience, not spending more.`,
        companies: ['Deloitte Digital', 'Accenture Song', 'Publicis Sapient', 'Capgemini Invent', 'IBM Consulting'],
        roundType: "Digital Transformation Case with Customer Experience Component",
        whatInterviewerTests: "Digital product thinking, funnel analysis, user behavior diagnosis, prioritization",
        commonMistakes: ["Recommending more marketing spend to drive downloads when the problem is activation and retention", "Not separating the activation problem from the retention problem", "Treating all 2 million downloads as the addressable base rather than focusing on the activation funnel", "Proposing a full app rebuild when targeted fixes to specific user journeys would be faster and cheaper"]
      }
    ]
  },
  "Supply Chain Consultant": {
    case_interview: [
      {
        q: "A leading Indian FMCG company is facing a situation where its fill rate to modern trade customers has dropped from 95% to 82% over the last two quarters while inventory levels have actually increased. How do you diagnose this?",
        subcategory: "Supply Chain Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A fill rate drop alongside rising inventory is a classic supply chain mismatch signal. If inventory were genuinely low, I would expect to see both metrics move in the same direction. The fact that they are moving in opposite directions tells me the company has inventory, it just has the wrong inventory in the wrong place at the wrong time. This is a forecasting and network design problem, not a supply shortage problem.

I would structure my diagnosis across three MECE buckets.

The first bucket is inventory location and network design. Where is the inventory physically sitting? Is it concentrated at central warehouses or mother depots while modern trade distribution centers are running stockouts? Modern trade in India operates on a pull model with frequent, smaller replenishment orders. If the distribution network was designed around general trade wholesale patterns, which are push-based and larger order sizes, it will structurally under-serve modern trade even when total inventory is adequate. I would want a depot-wise inventory position mapped against modern trade DC locations to test this hypothesis.

The second bucket is demand forecasting accuracy at the SKU-location level. Modern trade customers, particularly large chains like DMart, Reliance Retail, and Spencer's, have more predictable and concentrated ordering patterns than general trade. This should make them easier to forecast and serve, not harder. If fill rates are dropping specifically for modern trade it suggests the forecasting and replenishment logic is not tuned to modern trade ordering behavior, which may have changed with the growth of quick commerce and omnichannel fulfillment.

The third bucket is recent operational changes. Fill rate problems that emerge suddenly over two quarters almost always have a triggering event. A new warehouse management system implementation that disrupted replenishment logic. A change in the distributor network that broke the last-mile connection to modern trade. A new product launch that cannibalized forecasting bandwidth and inventory allocation from established SKUs. I would do a structured root cause analysis specifically looking at what changed in the organization two to three quarters ago.

Before recommending solutions I would want four data points. SKU-level fill rate data broken down by depot and customer to test the location hypothesis. Inventory aging reports to understand whether rising inventory is concentrated in slow-moving or recently launched SKUs. Demand forecast accuracy metrics for the affected SKUs compared to the prior year. And a timeline of operational changes in the supply chain over the last four quarters.

My working hypothesis is that this is a combination of a network design that was built for general trade and has not been adapted as modern trade has grown in importance, and a demand forecasting model that does not adequately capture modern trade ordering patterns. The likely fix is a dedicated replenishment model for modern trade accounts with tighter inventory positioning at downstream nodes, combined with a root cause review of why inventory is accumulating at the wrong points in the network.`,
        companies: ['Accenture', 'Kearney', 'Deloitte', 'PwC', 'EY', 'Capgemini'],
        roundType: "Operations and Supply Chain Case Interview",
        whatInterviewerTests: "Supply chain network thinking, inventory and logistics reasoning, root cause analysis, quantitative structuring",
        commonMistakes: ["Assuming this is a supply shortage problem without noticing the rising inventory signal", "Not separating the modern trade channel from general trade in the diagnosis", "Jumping to automation before understanding forecasting and network fundamentals", "Ignoring the possibility that a recent operational change triggered the problem"]
      },
      {
        q: "A large Indian automobile manufacturer is facing a situation where a single supplier provides 70% of its critical electronic control units. That supplier has just announced it is exiting the Indian market in 12 months. How do you help the manufacturer respond?",
        subcategory: "Supply Chain Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A single supplier providing 70% of a critical component with a 12-month exit notice is a supply chain crisis that requires immediate triage followed by a structured medium-term response. The 12-month clock is both the constraint and the organizing principle for everything that follows.

I would structure the response across three time horizons.

In the immediate term, the first priority is securing supply continuity through the transition period. I would negotiate aggressively with the exiting supplier to extend the exit timeline if possible, even by three to six months, in exchange for a clean wind-down commitment and payment guarantees. Simultaneously I would work with the manufacturer's procurement and engineering teams to identify the exact ECU specifications and qualification requirements so that alternative supplier evaluation can begin immediately. The worst outcome would be to spend the first three months in internal discussions rather than in parallel qualification conversations with alternative suppliers.

In the medium term, the core work is supplier qualification and dual sourcing. ECU qualification for automotive applications is not a quick process. It typically involves six to nine months of testing, validation, and regulatory approval depending on the vehicle type and the specific ECU functions. This means qualification conversations need to start in month one, not month six. I would identify a primary replacement supplier and a secondary supplier simultaneously, targeting a 50-40-10 split between primary, secondary, and retained existing supplier if a partial continuation is possible. The 10% retained share is a deliberate risk hedge.

The qualification process itself needs to be structured across four criteria. Technical capability and specification match with the existing ECUs. Manufacturing capacity and scalability to meet the manufacturer's volume requirements. Financial stability and long-term commitment to the Indian market given that this is precisely the risk that triggered the current crisis. And geopolitical and logistics risk, because concentrating ECU supply in a single geography creates vulnerability to the kind of supply shock the semiconductor crisis of 2021 demonstrated.

In the longer term, this crisis needs to become the trigger for a formal supply chain resilience policy that prevents single-source dependencies above a defined threshold for any critical component. I would recommend the manufacturer implement a supplier concentration policy that flags any component where a single supplier exceeds 40% of supply and triggers a mandatory dual-sourcing program within 24 months.

The financial model I would build for the manufacturer would quantify the cost of supply disruption if transition fails, the cost of the qualification and dual-sourcing program, and the ongoing cost premium of maintaining dual sources, to demonstrate that the resilience investment is significantly cheaper than the disruption risk it mitigates.`,
        companies: ['Accenture', 'Kearney', 'Deloitte', 'PwC', 'EY', 'Capgemini'],
        roundType: "Operations and Supply Chain Case Interview",
        whatInterviewerTests: "Supply chain crisis management, supplier qualification thinking, risk mitigation, time-constrained planning",
        commonMistakes: ["Not immediately starting supplier qualification conversations while negotiating with the exiting supplier", "Underestimating the ECU qualification timeline and planning as if a replacement can be found in weeks", "Focusing only on the immediate crisis without recommending a structural policy to prevent recurrence", "Not quantifying the cost of disruption to build the business case for the resilience investment"]
      }
    ]
  },
  "Financial Advisory Consultant": {
    case_interview: [
      {
        q: "Your client, a mid-size Indian private equity fund, is considering acquiring a controlling stake in a profitable but family-run retail chain with 120 stores across tier 2 and tier 3 cities. What are the key areas you would focus on in financial due diligence?",
        subcategory: "Financial Advisory Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Financial due diligence on a family-run business requires a fundamentally different mindset than diligencing a professionally managed company. The risk is not that the business is bad. It is that the reported picture of the business may not reflect the economic reality once you adjust for the way family businesses are typically run.

I would structure my due diligence across five focus areas.

The first and most important is quality of earnings. Family businesses frequently have personal expenses running through the P&L including family salaries above market rates, personal vehicles, travel, and entertainment. Related party transactions, for example purchases from a supplier owned by a family member, are often at non-arm's length terms. Revenue recognition may be inconsistent across periods. My approach would be to rebuild the P&L from raw transaction data rather than accepting the audited statements at face value, adjusting for each of these distortions to arrive at a normalized EBITDA. The difference between reported and normalized EBITDA in a family-run business can be 15 to 25 percent, which has a significant impact on the valuation multiple being paid.

The second area is working capital quality. In retail, inventory management and creditor terms are critical signals of operational health and financial stress. I would look at inventory turnover by category and by store, because a blended number can hide significant pockets of slow-moving or obsolete stock in smaller stores. I would also look at creditor days and whether there is a trend of stretching supplier payments, which is often a sign of cash management pressure that will surface as a post-acquisition liability.

The third area is store-level unit economics. Aggregate profitability at the company level can mask a situation where 20 high-performing stores are subsidizing 100 underperforming ones. I would want store-level P&L data to understand the genuine distribution of profitability across the portfolio, particularly in the tier 2 and tier 3 expansion stores which are likely newer and may not yet be contributing positively to group EBITDA.

The fourth area is tax and compliance. Family businesses in India frequently carry GST, TDS, income tax, and labor law exposures that have not been fully provided for in the accounts. These can create material post-closing liabilities that are not visible in the audited statements. I would engage a tax specialist to run a full compliance review as part of diligence.

The fifth area is key person and relationship dependency. If critical supplier relationships, landlord relationships, and local regulatory relationships are built around the promoter family personally, the PE firm needs to understand what happens to those relationships post-acquisition and whether there is a transition plan. Losing a key landlord relationship that governs 30 stores would be existential.

I would also flag to the deal team that the valuation methodology must reflect normalized earnings and not the peak or inflated reported earnings. Paying a market multiple on inflated EBITDA because we did not adjust for family business distortions is the most common mistake in this type of transaction.`,
        companies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Alvarez & Marsal', 'FTI Consulting'],
        roundType: "Transaction Advisory and Financial Due Diligence Case",
        whatInterviewerTests: "Financial analysis thinking, due diligence judgment, deal risk identification, structured financial reasoning",
        commonMistakes: ["Accepting reported financials at face value without adjusting for family business-specific distortions", "Ignoring store-level economics in favor of aggregate analysis", "Not stress testing working capital assumptions", "Underestimating tax and compliance tail risks in family-owned businesses"]
      },
      {
        q: "A large Indian pharmaceutical company wants to acquire a smaller specialty drug company with a strong oncology pipeline but negative EBITDA. Your client is paying 3,000 crore rupees for a company that is currently losing money. How do you evaluate whether this is a good deal?",
        subcategory: "Financial Advisory Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Acquiring a loss-making company for 3,000 crore rupees requires a fundamentally different evaluation framework than a standard profitability-based valuation. The value here is entirely in the future cash flows from the pipeline, not in the current P&L. So the question is not whether the target is profitable today but whether the pipeline assets justify the price being paid.

I would structure my evaluation across four dimensions.

The first dimension is pipeline value assessment. What is in the oncology pipeline, at what stage of clinical development is each asset, and what is the probability-adjusted net present value of each program? A Phase 3 asset with strong efficacy data in a large oncology indication could be worth 2,000 to 5,000 crore rupees on its own. A Phase 1 asset is worth far less. I would want an independent scientific assessment of each asset including the probability of approval, the addressable patient population, the likely pricing, and the competitive landscape.

The second dimension is strategic fit and synergy quantification. Does this acquisition strengthen our client's oncology position specifically, and are there genuine synergies that create value beyond what the target could achieve independently? Pharma synergies typically come from three sources: commercial synergies from leveraging the acquirer's sales force to launch drugs faster, manufacturing synergies from consolidating production, and R&D synergies from combining capabilities. I would want each synergy quantified with a timeline and confidence level rather than accepting a headline number.

The third dimension is execution and integration risk. Pharma acquisitions of pipeline companies have a high failure rate not because the science was wrong but because integration disrupted the team running the research. Key person risk is extreme in specialty pharma. I would want to understand retention plans for the founding scientists and whether the earn-out structure keeps them motivated through critical late-stage development.

The fourth dimension is downside scenario analysis. What happens if the lead oncology asset fails in Phase 3? At 3,000 crore rupees I need to understand the floor value of this acquisition. Are there revenue-generating products today, manufacturing assets, or secondary pipeline assets that provide downside protection?

My overall framework is: the price is justifiable only if the probability-adjusted NPV of the pipeline exceeds the acquisition price plus integration costs plus the opportunity cost of deploying 3,000 crore rupees elsewhere. I would run three scenarios, base case, bear case with one pipeline failure, and bull case with full pipeline success, and recommend the deal only if the bear case NPV is within acceptable loss parameters.`,
        companies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Alvarez & Marsal', 'FTI Consulting'],
        roundType: "Transaction Advisory and Financial Due Diligence Case",
        whatInterviewerTests: "Pipeline valuation, M&A thinking, synergy analysis, deal risk identification, scenario analysis",
        commonMistakes: ["Dismissing the deal because the target has negative EBITDA without recognizing pipeline value", "Not probability-adjusting clinical stage assets for approval likelihood", "Ignoring key person risk in science-driven acquisitions", "Accepting synergy numbers at face value without stress testing", "Not running a downside scenario to understand the floor value"]
      },
      {
        q: "A large Indian conglomerate is considering spinning off its IT services subsidiary, which contributes 30% of group revenue but is valued at a discount because of the conglomerate structure. The CFO wants to understand whether a spinoff creates value and how to execute it. How do you advise?",
        subcategory: "Financial Advisory Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `A spinoff of a subsidiary that is being held at a conglomerate discount is a classic value creation exercise, but the decision requires careful analysis of both the valuation gap and the execution complexity before recommending a specific path.

I would structure my advice across four dimensions.

The first dimension is quantifying the conglomerate discount. The premise of the spinoff is that the IT services subsidiary is worth more as a standalone entity than as part of the conglomerate. I would validate this by comparing the current implied valuation of the IT subsidiary within the group's market capitalization against the trading multiples of comparable standalone Indian IT services companies. If the comparable companies trade at 4 to 5x revenue and the subsidiary's implied value within the conglomerate is 2 to 3x revenue, the conglomerate discount is real and material. If the gap is small, the value creation rationale for the spinoff is weak.

The second dimension is the strategic and operational interdependencies. Before recommending a spinoff I would map the operational interdependencies between the IT subsidiary and the rest of the conglomerate. Does the IT subsidiary do significant work for group companies at below-market rates? Does it share back-office functions, real estate, or leadership with the parent? Are there customer relationships or contracts that are contingent on group membership? Each of these interdependencies represents a cost or risk in the spinoff that needs to be modeled. A subsidiary that looks standalone on the surface but has deep operational entanglement with the parent is much more complex and expensive to separate than the P&L suggests.

The third dimension is the execution path. There are three structural options. A pure spinoff distributes shares in the new standalone entity to existing shareholders at no cost. An IPO raises new capital by selling shares to public market investors. A strategic sale to a third party or to a PE firm provides immediate liquidity. Each option has different implications for control, capital raising, and timeline. A pure spinoff is the most tax-efficient and preserves shareholder choice but raises no new capital. An IPO raises capital but requires SEBI approval and market conditions. A strategic sale provides the fastest liquidity and the highest certainty of value but involves loss of control.

The fourth dimension is the tax and regulatory considerations. Indian spinoffs have specific tax implications under the Income Tax Act and SEBI regulations that govern demergers and listing of subsidiaries. The structure needs to be optimized for tax efficiency and regulatory compliance simultaneously.

My overall advice would be: if the conglomerate discount is validated at greater than 20 to 25%, the spinoff creates real value and is worth pursuing. The recommended execution path depends on whether the conglomerate needs capital, in which case an IPO is preferred, or whether the goal is simply to unlock value for existing shareholders, in which case a pure demerger is more efficient.`,
        companies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Alvarez & Marsal', 'FTI Consulting'],
        roundType: "Transaction Advisory and Financial Due Diligence Case",
        whatInterviewerTests: "Corporate restructuring knowledge, valuation thinking, execution path analysis, tax and regulatory awareness",
        commonMistakes: ["Not quantifying the conglomerate discount before recommending the spinoff", "Ignoring operational interdependencies that make separation more complex and costly than it appears", "Treating spinoff, IPO, and strategic sale as interchangeable without analyzing the different implications", "Not addressing the tax and regulatory execution complexity"]
      },
      {
        q: "A global private equity firm is considering investing 2,000 crore rupees in a leading Indian microfinance institution. The MFI serves 8 million borrowers across rural India with an average loan size of 35,000 rupees. What are the key diligence areas and what risks would you flag?",
        subcategory: "Financial Advisory Consultant",
        difficulty: "Hard",
        domain: "consulting",
        a: `Microfinance due diligence requires a combination of standard financial analysis and a deep understanding of the sector-specific risks that have caused MFI failures in India historically. The 2010 Andhra Pradesh crisis and various subsequent regional credit events have demonstrated that MFI portfolios can deteriorate very rapidly when macroeconomic or regulatory stress occurs, and a standard financial diligence approach is insufficient.

I would structure the diligence across five key areas.

The first area is portfolio quality assessment. The reported non-performing asset ratio is the starting point but not the endpoint. I would want a vintage analysis of the loan book showing the default rate by loan cohort from origination, because early vintage data predicts future portfolio behavior better than current NPA numbers. I would also want geographic concentration analysis: if 40% of the loan book is in two or three states, the portfolio is vulnerable to state-level regulatory intervention of the kind that has historically been the primary cause of MFI distress. And I would want an over-indebtedness analysis: what percentage of borrowers have loans from three or more MFIs simultaneously, which is the leading indicator of a credit stress event.

The second area is asset-liability management. MFIs borrow from banks and capital markets at relatively short tenors and lend at longer tenors to borrowers who repay weekly or monthly. The ALM profile needs to be stress tested for a scenario where bank credit lines are withdrawn or repriced, which is a realistic scenario during regulatory stress.

The third area is regulatory and political risk. Microfinance in India operates in a regulatory environment that has historically been subject to sudden state-level interventions. I would assess the regulatory posture in the states where the MFI has significant concentration, review any history of loan waiver announcements or political statements about microfinance in those states, and evaluate the MFI's compliance with RBI's revised microfinance regulations on borrower income assessment and multiple lending limits.

The fourth area is governance and management quality. MFI failures have frequently been associated with aggressive growth targets that compromised underwriting quality, commission-based field officer incentives that drove overlending, and board governance that did not provide adequate oversight of portfolio quality. I would review the board composition, the management incentive structure, and the internal audit function's independence and effectiveness.

The fifth area is the social performance track record. ESG considerations are increasingly important to global PE investors and the RBI has been explicit about responsible lending standards. I would assess the MFI's client protection practices, its complaint resolution mechanism, and whether there is evidence of coercive collection practices in its field operations.

The key risk I would flag to the PE firm as the most important single issue is geographic concentration combined with borrower over-indebtedness. A portfolio that appears high-quality in normal conditions can deteriorate within two to three quarters if a loan waiver announcement or regulatory tightening hits the primary states of operation. The investment thesis needs to explicitly account for this tail risk and the portfolio construction needs to reflect deliberate geographic diversification.`,
        companies: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Alvarez & Marsal', 'FTI Consulting'],
        roundType: "Transaction Advisory and Financial Due Diligence Case",
        whatInterviewerTests: "Sector-specific risk knowledge, portfolio quality analysis, regulatory risk assessment, PE investment diligence",
        commonMistakes: ["Applying standard corporate finance diligence without understanding MFI-specific risks", "Not doing a vintage analysis and relying only on current NPA numbers", "Underestimating regulatory and political risk in microfinance lending", "Not flagging geographic concentration and over-indebtedness as the primary tail risks"]
      }
    ]
  }
};

export const CONSULTING_LEVELS = [
  "Consultant",
  "Senior Consultant",
  "Management Consultant",
  "Strategy Consultant",
  "Business Consultant",
  "Transformation Consultant",
  "Operations Consultant",
  "Technology Consultant",
  "Advisory Consultant",
  "Risk Consultant",
  "Human Capital Consultant",
  "Corporate Strategy Consultant",
  "Digital Consultant",
  "Supply Chain Consultant",
  "Financial Advisory Consultant"
];
