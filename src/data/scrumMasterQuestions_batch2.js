export const scrumMasterQuestions_batch2 = {
  'Scrum Master': {
    behavioral: [
      {
        q: "What are the five Scrum values and how do they apply when a Scrum Master is working with a fintech team under regulatory pressure?",
        a: `The five Scrum values are commitment, focus, openness, respect, and courage. In a fintech team under regulatory pressure, each value has a specific and concrete expression.

Commitment in a fintech context means the team commits to the sprint goal knowing that regulatory deadlines are fixed but scope is negotiable. When a new RBI circular arrives mid-sprint, a committed team does not pretend they can absorb it without impact. They commit to being transparent about what the circular means for the current sprint and they commit to finding a path forward together rather than quietly letting the sprint goal slip.

Focus means the team protects their capacity for the highest value work even when the regulatory environment generates constant noise. In fintech, there is always another compliance requirement, another security audit, another vendor asking for attention. Focus means the team has agreed on a sprint goal and they defend that focus actively rather than allowing every urgent request to become a sprint interruption.

Openness means the team surfaces problems early. In a regulated environment, the instinct is often to hide problems because there is fear of regulatory or management consequence. A team living the Scrum value of openness tells the Scrum Master about the compliance gap discovered on day three of the sprint, not on day thirteen. Early openness creates options. Late openness creates crises.

Respect means the team recognizes that the compliance officer who keeps adding requirements is not the enemy. They are navigating the same regulatory environment with different expertise. Respect means the team engages with compliance as a partner rather than an obstacle.

Courage means the team is willing to say to the Product Owner that the sprint goal is not achievable given the regulatory change that arrived on day five, even though that conversation is uncomfortable. Courage in fintech also means raising a concern about a product decision that might create regulatory risk, even when leadership is excited about the feature.

The Scrum Master's role is to make these values visible and to call out when team behavior is inconsistent with them, especially when external pressure makes it tempting to compromise them.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Scrum values knowledge, domain application, coaching ability',
        commonMistakes: ['Listing values without applying them to context', 'Not demonstrating how values apply under pressure', 'Being abstract rather than specific'],
      },
      {
        q: "A Product Owner wants to cancel the current sprint at a telecom company because a major network vendor has changed their API specification. How do you handle this as a Scrum Master?",
        a: `Sprint cancellation is a legitimate tool in the Scrum framework and the Product Owner is the only person with the authority to cancel a sprint. My role as Scrum Master is not to prevent the cancellation but to ensure the decision is made with full information and that the process is followed correctly if cancellation does happen.

Before the Product Owner makes the final call, I facilitate a quick assessment with the full team. How much of the current sprint work is still valuable given the vendor API change? Are the stories that do not depend on the vendor API still worth completing? In telecom, a vendor API change often affects specific integration stories but leaves other work like UI development, test automation, or documentation unaffected. If sixty percent of the sprint work is still viable, cancellation may be premature.

I also ask the Product Owner what specifically makes the current sprint goal unachievable. If the sprint goal was to deliver a working integration with the vendor API, and the API has fundamentally changed, then yes, the sprint goal is obsolete and cancellation makes sense. If the sprint goal was broader and the vendor API was just one contributing story, the sprint goal may still be achievable with a modified scope.

If the Product Owner decides to cancel after this assessment, I facilitate the cancellation process correctly. Any completed and done stories are reviewed and accepted. Incomplete stories go back to the product backlog. The team holds a retrospective to capture what they learned. We do not simply abandon the sprint and start a new one without reflection.

In telecom, vendor API changes are a known risk. After the immediate crisis is handled, I work with the team to add vendor API stability as a definition of ready criterion for future stories that have external API dependencies.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Sprint cancellation knowledge, decision making, process adherence',
        commonMistakes: ['Preventing cancellation without assessing the full picture', 'Cancelling without reviewing completed work', 'Not holding a retrospective after cancellation'],
      },
      {
        q: "What is Product Backlog Refinement and how would you run it for a team building a digital banking platform?",
        a: `Product Backlog Refinement is the ongoing process of adding detail, estimates, and order to items in the product backlog. It is not a one-time event and it is not a Scrum ceremony with a fixed time box, although most teams schedule a regular refinement session of one to two hours per week.

The purpose of refinement is to ensure that the top of the backlog is always ready for the next sprint planning session. A story is considered ready for sprint planning when it is small enough to complete in a sprint, has clear acceptance criteria, has been estimated by the team, and has no unresolved dependencies or open questions.

For a team building a digital banking platform, I start refinement by reviewing upcoming sprint priorities with the Product Owner before the team session. In the refinement session itself I facilitate story discussion in a specific order. First, the Product Owner explains the business context and the user need. Second, the team asks clarifying questions. For banking, the compliance team member typically raises questions about regulatory requirements. Third, the team breaks the story into tasks if it is too large. A common mistake in banking product development is allowing stories that require both back end development and a regulatory approval process to sit in the same story. These need to be split. Fourth, the team estimates using their agreed method.

The output I want from each refinement session is a backlog where at least two sprints of work at the top is in a ready state. This buffer protects the team from arriving at sprint planning with stories that are not ready.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Backlog refinement knowledge, facilitation skills, domain application',
        commonMistakes: ['Treating refinement as a one-time event', 'Not involving the full team', 'Not defining what ready means for the specific domain'],
      },
      {
        q: "How do you handle a situation where a healthcare software team is under pressure to skip testing in order to meet a sprint deadline?",
        a: `In healthcare software, skipping testing is not a sprint planning decision. It is a patient safety decision. My response to this pressure is direct and unambiguous.

I start by making the stakes explicit. Healthcare software that has not been properly tested can cause patient harm. There are documented cases of medical device software errors resulting in incorrect dosing, misdiagnosis, or system failures during critical care. The sprint deadline does not change this reality.

At the same time, I recognize that the pressure to skip testing is almost never about genuine indifference to patient safety. It is usually about a delivery commitment made without adequate understanding of testing requirements, or a definition of done not enforced consistently across previous sprints, or a test environment problem creating a bottleneck nobody has addressed.

So I address the root cause. If the testing bottleneck is a test environment issue, I escalate immediately to get the environment fixed. If the testing gap is a skills issue, I work with the team to redistribute testing work across team members. If the commitment was made without understanding the testing requirements, I facilitate a conversation with the Product Owner and stakeholders about what the realistic delivery date is given the actual definition of done.

What I do not do is allow the team to redefine done to exclude testing. The definition of done for healthcare software should include unit testing, integration testing, regression testing, and in many cases clinical validation. If these were part of the definition of done when the sprint was planned, they are not optional at sprint end.

I also document the conversation. In a regulated healthcare environment, the decision to skip testing creates audit trail risk that extends beyond the immediate sprint.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Quality mindset, regulatory awareness, stakeholder management',
        commonMistakes: ['Allowing testing to be skipped under deadline pressure', 'Not addressing the root cause of the testing bottleneck', 'Not making the patient safety stakes explicit'],
      },
      {
        q: "What is the Sprint Goal and why is it important? Give an example of a good and bad Sprint Goal for a banking team.",
        a: `The Sprint Goal is a single objective that provides purpose and coherence to the sprint. It is created collaboratively during Sprint Planning and represents the team's commitment to the Product Owner. It is not a list of stories. It is a statement of what the team intends to achieve and why it matters.

The Sprint Goal is important for three reasons. First, it gives the team flexibility. If a story proves harder than expected, the team can adjust the plan while still working toward the goal. Without a Sprint Goal, any deviation from committed stories is seen as failure. With a Sprint Goal, the team can make intelligent trade-off decisions. Second, it creates alignment between the team and stakeholders. Everyone understands what the sprint is trying to achieve at a business level. Third, it guides the Daily Scrum. The question is not just what did you do yesterday but how does what you did yesterday contribute to our Sprint Goal.

A bad Sprint Goal for a banking team: complete user stories BNK-241, BNK-242, BNK-243, and BNK-244. This is not a goal. It is a list. It tells the team nothing about why the work matters and gives them no guidance for making decisions when things do not go as planned.

A good Sprint Goal for the same banking team: by end of sprint, a customer can initiate and track a domestic fund transfer through the new mobile banking interface without needing to call the branch. This goal is specific, outcome-oriented, understandable to a non-technical stakeholder, and gives the team a clear sense of what success looks like.

In banking, a well-crafted Sprint Goal also helps with regulatory communication. When a compliance team member asks what the team shipped in the last sprint, a clear Sprint Goal is a much better answer than a list of technical user stories.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Easy',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Sprint Goal knowledge, outcome orientation, domain application',
        commonMistakes: ['Confusing Sprint Goal with a list of stories', 'Creating a Sprint Goal after Sprint Planning', 'Not connecting the Sprint Goal to business value'],
      },
      {
        q: "You are a Scrum Master at a hospital software company. The clinical team insists that requirements cannot be estimated because every patient case is different. How do you address this?",
        a: `The clinical team's concern is legitimate and I do not dismiss it. Clinical software genuinely deals with variability that does not exist in most other domains. However, the inability to estimate precisely does not mean estimation is impossible or useless. Estimation in Scrum is about relative sizing and effort, not precise prediction. The question is not how long will this take but is this story bigger or smaller than the reference stories we have already completed.

I start by working with the clinical team to build a set of reference stories drawn from their own completed work. A routine patient admission workflow that they built last quarter becomes a reference point. A complex multi-system integration they completed the quarter before becomes another. These reference points give the team concrete anchors for sizing new work relative to what they have already done.

For genuinely uncertain clinical stories, I introduce the concept of a spike. A spike is a time-boxed research activity, usually one to two days, where a team member investigates the technical or clinical complexity of a story before the team commits to delivering it in a sprint. Spikes are common in healthcare software because the clinical domain often surfaces requirements that are poorly understood until someone actually digs into the clinical workflow or the HL7 or FHIR data structure.

I also work with the Product Owner to introduce range estimates for highly uncertain stories. Instead of committing to a specific number of story points, the team estimates a range: this story is somewhere between eight and twenty-one points depending on what we discover. The Product Owner then makes an informed decision about whether to include it in the sprint with that uncertainty or to invest in a spike first.

The goal is not to make clinical teams estimate perfectly. The goal is to give the team and Product Owner enough information to make good decisions about what to commit to in each sprint.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Estimation techniques, domain sensitivity, coaching ability',
        commonMistakes: ['Forcing precise estimation on genuinely uncertain work', 'Not acknowledging the validity of the clinical team concern', 'Not using spikes for high uncertainty stories'],
      },
      {
        q: "How do you facilitate a sprint review for a distributed team where some members are in Mumbai, some in Bangalore, and some in London?",
        a: `A distributed sprint review has all the same goals as a co-located one but it requires more deliberate facilitation. The risk in a distributed review is that it becomes a passive presentation where remote participants disengage and the valuable feedback loop never happens.

My preparation starts with the time zone challenge. Mumbai, Bangalore, and London have a significant time difference. I work with the team to find a slot that does not consistently disadvantage the same group. A rotating schedule where the inconvenient time moves around is fairer than always making London join at seven in the morning or Mumbai join at nine at night.

For the technology setup I establish clear standards before the sprint. Every team member uses a consistent video conferencing platform. Demos are recorded as a backup in case of connection issues. The person demoing shares their screen and tests their audio and video fifteen minutes before the review starts.

For the facilitation itself I structure the Sprint Review to actively involve all locations. I never allow the demo to run for forty-five minutes followed by a five-minute question period where remote participants feel like they are watching a webinar. Instead I pause after each demo item and explicitly invite feedback from each location. I address London directly: what questions do you have about what you just saw?

I also use collaborative tools during the review. A shared digital whiteboard where stakeholders from all locations can add feedback cards in real time makes the review feel participatory rather than passive.

After the review I send a written summary to all participants and stakeholders who could not attend. In a global team, not everyone can make every review. A clear written summary ensures the feedback and decisions from the review are accessible to everyone.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'general',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Distributed team facilitation, Sprint Review knowledge, practical problem solving',
        commonMistakes: ['Running distributed reviews like in-person presentations', 'Not addressing time zone fairness', 'Not creating mechanisms for remote participation'],
      },
      {
        q: "What is the difference between a Scrum Team being self-organizing and being autonomous? Why does this matter in a regulated banking environment?",
        a: `Self-organizing and autonomous sound similar but they mean different things and confusing them creates real problems, especially in regulated environments like banking.

A self-organizing team decides how to do the work. They determine who does what, in what order, using what technical approach. The Product Owner decides what to build and why. But within those boundaries, the development team is self-organizing. Nobody assigns tasks to individual team members. Nobody dictates the technical architecture. The team organizes around the sprint goal and figures out the best way to achieve it.

An autonomous team would decide not just how to do the work but what to do and what the goals are. True autonomy without alignment to organizational strategy is not what Scrum prescribes. Scrum teams operate within a system. They have a Product Owner who connects them to business strategy, stakeholders, and users.

This distinction matters enormously in a regulated banking environment. A self-organizing team in a bank can choose their technical approach, their testing methodology, and their internal collaboration practices. What they cannot do is decide to skip the compliance review process, choose a data architecture that violates the bank's security standards, or deprioritize regulatory requirements because they conflict with the team's preferred way of working.

I have seen Scrum teams in banking misinterpret self-organization as permission to ignore governance processes. This creates significant regulatory risk. My job as Scrum Master is to help the team understand that self-organization is about how they do the work within defined constraints, not about choosing which constraints to follow.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Scrum theory, regulatory awareness, coaching clarity',
        commonMistakes: ['Confusing self-organization with autonomy', 'Not applying the concept to regulated context', 'Not explaining the boundaries of self-organization'],
      },
      {
        q: "A team member at your fintech company comes to you privately and says the Product Owner is sharing confidential sprint velocity data with competitors. How do you handle this?",
        a: `This is a serious allegation that goes beyond the Scrum Master role. Sharing confidential velocity data with competitors is potentially a legal and compliance matter, not just a team dynamics issue.

My first response is to listen carefully and ask clarifying questions without leading the conversation. What exactly did the team member observe? How did they come to know that the data was shared with competitors? Is this a direct observation, something they overheard, or something they were told by someone else? The specificity of the information will shape how I proceed.

I make clear to the team member that I hear them, I take this seriously, and I will handle it appropriately. I also make clear that I cannot keep this confidential if it rises to the level of a legal or compliance issue.

My next step is not to confront the Product Owner directly. I escalate to my manager and to the compliance or legal team. In a fintech, there is almost always a compliance officer who handles exactly this type of allegation. I share what I was told and let them conduct a proper investigation.

I do not conduct my own investigation. I am not equipped to determine the legal implications of what allegedly happened, to assess the evidence, or to take disciplinary action. These are organizational and legal functions, not Scrum Master functions.

During this period I continue to facilitate the team's work normally. I do not share the allegation with other team members, I do not change my behavior toward the Product Owner in ways that signal something is wrong, and I do not allow the situation to affect the team's sprint.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Ethical handling, escalation judgment, role boundaries',
        commonMistakes: ['Confronting the Product Owner directly', 'Keeping the information confidential', 'Conducting your own investigation'],
      },
      {
        q: "How does HIPAA compliance affect how a Scrum team handles user stories and backlog items in healthcare software development?",
        a: `HIPAA compliance is not a separate workstream that runs alongside the product backlog. It is a constraint that shapes how every user story involving Protected Health Information is written, estimated, tested, and accepted.

The first place HIPAA affects the backlog is in story writing. Any user story that involves creating, reading, updating, or deleting PHI needs to include HIPAA compliance requirements as acceptance criteria. A story that says as a nurse I want to view a patient's medication history needs acceptance criteria that explicitly address who can view this data, what audit trail is created when the data is accessed, how the data is encrypted at rest and in transit, and what happens when the session times out.

The second place HIPAA affects the backlog is in the definition of done. The definition of done for any story involving PHI should include a HIPAA compliance checklist sign-off. The team cannot declare a story done without confirming that audit logging is in place, access controls are working correctly, and data handling meets HIPAA standards.

The third place HIPAA affects the team is in the test environment. HIPAA requires that test environments do not use real patient data. Setting up anonymized or synthetic test data that accurately reflects the structure of real PHI without exposing actual patient information is a significant technical task that needs to be accounted for in sprint planning.

The fourth implication is for retrospectives. Any security incident or near-miss involving PHI that occurs during a sprint, even in a test environment, should be discussed in the retrospective and the learnings should inform the definition of done going forward.

My role as Scrum Master is to ensure the team understands these constraints and has built them into their ways of working rather than treating HIPAA compliance as someone else's problem.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Regulatory knowledge, process integration, domain expertise',
        commonMistakes: ['Treating HIPAA as a separate compliance workstream', 'Not including compliance in the definition of done', 'Not addressing test data requirements'],
      },
    ],
  },
  'Senior Scrum Master': {
    behavioral: [
      {
        q: "You are a Senior Scrum Master at a bank undergoing a core banking system migration with a fixed regulatory go-live date. How do you apply Scrum in this context?",
        a: `A core banking migration with a fixed regulatory go-live date is exactly the kind of context where people assume Scrum does not apply. I disagree, but I also do not pretend that applying Scrum here is the same as applying it to a greenfield product development project.

The fixed date is a constraint, not a reason to abandon empirical thinking. Within the fixed date, there are still hundreds of decisions about what to build first, how to sequence the migration work, and how to handle the inevitable technical discoveries that emerge when migrating legacy systems with decades of undocumented complexity.

My approach is to use Scrum at the team level within a program management framework at the program level. The program has a fixed end date and a fixed scope defined by the regulatory requirement. Within that, the development teams use sprints to deliver increments of migration work, hold retrospectives to improve their process, and use sprint reviews to give the program steering committee visibility into actual progress rather than plan-based progress reports.

The most valuable thing Scrum brings to a core banking migration is empirical progress tracking. Instead of reporting percentage complete against a project plan built on pre-migration estimates, the team reports how many accounts have been successfully migrated and reconciled, how many error types they have encountered and resolved, and what their current throughput rate is. These are real numbers that give program leadership an accurate picture of whether the go-live date is achievable.

When the empirical data shows the go-live date is at risk, I surface it immediately. In a regulatory migration, finding out the date is at risk on sprint eight is much better than finding out on sprint twenty. Early transparency creates options. Late transparency creates crises.`,
        tracks: ['Agile', 'Scrum', 'Traditional Waterfall', 'Hybrid'],
        companies: [],
        difficulty: 'Hard',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Hybrid approach, empirical thinking, regulatory context',
        commonMistakes: ['Applying pure Scrum without acknowledging the fixed date constraint', 'Abandoning Scrum entirely for Waterfall', 'Not using empirical data to track actual progress'],
      },
      {
        q: "How do you handle a situation where your fintech company's legal team insists on reviewing every user story before it enters the sprint backlog, creating a three-week delay for every story?",
        a: `A three-week legal review cycle for every user story is a process design problem, not a legal requirement problem. My goal is to address the underlying concern driving the legal team's requirement while finding a more efficient path to meet it.

The first question I ask is what specifically the legal team is reviewing for. Legal teams in fintech are not reviewing user stories for the sake of it. They are trying to prevent regulatory risk, consumer protection violations, or intellectual property issues from making it into the product. Understanding the specific concern tells me how to design a more efficient review process.

If the legal team is reviewing for regulatory compliance, I work with them to identify the categories of stories that require legal review versus those that do not. A story about changing the color of a button does not carry the same regulatory risk as a story about changing how interest is calculated or displayed. I propose a triage process where the Product Owner flags stories with regulatory implications before they enter the backlog, and only those stories go to legal review.

If the legal team is concerned about the quality of story descriptions, I work with the Product Owner to improve the backlog item format so legal can make a faster assessment. A well-written story with clear acceptance criteria that explicitly addresses regulatory dimensions requires less back-and-forth than a vague story requiring ten clarifying questions.

I also propose a regular legal touchpoint rather than a story-by-story review. A weekly thirty-minute session with the legal team where the Product Owner walks through upcoming backlog priorities allows legal to flag concerns early without creating a formal review bottleneck for every story.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Process improvement, stakeholder negotiation, impediment removal',
        commonMistakes: ['Accepting the three-week delay as fixed', 'Bypassing the legal team without their agreement', 'Not understanding what the legal team is actually reviewing for'],
      },
      {
        q: "Explain the concept of technical debt and how you as a Scrum Master help a banking team manage it without derailing the product roadmap.",
        a: `Technical debt is the accumulated cost of taking shortcuts in software development. When a team chooses a quick solution instead of the right solution, they incur technical debt. Like financial debt, technical debt accrues interest. The longer it is left unaddressed, the more expensive it becomes to pay it down.

In a banking environment, technical debt has specific risk dimensions beyond the typical slowdown of development velocity. Technical debt in core financial systems can create security vulnerabilities, compliance gaps, and operational risk. A shortcut taken in the interest rate calculation module because of a deadline three years ago can become a regulatory finding or a customer harm issue today.

My role as Scrum Master in managing technical debt is not to make technical decisions about what constitutes debt or how to address it. That is an engineering responsibility. My role is to make technical debt visible, to create the conditions for the team to address it regularly, and to help the Product Owner understand the business case for allocating capacity to debt reduction.

The first thing I do is encourage the team to maintain a visible technical debt register. When a team makes a deliberate shortcut to meet a deadline, they log it: what the shortcut was, what the correct solution would have been, and what the estimated cost of not addressing it is. This register makes debt visible and creates accountability for addressing it.

The second thing I do is advocate for a regular allocation of sprint capacity to technical debt reduction. In banking teams I have worked with, allocating fifteen to twenty percent of sprint capacity to technical debt is a sustainable practice that prevents debt from accumulating to crisis levels. I help the Product Owner frame this not as engineering self-indulgence but as risk management. Unaddressed technical debt in banking systems is an operational risk item.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Technical debt understanding, business communication, risk management',
        commonMistakes: ['Ignoring technical debt as an engineering concern', 'Not making debt visible to the Product Owner', 'Not connecting debt to business risk in banking context'],
      },
      {
        q: "You are a Senior Scrum Master at a telecom company. The team's sprint velocity has been declining for three consecutive sprints. Leadership is concerned. How do you diagnose and address this?",
        a: `Declining velocity over three consecutive sprints is a signal that something has changed. My job is to understand what changed before I or leadership draws any conclusions about team performance.

I start with data, not assumptions. I pull the last six sprints of data and look at three dimensions. First, what happened to the team's capacity? Did team members take leave? Were team members pulled into other work like production incidents, compliance audits, or vendor negotiations? In telecom, production incidents are a significant and often invisible drain on sprint capacity. Second, what happened to story complexity? Did the team move from simpler feature work to more complex integration or infrastructure work? Higher complexity work legitimately produces lower velocity. Third, what changed in the team's environment? Did the test environment become unstable? Did a key team member leave?

Once I have the data, I share my findings transparently with both the team and leadership. If the velocity decline is explained by a specific cause, I name it clearly. The team delivered twenty percent fewer points this sprint because four days were consumed by a P1 network outage. The solution is not to demand higher velocity. The solution is to address the outage pattern through better incident prevention or to formally account for on-call time in capacity planning.

If the velocity decline is not explained by external factors, I facilitate a deeper retrospective focused specifically on the velocity trend. I ask the team what has changed in how they work over the last three sprints. Often the team knows exactly what has changed but has not surfaced it because they did not see it as a retrospective topic.

What I never do is allow leadership to use declining velocity as a reason to pressure the team into committing to more than they can deliver. Velocity is a measurement, not a target.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Diagnosis skills, data-driven thinking, stakeholder management',
        commonMistakes: ['Accepting the decline without diagnosing the cause', 'Allowing leadership to pressure the team', 'Not looking at capacity alongside velocity'],
      },
      {
        q: "How do you help a Scrum team navigate an AML compliance sprint at a bank where the requirements keep changing mid-sprint?",
        a: `Anti-money laundering compliance requirements that change mid-sprint are a real challenge in banking and the cause is almost always the same: the regulatory guidance from the central bank or FATF is interpreted differently by the compliance team at different points in time as they receive more clarification.

My first response is to work with the Product Owner to establish a stability agreement for sprint commitments. Once a story enters the sprint backlog and the sprint begins, the compliance requirements for that story should be locked unless there is a genuine regulatory emergency that makes the current implementation non-compliant. Ongoing refinement of compliance interpretation is handled in the product backlog, not in the active sprint.

For the product backlog I work with the Product Owner and the compliance team to build a more robust definition of ready for AML stories. Before an AML story enters the sprint, the compliance team must sign off on the requirements as final. This sign-off is a prerequisite for the story being ready. If the compliance team cannot sign off because the regulatory guidance is still being interpreted, the story is not ready and should not be in the sprint.

I also introduce a compliance liaison role or a regular compliance touchpoint during the sprint. Once a week, a representative from the compliance team joins a brief session with the Product Owner and a developer to review in-progress AML work. This gives compliance the opportunity to flag concerns before stories are completed, rather than after.

For the retrospective, I make mid-sprint requirement changes a standing agenda item. Each time it happens, we document the cause and assess whether there is a process change that would prevent it.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Regulatory change management, sprint stability, stakeholder coordination',
        commonMistakes: ['Accepting mid-sprint changes without addressing root cause', 'Not establishing a definition of ready for compliance stories', 'Not involving compliance early enough'],
      },
      {
        q: "What is the role of the Scrum Master when the team is using a scaled framework like LeSS or Nexus across multiple teams at a telecom company?",
        a: `When a telecom company scales Scrum across multiple teams using LeSS or Nexus, the Scrum Master's role expands in scope while remaining consistent in principle. The Scrum Master still serves the team, the Product Owner, and the organization, but they now do this in the context of a multi-team system where coordination across teams is as important as facilitation within a single team.

In LeSS, Scrum Masters often serve multiple teams simultaneously. The typical ratio is one Scrum Master for two to three teams. This changes how a Scrum Master allocates their time. They spend less time in individual team ceremonies and more time on cross-team impediments, organizational system design, and coaching.

In a telecom context, the most common cross-team challenges in a scaled environment are shared dependencies on network infrastructure teams, competing priorities for shared test environments, and coordination across teams building different parts of an integrated product like a 5G network management platform.

In Nexus, there is a Nexus Integration Team that coordinates the work of multiple Scrum teams. A Senior Scrum Master often serves on or facilitates the Nexus Integration Team, which is responsible for identifying and resolving cross-team dependencies, ensuring the Nexus Sprint Goal is understood across all teams, and facilitating the Nexus Sprint Planning, Nexus Daily Scrum, and Nexus Sprint Review.

The most important shift in mindset for a Scrum Master moving into a scaled context is from optimizing a single team to optimizing the system. Sometimes what is best for one team in isolation is not what is best for the product as a whole.`,
        tracks: ['Agile', 'Scrum', 'SAFe'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Scaled Agile knowledge, system thinking, organizational coaching',
        commonMistakes: ['Applying single-team Scrum Master behaviors unchanged', 'Not addressing cross-team coordination', 'Not understanding the specific framework being used'],
      },
      {
        q: "How do you coach a Product Owner at a healthcare company who is writing user stories that are too technical and not focused on user outcomes?",
        a: `A Product Owner writing technically-focused stories is a common pattern and it almost always has the same root cause: the Product Owner came from a technical background, or they are being heavily influenced by the engineering team, or they are trying to specify the solution because they do not trust the team to make the right technical choices.

My coaching approach addresses the root cause rather than just correcting the story format.

The first conversation I have with the Product Owner is about the purpose of a user story. A user story is a placeholder for a conversation, not a specification. Its job is to describe who needs something, what they need, and why they need it, so the team can have an informed conversation about how to build it. When a Product Owner writes a story that says update the HL7 message parser to support FHIR R4 compliant observation resources, they have already made the technical decision. The team has nothing to discuss.

Instead, the story might be: as a clinical integration analyst, I need to receive and process patient observation data from our new Epic integration so that nurse practitioners can see lab results in real time without manual data entry.

I use a coaching technique called the five whys in reverse. When the Product Owner writes a technical story, I ask them why. Why do we need to update the HL7 parser? Because the Epic integration sends FHIR R4 data. Why does the Epic integration matter? Because clinical staff need real-time lab results. Each why moves the conversation up the value chain until we reach the user need that should be at the center of the story.

I also invite the Product Owner to attend a few user research sessions or shadowing opportunities with clinical staff. Direct exposure to users almost always shifts a technically-oriented Product Owner toward user-outcome thinking because they see the gap between what the technology does and what the user actually needs.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Product Owner coaching, user story quality, outcome orientation',
        commonMistakes: ['Correcting story format without addressing root cause', 'Not involving the Product Owner in user research', 'Writing the stories for the Product Owner instead of coaching them'],
      },
      {
        q: "How do you handle a situation where a fintech team consistently delivers stories at the end of the sprint rather than distributing delivery across the sprint?",
        a: `End-loading delivery is one of the most common and most dangerous patterns in Scrum teams. When most stories are completed in the last two days of a two-week sprint, the team loses two weeks of feedback opportunity and creates significant risk that the sprint review will surface problems that could have been caught much earlier.

The root cause of end-loading is almost always one of three things: stories are too large and cannot be completed incrementally, the team is working on stories sequentially rather than in parallel, or there is a bottleneck at the testing or review stage that holds up story completion.

I diagnose which of these is happening by observing the sprint board throughout the sprint. If stories are moving from to do to in progress but staying in in progress for extended periods, the stories may be too large. If the board shows all stories in to do until the last few days and then a sudden rush of completions, the team is likely working sequentially. If stories pile up in testing or in review, there is a bottleneck in those stages.

For large stories, I work with the team during backlog refinement to break stories into smaller vertical slices. A vertical slice is a small but complete end-to-end piece of functionality that delivers value and can be independently tested.

For sequential working patterns, I introduce a team norm that team members actively collaborate on stories in progress rather than waiting for their own story to begin. In a fintech team, this might mean the front-end developer starts working on the UI for a story while the back-end developer is still building the API, using a mock or stub for the integration.

For testing bottlenecks, I work with the team to build testing into the flow rather than treating it as a final gate.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Flow management, root cause diagnosis, continuous delivery mindset',
        commonMistakes: ['Accepting end-loading as a team preference', 'Not diagnosing the root cause', 'Not addressing story sizing and working patterns'],
      },
      {
        q: "You are a Senior Scrum Master at a bank. A newly formed team of eight people has never worked together before and is struggling to gel. How do you accelerate team formation?",
        a: `A newly formed team going through the storming phase of team development is normal and expected. Tuckman's model of team formation describes forming, storming, norming, and performing as natural stages, and my job as Scrum Master is to help the team move through these stages intentionally rather than waiting for them to resolve on their own over many months.

In the first sprint I focus on team agreements rather than velocity. I facilitate a working agreements session where the team defines how they will work together: how they will communicate, how they will handle disagreements, what their core hours are, how they will flag when they are stuck, and what quality standards they hold themselves to. In a banking context, I also include agreements about how the team will handle compliance and security requirements. These agreements become the team's social contract.

I introduce a short but regular team health check in the first three sprints. At the end of each Daily Scrum I ask one question to the full team: on a scale of one to five, how effective do you feel our collaboration was today? I track the responses over time. A team that is struggling to gel shows low and inconsistent scores. A team that is forming well shows increasing scores with less variance.

For the retrospectives in the early sprints, I focus less on the work and more on the working relationship. I use exercises that help team members understand each other's strengths, communication styles, and preferences. A simple exercise where each team member shares their professional background, their preferred way of receiving feedback, and one thing people might misunderstand about them creates understanding that reduces interpersonal friction.

In a banking context, I also pay attention to hierarchy dynamics. Banking teams often have members with very different seniority levels and junior members may defer to senior members in ways that prevent genuine self-organization.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Team formation, facilitation, coaching skills',
        commonMistakes: ['Focusing on velocity before the team has formed', 'Not addressing hierarchy dynamics', 'Waiting for team formation to happen naturally'],
      },
      {
        q: "How do you facilitate a Sprint Planning session when the team has low confidence in their estimates because they are building on an unfamiliar technology stack?",
        a: `Low confidence in estimates due to an unfamiliar technology stack is a legitimate challenge and the worst thing I can do is pressure the team to commit to estimates they do not believe in. False confidence in estimates leads to missed sprint goals, frustrated stakeholders, and a team that learns to game the estimation process to protect themselves.

My approach starts before sprint planning. When I know the team is working with an unfamiliar technology, I advocate for a learning spike in the sprint prior to the first sprint that commits to significant delivery. A spike is a time-boxed investigation where team members explore the new technology, build a small proof of concept, and develop enough understanding to estimate future work with reasonable confidence. The output of the spike is not working software. The output is knowledge.

In sprint planning itself, I introduce three-point estimation for high uncertainty stories. The team estimates three values: the optimistic case if everything goes well, the most likely case given reasonable assumptions, and the pessimistic case if they encounter significant learning challenges. This gives the Product Owner a realistic range rather than a false single-point estimate.

I also reduce the sprint commitment size when uncertainty is high. If the team normally commits to sixty story points per sprint on a familiar technology, I recommend committing to forty on an unfamiliar technology for the first two or three sprints. This creates a buffer for learning without creating a pattern of sprint goal failure.

In the retrospective after the first sprint on the new technology, I specifically review how actual effort compared to estimates. This retrospective data becomes the team's calibration reference for future estimates on the same technology.

I also make the technology uncertainty visible to the Product Owner and stakeholders in the sprint planning meeting. In a banking context, it is better to set expectations early than to discover higher variance as a performance problem after the fact.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Estimation under uncertainty, risk management, stakeholder communication',
        commonMistakes: ['Pressuring the team to commit despite low confidence', 'Not using spikes before committing to unfamiliar technology', 'Not communicating uncertainty to stakeholders'],
      },
    ],
  },
  'Agile Coach': {
    behavioral: [
      {
        q: "You are an Agile Coach at a large telecom company. The organization has been running SAFe for two years but teams are still not delivering incrementally. What is the most likely root cause and how do you address it?",
        a: `Two years of SAFe without incremental delivery is one of the most common and most demoralizing outcomes I see in large-scale Agile transformations. The framework is in place. The ceremonies are happening. But the fundamental behavior change that makes Agile valuable, delivering working software incrementally rather than in big-bang releases, has not occurred.

The most likely root cause is that the organization adopted SAFe as a process overlay without changing the underlying delivery model. The teams are running sprints but they are still building toward a quarterly release that requires all teams to integrate and test together before anything can be deployed. The sprints are creating planning and reporting cadence but they are not creating incremental value delivery. This is sometimes called wagile: waterfall delivery inside an Agile process wrapper.

Addressing this requires working at three levels simultaneously.

At the team level, I focus on helping teams define done as deployed to production, not as integrated and tested in a shared environment. If teams cannot deploy independently because of a shared release process, that is the constraint to address. I work with the release management and operations teams to create a deployment pipeline that allows teams to release their work independently.

At the program level, I examine the Program Increment structure. If the PI is being used as a planning container rather than a delivery commitment, I work with the RTE and product management to redefine what done means at the PI level and to establish clear acceptance criteria for each PI that require actual user-facing functionality to be deployed.

At the organizational level, I work with leadership to change the incentives. If teams are measured on whether they complete their sprint stories rather than on whether they deliver working software to users, the behavior will not change regardless of the framework.`,
        tracks: ['Agile', 'SAFe', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'telecom',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Root cause analysis, organizational change, scaled Agile depth',
        commonMistakes: ['Focusing on ceremony compliance rather than delivery behavior', 'Not addressing the deployment model', 'Not working at multiple organizational levels'],
      },
      {
        q: "How do you build a business case for Agile transformation in a traditional banking organization that is skeptical of Agile?",
        a: `A traditional bank that is skeptical of Agile is not wrong to be skeptical. Banking has a long history of delivering complex regulatory and technology programs using structured waterfall approaches, and some of those approaches have worked well. My job is not to dismiss that history but to make a compelling, evidence-based case for why an Agile approach will produce better outcomes for the bank's specific situation.

I build the business case on four pillars.

The first pillar is speed to market. I quantify how long it currently takes the bank to go from an approved business requirement to a production-ready feature. In most traditional banks, this cycle is measured in quarters or years. I then present evidence from banks that have adopted Agile practices showing the reduction in time to market. ING, DBS Bank, and HSBC have all published case studies showing significant reduction in delivery cycle time after Agile adoption.

The second pillar is risk reduction through early feedback. The current waterfall approach concentrates risk at the end of the delivery cycle. In a twelve-month project, the bank discovers whether the product meets user needs at month eleven. With Agile, the bank gets user feedback every two weeks. In banking, where regulatory requirements evolve and customer expectations change, the ability to incorporate feedback continuously reduces the risk of delivering a product that is out of date or non-compliant by the time it reaches production.

The third pillar is the cost of change. I use the bank's own project history to calculate the average cost of a requirement change discovered in the testing phase versus the development phase versus the design phase. Requirements changes are exponentially cheaper to address early. Agile practices are designed to surface requirement issues early.

The fourth pillar is talent. A bank still running waterfall delivery is at a disadvantage in the talent market compared to competitors that have adopted modern delivery practices.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Business case development, change management, stakeholder influence',
        commonMistakes: ['Making a process argument rather than a business outcome argument', 'Not acknowledging what has worked in the traditional approach', 'Not using banking-specific evidence'],
      },
      {
        q: "You are an Agile Coach at a healthcare company. A senior surgeon who is a key stakeholder refuses to participate in sprint reviews because she considers it a waste of her time. How do you handle this?",
        a: `A senior surgeon's time is genuinely scarce and her instinct that a standard sprint review format is not a good use of that time may be correct. My first response is not to convince her to attend a standard sprint review but to understand what she would find valuable and redesign the engagement accordingly.

I request a thirty-minute conversation with her, framing it as seeking her advice on how to involve clinical experts most effectively in the product development process. In that conversation I ask her what decisions she needs to be involved in, what information she needs to make those decisions, and what format of engagement would fit her working pattern.

Based on that conversation I might redesign her engagement completely. Instead of a ninety-minute sprint review with the full team, I might propose a monthly thirty-minute clinical advisory session where I present only the clinical functionality completed in the last two sprints and ask for her input on three specific clinical workflow questions.

I also explore whether there is a clinical informatics colleague or a senior resident who can serve as her delegate for routine sprint reviews while she participates in the higher-stakes clinical validation sessions. In healthcare product development, having a clinical proxy who is accessible and engaged is often more valuable than infrequent participation from the most senior clinical voice.

If the issue is partly that she does not see value in the product being built, that is a Product Owner problem more than a sprint review problem. I share this observation with the Product Owner and suggest a one-on-one meeting between the surgeon and the Product Owner to align on the clinical value proposition of the product before expecting her sustained engagement.

What I do not do is mandate her participation or escalate her absence as a project risk without first genuinely trying to meet her where she is.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'healthcare',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Stakeholder engagement, adaptability, healthcare domain sensitivity',
        commonMistakes: ['Insisting on standard sprint review format', 'Escalating non-participation without exploring alternatives', 'Not understanding the clinical stakeholder perspective'],
      },
      {
        q: "How do you coach an organization that believes Agile means no documentation, especially in a regulated financial services environment?",
        a: `The belief that Agile means no documentation is one of the most persistent and most damaging misconceptions about Agile, and it is particularly dangerous in regulated financial services where documentation is a legal and compliance requirement.

The Agile Manifesto says working software over comprehensive documentation. It does not say working software instead of documentation. The manifesto was a reaction against spending months producing elaborate documentation before writing a single line of code. It was not a call to eliminate documentation entirely.

My coaching approach addresses this at the organizational and team level.

At the organizational level, I work with compliance, legal, and risk management to identify the documentation requirements that are genuinely mandated by regulation. In financial services, these typically include audit trails for financial transactions, change management records for core system modifications, security and access control documentation, and model risk management documentation for AI and analytics models. These are compliance requirements that exist regardless of the delivery methodology.

At the team level, I help teams understand the difference between documentation that creates value and documentation that is produced because that is what has always been done. A forty-page functional specification written before development begins and never updated after development is complete consumes significant time to produce and is out of date the moment development starts. A concise architecture decision record that captures why the team made a specific technical choice, updated as the choice is made, is documentation that creates value.

I introduce the principle of just enough, just in time documentation. The team produces the documentation that is needed, at the level of detail that is needed, at the point in the development cycle when it is needed.

The practical shift I encourage is from documentation as a phase to documentation as a practice woven into the definition of done.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Medium',
        domain: 'fintech',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Agile misconceptions, regulatory awareness, coaching clarity',
        commonMistakes: ['Accepting the no documentation misconception', 'Not differentiating between required and optional documentation', 'Not connecting documentation to the definition of done'],
      },
      {
        q: "You are an Agile Coach. A development team and a separate QA team at a bank are constantly in conflict about bug severity and release readiness. How do you resolve this structural problem?",
        a: `The conflict between a development team and a separate QA team about bug severity and release readiness is almost always a symptom of a structural problem, not a people problem. When testing is owned by a team separate from the team doing the development, you create conditions for conflict because the two teams have different incentives, different information, and different accountability for the outcome.

The development team is incentivized to complete stories and demonstrate progress. The QA team is incentivized to find defects and prevent low-quality releases. When these incentives are misaligned, the conflict you describe is the natural result.

My coaching approach addresses the structural cause.

The first intervention is to integrate quality into the development team. Cross-functional teams that include QA engineers alongside developers, working on the same backlog with the same sprint goal, eliminate most of the us and them dynamic. When a QA engineer is part of the team that writes the code, they have context for evaluating bugs that a separate QA team never has. They also catch quality issues earlier because they are involved in story refinement and development, not just in a separate testing phase.

The second intervention is to establish a shared definition of done that includes quality criteria agreed by both teams before the sprint begins. When the framework is agreed in advance, the debate at release time is about facts, not opinions.

The third intervention is to create a shared bug severity framework: high severity means the bug prevents the core user journey from completing, medium means it affects a secondary workflow, low means it is cosmetic or has a workaround.

If the organizational structure makes it impossible to integrate QA into the development team, I escalate this as a structural impediment. Separate development and QA teams in a Scrum environment is a known anti-pattern and the conflict is a predictable consequence.`,
        tracks: ['Agile', 'Scrum'],
        companies: [],
        difficulty: 'Hard',
        domain: 'banking',
        subcategory: null,
        roundType: 'Behavioral',
        whatInterviewerTests: 'Structural problem solving, team integration, quality mindset',
        commonMistakes: ['Treating this as a people conflict rather than a structural problem', 'Not advocating for QA integration into the development team', 'Not establishing shared quality criteria upfront'],
      },
    ],
  },
};
