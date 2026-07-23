import fs from 'fs';
import path from 'path';

// Read both files
const improvedFilePath = 'src/data/pmQuestions_remaining_improved.js';
const originalFilePath = 'src/data/pmQuestions.js';

console.log('Loading improved answers...');
const absoluteImprovedPath = path.resolve(improvedFilePath);
const fileUrl = new URL(`file:///${absoluteImprovedPath.replace(/\\/g, '/')}`).href;
const improvedModule = await import(fileUrl);
const improvedAnswers = improvedModule.pmQuestionsRemainingImproved;
console.log(`Loaded ${improvedAnswers.length} improved answers`);

console.log('Loading original questions...');
// For the original file, we need to load it as a module too
const absoluteOriginalPath = path.resolve(originalFilePath);
const originalFileUrl = new URL(`file:///${absoluteOriginalPath.replace(/\\/g, '/')}`).href;
const originalModule = await import(originalFileUrl);
const PM_QUESTIONS = originalModule.pmQuestions;

console.log('Loaded original questions structure');

// Build a map of improved answers by question text
const improvedMap = new Map();
improvedAnswers.forEach(item => {
  improvedMap.set(item.q, item.a);
});

console.log(`Built map with ${improvedMap.size} questions`);

// Traverse the nested structure and update answers
let matchCount = 0;
let unmatchedQuestions = [];

// The structure is: PM_QUESTIONS[level][category][index] = { q, a, ... }
Object.keys(PM_QUESTIONS).forEach(level => {
  const levelData = PM_QUESTIONS[level];
  if (typeof levelData === 'object' && levelData !== null) {
    Object.keys(levelData).forEach(category => {
      const categoryData = levelData[category];
      if (Array.isArray(categoryData)) {
        categoryData.forEach((question, index) => {
          if (question.q && improvedMap.has(question.q)) {
            const improvedAnswer = improvedMap.get(question.q);
            categoryData[index].a = improvedAnswer;
            matchCount++;
          }
        });
      }
    });
  }
});

// Collect unmatched questions from improved set
improvedAnswers.forEach(item => {
  let found = false;
  Object.keys(PM_QUESTIONS).forEach(level => {
    const levelData = PM_QUESTIONS[level];
    if (typeof levelData === 'object' && levelData !== null) {
      Object.keys(levelData).forEach(category => {
        const categoryData = levelData[category];
        if (Array.isArray(categoryData)) {
          categoryData.forEach(question => {
            if (question.q === item.q) {
              found = true;
            }
          });
        }
      });
    }
  });
  if (!found) {
    unmatchedQuestions.push(item.q);
  }
});

console.log(`\n=== MERGE RESULTS ===`);
console.log(`Questions updated: ${matchCount}`);

if (unmatchedQuestions.length > 0) {
  console.log(`\nQuestions from improved file with NO MATCH in original:`);
  unmatchedQuestions.sort().slice(0, 20).forEach((q, idx) => {
    console.log(`  ${idx + 1}. ${q.substring(0, 80)}${q.length > 80 ? '...' : ''}`);
  });
  if (unmatchedQuestions.length > 20) {
    console.log(`  ... and ${unmatchedQuestions.length - 20} more`);
  }
  console.log(`\nTotal unmatched: ${unmatchedQuestions.length}`);
}

// Now serialize the modified structure back
console.log(`\nSerializing updated structure...`);

// Helper to serialize - we need to match the original format
// The original uses: export { PM_QUESTIONS as pmQuestions };
// And has: export const PM_LEVELS = [...];
// And: export const DS_LEVELS = [...];

// Read the original file to get the headers
let originalContent = fs.readFileSync(originalFilePath, 'utf8');

// Extract the PM_LEVELS and DS_LEVELS from the content (keep them unchanged)
const levelsMatch = originalContent.match(/export const PM_LEVELS = \[([\s\S]*?)\];/);
const dsLevelsMatch = originalContent.match(/export const DS_LEVELS = \[([\s\S]*?)\];/);

const pm_levels_text = levelsMatch ? `export const PM_LEVELS = [${levelsMatch[1]}];` : '';
const ds_levels_text = dsLevelsMatch ? `export const DS_LEVELS = [${dsLevelsMatch[1]}];` : '';

// Serialize PM_QUESTIONS
function serializeObject(obj, indent = 0) {
  const spaces = ' '.repeat(indent);
  const nextIndent = indent + 2;
  const nextSpaces = ' '.repeat(nextIndent);

  if (obj === null) return 'null';
  if (typeof obj === 'string') {
    // Escape special characters for JSON
    const escaped = obj
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `"${escaped}"`;
  }
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => `${nextSpaces}${serializeObject(item, nextIndent)}`);
    return `[\n${items.join(',\n')}\n${spaces}]`;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    const items = keys.map(key => `${nextSpaces}"${key}": ${serializeObject(obj[key], nextIndent)}`);
    return `{\n${items.join(',\n')}\n${spaces}}`;
  }

  return String(obj);
}

const pmQuestionsText = `const PM_QUESTIONS = ${serializeObject(PM_QUESTIONS, 0)};`;

// Write the complete file
const newContent = `${pm_levels_text}

${ds_levels_text}

${pmQuestionsText}

export { PM_QUESTIONS as pmQuestions };
`;

fs.writeFileSync(originalFilePath, newContent, 'utf8');
console.log(`Successfully wrote updated pmQuestions.js`);
