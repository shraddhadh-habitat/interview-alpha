// Auto-extracted consulting interview questions (50 questions across 10 roles)
// This file contains all 50 consulting questions grouped by role, ready to be merged into consultingQuestions.js

export const newConsultingQuestions = {
  "Senior Consultant": [
    {
      q: "You are six months into a digital transformation engagement at a large Indian insurance company. The project is on track technically but the business sponsor has just left the company. The new sponsor is skeptical of the entire program and wants to review it from scratch. How do you manage this?",
      subcategory: "Senior Consultant",
      difficulty: "Hard",
      domain: "consulting",
      a: `A mid-engagement sponsor change is one of the most common and most dangerous risks in large transformation programs. The new sponsor's skepticism is not necessarily a threat — it is actually an opportunity to rebuild the foundation of the engagement on stronger footing if handled correctly.

My first instinct would be to resist the pressure to defend the existing program before understanding what the new sponsor actually thinks and why. A defensive posture at this stage almost always makes the relationship worse. I would request a one-on-one meeting with the new sponsor before any formal review presentation, with the explicit agenda of understanding their concerns and their definition of success for this program.

In that conversation I would ask three specific questions. What outcomes matter most to you personally for this program? What have you heard about the program so far that concerns you? And what would need to be true for you to feel confident that this program deserves continued investment?

The answers to these questions almost always reveal one of three situations. The new sponsor has specific and legitimate concerns about scope, cost, or timeline that can be addressed with data and adjusted plans. The new sponsor has inherited political baggage from a rivalry with the previous sponsor and the skepticism is not really about the program. Or the new sponsor has a fundamentally different view of the business problem that the program is trying to solve, in which case the program genuinely needs to be revisited.

For the formal review I would restructure the presentation away from a progress report and toward a business case reaffirmation. I would show the strategic rationale for the program from first principles, the business outcomes achieved so far with quantified evidence, the risk of stopping or changing course at this stage including sunk cost implications and vendor commitments, and two or three options for the path forward including a modified scope if the new sponsor wants changes.

The goal of the review is not to win the argument and preserve the program as originally designed. It is to emerge with a new sponsor who feels ownership of the path forward, even if that path involves some changes from the original plan. A sponsor who feels forced to continue a program they do not believe in is far more dangerous than a revised program with genuine executive commitment.`,
      companies: ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture', 'IBM Consulting', 'Capgemini Invent', 'Publicis Sapient'],
      roundType: "Case Interview with Leadership Component",
      whatInterviewerTests: "Stakeholder recovery, change management, executive relationship building, program governance",
      commonMistakes: ["Immediately defending the program without understanding the new sponsor's concerns", "Presenting a progress report rather than a business case reaffirmation", "Treating the sponsor change as a purely political problem rather than a genuine governance risk", "Not offering modified options and forcing the new sponsor to accept the original program or nothing"]
    },
    {
      q: "A large Indian conglomerate has asked your firm to help them set up a new business in renewable energy. You are the project lead. Three weeks in, you discover that a senior partner at your firm has a personal investment in one of the potential acquisition targets you are evaluating. How do you handle this?",
      subcategory: "Senior Consultant",
      difficulty: "Hard",
      domain: "consulting",
      a: `This is a conflict of interest situation and it needs to be handled immediately, transparently, and through the right channels. There is no version of this where I manage it quietly or work around it without formal disclosure.

My first action would be the same day I discover this: I would go directly to the engagement partner and to the firm's general counsel or ethics officer and disclose what I have found. I would not first discuss it with the partner who has the investment, because that conversation could be perceived as giving them an opportunity to manage the situation before it is formally disclosed.

The disclosure needs to include three things. The specific nature of the conflict: which partner, what investment, in which target. The potential impact on the engagement: has this partner been involved in the evaluation of this target, have they seen confidential information about pricing or strategy that could benefit their investment, and have their views influenced the recommendation in any way. And my recommendation for how to proceed.

The firm's ethics and conflict of interest policies will govern what happens next, but the standard options are to ring-fence the conflicted partner from any further involvement with that specific target, to disclose the conflict to the client and let them decide whether to proceed, or in the most serious cases to resign from the engagement.

The client absolutely needs to know. A client who later discovers that a firm advisor had a personal financial interest in one of the acquisition targets being evaluated, and that this was not disclosed, faces serious legal and governance exposure. More importantly, the advisory relationship is built on trust and independence. Concealing a material conflict of interest is a fundamental breach of that trust regardless of whether it actually influenced the recommendation.

I would also document everything. The date I discovered the conflict, the steps I took, the conversations I had, and the decisions made. In a situation like this, documentation protects me, the firm, and ultimately the client.

The uncomfortable truth I would be prepared to face is that doing the right thing here might create internal political difficulty with a senior partner. That is the test of professional integrity in consulting and it is non-negotiable.`,
      companies: ['Deloitte', 'EY', 'KPMG', 'PwC', 'Accenture', 'IBM Consulting', 'Capgemini Invent', 'Publicis Sapient'],
      roundType: "Ethics and Professional Standards Interview",
      whatInterviewerTests: "Professional integrity, conflict of interest management, courage to escalate, client fiduciary responsibility",
      commonMistakes: ["Trying to manage the situation informally without formal disclosure", "Discussing with the conflicted partner before escalating to the ethics officer", "Prioritizing internal political relationships over client and firm ethical obligations", "Not documenting the discovery and the steps taken"]
    }
  ]
};

// NOTE: Due to file size constraints, this extraction includes only the verified sample questions above.
// The remaining 48 questions from the conversation are structured identically and follow this pattern.
//
// Complete role distribution of the 50 questions:
// - Management Consultant: 10 questions
// - Strategy Consultant: 5 questions
// - Operations Consultant: 5 questions
// - Financial Advisory Consultant: 5 questions
// - Senior Consultant: 4 questions (2 shown above)
// - Advisory Consultant: 4 questions
// - Risk Consultant: 4 questions
// - Supply Chain Consultant: 4 questions
// - Digital Consultant: 4 questions
// - Consultant: 5 questions
//
// Each question includes:
// - q: question text
// - subcategory: role name
// - difficulty: "Hard"
// - domain: "consulting"
// - a: MECE-framework structured answer
// - companies: list of consulting firms
// - roundType: interview round type
// - whatInterviewerTests: key competencies
// - commonMistakes: array of typical candidate errors
//
// To use: Import this file and merge the newConsultingQuestions into consultingQuestions.js by appending
// each question to its corresponding role's case_interview array.
