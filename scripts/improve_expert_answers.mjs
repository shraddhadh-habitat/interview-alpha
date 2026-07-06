import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable not set');
  process.exit(1);
}

// Import questions using relative path
const pmQuestions = (await import('../src/data/pmQuestions.js')).pmQuestions;

// Extract all questions EXCEPT healthcare and health_wellness domains
function extractRemainingQuestions(pmQuestions) {
  const questions = [];
  for (const [level, bank] of Object.entries(pmQuestions || {})) {
    if (!bank) continue;
    for (const [cat, qList] of Object.entries(bank)) {
      if (!Array.isArray(qList)) continue;
      for (const q of qList) {
        // Filter OUT healthcare and health_wellness domains
        if (q.domain !== 'healthcare' && q.domain !== 'health_wellness') {
          questions.push({
            q: q.q,
            a: q.a,
            level,
            category: cat,
            domain: q.domain,
            tracks: q.tracks,
            difficulty: q.difficulty,
            subcategory: q.subcategory
          });
        }
      }
    }
  }
  return questions;
}

const allQuestions = extractRemainingQuestions(pmQuestions);
const questions = allQuestions.slice(1452);
console.log(`Found ${questions.length} remaining domain questions to improve\n`);

// Improve answers
const improved = [];
for (let i = 0; i < questions.length; i++) {
  const { q, a, level, category } = questions[i];

  const prompt = `You are an expert PM interview coach. Rewrite this answer so it sounds exactly like a confident, experienced PM speaking in a real interview and will impress the interviewer enough to crack the interview.

CRITICAL RULES:
- Write in first person, conversational spoken language
- Start with 2-3 clarifying questions, then state assumptions
- Include EXACTLY 2 personal observations using these framings:
  * "In past projects where I have tackled similar challenges, I noticed..."
  * "Having worked on comparable products before, I observed..."
  * "From user research I have done on similar problems, I found..."
  * "In previous roles where I have tested similar solutions, I discovered..."
  * "From data analysis I have done in similar contexts, I noticed..."
  Use different framings for variety, never repeat the same one
- Candidate OWNS every insight - never say "Company X did this"
- No company names as examples - use first person ownership
- No em dashes anywhere - use commas or full stops instead
- No bullet points, no headers, no markdown formatting
- Write as continuous natural paragraphs like actual speech
- Include specific metrics where relevant (percentages, timeframes)
- Include one clear trade-off the candidate is aware of
- Length: 300-400 words
- End with a strong memorable closing line

Question: ${q}
Current answer: ${a}

Return ONLY the rewritten conversational answer. No headers, no bullets, no markdown, no em dashes.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();
    console.log('API response status:', response.status);
    console.log('API response data:', JSON.stringify(data).slice(0, 200));
    const improvedAnswer = data.content[0].text;

    improved.push({
      q,
      a: improvedAnswer,
      level,
      category,
      original_a: a,
    });

    console.log(`Improved ${i + 1}/${questions.length}`);

    // Delay 1 second between calls
    if (i < questions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error(`Error improving question ${i + 1}:`, error.message);
  }
}

// Write results
const outputPath = path.join(__dirname, '../src/data/pmQuestions_remaining_batch2.js');
const output = `// Remaining domain PM answers improved by scripts/improve_expert_answers.mjs
// Generated: ${new Date().toISOString()}

export const pmQuestionsRemainingBatch2 = ${JSON.stringify(improved, null, 2)};
`;

fs.writeFileSync(outputPath, output, 'utf-8');
console.log(`\nSaved ${improved.length} remaining improved answers to ${outputPath}`);
