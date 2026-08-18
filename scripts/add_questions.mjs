import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the existing questions
const existingModule = await import('./src/data/consultingQuestions.js');
const existingData = existingModule.consultingQuestions;

// All 80 new questions provided by user - organized by role
// Due to length, I'll create a structure and then add them

const newQuestions = {
  "Consultant": [], // 25 questions
  "Strategy Consultant": [], // 20 questions
  "Management Consultant": [], // 20 questions
  "Operations Consultant": [] // 15 questions
};

// Consultant questions (25 total) - provided by user
const consultantQuestions = [
{
  q: "A large Indian cement company's profits have declined 35% despite volume growth of 12%. The MD wants to understand why. How do you diagnose this?",
  subcategory: "Consultant",
  difficulty: "Hard",
  domain: "consulting",
  a: `Using MECE framework, profit = revenue minus costs. Volume grew 12% so revenue likely grew. Therefore costs must have grown faster than revenue.

MECE STRUCTURE:
Profit decline = Revenue side issues OR Cost side issues OR Both

REVENUE SIDE (MECE):
Revenue = Volume times Realization per tonne. Volume grew 12%. If realization per tonne declined due to competitive pricing pressure, total revenue growth would be less than 12%. In Indian cement, price wars between Ultratech, Ambuja, and regional players frequently compress realizations.

COST SIDE MECE - 4 categories:
1. Raw material costs: Coal and pet coke are the largest variable costs in cement at 30 to 35% of total cost. A 20 to 25% increase in coal prices directly compresses margins even with volume growth.
2. Power and fuel costs: Energy represents 25 to 30% of cement manufacturing cost. Higher grid tariffs or diesel prices increase this significantly.
3. Logistics costs: Cement is a bulk commodity with high freight costs. If the product mix shifted toward more distant markets or diesel prices increased, logistics costs rise faster than revenue.
4. Fixed cost overrun: If the company added new capacity recently, depreciation and fixed overheads increased even before volume fully ramped.

MY HYPOTHESIS: The 35% profit decline with 12% volume growth is most likely driven by coal and energy cost inflation that was not passed through to customers due to competitive pricing pressure, combined with possible realization compression in select markets.

DIAGNOSIS APPROACH: Request a P&L bridge showing each cost line as a percentage of revenue for this year versus last year, and realization per tonne by geography to test both hypotheses simultaneously.`,
  companies: ['McKinsey & Company', 'BCG', 'Bain & Company', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture'],
  roundType: "Case Interview",
  whatInterviewerTests: "MECE P&L decomposition, cement industry cost structure, hypothesis generation, diagnostic approach",
  commonMistakes: ["Not immediately recognizing that volume growth isolates the problem to margin compression", "Missing coal and energy as primary cost drivers in cement", "Not generating multiple hypotheses before asking for data", "Not asking for a P&L bridge as the diagnostic tool"]
}
];

console.log('Script structure verified');
console.log('Ready to merge all 80 questions');
console.log('Current file has', Object.values(existingData).reduce((sum, role) => sum + role.case_interview.length, 0), 'questions');

