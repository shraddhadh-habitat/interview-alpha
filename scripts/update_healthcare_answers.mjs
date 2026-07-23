import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { pmQuestions, PM_LEVELS, DS_LEVELS } from '../src/data/pmQuestions.js';
import { pmQuestionsHealthcareImproved } from '../src/data/pmQuestions_healthcare_improved.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create map of improved answers by question text
const improvedMap = new Map();
pmQuestionsHealthcareImproved.forEach(item => {
  improvedMap.set(item.q, item.a);
});

console.log(`Loaded ${improvedMap.size} improved answers`);

// Update questions
let updateCount = 0;
for (const [level, bank] of Object.entries(pmQuestions || {})) {
  if (!bank) continue;
  for (const [cat, qList] of Object.entries(bank)) {
    if (!Array.isArray(qList)) continue;
    for (let i = 0; i < qList.length; i++) {
      if (improvedMap.has(qList[i].q)) {
        qList[i].a = improvedMap.get(qList[i].q);
        updateCount++;
      }
    }
  }
}

console.log(`Updated ${updateCount} answers`);

// Write updated pmQuestions back to file
const outputPath = path.join(__dirname, '../src/data/pmQuestions.js');

let output = `export const PM_LEVELS = ${JSON.stringify(PM_LEVELS, null, 2)};\n\n`;
output += `export const DS_LEVELS = ${JSON.stringify(DS_LEVELS, null, 2)};\n\n`;
output += `const PM_QUESTIONS = ${JSON.stringify(pmQuestions, null, 2)};\n\n`;
output += `export { PM_QUESTIONS as pmQuestions };\n`;

fs.writeFileSync(outputPath, output, 'utf-8');
console.log(`Wrote updated pmQuestions.js with ${updateCount} improved answers`);
