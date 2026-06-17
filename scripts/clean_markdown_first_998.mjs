import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pmQuestionsPath = path.join(__dirname, '../src/data/pmQuestions.js');

// Read the file
let fileContent = fs.readFileSync(pmQuestionsPath, 'utf-8');

// Function to clean markdown
function cleanMarkdown(text) {
  if (!text || typeof text !== 'string') return text;

  // Remove ** but keep the text
  text = text.replace(/\*\*(.+?)\*\*/g, '$1');

  // Remove ## and ### headings but keep the text
  text = text.replace(/#{2,3} +(.+?)(?=\n|$)/g, '$1');

  // Replace em dashes with hyphen
  text = text.replace(/—/g, '-');

  // Replace double hyphens with single hyphen
  text = text.replace(/--/g, '-');

  return text;
}

// Parse the file by finding the PM_QUESTIONS object definition
const pmQuestionsMatch = fileContent.match(/const PM_QUESTIONS = ({[\s\S]*?^};)/m);
if (!pmQuestionsMatch) {
  console.error('Could not find PM_QUESTIONS definition');
  process.exit(1);
}

const objectStr = pmQuestionsMatch[1];

// Parse the object - remove trailing semicolon if present
let cleanObjectStr = objectStr.trim();
if (cleanObjectStr.endsWith(';')) {
  cleanObjectStr = cleanObjectStr.slice(0, -1);
}

// Parse the object
let pmQuestions;
try {
  pmQuestions = eval('(' + cleanObjectStr + ')');
} catch (e) {
  console.error('Failed to parse PM_QUESTIONS:', e.message);
  console.error('Attempted to parse:', cleanObjectStr.substring(0, 100) + '...');
  process.exit(1);
}

// Count questions and process only the first 998
let questionCount = 0;
const maxQuestionsToClean = 998;

function processQuestions(obj) {
  for (const level in obj) {
    const levelData = obj[level];
    if (typeof levelData !== 'object' || !levelData) continue;

    for (const category in levelData) {
      const questions = levelData[category];
      if (!Array.isArray(questions)) continue;

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        questionCount++;

        // Only clean first 998 questions
        if (questionCount <= maxQuestionsToClean) {
          if (q.a && typeof q.a === 'string') {
            q.a = cleanMarkdown(q.a);
          }
        }
      }
    }
  }
}

processQuestions(pmQuestions);

console.log(`Total questions found: ${questionCount}`);
console.log(`Cleaned first ${Math.min(questionCount, maxQuestionsToClean)} questions`);
console.log(`Left ${Math.max(0, questionCount - maxQuestionsToClean)} questions unchanged`);

// Reconstruct the file
const newObjectStr = JSON.stringify(pmQuestions, null, 2);

// Get everything before the PM_QUESTIONS definition
const beforeMatch = fileContent.match(/^([\s\S]*?)const PM_QUESTIONS = /);
const beforeContent = beforeMatch ? beforeMatch[1] : '';

const newContent = `${beforeContent}const PM_QUESTIONS = ${newObjectStr};

export { PM_QUESTIONS as pmQuestions };
`;

fs.writeFileSync(pmQuestionsPath, newContent, 'utf-8');

console.log(`✓ Saved to ${pmQuestionsPath}`);
