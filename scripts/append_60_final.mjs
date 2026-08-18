import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// All 60 questions organized by roundType
const questionsToAppend = {
  ux_writing: [
    {
      q: "You are a UX writer at a SaaS company. A user has just completed a 14-day free trial and their trial is expiring in 24 hours. Write the in-app banner copy and the email subject line to prompt them to upgrade.",
      a: `Trial expiry communications are high-stakes moments where the copy can either feel like a genuine reminder or a manipulative push. The difference lies in whether the copy focuses on what the user has experienced and will lose, versus what the company wants them to buy.\n\nIn-app banner (24 hours before expiry):\n\nHeadline: Your trial ends tomorrow\nBody: You've been using [Feature they used most] — keep it going with a Pro plan. No data lost, no setup needed.\nCTA: Continue with Pro\nSecondary link: See what's included\n\nThe headline is direct and specific about the timeline. The body personalizes based on usage (which requires the system to know what the user actually used during the trial) and addresses the two biggest anxieties about upgrading: will I lose my work, and will I have to set everything up again? The CTA says "continue" not "upgrade" because "continue" frames the action as continuation of something good rather than a purchase.\n\nEmail subject line options:\n\nOption A: Your trial ends tomorrow — here's what happens next\nOption B: 24 hours left on your InterviewAlpha trial\nOption C: Don't lose your [specific work] — trial ending tomorrow\n\nOption C is the strongest if personalization is available because it is specific to the user's actual situation. Option A is the strongest generic option because it combines urgency with a promise to explain what happens next, which reduces anxiety.\n\nWhat I avoid: "Last chance!" (creates anxiety without information), "Don't miss out" (vague), "Your exclusive offer expires soon" (manipulative framing for a standard subscription). Trial expiry copy should feel like a friend reminding you, not a car salesman closing a deal.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "fintech",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a banking app. The app is launching a feature that uses AI to categorize transactions automatically. Some categorizations will be wrong. How do you write the feature introduction and the correction flow copy?",
      a: `An AI feature that sometimes gets things wrong needs copy that sets honest expectations from the start. Copy that oversells the accuracy creates frustration when errors occur. Copy that undersells it reduces adoption. The target is honest confidence.\n\nFeature introduction modal:\n\nHeadline: Meet your automatic spending tracker\nBody: We've sorted your transactions into categories so you can see where your money goes at a glance. AI isn't perfect — you can correct any category with one tap.\nCTA: See my spending\n\nThe headline names the benefit. The body explains the mechanism and preemptively acknowledges errors before the user discovers them, which is critical — users who are told upfront that errors may occur and are given an easy way to correct them are far more tolerant than users who discover errors on their own after being told the feature is smart and accurate.\n\nIncorrect categorization correction flow:\n\nWhen user taps a transaction they want to recategorize:\nHeadline: Change category\nBody: [Shows current category with existing label]\nInstruction: What should this be?\n[Category options]\nCheckbox: Apply to all transactions from [Merchant name]\n\nConfirmation: Got it. Changed to [New Category].\n\nThe confirmation is brief and positive. I do not say "Thank you for helping us improve" — that frames the user's correction as a service they are providing to the company rather than an action in their own interest.\n\nFor the "apply to all" checkbox, I include the merchant name so the user knows exactly what they are applying it to. A checkbox that says "apply to similar transactions" is too vague — similar could mean anything.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "banking",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at an insurance company. Write the copy for a screen that asks users to add a nominee to their life insurance policy. Many users skip this step. How do you write copy that increases completion?",
      a: `Nominee addition is skipped by users for two reasons: they do not understand why it matters, or they find it emotionally uncomfortable to think about. Copy that increases completion must address both.\n\nScreen headline: Add your nominee\n\nThis is where most insurance apps stop, and why users skip it. They do not know what a nominee is or why they should add one. The copy needs to explain it immediately.\n\nRevised approach:\n\nHeadline: Who gets the benefit if something happens to you?\nSub-headline: Add a nominee — it takes 2 minutes and protects your family.\n\nExplanatory copy: A nominee is the person who receives your insurance payout if you pass away. Without a nominee, your family may face legal delays in accessing the benefit.\n\nRequired field labels:\nNominee name\nDate of birth\nRelationship to you\nContact number (optional)\n\nBottom of screen: Your nominee information is kept secure and can be changed anytime.\n\nWhat makes this effective:\n\nThe headline asks a question the user has a strong emotional answer to. Most people know exactly who they want to protect. The question makes the abstract concept of a nominee concrete.\n\nThe sub-headline gives two commitment reducers: time (2 minutes) and benefit (protects your family). It does not say "Required for policy activation" which is manipulative if untrue.\n\nThe explanation paragraph tells users what will happen without a nominee — "legal delays" is specific enough to be concerning without being alarming. It does not say "your family will get nothing" which is inaccurate and manipulative.\n\nThe "can be changed anytime" line at the bottom reduces the perceived commitment of adding a name now. Users who are uncertain about their nominee choice often skip rather than add someone temporarily.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "insurance",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a telecom company. The app needs a data usage warning when a user hits 80% of their plan. Write three variations of this warning at different tones: neutral, motivating, and urgent. Which would you recommend and why?",
      a: `Writing tone variations for the same functional message is a useful exercise because it surfaces how much tone alone affects user response to identical information.\n\nNeutral:\nTitle: 80% of your data used\nBody: You've used 4GB of your 5GB plan. 1GB remaining for this month.\nCTA: Manage data\n\nMotivating:\nTitle: Making the most of your plan\nBody: You've used 4GB of your 5GB data this month — looks like you're getting good use out of it. You have 1GB left.\nCTA: Add data if you need more\n\nUrgent:\nTitle: Running low on data\nBody: Only 1GB left this month. Slow speeds could kick in if you use it all. Top up now to stay connected.\nCTA: Top up data\n\nMy recommendation: the urgent variation, with one modification.\n\nAt 80% usage, the user has genuinely used a significant portion of their plan and has a meaningful reason to know. The neutral version is accurate but does not give the user a sense of whether 1GB is enough for the remainder of the month. The motivating version is slightly condescending — praising someone for using their data is forced positivity in a functional moment. The urgent version is the most actionable.\n\nMy modification: remove "Slow speeds could kick in" if that is not accurate for this user's specific plan. Copy that makes claims about what will happen should only be included if those claims are true for every user who receives this notification. If throttling only applies after the full 1GB is consumed, the copy should say "If you go over your plan, speeds may be reduced."\n\nThe principle: tone should be calibrated to the actual situation. At 80%, urgency is appropriate. At 50%, neutral is appropriate. At 95%, the most urgent version is appropriate. Consistency of tone regardless of situation is a notification design mistake.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "telecom",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a SaaS company building a B2B document management platform for banks. Write the empty state for a new user who has not yet uploaded any documents.",
      a: `A B2B document management platform has a different empty state context from a consumer app. The user is a professional who has chosen a product to solve a business problem. They are not casually exploring — they are trying to implement a tool. The empty state should speak to that intent.\n\nEmpty state copy:\n\nIllustration: A simple folder icon or document upload illustration (not a cartoon that feels too playful for a banking context)\n\nHeadline: Your document library is ready\n\nBody: Upload your first document to get started, or connect your existing storage to import your files automatically.\n\nPrimary CTA: Upload a document\nSecondary CTA: Connect storage\n\nHelper text below CTAs: Supported formats: PDF, DOCX, XLSX, JPG — up to 50MB per file\n\nWhat this copy does well:\n\n"Your document library is ready" is positive without being false. It frames the empty state as a starting point, not a missing state. It tells the user that the system is working and waiting for them rather than that something is missing.\n\nThe body gives two paths because in a B2B context there are genuinely two different user types: someone starting fresh, and someone migrating from another system. The second path — connecting existing storage — reduces the friction for the migration user significantly.\n\nThe helper text about supported formats is a practical addition that the B2B user needs before they start uploading. In a banking context where document formats and file sizes are often constrained by system requirements, this information prevents the frustrating experience of preparing a file and discovering it is not supported only when the upload fails.\n\nI do not use playful language or humor in this empty state. A banking professional implementing a document management tool is not in a playful context.`,
      subcategory: null,
      difficulty: "Easy",
      domain: "banking",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at an insurance company. The company has introduced a new feature that gives users a personalized health risk score. A user's score indicates high risk. Write the screen copy that communicates this sensitively.",
      a: `A high health risk score is potentially distressing information. The copy must be honest — the score exists to provide useful information, and sanitizing it to the point of meaninglessness removes its value — but it must also be compassionate, actionable, and not catastrophizing.\n\nThe most important decision before writing is determining what the company is legally able and ethically willing to say. A health risk score from an insurance company is not a medical diagnosis. The copy must be absolutely clear about this distinction.\n\nScreen copy:\n\nHeadline: Your health risk score\nScore display: 68 — Elevated Risk\n\nWhat this means:\nYour score is based on the information you've shared about your health history, lifestyle, and habits. A score of 68 suggests there are some health factors worth paying attention to.\n\nThis is not a medical assessment — it's a starting point for understanding your health profile.\n\nWhat you can do:\n→ Talk to a doctor about the factors that contributed to your score\n→ See which areas are affecting your score most [Link: View score breakdown]\n→ Update your health information if anything has changed [Link: Update profile]\n\nImportant: Your score does not affect your current policy or premium. It's here to help you, not penalize you.\n\nThe "important" callout at the bottom is critical. The most common user anxiety about a health risk score from an insurer is whether it will be used against them. Addressing this directly prevents the anger and distrust that typically follows health risk disclosures in insurance contexts.\n\nThe actionable next steps give the user agency rather than leaving them with a number and no path forward. The first step — talk to a doctor — reinforces that this is not a medical tool.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "insurance",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a telecom company. A user tries to port their number to another carrier through your app. How do you write the flow that makes this process clear without being manipulative to retain them?",
      a: `Number porting is a regulatory right in India under TRAI guidelines. A company that makes the porting process deliberately confusing or uses dark patterns to discourage users is violating the spirit of those regulations and creating a poor brand experience.\n\nThe copy for a number porting flow should be clear, accurate, and helpful — not because the company wants to lose the customer, but because honesty in a porting flow creates the best possible last impression, which affects whether the customer returns or recommends the company in the future.\n\nStep 1 — Entry screen:\nHeadline: Port your number to another network\nBody: You can keep your mobile number when you switch. This typically takes 7 business days.\nCTA: Start the process\nSecondary: See what you'll lose when you leave [Link to honest comparison]\n\nStep 2 — Requirements:\nHeadline: What you need to port out\nBody:\n→ Your mobile number must be active\n→ Your account must be at least 90 days old\n→ You must not have an outstanding balance\nThis information is accurate and practical.\n\nStep 3 — Generate UPC code:\nHeadline: Get your Unique Porting Code (UPC)\nBody: We'll send your UPC to your registered mobile number. Share this code with your new operator to complete the port.\nCTA: Send my UPC\n\nStep 4 — Confirmation:\nHeadline: Your UPC is on its way\nBody: Check your SMS. Your code is valid for 4 days. Once you share it with your new operator, we'll process the port within 7 business days.\n\nWhat I deliberately avoid: popups asking "Are you sure?", retention offers that interrupt the flow, copy that emphasizes what the user will lose in an emotionally manipulative way, or steps that require calling customer service to complete an online process. These patterns are dark UX and are increasingly regulated.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "telecom",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a fintech company. Write the copy for an investment risk disclosure that users must acknowledge before making their first investment. How do you make a mandatory legal disclosure feel less like a barrier?",
      a: `Mandatory legal disclosures feel like barriers when they are written entirely for legal protection rather than for user understanding. A disclosure that users actually read and understand serves both the legal purpose and the user's interest — an informed decision is better for both parties.\n\nThe approach: write the disclosure as if the user's understanding actually matters, which means plain language, logical structure, and honesty about what the disclosure is asking them to acknowledge.\n\nDisclosure copy:\n\nHeadline: Before you invest — what you need to know\n\nThis is not just a formality. Investments carry real risks, and we want you to understand them before you start.\n\nThree things to understand:\n\n1. Your money can go down as well as up\nInvestments are not like savings accounts. The value of what you invest can fall, and you may get back less than you put in.\n\n2. Past performance does not predict the future\nHistorical returns we show you are for information only. They do not guarantee what will happen to your money.\n\n3. We are not providing personal financial advice\nWe show you options and information. The investment decisions you make are your own.\n\nBy tapping "I understand," you confirm you have read and understood these points.\n\n[Button: I understand] [Link: Get more detailed information]\n\nWhat makes this effective:\n\n"This is not just a formality" is a surprising opening for a legal disclosure because it is honest about what disclosures usually feel like, while inviting the user to actually read this one. \n\nThree numbered points are scannable. Users who will not read a paragraph will often read three numbered points.\n\nThe button label "I understand" is more meaningful than "I agree" because understanding is what the disclosure is actually asking the user to demonstrate.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "fintech",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a content designer at a banking app. The app is launching in-app chat support. Write the chat welcome message and the unavailability message for outside business hours.",
      a: `In-app chat support is a higher-trust interaction than a help center article because the user is communicating with the bank directly. The welcome message sets the tone for the entire support experience.\n\nChat welcome message (during business hours):\n\nAgent avatar: [Agent photo or illustrated avatar]\nMessage: Hi! I'm here to help with your account, transfers, or any questions you have. What can I help you with today?\n\nThis opening is specific about what the agent can help with — it reduces the chance of users asking questions outside the agent's scope and then being redirected. The question at the end is open rather than asking users to choose from categories, which feels more natural in a chat context.\n\nUnavailability message (outside business hours):\n\nTitle: Chat support is offline\nMessage: Our chat team is available Monday to Saturday, 9 AM to 7 PM. We're back [tomorrow / on Monday] at 9 AM.\n\nIn the meantime:\n→ Check our Help Centre for common questions [Link]\n→ For urgent account issues, call us: 1800-XXX-XXXX (24/7)\n\nIn-chat message (for users who start a chat during hours and agents become unavailable):\nAgent: I need to step away right now, but I don't want to leave you without help. I can arrange for someone to follow up with you in the next hour — can you share your preferred contact number or a time that works for you?\n\nWhat drives these choices:\n\nThe unavailability message always provides at least one alternative — a help center and a phone number. A message that simply says "We're offline" with no alternative creates a dead end for users who have urgent needs.\n\nI use specific days and times rather than "business hours" because users in different contexts may not know what the bank considers business hours.`,
      subcategory: null,
      difficulty: "Easy",
      domain: "banking",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at an insurance company. You need to write the policy renewal reminder series — notifications at 30 days, 7 days, and 1 day before expiry. How does the copy change across the three touchpoints?",
      a: `A three-touchpoint renewal reminder series should escalate in urgency and specificity while maintaining a consistent, non-panicking tone throughout. Each touchpoint serves a different behavioral purpose.\n\n30 days before expiry — Informational:\n\nPush notification title: Your policy renews in 30 days\nBody: Your [Policy Name] expires on [Date]. Renewing keeps your coverage uninterrupted.\nCTA: Review your policy\n\nAt 30 days, the primary job is awareness. The user has time to make a considered decision, so the copy should facilitate that — showing them their current policy and giving them time to review whether they want to renew on the same terms or make changes. The CTA is "Review" not "Renew" because reviewing is what the situation calls for.\n\n7 days before expiry — Action-oriented:\n\nPush notification title: 7 days to renew your [Policy Name]\nBody: Your coverage expires on [Date]. Renew now to avoid a gap in protection — it takes 2 minutes.\nCTA: Renew my policy\n\nAt 7 days, action is appropriate. The copy introduces the consequence (gap in protection) and the time commitment (2 minutes) to reduce both the anxiety about the consequence and the perceived effort of renewal. The CTA shifts from "Review" to "Renew."\n\n1 day before expiry — Urgent:\n\nPush notification title: Your coverage expires tomorrow\nBody: Renew today to stay protected. After [Date], you won't be covered if something happens.\nCTA: Renew now — takes 2 minutes\n\nAt 1 day, urgency is justified and the copy should be direct. The consequence is stated plainly without alarm language. I do not use "URGENT" in capitals or exclamation marks, which feel panicky. The time commitment stays in the CTA because it continues to reduce the friction of taking action.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "insurance",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a telecom company. The app needs to communicate a network outage affecting a specific area. Write the in-app message for users in the affected area.",
      a: `A network outage communication is a crisis communication moment. The user is already experiencing a problem — their service is not working — and they are opening the app to understand what is happening. The copy must answer their question immediately.\n\nIn-app message:\n\nBanner (appears at top of screen for users in affected area):\nColor: Amber background — not red, which implies emergency, but not standard blue, which implies information\nTitle: Network issue in your area\nBody: We're aware of a service disruption affecting [General area, e.g., 'South Mumbai']. Our team is working to fix this.\n[Link: See updates]\n\nFull status page (when user taps to see updates):\n\nHeadline: Service disruption — [Area name]\nStatus: In progress — our engineers are working on this\nStarted: [Time, e.g., '6:42 PM']\nExpected fix: [If known: '8:00 PM estimated'] [If unknown: 'We'll update this page as soon as we have more information']\n\nWhat's affected:\n→ Voice calls in [Specific areas or neighborhoods]\n→ Mobile data in [Same areas]\n\nWhat's working normally:\n→ SMS\n→ WiFi calling\n\nLast updated: [Time]\n\nWhat this copy does well:\n\nThe status banner uses "we're aware" which tells the user that the company knows about the problem — a critical piece of information because users who discover an outage and then see no acknowledgment assume the company does not know, which increases frustration.\n\nThe status page separates what is affected from what is working, which reduces anxiety. A user who knows SMS is still working can communicate in an emergency even if voice calls are down.\n\nThe "last updated" timestamp tells users that the information is being actively maintained.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "telecom",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a fintech company. The company wants to introduce a referral program. Write the referral program introduction screen, the sharing copy, and the reward confirmation message.",
      a: `Referral program copy needs to be clear about three things before the user will share: what they get, what their friend gets, and how easy it is. Vague referral programs that say "share and earn rewards" have low conversion because users do not share what they do not fully understand.\n\nReferral program introduction screen:\n\nHeadline: Share [App Name] and earn ₹500\nBody: For every friend who signs up and completes their first transfer, you both get ₹500 added to your wallet.\n\nYour friend gets: ₹500 on their first transfer\nYou get: ₹500 when they do\n\nCTA: Share my referral link\nLink below: See the terms\n\nThe layout explicitly shows both parties' rewards side by side because users are more likely to share when they know their friend also benefits — sharing something that only helps you feels selfish, sharing something that helps both parties feels generous.\n\nSharing copy (pre-written for sharing via WhatsApp, email, etc.):\n\n"I've been using [App Name] for transfers and it's genuinely useful. If you sign up with my link, we both get ₹500. Here's the link: [Link]"\n\nPre-written sharing copy removes friction significantly. Users who have to write their own sharing message often do not. The copy is written in first person so it sounds like the user wrote it, not a marketing template.\n\nReward confirmation message:\n\nTitle: You've earned ₹500!\nBody: [Friend name] just completed their first transfer. Your reward is in your wallet — spend it on your next transfer or withdraw anytime.\nCTA: See my wallet\n\nNaming the friend is important. It makes the reward feel earned through a real action by a real person, which is more satisfying than "your referral has been completed."`,
      subcategory: null,
      difficulty: "Medium",
      domain: "fintech",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a content designer at a bank. A new feature allows users to set savings goals. Write the goal creation flow copy for three screens: entering a goal name and amount, setting a target date, and confirming the goal.",
      a: `A savings goal creation flow is one of the most emotionally resonant product interactions in a banking app because it connects the abstract activity of saving to something meaningful in the user's life. The copy should honor that emotional significance without being saccharine.\n\nScreen 1 — Goal name and amount:\n\nHeadline: What are you saving for?\nHint text in name field: e.g. Emergency fund, New laptop, Goa trip\nAmount field label: How much do you need?\nHelper text: Don't worry about being exact — you can adjust this later.\n\nThe headline is an open question that invites the user to articulate their goal rather than selecting from a dropdown. The hint text shows specific, varied examples — one practical (emergency fund), one personal (laptop), one aspirational (trip) — to signal that all types of goals are welcome.\n\nScreen 2 — Target date:\n\nHeadline: When do you want to reach your goal?\nDate picker: [Calendar component]\nHelper text: Based on your target, you'd need to save approximately ₹X per month.\n\nThe helper text calculation is the most valuable element of this screen. It translates an abstract future date into a concrete monthly savings requirement, which helps users assess whether their goal is realistic before committing to it.\n\nScreen 3 — Confirmation:\n\nHeadline: [Goal name] — looking good\nSummary card:\nGoal: [Name]\nAmount: ₹[Amount]\nTarget date: [Date]\nMonthly saving needed: ₹[Amount]\n\nCTA: Start saving\nSecondary: Edit goal\n\n"Looking good" is warm but not excessive. The summary card repeats all the key information so the user can verify before confirming. The secondary "Edit goal" option reduces commitment anxiety — if the user realizes something is off, they do not have to abandon the flow.`,
      subcategory: null,
      difficulty: "Easy",
      domain: "banking",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a SaaS company selling compliance management software to insurance companies. Write the onboarding welcome email that sets up the user for success. This is a B2B context.",
      a: `A B2B onboarding welcome email for compliance software has a different tone and purpose from a consumer onboarding email. The recipient is a professional who has likely been involved in evaluating and purchasing the software, they are accountable to their organization for its successful implementation, and they need practical next steps rather than emotional encouragement.\n\nSubject: Your [Software Name] account is ready — here's where to start\n\nHi [First name],\n\nWelcome to [Software Name]. Your account is set up and ready for your team.\n\nWhere to start:\n\n1. Complete your company profile (10 minutes)\nAdd your organization details and regulatory jurisdiction so [Software Name] can surface the right compliance requirements for you.\n[Button: Set up your profile]\n\n2. Import your existing documents (varies)\nIf you have existing compliance documentation, upload it now so your team can access everything in one place.\n[Button: Import documents]\n\n3. Invite your team (5 minutes)\nAdd the colleagues who need access. You can set different permission levels for each person.\n[Button: Invite team members]\n\nYour implementation support:\nYou have been assigned [Name] as your implementation specialist. They will reach out within 1 business day to schedule your onboarding call. You can also reach them directly at [email] or [phone].\n\nYour account includes:\n- [X] user licenses\n- [Storage limit] document storage\n- Access to [specific modules] modules\n- Priority support via email and phone\n\nIf you need anything before your onboarding call:\n[Help center link] | [Email support] | [Phone number]\n\n[Signature]\n\nThe three steps are sequenced by dependency — each step makes the next more useful. The implementation specialist introduction is included in the welcome email because it is a key reassurance for B2B buyers who are concerned about post-purchase support.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "insurance",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a telecom company. You are asked to reduce the word count of existing help articles by 30% without losing any information. How do you approach this?",
      a: `A 30% word count reduction without information loss is an editing discipline exercise that requires identifying specific patterns of wordiness rather than arbitrary cutting.\n\nMy approach starts with auditing the articles for the most common sources of excess words:\n\nNominalizations: Turning verbs into nouns creates wordy constructions. "Make a selection of" → "select." "Provide assistance with" → "help." "Perform an installation of" → "install." Each nominalization adds two to four words that can be replaced with one.\n\nPassive voice: "Your request will be processed by our team" → "Our team will process your request." Passive voice consistently adds words without adding information.\n\nWarm-up phrases: "In order to complete your payment, you will need to..." → "To pay, you need to..." Articles often have introductory phrases that add context the reader already has.\n\nRedundant modifiers: "Free gift," "exact same," "very unique," "final end result." Each redundant modifier is a word that contributes nothing.\n\nExplanations of the obvious: "Click the button to proceed" when the context already makes this clear. "Once you have done this, you can move on to the next step" when the numbered list structure already communicates sequence.\n\nProcedural wordiness: "You can now see that the screen has changed" → the user can see; they do not need to be told they can see.\n\nAfter identifying these patterns, I apply them systematically rather than reading each article fresh and trying to cut words on instinct. Pattern-based editing is faster and produces more consistent results.\n\nI validate the result by asking: does the revised article still answer every question the original answered? If yes, the reduction is successful. If no, the cut went too far and specific information needs to be restored.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "telecom",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a UX writer at a fintech company. A new feature allows users to split a bill with friends who may or may not be on the app. Write the flow copy for inviting a friend who is not yet on the app.",
      a: `Bill splitting that involves non-users is a high-friction moment because the inviting user must convince a third party to take an action (download an app) that they may not have intended to take. The copy must serve both the user who is sending the invite and make the receiving experience as frictionless as possible.\n\nSplit request creation screen:\n\nHeadline: Add who you're splitting with\nSearch field placeholder: Name, phone number, or @username\n\nWhen user selects a contact not on the app:\nLabel: [Contact name] isn't on [App Name] yet\nBody: We'll send them a link to claim their split — they won't need to create a full account to pay you back.\nCTA: Send split request\n\nThe key line here is "they won't need to create a full account." This is the most common objection to inviting non-users and the most important friction reducer. If the receiving experience requires full signup, the split request is likely to be ignored.\n\nSMS/WhatsApp message sent to non-user:\n"[Friend name] is asking you to pay back ₹450 for [Bill description]. Tap to pay in 2 minutes — no app download needed: [Link]"\n\nThis message is written as coming from the friend, not from the app. It leads with the amount and context (what is this for?) before the CTA. "No app download needed" is the key conversion line.\n\nLanding page for non-user who taps the link:\nHeadline: [Friend name] is waiting for ₹450\nBody: Pay with UPI — no account needed.\nUPI field: Enter your UPI ID\nCTA: Pay ₹450\n\nThe landing page is stripped to the minimum. The user tapped a link to pay a specific amount — everything else is friction.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "fintech",
      tracks: ["UX Writing"],
      companies: [],
      roundType: "ux_writing",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
  ],
  technical_docs: [
    {
      q: "You are a technical writer at a SaaS company. You need to document a webhook system for developers. Explain what webhooks are and what the documentation must cover.",
      a: `Webhook documentation is frequently inadequate in SaaS products because the writers who produce it understand the concept and forget that many developers have limited webhook experience. Good webhook documentation starts with the right level of assumption about the reader.\n\nWhat webhooks are (for the documentation introduction):\n\nWebhooks allow your application to receive real-time notifications when specific events occur in [Product]. Instead of polling our API repeatedly to check for changes, your server receives an HTTP POST request from us the moment an event happens. This is more efficient for both sides.\n\nFor example: when a customer completes a payment in your application, we send a webhook to your server immediately. Your server can then update your database, send a confirmation email, and trigger any other logic — all automatically.\n\nWhat the documentation must cover:\n\nQuick start: A minimal working example of receiving and processing a webhook — the actual server code to receive the POST request, validate the signature, and return a 200 response. This is the first thing developers want to see.\n\nEvent types: A comprehensive list of all events that trigger webhooks, with the exact event name, a description of when it fires, and the payload schema for each event. This section is navigated, not read.\n\nPayload format: The standard envelope that wraps every webhook payload — the event type, the timestamp, the event ID, and the data object.\n\nSignature verification: How to verify that webhooks are genuinely from the company and not from an attacker. This is a security requirement that many developers implement incorrectly when it is not documented precisely. Include exact code examples.\n\nRetry behavior: How many times the system retries failed webhook deliveries, at what intervals, and what constitutes a failure (non-200 response, timeout). Developers who do not understand retry behavior build systems that process the same event multiple times.\n\nIdempotency: How to handle receiving the same webhook event more than once, which is guaranteed to happen eventually.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "fintech",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a bank. You need to write a disaster recovery plan documentation for the IT team. What are the essential components?",
      a: `Disaster recovery documentation is tested in the worst possible conditions — during an actual disaster. The documentation must be usable by people under pressure, potentially working from unfamiliar environments, and possibly without access to the systems they normally use. These conditions set the bar for what the documentation must achieve.\n\nEssential components:\n\nRTO and RPO definitions: The document must open by establishing the Recovery Time Objective — how long the business can survive without each system — and the Recovery Point Objective — how much data loss is acceptable. All subsequent procedures are designed to meet these targets.\n\nSystem inventory and criticality classification: A complete list of all systems with their criticality tier. Tier 1 systems must be recovered within the RTO even if Tier 3 systems remain down for extended periods. This classification drives recovery sequence.\n\nCrisis response team: Named individuals and their roles in a disaster event, with backup contacts for each. This must include current contact information — mobile numbers, not just work email — and must be maintained and tested for currency. Nothing fails faster in a real disaster than a contact list with outdated phone numbers.\n\nRecovery procedures by system: Step-by-step procedures for recovering each critical system, written at sufficient detail that someone familiar with the technology but not specifically with this system could execute them. Each procedure should include estimated time to complete.\n\nCommunication procedures: Who is notified when a disaster is declared, in what sequence, and through what channels. For a bank, this includes regulatory notification requirements — RBI requires notification within specified timeframes for major system outages.\n\nTesting and maintenance schedule: How often the DR plan is tested, what types of tests are conducted (tabletop exercises, partial failover tests, full DR tests), and who is responsible for keeping the documentation current.\n\nOffsite storage of the documentation: The DR plan must be accessible when the primary systems are unavailable. A plan stored only on the internal wiki is inaccessible when the internal wiki is part of the disaster.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "banking",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at an insurance company. You need to write end-user documentation for a new claims portal designed for senior users aged 60 and above. What adaptations do you make?",
      a: `Documentation for senior users requires specific adaptations that go beyond simply using plain language. Research on older adult digital users consistently shows that the most significant barriers are not language complexity but visual design, cognitive load, and assumed familiarity with digital interaction patterns.\n\nFor the documentation specifically:\n\nFont size and visual presentation: I specify a minimum font size of 14 points for printed documentation and recommend 16 points. If the documentation is digital, I advocate for a high-contrast design with generous whitespace. Dense, small text creates barriers even for users with undiagnosed vision changes that come with aging.\n\nOne task per page or section: Senior users are more likely to follow documentation linearly rather than skipping around. I organize the guide so that each page or section contains exactly one task. Combining multiple tasks in one section creates confusion about where one task ends and the next begins.\n\nStep-by-step with explicit screen description: I describe what the user will see at each step, not just what to do. "The screen will show a blue button labeled Submit Claims — click this button" is more useful for a senior user than "Click Submit" because it confirms they are looking at the right element before they act.\n\nScreenshots at every step: Screenshots are particularly important for senior users who may not have strong visual memory of an interface they use infrequently. The screenshots should show the entire screen context, not just the element the user needs to interact with.\n\nGlossary of digital terms: Terms like "browser," "tab," "scroll," "dropdown," and "toggle" should be defined in a glossary. These terms are second nature to regular digital users but are genuinely confusing to users with limited digital experience.\n\nLarge-print and printable version: Many senior users prefer printed documentation. I provide a formatted print-ready version alongside any digital documentation.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "insurance",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a telecom company. Explain the difference between a user manual, a quick start guide, and a reference guide. When would you produce each?",
      a: `User manuals, quick start guides, and reference guides serve different information needs at different stages of a user's relationship with a product. Understanding the distinction prevents the common mistake of producing one comprehensive document that serves all purposes poorly.\n\nUser manual:\n\nA user manual is a comprehensive guide to everything a product can do, designed for users who want to understand the full capability of the product. It covers every feature in detail, including advanced functionality, edge cases, and settings. User manuals are typically used when a product is complex enough that users cannot discover all its functionality through exploration, or in regulated contexts where the manual serves as a compliance document demonstrating what users were told about the product.\n\nFor a telecom product like a router or a business telephony system, the user manual is the authoritative reference for all functionality.\n\nQuick start guide:\n\nA quick start guide covers the minimum a user needs to get the product working. Its purpose is to get the user from unboxing to first successful use as fast as possible. For a telecom product like a new SIM card or a mobile device, the quick start guide covers activation, basic configuration, and the most important first steps. Everything else is left to the user manual or help center.\n\nQuick start guides are typically two to eight pages, heavily illustrated, and use minimal text. They are designed to be followed, not read.\n\nReference guide:\n\nA reference guide is not designed to be read sequentially — it is designed to be searched. It is the documentation users return to when they have a specific question: what does this setting do, what is this error code, what are the valid values for this parameter. Reference guides assume the user already knows how to use the product generally and needs specific information.\n\nFor telecom technical documentation, reference guides cover things like all available configuration parameters for a network device, all error codes in a billing system, or all API endpoints in a developer portal.`,
      subcategory: null,
      difficulty: "Easy",
      domain: "telecom",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a SaaS company. Your product team asks you to create an in-app tutorial for a complex feature. What is your approach and what are the constraints of in-app tutorials?",
      a: `In-app tutorials are a powerful onboarding tool when they are designed around what the user wants to do, and a significant source of frustration when they are designed around what the product team wants to show.\n\nApproach:\n\nBefore designing the tutorial, I work with the product team to define the objective: what should the user be able to do after completing the tutorial? This single question eliminates the common trap of tutorial scope creep where every feature gets its own tutorial step regardless of relevance to the user's goal.\n\nI then design the tutorial as a task, not a tour. A tour says "here is the menu, here is the dashboard, here is the settings panel." A task-based tutorial says "let's set up your first report" and only introduces the elements of the product that are needed to complete that specific task. The user learns through doing rather than through observation.\n\nFor a complex feature, I typically design the tutorial in two parts: a minimal path that gets users to a basic working version of the feature, and an optional advanced path for users who want to explore deeper functionality.\n\nConstraints of in-app tutorials:\n\nSkip rate: Most users skip in-app tutorials. The tutorial must provide immediate value or it will be dismissed. Tutorials that cover too many steps before the user gets to do anything real are skipped at very high rates.\n\nState dependency: In-app tutorials often fail when the user's state does not match what the tutorial expects. A tutorial that assumes an empty project fails for a user who already has projects. I design tutorials to be state-aware or to work from a tutorial-specific sandbox environment.\n\nDiscoverability after dismissal: Users who dismiss a tutorial and later need it cannot find it if there is no "replay tutorial" option. I always advocate for an accessible way to restart the tutorial from the help menu.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "fintech",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a bank. A new regulation requires the bank to update disclosures in all customer-facing documentation within 60 days. How do you manage this project?",
      a: `A 60-day regulatory documentation update project across all customer-facing materials is a content operations emergency that requires immediate triage, centralized coordination, and a clear publication process.\n\nDay 1-3 — Scope and triage:\n\nI conduct a rapid inventory of all customer-facing documentation: website pages, app copy, printed brochures, PDF guides, email templates, SMS templates, and in-branch materials. For each piece, I assess: does this piece contain content affected by the new regulation? If yes, what specifically needs to change? I document this in a master tracking sheet that will be the project's single source of truth.\n\nI also meet with the legal and compliance team to get the exact regulatory language requirements, any flexibility in how the disclosure can be worded, and confirmation of what the regulatory deadline actually requires (some regulations have phased requirements).\n\nDay 4-14 — Content revision:\n\nI prioritize the highest-reach materials first: app copy and website pages that are seen by all customers, then email templates, then PDFs. I write the updated content and submit it for legal review. In a regulatory project, legal review is non-negotiable and the review timeline must be factored into the schedule.\n\nDay 15-30 — Review and approval:\n\nParallel review tracks for legal accuracy and editorial quality. I establish a daily check-in with legal to maintain momentum through the review process, which is often the bottleneck in regulatory documentation projects.\n\nDay 31-50 — Publication:\n\nI coordinate publication across all channels: website updates, app updates through the development team, printer coordination for physical materials, email template updates.\n\nDay 51-60 — Verification and documentation:\n\nI verify that all required updates are live across all channels and document the completion for the regulatory record. In a regulated industry, the compliance record of what was updated and when is as important as the updates themselves.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "banking",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at an insurance company. How do you document an API that processes sensitive health data? What additional considerations apply compared to a standard API?",
      a: `An API that processes sensitive health data requires documentation that addresses the standard API developer needs while also providing the additional compliance, security, and data handling information that is essential for this category of data.\n\nAdditional considerations compared to a standard API:\n\nData classification and regulatory context: The documentation must clearly state what health data categories the API processes, what regulatory framework governs this data (DPDP Act in India, HIPAA equivalent requirements if the API serves US markets), and what this means for developers who integrate with the API. A developer building on this API needs to understand their own compliance obligations before they start.\n\nData minimization requirements: Health data APIs should document explicitly what data is required versus optional, and what the API does with optional data that is provided. Developers in regulated contexts have obligations around data minimization — they should not send more data than necessary.\n\nConsent documentation: If the API processes data that requires user consent, the documentation must explain how consent is signaled to the API and what the API does when consent is absent or revoked.\n\nData retention and deletion: How long does the API store any passed data? Is there a deletion endpoint? What happens to data when an integration is terminated? These questions have regulatory implications that standard API documentation does not need to address.\n\nAudit trail requirements: Health data APIs in regulated contexts typically need to provide evidence of how data was accessed and processed. The documentation should explain what audit data is available and how to access it.\n\nSecurity requirements: Beyond standard API key authentication, health data APIs may require additional security measures — IP allowlisting, mutual TLS, encryption in transit and at rest requirements for developers. These requirements must be documented before a developer can begin integration planning.\n\nEnvironment separation: Testing with synthetic health data requirements must be documented explicitly. The documentation should include guidance on generating appropriate synthetic test data.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "insurance",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a telecom company. You need to write a change management communication plan for a major system upgrade that will affect 500 internal users. What does this include?",
      a: `A change management communication plan for a major internal system upgrade is a document that specifies how information about the change will be delivered to affected users before, during, and after the upgrade.\n\nThe plan covers five dimensions:\n\nAudience analysis: The 500 internal users are not a homogeneous group. I identify sub-groups with different relationships to the system: heavy users who use it daily and whose workflows will be significantly disrupted, light users who use it occasionally, technical users who may need more detailed information, and managers who need to understand the business impact. Each group needs communication tailored to their specific concerns and informaiton needs.\n\nMessage architecture: The core messages that must be consistent across all communications: what is changing and why, when the change happens, what users need to do to prepare, where to get help, and how to provide feedback. These messages form the backbone of all communications in the plan.\n\nCommunication timeline:\n\n8 weeks before: Executive announcement of the upcoming change with business rationale.\n6 weeks before: Department-level briefings with more detail about what changes in each team's workflow.\n4 weeks before: Training materials and sessions available to all users.\n2 weeks before: Reminder communications with key dates and preparation checklist.\n1 week before: Final reminder with help resources prominently featured.\nDay of upgrade: Status updates through the day.\nDay after: Confirmation that systems are live and feedback invitation.\n2 weeks after: Survey to assess adoption and identify remaining support needs.\n\nFeedback channels: How users can ask questions and raise concerns. A dedicated email alias, a FAQ document that is updated as questions arise, and regular office hours with the project team.\n\nSuccess metrics: What the communication plan is trying to achieve, measured as: awareness of the change (surveyed before launch), preparation completion rate, help desk contact volume post-launch (lower than baseline indicates effective preparation), and user satisfaction with the communication at 2 weeks post-launch.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "telecom",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a fintech company. What is DITA and how would you use it in a large-scale documentation project?",
      a: `DITA, which stands for Darwin Information Typing Architecture, is an XML-based open standard for structuring technical documentation. It was developed by IBM and is now maintained by OASIS. It is primarily used in large organizations that produce documentation at scale across multiple products, teams, and output channels.\n\nThe core concept of DITA is topic-based authoring. Instead of writing documentation as continuous documents — chapters, sections, paragraphs — DITA breaks content into discrete, self-contained topics. Each topic covers one concept, one task, or one piece of reference information. Topics are reusable: the same topic about how to authenticate with an API can be included in a quick start guide, a developer guide, and an SDK reference without being copied or maintained in multiple places.\n\nDITA topic types:\n\nConcept topics explain what something is. Task topics describe how to do something, always in numbered steps. Reference topics provide factual information that users look up rather than read — parameter tables, error codes, configuration settings.\n\nHow I would use it in a large-scale fintech documentation project:\n\nFor a fintech company with multiple products sharing common infrastructure — authentication, payment processing, webhooks — DITA enables the authentication documentation to be written once and included in the documentation for every product. When the authentication system changes, updating one DITA topic updates all the documentation that includes it.\n\nFor publishing, DITA content is processed through a DITA Open Toolkit to generate multiple output formats: HTML for the online help center, PDF for downloadable guides, and increasingly, structured data formats that can feed AI knowledge bases.\n\nDITA has a significant learning curve and requires tooling investment — authoring tools like Oxygen XML Editor, and content management systems that support DITA. For a fintech company with a small documentation team producing limited documentation, the overhead is not justified. For a team managing thousands of topics across dozens of products, DITA becomes a productivity and quality multiplier.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "fintech",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a bank. You need to create training documentation for a new core banking system. What makes banking system training documentation different from standard software documentation?",
      a: `Banking system training documentation operates under constraints and serves purposes that standard software documentation does not encounter, making it a specialized discipline within technical writing.\n\nRegulatory accountability: Every action a bank employee takes in a core banking system can be subject to regulatory audit. The training documentation must not just explain how to perform tasks but also explain why specific procedures exist — which regulatory requirements they satisfy — so that trained staff understand the compliance context, not just the mechanical steps. A staff member who understands that a specific KYC verification step exists because of RBI account opening guidelines is more likely to follow it correctly than one who follows it as a ritual without understanding its purpose.\n\nError consequences: Errors in a core banking system have financial consequences for customers, the bank, and potentially for the individual employee. Training documentation must address error scenarios explicitly and in detail: what happens if a wrong account number is entered, how to reverse a transaction, when to escalate rather than attempt self-correction. Standard software documentation rarely needs this level of error consequence detail.\n\nRole-based access and documentation: Different staff roles have different system access and different responsibilities. The documentation must be structured by role — teller procedures, branch manager override procedures, back-office reconciliation procedures — so that each staff member is trained only on their specific responsibilities rather than on the entire system.\n\nAudit trail requirements: Training documentation for a core banking system typically includes documentation of completion — a record that specific staff have been trained on specific procedures. The documentation must be designed to support this tracking, whether through formal acknowledgment forms or learning management system integration.\n\nUpdate processes: When banking procedures change due to regulatory updates or product changes, the training documentation must be updated and staff must be retrained. The documentation must include clear version information and a process for communicating updates to trained staff.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "banking",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at an insurance company. You have been asked to document a machine learning model used for claim fraud detection. What are the documentation requirements for an AI/ML model in a regulated industry?",
      a: `Documenting a machine learning model for fraud detection in insurance is a specialized technical writing challenge that intersects with model governance, regulatory compliance, and explainability requirements. The documentation serves multiple audiences: data scientists, business stakeholders, compliance teams, and potentially regulators.\n\nDocumentation requirements:\n\nModel purpose and scope: A clear statement of what the model does, what it is used for, and what it is not designed to handle. For a fraud detection model, this includes the specific claim types it evaluates, the geographic scope, and any policy types or customer segments it excludes.\n\nTraining data documentation: What data was used to train the model, what time period it covers, where it came from, how it was preprocessed, and what the class distribution was. In fraud detection, class imbalance is significant — genuine claims vastly outnumber fraudulent ones — and how this was addressed in training must be documented.\n\nFeature documentation: A complete list of all input features the model uses, with descriptions of each feature, its data type, and its source. In regulated contexts, certain features may be restricted from use in models that affect individuals — characteristics that could constitute discriminatory criteria under applicable law.\n\nModel performance metrics: The accuracy, precision, recall, and AUC-ROC of the model on the evaluation set, with the specific thresholds used for classification decisions. In fraud detection, the trade-off between false positive rate (legitimate claims incorrectly flagged) and false negative rate (fraudulent claims missed) is a business and ethical decision that must be documented.\n\nExplainability: For regulatory compliance and for claims handlers who must act on model outputs, the documentation should explain what factors most significantly influence the model's fraud score. IRDAI guidelines on fair treatment of policyholders require that claim decisions be explainable.\n\nModel monitoring and retraining schedule: How model performance is monitored in production, what triggers a retraining cycle, and how model drift is detected and addressed.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "insurance",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a telecom company. You need to write a network topology document for the engineering team. What information does it need to contain and how do you gather it?",
      a: `A network topology document for an engineering team is a reference document that must accurately represent the current state of the network infrastructure and be updatable when that state changes. Its accuracy is more important than its elegance — an inaccurate network diagram creates operational risk.\n\nInformation it needs to contain:\n\nNetwork diagrams: Visual representations of how network components connect, organized by layer (core, distribution, access), by geographic region, and by function (data, voice, management). Multiple diagram types serve different purposes and different audiences within the engineering team.\n\nComponent inventory: A complete list of all network devices with their model, firmware version, physical location, IP address, management access information, and role in the network. This inventory must be searchable and must correspond exactly to the diagrams.\n\nInterconnection details: How each device connects to others — port numbers, cable types, VLAN configurations, routing protocols in use. This level of detail is essential for troubleshooting and for capacity planning.\n\nRedundancy and failover: Which paths and components have redundancy, how failover is triggered, and what the expected behavior is during a failover event.\n\nCapacity information: Current utilization rates for key links and devices, and what the capacity thresholds are that trigger upgrade planning.\n\nHow I gather it:\n\nFor existing infrastructure, I combine documentation from network management tools (which can export current configurations and topology automatically), interviews with network engineers who know the undocumented details, and in some cases physical inspection for physical layer information.\n\nThe most important principle for gathering network documentation: do not trust existing documentation as accurate. I treat existing diagrams as a starting point to be verified, not as the source of truth. Networks change faster than documentation and undocumented changes are the norm.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "telecom",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a fintech company. What is the difference between documentation and a specification, and when do you write each?",
      a: `Documentation and specifications serve different purposes in the software development lifecycle, and conflating them produces documents that do neither job well.\n\nA specification is a prescriptive document that defines what a system should do — written before or during development to guide how something will be built. Specifications are living documents during the design and development phase, and they are written by the people defining what will be built: product managers, architects, and sometimes developers. The audience is the people building the system. The purpose is to constrain and guide implementation decisions.\n\nA specification answers questions like: what are the requirements for this feature, what inputs does this function accept and what outputs does it produce, what are the performance requirements for this API endpoint. Specifications can be functional (what behavior is required) or technical (how the behavior should be implemented).\n\nDocumentation is a descriptive document that explains what a system does — written after or during development to help users, developers, or operators understand and use the system as it exists. Documentation reflects reality; specification defines an intended reality. The audience for documentation is typically broader and less technical than the specification audience.\n\nWhen to write each:\n\nSpecifications are written before implementation, as input to the development process. A feature specification is written by the product manager before engineers begin building. An API specification is written before the API is implemented, possibly using a specification format like OpenAPI.\n\nDocumentation is written after the implementation is complete enough to document accurately, or in parallel with development for iterative documentation. Documenting a feature before it is built is specification, not documentation — even if it is called documentation.\n\nThe practical confusion: developers sometimes call specifications documentation because both are written documents about software. Technical writers must clarify which is needed and when, because the writing process, the review process, and the maintenance process are fundamentally different.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "fintech",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at a bank. A new joiner on your documentation team has produced a first draft that is technically accurate but written in a passive, impersonal voice throughout. How do you give feedback and coach them?",
      a: `Giving feedback to a new writer requires balancing honest assessment with encouragement and providing specific, actionable guidance rather than general criticism. How feedback is given shapes whether the new writer improves quickly or becomes defensive and demoralized.\n\nI start by identifying what the draft does well and say this first, specifically. If the draft is technically accurate, that is genuinely valuable and non-trivial. "The technical content here is solid — you clearly understood what you were writing about and the information is accurate" is honest positive feedback that establishes credibility before the improvement conversation.\n\nFor the passive voice issue, I do not say "this is written in passive voice which is bad." I explain the principle and show the difference:\n\n"There is a pattern in this draft that I want to help you address. Technical writing is most effective when it is direct and tells the reader exactly what to do or what happens. Here is an example from your draft: 'The form should be submitted by the user after all fields have been completed.' Here is the same information in active voice: 'Submit the form after you complete all fields.' The second version is shorter, clearer, and puts the reader at the center of the instruction. This pattern appears throughout the draft — I have marked the instances in the document."\n\nI then ask the new writer to revise a section themselves rather than revising it for them, and I offer to review the revision and discuss what they changed and why.\n\nFor ongoing coaching, I establish a pattern: write, review together, revise, review again. I give specific positive reinforcement when I see improvement. "This paragraph you revised is much stronger — notice how much clearer the instruction is now." Naming the specific improvement helps the writer internalize what good looks like.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "banking",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a technical writer at an insurance company. You need to write accessibility guidelines for your documentation team. What are the most important accessibility considerations for technical documentation?",
      a: `Accessibility in technical documentation means ensuring that content is usable by people with disabilities, including visual impairments, cognitive differences, motor impairments, and hearing impairments. In an insurance context, accessibility is both a legal requirement and an ethical obligation.\n\nMost important accessibility considerations:\n\nAlternative text for images and diagrams: Every image, diagram, chart, and screenshot must have descriptive alternative text that communicates the same information as the visual. For process diagrams, the alt text should describe the process, not just label the image as "process diagram." Screen readers read alt text aloud for visually impaired users who cannot see the images.\n\nHeading structure: Documents must use a logical heading hierarchy — H1, H2, H3 — in sequence, never skipping levels. Screen reader users navigate documents by heading structure. A document without proper heading hierarchy is unnavigable for a screen reader user.\n\nColor and contrast: Information must never be conveyed by color alone because color-blind users cannot distinguish it. "Red text indicates an error" is not accessible; "red text with an error icon and the label Error indicates an error" is. Color contrast ratios must meet WCAG standards — 4.5:1 for normal text, 3:1 for large text.\n\nLink text: Links must be descriptively labeled. "Click here" is inaccessible because a screen reader user navigating by links hears a list of "click here" links with no context. "Download the claim form" is accessible because it describes what the link leads to.\n\nTable accessibility: Data tables must have header rows identified as headers, not just formatted to look like headers. Screen readers use table header information to provide context for each cell.\n\nReadable language: Plain language is an accessibility requirement, not just a quality preference. Users with cognitive disabilities, low literacy, or limited English proficiency benefit from short sentences, common words, and clear structure.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "insurance",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
  ],
  ai_content: [
    {
      q: "You are an AI content designer at a SaaS company. You need to design the conversational flow for an AI onboarding assistant that helps new users set up their account. What are the principles that guide this design?",
      a: `An AI onboarding assistant has a specific and high-stakes job: get users to the point where they experience the product's core value as quickly as possible, while gathering the setup information needed for the product to work. The principles that guide this design:\n\nPrinciple 1 — Progress over perfection: The onboarding assistant should get users to a working setup quickly, even if it is not a fully optimized setup. A user who has a basic, functional account on day one is more likely to return than one who abandoned a comprehensive setup flow on day one. Required fields only in the initial onboarding; optional customization later.\n\nPrinciple 2 — Explain the why, not just the what: When the assistant asks for information, it should explain why it needs it. "What industry are you in?" feels interrogative. "What industry are you in? We'll tailor the templates and examples to your context." feels useful.\n\nPrinciple 3 — Acknowledge and confirm before proceeding: After each user input, the assistant confirms receipt and meaning before proceeding. "Got it — you're setting up for a team of 12 in financial services. Here's what I'll set up for you:" This prevents the user from feeling like they are filling out a form that disappears into a void.\n\nPrinciple 4 — Make skipping easy but not necessary: Users should be able to skip any step they do not want to complete during onboarding, with the understanding that they can return to it later. But the skip path should not be the most prominent option — the completion path should be.\n\nPrinciple 5 — Celebrate the end: When setup is complete, the assistant should celebrate it specifically. Not "Setup complete" but "You're all set — your workspace is configured for your team. Here's what we set up: [specific list]. Ready to see your first dashboard?"\n\nPrinciple 6 — One question at a time: Conversational onboarding fails when it presents multiple questions simultaneously. Each turn should contain one question. The user's answer determines the next question.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "fintech",
      tracks: ["AI Content"],
      companies: [],
      roundType: "ai_content",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are an AI content engineer at a bank. The bank wants to use AI to generate first drafts of customer complaint responses. What are the risks and how do you mitigate them?",
      a: `AI-generated complaint responses in a banking context carry significant risks that require careful mitigation, because complaint responses have legal, regulatory, and customer relationship implications that make errors costly.\n\nRisk 1 — Factual inaccuracy about the customer's account:\n\nThe AI may generate a response that references account details, transaction amounts, or policy terms incorrectly. In a complaint context, a factually wrong response from the bank creates a new grievance on top of the original.\n\nMitigation: The AI must have access to the specific customer's verified account data for the complaint in question, and the generated response must be reviewed by a human agent who can verify factual claims before the response is sent.\n\nRisk 2 — Regulatory non-compliance:\n\nRBI grievance redressal guidelines specify what must be included in complaint responses — acknowledgment timelines, resolution procedures, escalation paths, and mandatory disclosure language. An AI that has not been specifically trained on these requirements may generate responses that omit required elements.\n\nMitigation: The system prompt must include the mandatory regulatory elements that all complaint responses must contain, and a compliance check layer should verify their presence before human review.\n\nRisk 3 — Inappropriate tone for sensitive complaints:\n\nComplaints about fraud, unauthorized transactions, or significant financial loss require empathetic, careful communication. An AI that generates a formulaic "thank you for your feedback" response to a customer who has reported losing ₹5 lakhs to fraud creates a serious brand and relationship problem.\n\nMitigation: Complaints must be classified by severity and type before AI response generation. High-severity complaints (fraud, major errors, complaints already escalated to the Banking Ombudsman) should have the AI draft reviewed at senior levels or bypassed entirely.\n\nRisk 4 — Creating legal commitments the bank cannot keep:\n\nAI responses may generate statements that constitute commitments — "we will resolve this within 48 hours," "we will refund the full amount" — that the bank has not authorized.\n\nMitigation: The system prompt must explicitly prohibit commitment language and require qualified language instead. Human review must specifically check for unauthorized commitments.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "banking",
      tracks: ["AI Content"],
      companies: [],
      roundType: "ai_content",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
  ],
  content_strategy: [
    {
      q: "You are a technical writer at a bank. You need to document the bank's incident response procedure for a cybersecurity breach. What makes this documentation different and what are the special considerations?",
      a: `Cybersecurity incident response documentation has unique requirements that distinguish it from standard operational procedures, because it is used in adversarial conditions — the incident itself may compromise the systems where the documentation is stored.\n\nSpecial considerations:\n\nOffline accessibility: If the cybersecurity incident involves the bank's network or internal systems, the documentation stored on those systems may be inaccessible during the very incident it is designed to address. Incident response documentation must be available offline: printed copies in secured physical locations, offline storage devices, and access through external channels that do not depend on the compromised network.\n\nNeed-to-know access control: Detailed incident response procedures, escalation contacts, and vulnerability information should not be accessible to all staff. The documentation access control must match the sensitivity of the information contained, while ensuring that the people who need it during an incident can access it quickly.\n\nContainment versus disclosure sequence: The documentation must clearly specify the sequence of containment, forensic preservation, and disclosure actions. Incorrect sequencing — disclosing before containing, or containing before preserving forensic evidence — can both worsen the incident and create legal problems.\n\nRegulatory notification requirements: RBI regulations specify notification timelines for cybersecurity incidents at banks. CERT-In also has specific reporting requirements. The documentation must include the specific notification requirements, the notification timelines, the information that must be included in regulatory notifications, and who is authorized to make those notifications.\n\nCommunication security: During a cybersecurity incident, the bank's normal communication channels may be compromised. The documentation must specify alternative communication channels — encrypted messaging apps, out-of-band phone lines — to use when normal channels cannot be trusted.\n\nPost-incident forensic requirements: What evidence must be preserved, in what format, by whom, and for how long, to support both internal investigation and potential law enforcement involvement.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "banking",
      tracks: ["Technical Docs"],
      companies: [],
      roundType: "technical_docs",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are an AI content engineer at a bank. The bank wants to use generative AI to produce first drafts of product descriptions for new financial products. What governance process do you put in place?",
      a: `Using generative AI to produce first drafts of financial product descriptions requires a governance process that addresses the specific risks of AI-generated financial content: factual inaccuracy, regulatory non-compliance, and commitments the bank did not intend to make.\n\nGovernance process:\n\nStage 1 — Input governance:\n\nBefore the AI generates any content, I establish what inputs it receives and what it does not. The AI should receive: the product's approved term sheet, the intended audience segment, the mandatory regulatory disclosure requirements, the brand voice guidelines, and examples of approved product descriptions for similar products. The AI should not have discretion about product terms — every term in the generated content must come from the approved term sheet, not be inferred or estimated by the model.\n\nStage 2 — Generation with constraints:\n\nThe system prompt constrains the AI's output explicitly: all financial terms must match the approved term sheet exactly, all rates must be taken from the input data (the AI cannot estimate rates), mandatory regulatory language must appear verbatim as provided, and no commitments beyond what is in the term sheet can be made.\n\nStage 3 — Factual accuracy review:\n\nThe first review is a factual accuracy check against the term sheet, conducted by the product team. Every financial term, rate, fee, and condition in the AI-generated draft is verified against the approved term sheet. Any discrepancy is an error, not a suggestion.\n\nStage 4 — Regulatory compliance review:\n\nThe compliance team reviews for mandatory disclosures, prohibited language, and regulatory accuracy. This review cannot be delegated or abbreviated regardless of the AI's output quality.\n\nStage 5 — Legal review for commitment language:\n\nLegal reviews for inadvertent commitments, guarantee language, and any statements that could create obligations the bank did not intend.\n\nStage 6 — Final approval:\n\nAll three review stages must be completed and approved before any AI-generated content is published.`,
      subcategory: null,
      difficulty: "Hard",
      domain: "banking",
      tracks: ["AI Content"],
      companies: [],
      roundType: "ai_content",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
    {
      q: "You are a content strategist at a fintech company. How do you create a taxonomy for a financial services help center and why does taxonomy matter?",
      a: `Taxonomy is the classification system that determines how content is organized and navigated in a help center. It matters because it directly determines whether users can find the information they need — a help center with excellent content but poor taxonomy is functionally inaccessible.\n\nWhy taxonomy matters specifically for financial services:\n\nFinancial services products have overlapping concepts that can be organized in multiple logical ways. "How to transfer money" could be classified under Accounts, Payments, or Features. "Interest on savings" could be under Accounts, Interest & Fees, or How banking works. Without a deliberate taxonomy, similar content ends up in different categories depending on who created it, and users search for content in the obvious category only to find it was placed in a different one.\n\nApproach to creating the taxonomy:\n\nUser research foundation: I base the taxonomy on how users think about their questions, not on how the bank organizes its products internally. Card sorting exercises with representative users reveal the mental models they use to categorize financial information. This is the most important input — without it, the taxonomy reflects internal thinking rather than user thinking.\n\nTop-level categories: For a fintech help center, effective top-level categories typically follow user tasks or life events: Getting started, Managing my account, Payments and transfers, Cards, Loans and credit, Security and fraud, and Fees and charges. These are oriented around what users want to do rather than product names.\n\nDepth limits: Effective help center taxonomies are typically no deeper than three levels. Category → Subcategory → Article. Deeper hierarchies require users to navigate multiple levels to reach content, increasing friction and abandonment.\n\nMultiple entry points: The same article may be relevant to multiple categories. A well-designed taxonomy either allows articles to appear in multiple places (with canonical URLs to avoid search engine duplication) or uses a robust tagging and search system that surfaces content regardless of where it is placed.`,
      subcategory: null,
      difficulty: "Medium",
      domain: "fintech",
      tracks: ["Content Strategy"],
      companies: [],
      roundType: "content_strategy",
      whatInterviewerTests: "",
      commonMistakes: [],
    },
  ]
};

// Read the existing file
const filePath = path.join(__dirname, 'src/data/technicalWritingQuestions.js');
let fileContent = fs.readFileSync(filePath, 'utf-8');

// Parse the existing data to find where to insert new questions
const technicalWriterIndex = fileContent.indexOf('"Technical Writer":');
if (technicalWriterIndex === -1) {
  console.error('Could not find "Technical Writer" object in the file');
  process.exit(1);
}

// For each roundType, find the array and append questions
let modifiedContent = fileContent;
let questionsAdded = 0;

// Function to append questions to an array
function appendQuestionsByRoundType(content, roundType, questions) {
  const arrayName = roundType;
  const pattern = new RegExp(`"${arrayName}":\\s*\\[`, 'g');

  let matchCount = 0;
  let lastMatchIndex = -1;

  // Find all occurrences
  let match;
  while ((match = pattern.exec(content)) !== null) {
    matchCount++;
    lastMatchIndex = match.index;
  }

  if (matchCount === 0) {
    console.error(`Could not find "${arrayName}" array`);
    return content;
  }

  // Find the closing bracket of the Technical Writer object's roundType array
  // We need the LAST occurrence of the array (latest one being added to)
  pattern.lastIndex = 0;
  let targetIndex = -1;
  let currentIndex = 0;

  while ((match = pattern.exec(content)) !== null) {
    currentIndex = match.index;
    // Check if this match is within the Technical Writer object
    // by verifying it comes after the Technical Writer declaration
    if (currentIndex > technicalWriterIndex) {
      // Check if we've found the right array by looking at what comes after
      const contextBefore = content.substring(Math.max(0, currentIndex - 100), currentIndex);
      if (contextBefore.includes('"Technical Writer"') || !contextBefore.includes('"')) {
        targetIndex = currentIndex;
      }
    }
  }

  if (targetIndex === -1) {
    console.error(`Could not find proper location for "${arrayName}" in Technical Writer object`);
    return content;
  }

  // Find the opening bracket
  const bracketIndex = content.indexOf('[', targetIndex);
  if (bracketIndex === -1) {
    console.error(`Could not find opening bracket for "${arrayName}" array`);
    return content;
  }

  // Find the closing bracket
  let bracketCount = 1;
  let closeIndex = bracketIndex + 1;
  while (bracketCount > 0 && closeIndex < content.length) {
    if (content[closeIndex] === '[') bracketCount++;
    if (content[closeIndex] === ']') bracketCount--;
    closeIndex++;
  }
  closeIndex--; // Back to the closing bracket

  // Format the new questions
  const formattedQuestions = questions.map(q => {
    return `      ${JSON.stringify(q, null, 12)}`;
  }).join(',\n');

  // Insert the questions before the closing bracket
  const beforeClose = content.substring(0, closeIndex);
  const afterClose = content.substring(closeIndex);

  // Check if there are existing questions in the array
  const arrayContent = content.substring(bracketIndex + 1, closeIndex);
  const hasQuestions = arrayContent.trim().length > 0 && arrayContent.trim() !== '';

  let insertedContent;
  if (hasQuestions) {
    insertedContent = beforeClose + ',\n' + formattedQuestions + '\n    ' + afterClose;
  } else {
    insertedContent = beforeClose + '\n' + formattedQuestions + '\n    ' + afterClose;
  }

  return insertedContent;
}

// Append questions for each roundType
modifiedContent = appendQuestionsByRoundType(modifiedContent, 'ux_writing', questionsToAppend.ux_writing);
questionsAdded += questionsToAppend.ux_writing.length;

modifiedContent = appendQuestionsByRoundType(modifiedContent, 'technical_docs', questionsToAppend.technical_docs);
questionsAdded += questionsToAppend.technical_docs.length;

modifiedContent = appendQuestionsByRoundType(modifiedContent, 'ai_content', questionsToAppend.ai_content);
questionsAdded += questionsToAppend.ai_content.length;

modifiedContent = appendQuestionsByRoundType(modifiedContent, 'content_strategy', questionsToAppend.content_strategy);
questionsAdded += questionsToAppend.content_strategy.length;

// Write the modified content back
fs.writeFileSync(filePath, modifiedContent, 'utf-8');

console.log(`Successfully appended ${questionsAdded} questions to the file`);
console.log('Done!');
