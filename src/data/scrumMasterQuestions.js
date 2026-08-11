export const SCRUMMASTER_LEVELS = [
  'Scrum Master',
  'Senior Scrum Master',
  'Agile Coach',
];

export const scrumMasterQuestions = {
  'Scrum Master': {
    behavioral: [
      {
        q: "You are a Scrum Master at a telecom company. Your development team consistently fails to complete all sprint commitments. The team blames unclear requirements. Product Owner blames the team for underestimating. How do you resolve this?",
        a: `Before I take any side in this conversation I want to understand what the data actually says. How many sprints in a row has this happened? What percentage of the committed story points is the team delivering? Is the shortfall consistent across story types or concentrated in specific work like integration stories or regulatory compliance items that telecom products often carry?

In my experience, when a team and a Product Owner are pointing at each other, both are usually partially right and neither is seeing the full picture. My job as Scrum Master is to make the systemic problem visible so neither person feels blamed.

The first thing I do is facilitate a proper sprint retrospective that goes deeper than the usual format. I use a technique called the five whys specifically on the incomplete items. We did not finish the API integration story. Why? Because the telecom network team did not provide the test environment credentials on time. Why? Because the dependency was not captured in the definition of ready. Why? Because our definition of ready does not include external dependencies. That chain of whys usually surfaces a process gap rather than a people gap.

In parallel I work with the Product Owner to improve the definition of ready. In telecom products, stories often have hidden dependencies on network provisioning, regulatory approvals, or vendor APIs that are not visible until a developer actually starts the work. I introduce a dependency mapping step in backlog refinement so external dependencies are identified and resolved before a story enters a sprint.

On estimation I introduce reference stories. The team picks three to five completed stories that represent different sizes of work and uses them as calibration anchors for every future estimate. Telecom integration work is notoriously hard to estimate in isolation. Calibrated reference points reduce the variance.

I also track sprint velocity for three to four consecutive sprints and use that data to have an honest conversation with the Product Owner about what the team can realistically commit to. If the team is delivering 60 story points consistently, committing 80 every sprint is a planning failure, not a team failure.

The measure of success for me is not that every story gets completed every sprint. It is that the team and Product Owner develop a shared understanding of what realistic commitment looks like and that incomplete items have clear explanations rooted in process rather than blame.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Conflict resolution, sprint planning, stakeholder management',
        commonMistakes: ['Taking sides without data', 'Focusing on blame rather than process', 'Not addressing the root cause'],
      },
      {
        q: "You are a Scrum Master at a fintech. During sprint planning, a senior developer dominates the conversation and the junior team members never speak. How do you handle this?",
        a: `This is a team health problem that will eventually become a delivery problem. When junior team members do not contribute to planning, you end up with stories that only one person truly understands, single points of failure in execution, and a team that does not build collective ownership of the sprint.

I address this in two ways: in the room and outside the room.

Outside the room I have a one on one conversation with the senior developer. Not a confrontational one, a curious one. I ask them how they feel the planning sessions are going. In my experience senior developers who dominate planning are not usually trying to silence others. They are anxious about estimation quality, they want to move fast, or they have been burned before by missing commitments. Understanding their motivation tells me how to help them channel their energy differently.

I also have individual conversations with the junior team members before the next planning session. I ask them what would make it easier to contribute their perspective. Sometimes they have the answers but do not feel the room is safe enough to offer them. Sometimes they genuinely need a moment to prepare before speaking.

In the room I introduce structured turn-taking for estimation. I use planning poker with a specific rule: everyone submits their estimate simultaneously and nobody speaks until all cards are revealed. This forces the senior developer's opinion out of the room during the estimation moment. If there is a wide variance in estimates, I explicitly ask the person with the lowest estimate to speak first, then the person with the highest, so the junior members have space before the senior voice frames the conversation.

I also use a technique called round robin for story breakdown. I go around the room and ask each person what questions they have about the story before we estimate. This makes it normal for everyone to contribute and makes it harder for any one person to fill all the airspace.

In fintech, where regulatory and compliance complexity often sits in unexpected places, the junior team member who worked on a similar integration last quarter may have the most relevant insight in the room. Losing that insight because they did not feel safe to offer it is a real delivery risk.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Team dynamics, facilitation skills, psychological safety',
        commonMistakes: ['Publicly calling out the senior developer', 'Ignoring the problem hoping it resolves', 'Not addressing the root cause of junior silence'],
      },
      {
        q: "Explain the difference between a Scrum Master and a Project Manager. Why would a fintech company choose one over the other?",
        a: `The difference is fundamental and getting it wrong creates organizational problems that are hard to untangle later.

A Project Manager operates in a plan-driven world. They own the plan, track against it, manage resources, report status, and are accountable for delivery against scope, schedule, and budget. The authority structure is hierarchical. The PM tells the team what to work on and holds them accountable for completing it. In traditional fintech environments, particularly large banks and legacy financial institutions, this model works well because the work is well-defined, compliance requirements are known in advance, and the cost of deviation from the plan is high.

A Scrum Master operates in an empirical world. They do not own the plan. They own the process. Their job is to remove impediments, facilitate the Scrum ceremonies, protect the team from external interference, and coach the organization toward greater agility. The authority structure is servant leadership. The Scrum Master influences without controlling. The team owns their commitments.

The distinction matters most when the work is uncertain. In a fintech startup building a new payments product, the requirements evolve based on user feedback, regulatory changes, and competitor moves. A Project Manager in that environment becomes a bottleneck because every change requires replanning and re-approval. A Scrum Master in that environment creates the conditions for the team to respond to change quickly without losing accountability.

In a large fintech with regulatory compliance work, the answer is more nuanced. Compliance projects often have fixed scope, fixed deadlines, and fixed budgets driven by regulatory mandates. Those projects often benefit from project management discipline alongside agile practices. The most effective fintech organizations I have seen use Scrum Masters for product development squads and Project Managers for regulatory and infrastructure programs, with Agile Coaches helping bridge the two worlds.

The mistake I see most often is fintech companies hiring a Scrum Master and expecting them to behave like a Project Manager, then being frustrated when the Scrum Master refuses to create Gantt charts and track individual developer productivity. These are genuinely different roles with different philosophies and expecting one person to do both usually means neither is done well.`,
        tracks: ['Agile', 'Scrum', 'Traditional Waterfall'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Role clarity, Agile knowledge, organizational understanding',
        commonMistakes: ['Confusing the two roles', 'Not acknowledging when each is appropriate', 'Being dogmatic about Agile without considering context'],
      },
      {
        q: "You are a Scrum Master at a telecom company. The business stakeholders keep attending the Daily Scrum and interrupting the team with questions and new requests. How do you handle this?",
        a: `The Daily Scrum has a clear purpose and a clear audience. It is a 15-minute planning event for the development team to synchronize their work for the next 24 hours. It is not a status report for stakeholders and it is not a forum for new requests. When stakeholders treat it as either of those things, the Daily Scrum stops serving its purpose and the team starts self-censoring what they say to avoid triggering new conversations.

My first step is to understand why the stakeholders are attending. In telecom companies, where network operations, regulatory compliance, and customer SLA commitments create genuine urgency, stakeholders often attend Daily Scrums because they do not feel they have any other visibility into what is happening. The Daily Scrum attendance is a symptom of an information gap, not a power play.

So I address the information gap first. I work with the Product Owner to create a lightweight daily status communication that goes to stakeholders before the Daily Scrum starts. This can be a simple three-line message: here is what we completed yesterday, here is what is in progress today, here are the blockers we are working through. When stakeholders have this information before the Daily Scrum, they stop needing to attend to get it.

I also create a dedicated stakeholder touchpoint. In telecom, a brief biweekly sync between the Product Owner and key stakeholders where they can ask questions, raise concerns, and provide input goes a long way toward reducing the urge to interrupt the team's daily rhythm.

For the stakeholders who continue to attend despite having other channels, I have a direct conversation. I explain that their presence in the Daily Scrum is counterproductive not because their questions are unwelcome but because the Daily Scrum is the wrong forum for them. I invite them to stay for a five-minute informal conversation after the Daily Scrum ends where I will personally address their questions.

The principle I hold onto is that the Daily Scrum belongs to the team. My job as Scrum Master is to protect that space while finding legitimate ways to give stakeholders the visibility they need.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Ceremony management, stakeholder management, boundary setting',
        commonMistakes: ['Banning stakeholders without addressing why they attend', 'Allowing the Daily Scrum to become a status meeting', 'Not creating alternative stakeholder visibility channels'],
      },
      {
        q: "What is the definition of done and why does it matter? Give an example from a telecom or fintech context.",
        a: `The definition of done is the team's shared understanding of the criteria that must be met before any increment of work can be considered complete. It is not a checklist attached to individual stories. It is a quality standard that applies to every piece of work the team delivers.

It matters because without a shared definition of done, done means something different to everyone on the team. To a developer, done might mean the code is written and the unit tests pass. To the QA engineer, done means it has passed integration testing. To the Product Owner, done means it is deployed to production and the user can access it. To the compliance officer in a fintech, done means the audit log is in place and the regulatory requirement is satisfied. When these definitions are not aligned, you end up with work that is declared done in a sprint review but is not actually ready for users, and the technical and compliance debt accumulates silently until it becomes a crisis.

In a fintech context the definition of done typically includes: code reviewed and merged to main, unit tests written and passing, integration tests passing, security scan completed with no high or critical findings, performance within defined thresholds, audit logging implemented and verified, compliance checklist signed off, product owner acceptance criteria verified, and deployed to the production environment.

In a telecom context the definition of done often includes additional elements specific to network operations: the feature works across all network types the company supports, the configuration is deployed to all required network nodes, the monitoring alert is configured for the new feature, and the operations runbook is updated so the NOC team knows how to handle incidents related to the new capability.

The power of the definition of done is that it makes quality a team responsibility rather than a QA gate at the end. When every team member knows what done looks like, they build toward it from the beginning rather than discovering gaps at the sprint review.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Easy',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Scrum fundamentals, quality mindset, domain application',
        commonMistakes: ['Confusing definition of done with acceptance criteria', 'Not including compliance and security in fintech/telecom context', 'Treating it as a checklist rather than a shared standard'],
      },
    ],
  },
  'Senior Scrum Master': {
    behavioral: [
      {
        q: "You are a Senior Scrum Master at a fintech company running multiple Scrum teams. Two teams are dependent on each other's deliverables and keep missing sprint goals because of unresolved cross-team dependencies. How do you fix this?",
        a: `Cross-team dependencies are one of the most common reasons scaled Agile initiatives fail in fintech environments. When two teams are blocked waiting for each other, neither team can deliver independently and the entire sprint rhythm breaks down.

The first thing I establish is visibility. Dependencies that are invisible cannot be managed. I introduce a dependency board that both teams maintain and review together. Every story that has a cross-team dependency is flagged with the dependent team, the nature of the dependency, and the date by which the dependency needs to be resolved for the story to remain in the sprint. This board is reviewed at the start of every sprint planning session for both teams simultaneously.

The second thing I introduce is a cross-team synchronization event. Twice a week, fifteen minutes, representatives from both teams review the dependency board together. This is different from the Daily Scrum. It is specifically about inter-team coordination and it gives both teams a regular touchpoint to surface blockers before they become sprint failures.

For recurring dependencies, I work with the Product Owners of both teams to redesign the backlog so that the team providing a dependency delivers it at least one sprint ahead of the team consuming it. This creates a buffer that absorbs the natural variability in delivery without causing the consuming team to miss their sprint goal. In fintech this often means the platform team ships an API or integration capability in sprint N and the product team builds on top of it in sprint N plus one.

If the dependency pattern is deep and structural, the right answer is often a team topology change. If two teams are consistently dependent on each other for more than thirty percent of their work, they are probably organized around the wrong boundaries. I raise this observation with the engineering leaders and help them think through whether the teams should be reorganized around value streams rather than technical layers.

The measure of success is not that dependencies disappear. In fintech, complex integrations create genuine dependencies. The measure of success is that dependencies are visible, managed proactively, and resolved before they cause sprint failures.`,
        tracks: ['Agile', 'Scrum', 'SAFe'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Scaled Agile, dependency management, organizational thinking',
        commonMistakes: ['Treating this as a people problem rather than a structural problem', 'Not creating visibility mechanisms', 'Not addressing team topology'],
      },
      {
        q: "You are a Senior Scrum Master at a telecom company. A new VP has joined and wants to replace Scrum with a Waterfall approach because she believes Scrum is too unstructured for telecom network projects. How do you respond?",
        a: `I do not respond by defending Scrum. I respond by trying to understand what problem she is trying to solve.

A new VP who wants to replace Scrum with Waterfall in a telecom environment is almost always reacting to something she has observed or experienced. Either she has seen Scrum misimplemented and associates the chaos she observed with Scrum as a methodology, or she has worked on telecom network programs where fixed scope and fixed timelines genuinely drove successful outcomes, or she is facing pressure from customers or regulators for long-range delivery commitments that she believes Scrum cannot support.

If her concern is about predictability and commitment, I show her how mature Scrum teams use velocity and capacity planning to give reliable delivery forecasts. In a telecom context, a team with twelve sprints of consistent velocity can give a ninety percent confidence interval on when a given body of work will be complete.

If her concern is that network rollout projects have genuine fixed scope requirements driven by regulatory or infrastructure timelines, I agree with her and suggest a hybrid approach. Waterfall for the program-level planning and milestone management, Scrum for the team-level execution within each phase.

What I do not do is lecture her on the Agile Manifesto or tell her that Waterfall is outdated. My job is to help her achieve her goals, and if her goals include more structure and predictability, I help her find the path to that within an Agile framework.`,
        tracks: ['Agile', 'Scrum', 'Traditional Waterfall', 'Hybrid'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Organizational change, stakeholder management, methodology flexibility',
        commonMistakes: ['Being dogmatic about Agile', 'Not listening to the VP concerns', 'Failing to acknowledge valid use cases for Waterfall in telecom'],
      },
      {
        q: "Walk me through how you would facilitate a Sprint Retrospective for a team that has become disengaged and stops raising real issues.",
        a: `A retrospective where the same surface-level feedback keeps appearing is telling me one of three things. Either the team has raised these issues before and nothing changed, or the team does not feel psychologically safe enough to raise real issues, or the retrospective format has become too routine.

For the first case, I start by reviewing action items from the last three retrospectives and asking honestly: which did we actually implement? Making the gap between intention and action visible reestablishes that the retrospective can create real change.

For the second case, I run an anonymous pre-retrospective. Team members submit observations anonymously before the meeting. I group the themes and present them without attribution. The real issues almost always appear in anonymous submissions even when they do not appear in the room.

For the third case, I change the format completely. I ask the team to write down the one thing they have never said in a retrospective but have thought about after one. Five minutes to write alone before sharing. The writing creates individual reflection that breaks group inertia.

Rebuilding faith requires demonstrating that at least one action from the retrospective leads to a visible change before the next one. I personally follow through on the highest confidence action item so the team sees the retrospective producing a tangible outcome.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'general',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Facilitation skills, psychological safety, continuous improvement',
        commonMistakes: ['Changing the format without understanding root cause', 'Not following through on action items', 'Forcing participation without creating safety'],
      },
      {
        q: "A Product Owner at your fintech company is refusing to participate in Sprint Reviews, saying she is too busy. How do you handle this?",
        a: `The Product Owner's absence from Sprint Reviews is a governance problem. Without the Product Owner in that room, the feedback loop breaks and the team starts building in a vacuum.

My first conversation with her is curious, not corrective. I ask what her week looks like and where the Sprint Review sits in her competing priorities. I want to understand whether this is a priority problem, a capacity problem, or a belief problem.

If it is a capacity problem, I escalate to her manager with a clear framing. The Product Owner is the connection between the business and the development team. If she does not have time to fulfill that role, either she needs more support or the team needs a different Product Owner. This is a structural issue leadership needs to solve.

If it is a belief problem, I show her the cost of her absence in concrete terms. The team built a feature last sprint requiring three rounds of rework because stakeholder feedback came through informal channels two weeks late. That rework cost one full sprint of capacity. Her presence in the Sprint Review is the most cost-effective way to prevent that pattern.

I also offer to redesign the Sprint Review to fit her constraints. If ninety minutes is too long, can we run forty-five minutes? I want to remove every legitimate barrier before concluding this is a will problem.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Stakeholder management, role accountability, problem solving',
        commonMistakes: ['Escalating immediately without understanding root cause', 'Accepting the absence without addressing it', 'Not offering solutions to the capacity constraint'],
      },
      {
        q: "What is velocity and how do you use it responsibly? What are the risks of misusing velocity in fintech or telecom?",
        a: `Velocity is the amount of work a team completes in a sprint measured in story points. Over multiple sprints it stabilizes into a range reflecting the team's sustainable pace.

Used responsibly, velocity is a planning tool. If a team has stable velocity of sixty story points per sprint and the backlog has three hundred story points, I can forecast the team needs approximately five sprints to complete that work.

The responsible use of velocity has three guardrails. First, it is a team measurement not an individual one. Second, it is a recent average not a commitment — I use a rolling average of the last three to five sprints. Third, it is directional not contractual. Fintech and telecom environments have external shocks — regulatory changes, network incidents, compliance audits — that affect velocity in ways the team cannot control.

The risks of misusing velocity are significant. When management treats velocity as a performance metric, teams inflate estimates to look productive. When Product Owners use velocity to set commitments rather than letting the team self-select work, accountability collapses. When velocity becomes a target, teams split stories artificially to close more items, inflating velocity without increasing throughput.

I have seen fintech organizations create bonus structures tied to team velocity. Within two sprints the estimates are meaningless. Within four sprints retrospectives stop being honest because the team is managing the metric rather than the work.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Agile metrics knowledge, responsible use of data, organizational awareness',
        commonMistakes: ['Using velocity as a performance metric', 'Treating velocity as a commitment', 'Not accounting for external factors'],
      },
      {
        q: "A critical network outage has occurred mid-sprint at your telecom company. How do you manage this without destroying the sprint?",
        a: `A critical network outage is an incident response situation and the team's first obligation is to the network, not the sprint.

My immediate response is to create space for the team to respond without feeling like they are failing at their Scrum commitments. I communicate to the Product Owner and stakeholders immediately that the team is responding to a P1 outage and the sprint goal is temporarily suspended.

For the incident response I make sure the team has what they need. Are they blocked on dependencies? Do they need someone from the vendor or network operations team who is not responding? My role is to remove impediments from the incident response the same way I remove impediments from sprint work.

For the sprint I do a quick impact assessment. Which stories are affected by the team members responding to the outage? Which can continue without those team members? I work with the Product Owner to reprioritize in real time so team members not involved in the outage continue delivering value.

Once the outage is resolved I facilitate a brief session to assess the sprint damage and make a conscious decision about remaining sprint days. Options are to reduce the sprint goal, extend the sprint, or end early and start a new one.

The retrospective includes the outage as a specific topic — not to assign blame but to capture what the team learned about responding to incidents within an Agile framework.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Incident management, sprint flexibility, prioritization under pressure',
        commonMistakes: ['Insisting on completing the sprint at expense of the incident', 'Not communicating sprint impact to stakeholders', 'Not using the incident as a learning opportunity'],
      },
      {
        q: "What is the difference between Scrum and Kanban? When would you recommend each for a fintech team?",
        a: `Scrum is a time-boxed iterative framework. Work is organized into fixed-length sprints. The team commits to a sprint goal and delivers a potentially shippable increment at the end. Scrum has defined roles: Product Owner, Scrum Master, and developers. It has defined events: Sprint Planning, Daily Scrum, Sprint Review, and Retrospective.

Kanban is a flow-based framework with no sprints. Work flows through defined stages from backlog to done and the team manages the system by limiting work in progress at each stage. Kanban is pull-based: team members pull new work when they have capacity.

For a fintech team building a new product, I recommend Scrum. The sprint cadence creates a predictable rhythm for stakeholder engagement. The sprint goal gives the team a shared objective. When the team does not yet know what good looks like, the structure of Scrum helps them learn faster.

For a fintech team doing ongoing platform operations, support work, or compliance maintenance where work arrives unpredictably, I recommend Kanban. Forcing unpredictable support work into sprint commitments creates constant sprint failures. Kanban lets the team manage throughput without the overhead of sprint ceremonies that do not fit the work pattern.

In practice the most effective fintech teams I have seen use a hybrid. They run Scrum for core product development and maintain a Kanban board for operational and support work with explicit rules about how operational work gets pulled into development team capacity.`,
        tracks: ['Agile', 'Scrum', 'Kanban'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Agile framework knowledge, situational recommendation, practical application',
        commonMistakes: ['Recommending one framework without considering context', 'Not acknowledging hybrid approaches', 'Being dogmatic about either framework'],
      },
      {
        q: "Explain the three pillars of Scrum and how they apply to a telecom network rollout.",
        a: `The three pillars of Scrum are transparency, inspection, and adaptation.

Transparency means significant aspects of the process must be visible to those responsible for the outcome. In a telecom network rollout, transparency means the sprint backlog is visible to everyone including network operations, the project sponsor, and vendor partners. The definition of done is explicit. When a vendor is two weeks late delivering test equipment and that fact is not visible to program leadership, decisions get made based on an inaccurate picture of reality.

Inspection means Scrum artifacts and progress are frequently inspected so undesirable variances can be detected. In a telecom rollout, the Sprint Review is the primary inspection event. In network rollouts, problems not inspected frequently compound. A configuration error detected in the daily scrum costs four hours to fix. The same error detected at the end of a four-week waterfall phase costs four weeks.

Adaptation means that if the process deviates outside acceptable limits, it must be adjusted as soon as possible. In a telecom rollout, adaptation might mean changing the order network nodes are commissioned because a vendor dependency slipped. Scrum does not prevent change. It creates the conditions to detect when change is needed and respond before the cost becomes prohibitive.

Together these three pillars handle the genuine uncertainty of telecom network rollouts far better than a plan that assumes perfect knowledge at the start.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Scrum theory, certification knowledge, domain application',
        commonMistakes: ['Describing pillars abstractly without applying to context', 'Confusing pillars with values', 'Not demonstrating practical understanding'],
      },
      {
        q: "You joined a fintech as Senior Scrum Master. The team has done Scrum for two years but is just going through the motions. How do you approach this?",
        a: `This is zombie Scrum — the team executes ceremonies as a compliance exercise rather than a system for continuous improvement. It is one of the harder situations to improve because the team believes they are already doing Scrum.

My first month is observation without intervention. I attend all ceremonies, take notes, and ask questions. I do not arrive with a change agenda because a new Scrum Master who immediately tries to fix everything erodes trust before it is built.

After a month I have individual conversations with each team member asking what one thing they would change if they could. The answers tell me where energy for change exists.

For the Daily Scrum I introduce one change at a time. I replace the standard three questions with a focus on the sprint goal: what did we do yesterday that moves us toward our sprint goal? What will we do today? What is preventing us from reaching it? This reframes the Daily Scrum as a goal-tracking event rather than a reporting event.

For the retrospective I tell the team I want to leave each one with one action we can implement before the next sprint. I personally track whether we implement it. When the team sees a retrospective action actually change something in their working environment, the next retrospective generates more honest input.

Change in a team doing zombie Scrum for two years takes four to six months. I do not try to accelerate it by introducing too many changes at once.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Agile coaching, team transformation, patience and strategy',
        commonMistakes: ['Trying to fix everything immediately', 'Not building trust before introducing change', 'Focusing on ceremony compliance rather than outcomes'],
      },
      {
        q: "Explain Sprint Planning in detail for a team building a 5G network feature at a telecom company.",
        a: `Sprint Planning is a time-boxed event where the Scrum Team collaborates to define what can be delivered in the upcoming sprint and how. For a two-week sprint the recommended time box is four hours.

Sprint Planning has two parts. The first answers what the team will deliver. The Product Owner presents the highest priority backlog items and explains the sprint goal. The team selects items they can complete based on recent velocity, current capacity, and complexity. The sprint goal is agreed by the entire team.

The second part answers how the team will deliver the selected items. The team breaks each item into tasks, identifies dependencies, and creates a shared understanding of the technical approach.

For a team building a 5G network feature, Sprint Planning has specific adaptations.

The definition of ready would include confirmation that relevant 3GPP specifications are accessible, that the test environment supports the specific 5G frequency bands in scope, and that vendor dependencies such as baseband unit firmware versions are confirmed available.

Capacity planning would account for on-site activities at cell tower locations or data centers not visible in a standard capacity calculation.

The dependency identification step would explicitly surface dependencies on the radio access network team, core network team, and vendor professional services team, because 5G feature delivery almost always spans multiple teams and organizations.

The sprint goal might be: by end of sprint, the network management system can successfully orchestrate a 5G slice for a single enterprise customer use case in the lab environment.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Ceremony knowledge, domain application, facilitation skills',
        commonMistakes: ['Not applying Sprint Planning to telecom context', 'Not addressing telecom-specific dependencies', 'Treating Sprint Planning as only a planning exercise'],
      },
    ],
  },
  'Agile Coach': {
    behavioral: [
      {
        q: "The CTO wants to scale Agile across 15 teams using SAFe. Half the Scrum Masters think SAFe is too heavyweight. How do you navigate this?",
        a: `The Scrum Masters' concern about SAFe being too heavyweight is not wrong. SAFe adds significant ceremony and governance overhead on top of team-level Scrum. In organizations not ready for it, SAFe can feel like bureaucracy rather than agility.

But the CTO's instinct to coordinate fifteen teams more effectively is also not wrong. At fifteen teams, informal coordination breaks down. Dependencies become invisible and priorities diverge.

My approach: help both sides see the real question is not SAFe versus not SAFe but what coordination and alignment mechanisms do we need at this scale, and which can we implement incrementally.

I facilitate a conversation between the CTO and a representative group of Scrum Masters about the specific coordination problems they are trying to solve. The answer usually involves a small number of pain points: no shared cadence for cross-team planning, no clear mechanism for managing cross-team dependencies, no way for product strategy to cascade into team-level priorities.

SAFe has solutions to all of these. The question is whether you need all of SAFe or just the specific elements that address your specific problems.

My recommendation to the CTO: start with Essential SAFe, the minimum viable implementation. Run one Program Increment with three to four teams and invest heavily in coaching. Evaluate before rolling out to all fifteen teams.

My message to skeptical Scrum Masters: your concerns are valid but you need to propose an alternative for cross-team coordination that addresses the CTO's legitimate problem. Saying SAFe is too heavyweight without proposing a lighter-weight alternative leaves the CTO with no option but the full framework.`,
        tracks: ['Agile', 'SAFe', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Scaled Agile, organizational change, stakeholder management',
        commonMistakes: ['Taking sides without understanding the full picture', 'Recommending full SAFe without assessing readiness', 'Not proposing an incremental approach'],
      },
      {
        q: "How would you measure the maturity of a Scrum team at a telecom company? What metrics would you use and what would you avoid?",
        a: `Measuring Agile maturity is one of the areas where coaches do the most damage when they get it wrong. The wrong metrics create perverse incentives.

The metrics I use fall into two categories: outcome metrics and health indicators.

Outcome metrics tell me whether the team is delivering value. The primary one is whether the team ships working software at the end of every sprint that could actually be used by a customer. In telecom this might mean a network feature that passes all acceptance tests and is ready for production deployment. The frequency with which the team achieves this is more telling than any process metric.

I also look at whether the backlog reflects real business value, whether velocity is stable over time rather than wildly variable, and whether time from backlog creation to production deployment is decreasing.

Health indicators tell me about conditions that produce good outcomes over time. Psychological safety is the most important. Retrospective action completion rate tells me whether the team is actually improving. Sprint commitment completion rate tells me whether the team has a healthy relationship with estimation.

What I avoid: individual story point output per developer, which creates competition where there should be collaboration. Velocity growth as a positive metric, because velocity should stabilize not grow indefinitely. Number of ceremonies completed, because doing all ceremonies poorly is worse than doing fewer well. Any metric management has attached compensation to, because these immediately become games.

In telecom specifically I also look at whether the team has a handle on technical debt and operational burden. A team spending thirty percent of every sprint on production incidents has a maturity problem no process metric will capture.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Agile measurement, coaching maturity, avoiding vanity metrics',
        commonMistakes: ['Using velocity as primary maturity metric', 'Measuring ceremony compliance rather than outcomes', 'Not distinguishing outcome metrics from health indicators'],
      },
      {
        q: "You discover Scrum Masters across four fintech teams are spending most of their time scheduling meetings and taking notes. How do you address this systemic problem?",
        a: `What I am looking at is a systemic misunderstanding of the Scrum Master role institutionalized across four teams. This is not a problem with individual Scrum Masters. It is a problem with how the role was defined at the organizational level.

The fact that this is happening across four teams simultaneously tells me leadership communicated the Scrum Master role as an administrative support function. Someone defined the role in terms of scheduling and note-taking rather than coaching and facilitation. The Scrum Masters are doing what they were told, making this an organizational design problem before it is a people problem.

My first move is to understand how the Scrum Masters themselves understand their role. I ask each one to describe a typical week. Then I ask what they would do if administrative tasks were handled by someone else. The answers tell me whether these individuals have the coaching instincts the role requires.

My second move is to make the cost visible to engineering leaders. A Scrum Master spending thirty hours a week scheduling meetings is an expensive calendar tool. A Scrum Master spending thirty hours helping teams identify impediments, coaching Product Owners, and facilitating retrospectives that improve velocity is a force multiplier. The gap is significant in dollar terms.

My recommendation to leadership: create a team coordinator role to handle administrative work, freeing Scrum Masters to do the coaching work the role is designed for. I also work with the Scrum Masters to build a shared definition of what good coaching looks like so they have a concrete picture of what they should be doing.

The change takes three to four months because Scrum Masters need to build confidence in their coaching identity and teams need to experience the difference between administrative support and genuine coaching.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Organizational coaching, role clarity, systemic thinking',
        commonMistakes: ['Blaming Scrum Masters without addressing systemic cause', 'Not making cost visible to leadership', 'Trying to fix individuals without changing role definition'],
      },
    ],
  },
};
