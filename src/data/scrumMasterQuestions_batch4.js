export const scrumMasterQuestions_batch4 = {
  'Scrum Master': {
    behavioral: [
      {
        q: "You are a Scrum Master at a telecom company. The team has just received a new regulatory requirement to implement 5G standalone architecture changes within 90 days. How do you plan the sprints to meet this deadline?",
        a: `A 90-day regulatory deadline for 5G standalone architecture changes requires immediate action combined with disciplined sprint planning. My first response is not to start estimating stories. My first response is to understand the full scope of what is required.

I facilitate a scope clarification session with the regulatory team, the network architects, and the product owner within the first two days. The goal is to answer three questions: what specifically must be implemented to meet the regulatory requirement, what is the minimum viable implementation that satisfies the regulation versus what would be ideal, and what dependencies exist on external parties like network equipment vendors.

With 90 days available and two-week sprints, the team has approximately six sprints. I run a rapid estimation session with the full technical team to size the identified work. If the estimate exceeds six sprints of available capacity, I surface this immediately to leadership with the specific gap. At this point the options are to add capacity, descope to the regulatory minimum, or seek a deadline extension from the regulator. All three options require leadership decisions and the earlier those decisions are made the better.

Assuming the scope is achievable, I sequence the sprints with risk-first prioritization. The highest technical risk items, typically the core architecture changes that everything else depends on, go in the first two sprints. If there are surprises in those items, there is still time to respond. Lower risk items like monitoring, documentation, and operational runbooks go in the final sprints.

I also establish a daily impediment escalation path for this program. Any blocker that cannot be resolved within 24 hours goes immediately to the program lead. With a 90-day deadline, a three-day blocker costs half a sprint. Fast escalation is essential.

Progress is tracked against a release burn-up chart that is shared with regulatory stakeholders weekly so they have continuous visibility into actual delivery progress rather than point-in-time status reports.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Fixed deadline planning, risk sequencing, regulatory delivery',
        commonMistakes: ['Starting estimation before clarifying scope', 'Not surfacing scope-deadline misalignment immediately', 'Not establishing fast escalation paths'],
      },
      {
        q: "How do you ensure knowledge is not siloed in one or two team members in a fintech Scrum team? What practices do you introduce?",
        a: `Knowledge silos in a fintech Scrum team are both a delivery risk and a technical risk. When only one or two team members understand a critical component, the team has a bus factor problem: if those people are unavailable, the team cannot maintain or extend that component. In fintech, where payment systems, fraud models, and compliance controls are critical infrastructure, this risk is particularly acute.

I address knowledge silos through a combination of practices that build collective understanding over time rather than requiring a one-time knowledge transfer event.

The first practice is pair programming and mob programming. When I observe that certain stories are always picked up by the same team members, I introduce pairing as a team norm. A senior engineer who always handles the payment gateway integration pairs with a junior engineer on the next payment gateway story. The senior engineers typically resist this initially because they believe working alone is faster. I address this by measuring velocity at the team level rather than the individual level and by pointing out the sprint risk that materializes when the senior engineer is unavailable and nobody else can pick up their work.

The second practice is a rotation policy for recurring work. When the same team members are always assigned to the same types of stories, I work with the team to introduce a rotation. For every third story of a particular type, a different team member picks it up, with the original expert available for pairing. This is slower in the short term but builds team-wide capability over time.

The third practice is the definition of done including documentation requirements for complex components. When a team member implements a complex payment routing algorithm or a fraud detection rule, the definition of done includes a brief architectural decision record and a code walkthrough for the rest of the team. This converts individual knowledge into team knowledge as a side effect of normal delivery.

The fourth practice is a regular team learning session. Once per sprint, the team spends thirty minutes on a knowledge-sharing topic selected by rotation. Team members take turns presenting something they understand that others do not.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Knowledge management, team resilience, bus factor reduction',
        commonMistakes: ['Relying on documentation alone without pairing', 'Not making knowledge sharing a sprint norm', 'Not addressing resistance from senior engineers'],
      },
      {
        q: "What is a Definition of Ready and how does it differ from a Definition of Done? Create an example of each for a banking team building a loan origination system.",
        a: `The Definition of Ready and the Definition of Done are both quality standards but they apply at different points in the workflow and serve different purposes.

The Definition of Ready is a checklist of criteria that a product backlog item must meet before the team commits to including it in a sprint. It is the entry gate to the sprint. Its purpose is to ensure the team has enough information to estimate the work, understand the acceptance criteria, and begin delivering without getting blocked by missing information or unresolved dependencies.

The Definition of Done is a checklist of criteria that a backlog item must meet before it can be declared complete. It is the exit gate from the sprint. Its purpose is to ensure the team delivers working, high-quality software consistently rather than declaring items done when they are only partially complete.

For a banking team building a loan origination system, a Definition of Ready for a user story might include: the story is written in the agreed format with a clear user need and business value, acceptance criteria are defined and approved by the Product Owner, the compliance team has reviewed the story and confirmed it meets regulatory requirements for lending, the story has no unresolved external dependencies, the story has been estimated by the team and is small enough to complete in one sprint, the UI mockup has been reviewed and approved if the story has a user interface, and the test data requirements have been identified and the data is available in the test environment.

A Definition of Done for the same team might include: code has been peer reviewed and all review comments addressed, unit tests written with at least eighty percent code coverage, integration tests passing in the continuous integration environment, the loan calculation logic has been validated against the regulatory calculation requirements, the audit log records the correct user action and timestamp, performance testing confirms the response time meets the defined SLA under expected load, the product owner has accepted the implementation against the acceptance criteria, security scan completed with no high or critical findings, and the feature is deployed to the staging environment.

The key distinction: the Definition of Ready ensures work is ready to start. The Definition of Done ensures work is ready to ship.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Definition of Ready vs Done, quality standards, domain application',
        commonMistakes: ['Confusing the two definitions', 'Creating a Definition of Ready that is so strict no stories pass it', 'Not including domain-specific criteria in either definition'],
      },
      {
        q: "How do you handle a team member who repeatedly skips the Daily Scrum without explanation at a healthcare software company?",
        a: `A team member who repeatedly skips the Daily Scrum without explanation needs to be addressed directly but with curiosity before consequence. There is almost always a reason and understanding it is more productive than applying rules.

My first conversation is a private one-on-one with the team member. I do not have this conversation in front of the team and I do not frame it as a complaint about their behavior. I frame it as a genuine inquiry. I have noticed you have missed the last several Daily Scrums and I wanted to check in. Is everything okay and is there anything about the current setup that is not working for you?

The answers I typically receive fall into a few categories. Sometimes the team member finds the Daily Scrum unhelpful because the discussion does not apply to their work. Sometimes there is a scheduling conflict with another meeting they feel they cannot miss. Sometimes there are personal circumstances they have not shared. And occasionally the team member genuinely does not see the value in the Daily Scrum and is choosing to skip it.

Each category has a different response. If the Daily Scrum is not relevant to their work, I investigate whether the team is conducting the Daily Scrum correctly. A Daily Scrum where a developer working on backend API has to sit through ten minutes of discussion about frontend UI concerns they have no context for is a poorly facilitated Daily Scrum. The solution is to improve the Daily Scrum, not to force attendance.

If there is a scheduling conflict, I work with the team to find a time that works for everyone. Daily Scrum timing should accommodate the team, not the other way around.

If the team member does not see the value in the Daily Scrum, I explain why their participation matters to the team. In a healthcare software team, the Daily Scrum is particularly important because patient safety dependencies can surface through the daily coordination that would not surface otherwise. Their absence means the team may miss a dependency or a blocker that their work creates for others.

If after a direct conversation the behavior continues, I involve the team member's manager and discuss whether this is a commitment issue that extends beyond the Daily Scrum.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Team behavior, direct conversation, root cause approach',
        commonMistakes: ['Enforcing attendance rules without understanding the reason', 'Addressing the behavior publicly', 'Not investigating whether the Daily Scrum itself needs improvement'],
      },
      {
        q: "How do you introduce story point estimation to a team that has never used it before? What are the common pitfalls?",
        a: `Introducing story point estimation to a team that has never used it requires starting with the concept of relative sizing before introducing the mechanics of planning poker or any specific technique. Teams that understand why they are estimating in relative terms adopt the practice more successfully than teams that are simply told to use story points.

I start with an analogy that makes relative sizing intuitive. I ask the team: if I asked you how long it would take to walk from our office to the nearest coffee shop, you could estimate that. If I then asked how long it would take to walk to a coffee shop that is three times as far, you could give a proportional estimate without knowing the exact distances. Story points work the same way. We are not trying to predict how many hours a story will take. We are saying this story feels about three times as complex and effort-intensive as that reference story.

I then run a practice estimation session before the first real sprint planning. I bring in five or six completed stories from the team's recent work and ask them to size them relative to each other using the Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21. We start by identifying the smallest story in the set and agreeing that it is a 1 or a 2. Then we size each other story relative to that anchor.

The practice session is critical because it reveals the calibration differences in the team. When one developer sizes a story as a 3 and another sizes it as an 8, the conversation that follows is the real value of estimation. That conversation surfaces assumptions, risks, and knowledge gaps that would not surface otherwise.

Common pitfalls I warn teams about: the tendency to convert story points to hours, which defeats the purpose of relative sizing. The tendency to game estimates to match what the Product Owner wants to hear. The tendency to let the most senior person's estimate anchor the group before others have thought independently. And the tendency to stop estimating stories that are genuinely uncertain rather than using that uncertainty as a signal to break the story down or to spike it.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Easy',
        domain: 'general',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Estimation coaching, practical facilitation, common pitfall awareness',
        commonMistakes: ['Jumping straight to planning poker without explaining relative sizing', 'Not running a practice session', 'Not addressing anchoring bias in estimation'],
      },
      {
        q: "You are a Scrum Master at a bank. The development team wants to adopt test-driven development but the QA manager is concerned this will reduce the QA team's role. How do you navigate this?",
        a: `The QA manager's concern is legitimate and I take it seriously before advocating for TDD adoption. Test-driven development does change the role of QA engineers and if that change is not managed thoughtfully, it creates real anxiety and resistance that can undermine both the TDD adoption and the team's relationships with the QA function.

My first conversation is with the QA manager to understand their specific concern. Are they worried about job security for their team members? Are they concerned about quality standards being maintained if developers write their own tests? Are they concerned about losing their seat at the table in the development process? Understanding the specific concern tells me how to respond.

For job security concerns, I make the case that TDD does not eliminate the need for QA expertise. It changes where QA expertise is applied. Instead of manually testing features at the end of a development cycle, QA engineers in a TDD environment contribute to acceptance test design, exploratory testing, performance testing, security testing, and test automation strategy. These are higher-value activities than manual regression testing and they require QA expertise that developers typically do not have. TDD creates an opportunity for QA engineers to do more interesting and impactful work, not less.

For quality standard concerns, I propose a pilot with clear quality metrics. The team adopts TDD for one sprint, and we measure defect rates, code coverage, and time to detect defects compared to the previous sprint. If TDD produces worse quality outcomes than the current approach, we have empirical evidence to adjust the approach. If it produces better outcomes, we have empirical evidence to expand it.

For the seat at the table concern, I work with the development team and the QA manager to design a collaborative acceptance criteria process where QA engineers co-create the acceptance tests with developers before development begins. This makes QA expertise central to the development process rather than a gate at the end of it.

The goal is to bring the QA manager into the TDD adoption as a partner rather than a stakeholder who needs to be managed.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Change management, stakeholder empathy, quality practice adoption',
        commonMistakes: ['Dismissing the QA manager concerns', 'Not involving QA in the TDD adoption plan', 'Not proposing a pilot to generate empirical evidence'],
      },
      {
        q: "How do you run an effective sprint planning session in two hours for a team that typically takes four hours?",
        a: `A sprint planning session that runs four hours when it should run two is almost always suffering from one or more of three problems: stories are not ready for planning when the session begins, the team is designing solutions during planning rather than just sizing and committing, or the group is making decisions that should be made by individuals.

Before attacking the session length, I diagnose which of these is happening by timing each section of the current planning sessions. How long does story presentation take? How long does estimation take per story? How long does the commitment discussion take? The section that consumes disproportionate time is the section to address.

For stories that are not ready, the solution is in backlog refinement, not in sprint planning. If the team is spending significant time in sprint planning clarifying acceptance criteria, discussing requirements, and resolving dependencies, those activities belong in the refinement session earlier in the week. I enforce a strict definition of ready that stories must meet before they can enter sprint planning. Stories that do not meet the definition of ready are returned to the backlog.

For solution design during planning, I introduce a facilitation rule: sprint planning is about what, not how. The team selects stories based on the sprint goal and estimates them based on their understanding of the work. The detailed technical design happens during the sprint, not during planning. When technical design discussions break out in sprint planning, I time-box them to two minutes and move on.

For group decisions that should be individual, I change how estimation works. Instead of group discussion before each estimate, I use silent individual estimation followed by a simultaneous reveal. When all estimates are within one Fibonacci point of each other, we take the average and move on. Only when there is significant divergence do we have a discussion. This reduces the time per story estimate from five minutes to ninety seconds for most stories.

With these three changes in place, a four-hour sprint planning typically reduces to two hours within two or three sprints.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'general',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Ceremony efficiency, facilitation skills, root cause diagnosis',
        commonMistakes: ['Trying to reduce time without diagnosing which section is consuming it', 'Not enforcing the definition of ready before planning', 'Allowing solution design discussions in sprint planning'],
      },
      {
        q: "How do you help a Scrum team at a fintech company build a culture of continuous improvement beyond the retrospective?",
        a: `The retrospective is the most visible continuous improvement mechanism in Scrum but limiting continuous improvement to a bi-weekly ceremony is a missed opportunity. In a fast-moving fintech environment, the ability to identify and address improvement opportunities continuously rather than waiting for the next retrospective is a competitive advantage.

I help teams build continuous improvement into their daily working culture through three complementary practices.

The first practice is making the improvement backlog visible and active. I work with the team to maintain a dedicated improvement backlog separate from the product backlog. Any team member can add to it at any time, not just during retrospectives. The improvement backlog is reviewed as part of sprint planning and a small number of improvement items are selected for the sprint alongside product stories. This makes continuous improvement a regular sprint activity rather than a once-per-sprint ceremony output.

The second practice is a team norm of calling out process problems in real time. When a team member encounters a process issue during the sprint, whether a tool that is not working, a communication gap, or a workflow bottleneck, they add it immediately to the improvement backlog rather than waiting for the retrospective to surface it. I introduce a simple rule: if you notice it, note it. The retrospective becomes a review and prioritization session for items that have accumulated throughout the sprint rather than a discovery session.

The third practice is a team norm of experimenting with small process changes within the sprint without waiting for the retrospective to sanction them. I encourage teams to adopt a try it for a week mindset for low-risk process experiments. A team member who thinks the daily standup would be more effective at 9am instead of 10am suggests trying it for a week. The team agrees or disagrees and moves on. If it works, they keep it. If it does not, they revert. This creates a culture where improvement is everyone's responsibility, not just the Scrum Master's.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Continuous improvement culture, team coaching, beyond retrospective',
        commonMistakes: ['Limiting continuous improvement to retrospectives', 'Not maintaining a visible improvement backlog', 'Not empowering team members to experiment without permission'],
      },
      {
        q: "What is mob programming and when would you recommend it for a healthcare software team?",
        a: `Mob programming is a collaborative software development practice where the entire team works together on a single piece of work at the same time on a single computer. One person, the driver, writes the code while the rest of the team, the navigators, direct what the driver writes. The driver and navigator roles rotate on a short timer, typically every ten to fifteen minutes.

Mob programming is the most intensive form of knowledge sharing available to a software team. Because the entire team is working on the same problem simultaneously, knowledge is shared in real time rather than through documentation or code reviews. Questions are answered immediately, mistakes are caught as they happen, and the team's collective intelligence is applied to each problem rather than a single person's judgment.

In a healthcare software team, I would recommend mob programming in three specific situations.

The first situation is when the team is working on a high-stakes patient safety feature that has significant complexity and where the cost of a defect is high. Mob programming provides multiple layers of review in real time that reduce the probability of a defect reaching production. For a medication dosing calculator or an allergy alert system, the investment in mob programming is justified by the safety benefit.

The second situation is when the team is onboarding new members who need to learn the clinical domain and the codebase simultaneously. Mob programming dramatically accelerates onboarding because the new team member is immersed in the team's thinking, terminology, and approach from day one rather than reading documentation and trying to piece together the context independently.

The third situation is when the team is facing a problem that nobody fully understands. In healthcare software, this often happens when integrating with a legacy clinical system that has undocumented behavior. Mob programming brings the team's collective analytical capability to bear on the problem simultaneously rather than having one person struggle with it in isolation.

The main objection to mob programming is that it is inefficient because the whole team is working on one thing instead of many things. My response is that for the specific situations above, the quality and speed benefits of mob programming outweigh the apparent loss of parallelism.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Advanced Agile practices, knowledge sharing, practical recommendation',
        commonMistakes: ['Not explaining when to use mob programming vs when not to', 'Not addressing the efficiency objection', 'Not applying to the healthcare context'],
      },
      {
        q: "How do you support a Scrum team at a telecom company during a major organizational restructuring that disrupts the team composition and reporting lines?",
        a: `Organizational restructuring is one of the most disruptive events a Scrum team can face and my role during the restructuring is to provide stability and clarity while the organizational uncertainty is being resolved.

My first priority is to maintain the team's sprint rhythm. During organizational uncertainty, the temptation is to pause delivery until the new structure is clear. I resist this strongly. Continuing to deliver working software in two-week increments is the most powerful demonstration that the team is stable and productive regardless of organizational change. It also gives team members a sense of purpose and continuity during a period when many things feel out of control.

My second priority is to be transparent with the team about what I know and do not know. If I know that the team will be reorganized but do not yet know the details, I say that clearly rather than allowing rumor to fill the vacuum. I also communicate clearly that the team's Scrum practices, working agreements, and sprint commitments continue unchanged until new guidance arrives from leadership.

My third priority is to advocate for the team's continuity in whatever restructuring conversations I have access to. Teams that have been working together for more than a few months have built up significant working relationships, domain knowledge, and process efficiency. Breaking them up has a real productivity cost that is often underestimated in restructuring planning. I quantify this cost for the leaders making the restructuring decisions. A team that has been together for eighteen months and is delivering consistently will lose six to nine months of productivity through the disruption and ramp-up period if it is disbanded and reformed.

If the restructuring results in team membership changes, I facilitate a deliberate team formation session with the new composition. New working agreements, updated Definition of Done, and explicit team health conversations at the start of the new team's first sprint help the reformed team establish its identity and working culture as quickly as possible.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Organizational change, team stability, advocacy skills',
        commonMistakes: ['Allowing delivery to pause during restructuring', 'Not being transparent with the team about what is known', 'Not advocating for team continuity in restructuring decisions'],
      },
    ],
  },
  'Senior Scrum Master': {
    behavioral: [
      {
        q: "You are a Senior Scrum Master at a fintech company. The organization is planning to offshore half of the development team to a different time zone. How do you prepare the Scrum team for this transition?",
        a: `Offshoring half of a development team to a different time zone is a significant disruption that requires deliberate preparation to maintain team effectiveness. The greatest risk is that the offshore team becomes a separate entity that receives instructions and delivers work in isolation rather than being an integrated part of the Scrum team.

My preparation starts three to four sprints before the offshoring begins, not one sprint before. The preparation work itself is significant and needs time.

The first preparation activity is knowledge documentation. I work with the team to identify and document the institutional knowledge that currently lives in people's heads: the rationale for architectural decisions, the quirks of the legacy payment systems, the regulatory interpretation decisions that were made and why, and the working agreements that have evolved organically. This documentation does not need to be comprehensive. It needs to cover the information that a new team member would need to be effective in their first few sprints.

The second preparation activity is establishing communication protocols before they are needed. The offshore team and the onshore team need to agree on: the primary communication channel, the expected response time for different types of messages, the schedule for synchronous collaboration given the time zone difference, and the protocol for handling urgent issues that arise outside of overlap hours. I facilitate this conversation with both teams present so the agreements are co-created rather than imposed.

The third preparation activity is redesigning the Scrum ceremonies to work across time zones. The Daily Scrum moves to a time within the overlap window, typically thirty to sixty minutes per day depending on the time zones. The sprint planning and retrospective sessions are scheduled during the overlap period. The sprint review is recorded for team members who cannot attend live.

The fourth activity is establishing a buddy system for the first three sprints of the distributed arrangement. Each offshore team member is paired with an onshore team member who is their primary contact for questions, context, and support during the transition.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Distributed team management, change preparation, communication protocols',
        commonMistakes: ['Starting preparation too late', 'Not redesigning ceremonies for the time zone difference', 'Not establishing communication protocols before they are needed'],
      },
      {
        q: "How do you measure and improve psychological safety in a Scrum team at a healthcare company where clinical staff are reluctant to question doctors' technical decisions?",
        a: `Psychological safety in a healthcare technology team that includes clinical staff working alongside doctors is genuinely difficult because the professional hierarchy in clinical settings is deeply embedded. Nurses, pharmacists, and clinical informatics staff who have been trained to defer to physicians do not automatically shift to a peer relationship when they join a software development team that includes physician stakeholders.

My first step is to make psychological safety a team conversation topic rather than something I address only through facilitation techniques. I introduce the concept in a team session and I name the specific dynamic: in clinical settings, there are good reasons for professional hierarchy. In software development, the best ideas come from everyone on the team regardless of clinical seniority, and the most dangerous quality failures often happen when team members do not feel safe raising concerns. I ask the team to discuss this openly and to agree that the Scrum team operates with different norms than the clinical environment.

For measurement, I use Amy Edmondson's psychological safety survey, which I adapt slightly for the healthcare technology context. I ask team members to rate statements like: in this team, it is safe to take a risk and make a mistake; team members raise concerns about patient safety without fear of negative consequences; if I make a mistake on this project, it will be held against me. I run this survey anonymously every two to three months and share the aggregate results with the team. Tracking the score over time gives both the team and me visibility into whether safety is improving or declining.

For improvement, I use facilitation techniques that structurally create space for all voices. Anonymous idea generation before group discussion prevents the first speaker's opinion from anchoring the room. Round-robin responses to retrospective questions ensure everyone speaks before discussion begins. And explicit appreciation for raising concerns, modeled consistently by me in every ceremony, gradually shifts the team norm toward valuing the person who surfaces a risk rather than viewing them as a troublemaker.

The most powerful lever for psychological safety, however, is the behavior of the most senior person in the room. I work directly with physician stakeholders and technical leads on the team to help them model the behavior that creates safety: acknowledging uncertainty, inviting dissent, and thanking team members for raising concerns even when those concerns are inconvenient.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Psychological safety, measurement, healthcare hierarchy dynamics',
        commonMistakes: ['Using facilitation techniques without addressing the clinical hierarchy dynamic', 'Not measuring psychological safety explicitly', 'Not coaching senior stakeholders on their impact'],
      },
      {
        q: "How do you handle a situation where a Product Owner at a bank consistently prioritizes new features over fixing known defects, resulting in growing technical debt and user complaints?",
        a: `A Product Owner who consistently prioritizes features over defects is making a business trade-off that has real consequences for users and for the team's long-term delivery capacity. My role is not to override the Product Owner's prioritization authority but to ensure the decision is being made with full information about the consequences.

My first step is to make the defect picture visible to the Product Owner in business terms rather than technical terms. Most Product Owners who deprioritize defects are looking at a list of bug tickets with technical descriptions that do not communicate business impact. I work with the team to translate each defect into its business impact: how many users are affected, what is the workaround cost in customer support time, what is the revenue at risk if the defect causes a customer to abandon a transaction, and what is the regulatory risk if the defect represents a compliance gap. When defects are expressed in these terms, the prioritization conversation changes.

My second step is to propose a defect budget. I work with the Product Owner to agree that a percentage of each sprint, typically fifteen to twenty percent, is allocated to defect remediation. This is not negotiable in the prioritization conversation. The remaining capacity is available for new features. The specific defects addressed within the budget are selected by the team based on business impact and technical risk. This approach gives the Product Owner feature delivery predictability while ensuring defects are addressed systematically.

My third step is to introduce a technical debt impact metric. I track the relationship between the volume of outstanding defects and the team's velocity over time. In most software systems, as defect volume grows, velocity declines because more team time is consumed by workarounds, support escalations, and cascading failures. When I can show the Product Owner a clear correlation between defect accumulation and velocity decline, the business case for defect remediation becomes compelling.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Defect management, Product Owner coaching, technical debt',
        commonMistakes: ['Presenting defects in technical terms rather than business terms', 'Not proposing a defect budget', 'Not connecting defect accumulation to velocity decline'],
      },
      {
        q: "You are a Senior Scrum Master at a telecom company. How do you facilitate the transition from annual planning to continuous planning using a rolling wave approach?",
        a: `The transition from annual planning to continuous planning using a rolling wave approach is one of the most impactful changes an organization can make to its planning discipline, and it is also one of the most difficult because annual planning is deeply embedded in budget cycles, headcount planning, and organizational governance.

Rolling wave planning is based on the principle that we plan in detail for the near term and at a higher level for the longer term. In a telecom context, this means the team has detailed sprint-level plans for the next two to three sprints, a higher-level quarterly roadmap for the next three months, and strategic themes rather than detailed plans for the six to twelve month horizon. As time passes, the detailed plan rolls forward and the higher-level plan is refined based on what has been learned.

My approach to facilitating this transition starts with making the cost of annual planning visible. I work with the leadership team to calculate how much time the organization spends on annual planning and how accurate those plans turn out to be at month twelve. In my experience, detailed annual plans in telecom are accurate to within twenty to thirty percent on scope, fifty percent on timeline, and significantly off on priority because the regulatory environment, competitive landscape, and technology change faster than annual plans account for.

The rolling wave alternative I propose maintains the structure that the organization needs for budget and headcount planning, which typically requires a twelve-month view, while giving the teams the flexibility to respond to change within the year. I help leadership design a quarterly replan cadence where the team reviews the twelve-month outlook, updates it based on what they have learned in the past quarter, and commits in detail to only the next quarter's work.

The key stakeholder management challenge is helping executive leaders become comfortable with less detailed long-range plans. I address this by framing the change not as less planning but as more accurate planning. A rolling quarterly commitment that is met consistently is more valuable than an annual commitment that is constantly revised.`,
        tracks: ['Agile', 'Scrum', 'SAFe'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Planning evolution, organizational change, rolling wave concept',
        commonMistakes: ['Not acknowledging the organizational constraints around annual planning', 'Not maintaining the twelve-month view for budget purposes', 'Not making the cost of annual planning visible'],
      },
      {
        q: "How do you help a Scrum team at a fintech company recover from a failed sprint where the team missed the sprint goal and team morale is low?",
        a: `A failed sprint followed by low team morale is a situation that requires both practical recovery and emotional acknowledgment. Jumping straight into planning the next sprint without addressing what happened and how the team is feeling is a mistake that compounds the morale problem.

My first priority is to facilitate a retrospective that is explicitly about the failed sprint, not the usual retrospective format. I open the retrospective by naming the situation directly: we did not meet our sprint goal last sprint and I want to understand what happened and make sure we learn from it. I frame this as a learning conversation, not a post-mortem on failure. The distinction matters because teams in low morale are already being hard on themselves. The retrospective should be energizing, not further deflating.

In the retrospective, I use a root cause analysis approach. We work backward from the missed sprint goal: what specific stories were not completed, what prevented them from being completed, and what conditions created those blockers. The analysis almost always reveals a combination of factors: overcommitment, hidden complexity that emerged during development, external dependencies that materialized as blockers, or scope changes that arrived during the sprint. Identifying the specific causes is important because it converts a vague sense of failure into addressable problems.

For the team's morale, I acknowledge the difficulty directly. Missing a sprint goal is frustrating. It is also normal. Teams with good Scrum practices will miss their sprint goal occasionally because they take on meaningful challenges. A team that never misses a sprint goal is a team that is undercommitting. I share this perspective explicitly because teams often feel more shame about sprint failures than is warranted.

For the next sprint planning, I focus on two things: a sprint goal that is genuinely achievable given the lessons from the previous sprint, and explicit capacity planning that accounts for the factors that contributed to the previous sprint's failure. If unplanned work derailed the previous sprint, we build in a buffer. If a dependency was not resolved in time, we confirm the dependency is resolved before committing to the dependent story.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Sprint recovery, team morale, root cause retrospective',
        commonMistakes: ['Skipping the retrospective and moving straight to replanning', 'Not acknowledging the emotional impact of the failed sprint', 'Not addressing the root cause to prevent recurrence'],
      },
    ],
  },
  'Agile Coach': {
    behavioral: [
      {
        q: "You are an Agile Coach at a bank. The HR team wants to introduce individual performance metrics for developers based on their story point velocity. How do you respond?",
        a: `Individual performance metrics based on story point velocity for developers is one of the most destructive things an organization can do to its Agile teams and I respond to this proposal directly and with evidence.

I request a meeting with the HR team and the relevant engineering leadership to discuss the proposal. In that meeting I make the following case.

Story points are a team metric, not an individual metric. They measure the team's collective output in a sprint. When a developer pairs with a less experienced colleague on a complex story, they are producing less output individually but generating more team capability. When a developer focuses on removing an architectural blocker that unblocks five stories for others, they may personally close zero stories in a sprint but contribute enormous value to the team. Individual velocity metrics would penalize both behaviors.

I then explain what happens when individual velocity becomes a performance metric. Developers stop pairing because it reduces their personal story count. Developers stop helping colleagues because it diverts time from their own stories. Developers start breaking stories into smaller pieces to maximize their story count. Developers stop picking up complex or ambiguous stories because they carry too much velocity risk. Each of these behaviors directly reduces team effectiveness and product quality.

I provide alternative metrics that capture individual developer contribution without these destructive effects. Code review quality and timeliness, mentoring impact on junior developers, technical debt reduction contributions, and peer feedback on collaboration are all legitimate inputs to individual performance assessment that do not create the perverse incentives of individual velocity tracking.

I also propose a team-level performance framework as the primary performance mechanism for developers. Teams are evaluated on their sprint goal achievement rate, defect escape rate, deployment frequency, and lead time. Individual contribution is assessed through peer review, not through individual story point tracking.

If after this conversation the HR team still wants to proceed with individual velocity metrics, I escalate to the CTO with a written analysis of the expected impact on team performance.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Metrics governance, organizational influence, Agile values',
        commonMistakes: ['Not pushing back on individual velocity metrics', 'Not providing alternative metrics', 'Not escalating if the push back is not accepted'],
      },
      {
        q: "How do you design and facilitate a Program Increment Planning event for a telecom organization running five Scrum teams?",
        a: `Program Increment Planning, or PI Planning, is the flagship event in SAFe where all teams in an Agile Release Train align on a shared vision, identify cross-team dependencies, and commit to a set of objectives for the next eight to twelve week program increment. For a telecom organization running five Scrum teams, PI Planning is a two-day event that typically involves fifty to one hundred people.

My preparation for PI Planning starts six weeks before the event, not two weeks before. Six weeks is necessary to prepare the backlog to the level of readiness that allows teams to plan in detail during the event.

The preparation work has four components. First, the product management team prepares a vision and roadmap presentation that gives all teams the business context for the PI. In a telecom context, this includes the market requirements, regulatory commitments, and strategic priorities that will shape the PI objectives. Second, the architecture team prepares an architectural runway presentation that describes the technical foundation the teams will build on. Third, each team's Product Owner prepares their team backlog to a state where the top two to three sprints of work are in a ready state. Fourth, the business owners prepare a business context presentation that communicates the organizational priorities and constraints.

The PI Planning event itself follows a specific structure. Day one includes the vision and architecture presentations in the morning, followed by team breakout sessions in the afternoon where each team plans their first sprint in detail. Day two includes team plan reviews where each team presents their draft PI objectives and identifies dependencies, followed by problem-solving sessions for identified risks and dependencies, followed by final plan approval and commitment.

As the facilitating Agile Coach, my specific role during the event is to manage the overall flow, facilitate the dependency management conversations between teams, facilitate the risk identification and ROAM session, and keep the energy high in a two-day planning event that can easily become exhausting.

After PI Planning, I capture all commitments, dependencies, and risks in a program board that remains visible to all teams throughout the PI as the primary coordination artifact.`,
        tracks: ['Agile', 'SAFe'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'SAFe knowledge, large-scale facilitation, PI Planning depth',
        commonMistakes: ['Not starting preparation early enough', 'Not involving all roles in preparation', 'Not capturing dependencies and risks in a visible program board'],
      },
      {
        q: "How do you handle an Agile transformation that is losing momentum after the initial excitement has faded at a healthcare organization?",
        a: `An Agile transformation that is losing momentum after the initial excitement has faded is a common pattern and it has a common cause: the transformation was launched as an initiative with a defined start and end rather than as a continuous organizational development journey.

My first step is to diagnose where the momentum loss is occurring. Is it at the team level, where teams have stopped doing retrospectives rigorously or have reverted to old working patterns? Is it at the management level, where leaders have stopped modeling Agile behaviors or have re-introduced command-and-control decision making? Or is it at the organizational level, where governance processes, budget cycles, and metrics still reflect the old way of working and are constraining the teams?

I conduct a series of conversations across all three levels to understand the specific experience of momentum loss. What I am listening for is the gap between the narrative of transformation, which is usually still positive, and the actual experience of teams working day to day, which is often more honest about what has stalled.

For teams that have lost momentum, I recommend a reset rather than a continuation. I facilitate a team session that revisits the team's original motivations for adopting Agile, reviews what has changed in how they work, and creates a fresh set of working agreements and improvement commitments. A reset session acknowledges that the initial enthusiasm was not sustainable indefinitely while creating a new foundation for sustained practice.

For management momentum loss, I work with leaders to identify two or three specific behaviors they will model consistently: attending sprint reviews, removing impediments quickly, and protecting teams from ad-hoc interruptions. Behavior change at the management level has more impact on team Agile practice than any number of coaching sessions with the teams themselves.

For organizational constraints that are blocking the transformation, I help leadership prioritize the two or three highest-impact changes to make in the next quarter. Trying to change everything simultaneously is what creates the unsustainable early surge followed by exhaustion. A focused, sequenced approach to organizational change is what sustains momentum over years rather than months.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Transformation sustainability, organizational change, multi-level diagnosis',
        commonMistakes: ['Trying to restart the transformation with another wave of training', 'Not diagnosing which level the momentum loss is occurring at', 'Not addressing organizational constraints alongside team-level practices'],
      },
      {
        q: "You are an Agile Coach. How do you help a Scrum team that has just adopted Agile understand the difference between being busy and being productive?",
        a: `Teams that have just adopted Agile sometimes discover that being busy, which they were very good at in their previous ways of working, and being productive in the Agile sense are not the same thing. The distinction is important and worth making explicit because busyness without productivity is one of the most common failure modes in early Agile adoption.

The difference is this: being busy means having a full calendar, many work-in-progress items, and constant activity. Being productive in Agile terms means regularly delivering working software that users can actually use. A team can be fully occupied for two weeks and deliver nothing that a user can interact with if the work-in-progress is large, the stories are not vertically sliced, or the definition of done is not enforced.

I introduce this concept by asking the team a simple question at the end of their first or second sprint: if every user account was deleted today and the team had to demonstrate to an investor what they built in the last two weeks, what would they show? In teams that are busy but not productive, the honest answer is often: we would show a database schema, some API endpoints without a frontend, or a UI without backend integration. These are not valuable to a user in isolation.

I then introduce the concept of a potentially shippable increment. At the end of every sprint, the team should be able to ship what they built to a real user. Not necessarily to all users, not necessarily with all features, but to someone who could use it. This standard redirects the team's focus from completing tasks to delivering value.

In a practical sense, this means teams need to learn to slice their stories vertically rather than horizontally. Instead of one team building all the data models, another building all the APIs, and a third building all the UI in separate sprints, each sprint delivers a thin vertical slice of functionality that includes data, API, and UI, even if it covers only one user scenario. This approach produces something demonstrable at the end of every sprint rather than something complete only when all horizontal layers are assembled at the end.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'general',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Value delivery mindset, vertical slicing, early Agile coaching',
        commonMistakes: ['Not making the busy vs productive distinction explicit', 'Not introducing the potentially shippable increment concept', 'Not connecting to vertical slicing as the practical solution'],
      },
      {
        q: "How do you coach a Scrum Master who is too task-oriented and focuses on managing the sprint board rather than coaching the team?",
        a: `A Scrum Master who is too task-oriented is a very common pattern, particularly in Scrum Masters who came from project management backgrounds or who were promoted from developer roles. They understand the mechanics of Scrum and they are good at keeping the sprint board updated, tracking velocity, and organizing ceremonies, but they have not yet made the shift from managing the work to developing the team.

My coaching approach with this type of Scrum Master focuses on three shifts.

The first shift is from tracking to observing. I ask them to spend one sprint making two lists: what they did as a Scrum Master and what they noticed about the team that they did not act on. The second list is always longer than they expected and it reveals the coaching opportunities they are missing because they are focused on the board. A team member who seems disengaged, a developer who is always the last to speak in planning, a pair of team members who stop talking when a third person joins their conversation: these are coaching signals that a task-oriented Scrum Master filters out because they are not on the sprint board.

The second shift is from solving to questioning. I introduce the coaching distinction between a Scrum Master who solves impediments for the team and a Scrum Master who helps the team solve their own impediments. I give them a specific practice: for the next sprint, every time they feel the urge to solve a problem for the team, they ask a question instead. What do you think would help here? What have we tried before? Who in the team has experience with this? This practice is uncomfortable at first but it builds the team's problem-solving capability rather than the Scrum Master's problem-solving reputation.

The third shift is from ceremony management to team development. I work with the Scrum Master to set a personal development goal that is explicitly about team dynamics rather than process mechanics. For example: by the end of this quarter, every team member will have facilitated at least one retrospective activity. This goal shifts their focus from running ceremonies themselves to developing the team's facilitation capability.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'general',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Coaching Scrum Masters, role development, task vs coaching orientation',
        commonMistakes: ['Telling the Scrum Master to coach more without showing them how', 'Not addressing the underlying orientation shift', 'Not giving specific practices to change behavior'],
      },
      {
        q: "What is the difference between an Agile Coach and a Scrum Master, and when does an organization need each?",
        a: `An Agile Coach and a Scrum Master serve different levels of the organization and work at different scales. Understanding the distinction helps organizations invest in the right capability at the right level.

A Scrum Master is a team-level practitioner. They serve a single Scrum team, or occasionally two to three teams in a senior capacity. Their primary focus is ensuring the team is practicing Scrum effectively: facilitating ceremonies, removing impediments, coaching the team on Scrum values and principles, and helping the Product Owner manage the backlog. The Scrum Master's domain is the team and its immediate environment.

An Agile Coach operates at the program or organizational level. They work with multiple teams, with middle management, and with senior leadership. Their focus is on organizational change: designing the conditions that enable teams to be effective, coaching leaders on Agile leadership behaviors, designing governance and funding models that support Agile delivery, and measuring the organizational health of the transformation. The Agile Coach's domain is the system of work that the teams operate within.

An organization needs a Scrum Master when it has a Scrum team that needs facilitation, coaching, and impediment removal at the team level. This is a relatively modest investment that almost any team doing Scrum should have.

An organization needs an Agile Coach when it is undertaking a transformation that requires changing how the organization makes decisions, funds work, measures performance, and manages people. These changes cannot be made at the team level. They require someone with the organizational access, the change management skills, and the business credibility to influence senior leadership. An Agile Coach without organizational access and leadership credibility is just a very expensive Scrum Master.

The most common mistake organizations make is hiring Agile Coaches but asking them to do Scrum Master work. This is like hiring a management consultant to run status meetings. The investment does not match the activity.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'general',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Role distinction, organizational understanding, investment guidance',
        commonMistakes: ['Not clearly distinguishing the levels of impact', 'Not explaining when each is needed', 'Not addressing the common mistake of misusing Agile Coaches'],
      },
      {
        q: "You are an Agile Coach at a fintech company. The engineering team wants to move to continuous deployment but the risk and compliance team is insisting on a monthly release window. How do you broker this negotiation?",
        a: `The tension between engineering's desire for continuous deployment and risk and compliance's insistence on a monthly release window is a real and legitimate conflict in fintech. Both sides have valid concerns and my role as an Agile Coach is to help them find a solution that meets both sets of concerns rather than declaring a winner.

The engineering team's concern is valid: monthly release windows create a month of accumulated changes in each release, which means higher risk per release, longer time to fix production defects, and slower feedback from users. Paradoxically, monthly releases often create more risk than continuous deployment, not less.

The risk and compliance team's concern is also valid: each release to production carries regulatory risk if inadequately tested or documented, and monthly windows allow for thorough review and sign-off before changes reach customers.

I facilitate a working session that brings both teams together to design a release model that serves both concerns. The key insight I introduce is that the risk and compliance team's actual concern is about unreviewed changes reaching production, not about release frequency per se. If every change goes through a defined review process before production, the frequency of deployment is not the risk variable. The adequacy of the review process is.

I propose a pre-approved change model. Together with the risk and compliance team, we define categories of changes that can be deployed continuously because they carry low risk and pass defined automated quality gates: code changes with full automated test coverage, infrastructure changes within defined parameters, and configuration changes that have been reviewed and approved in advance. These changes can deploy to production at any frequency without triggering the monthly release window process.

Higher-risk changes, such as changes to core payment processing logic, new product launches, or changes to customer data handling, continue to go through the monthly release window with full review and sign-off.

This model gives engineering the ability to deploy frequently for low-risk changes while giving risk and compliance the oversight they need for high-risk changes.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Negotiation, CI/CD advocacy, regulatory adaptation',
        commonMistakes: ['Taking sides rather than facilitating', 'Not proposing a risk-tiered deployment model', 'Not reframing the risk concern as about review adequacy rather than frequency'],
      },
    ],
  },
};
