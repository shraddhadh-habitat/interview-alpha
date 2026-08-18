const fs = require('fs');

const sourceFile = '/tmp/source_questions.txt';
const targetFile = '/c/Users/Shrad/interview-alpha/src/data/consultingQuestions.js';

console.log('Reading files...');
let sourceContent = fs.readFileSync(sourceFile, 'utf-8');
let targetContent = fs.readFileSync(targetFile, 'utf-8');

console.log(`Source file size: ${sourceContent.length} chars`);
console.log(`Target file size: ${targetContent.length} chars`);

// Extract questions by role
const roles = [
  {header: 'MANAGEMENT CONSULTANT - add 10 more', label: 'Management Consultant', expectedCount: 10},
  {header: 'CONSULTANT - add 5 more profitability', label: 'Consultant', expectedCount: 5},
  {header: 'STRATEGY CONSULTANT - add 5 more', label: 'Strategy Consultant', expectedCount: 5},
  {header: 'OPERATIONS CONSULTANT - add 5 more', label: 'Operations Consultant', expectedCount: 5},
  {header: 'FINANCIAL ADVISORY CONSULTANT - add 5 more', label: 'Financial Advisory Consultant', expectedCount: 5},
  {header: 'SENIOR CONSULTANT - add 4 more', label: 'Senior Consultant', expectedCount: 4},
  {header: 'ADVISORY CONSULTANT - add 4 more', label: 'Advisory Consultant', expectedCount: 4},
  {header: 'RISK CONSULTANT - add 4 more', label: 'Risk Consultant', expectedCount: 4},
  {header: 'SUPPLY CHAIN CONSULTANT - add 4 more', label: 'Supply Chain Consultant', expectedCount: 4},
  {header: 'DIGITAL CONSULTANT - add 4 more', label: 'Digital Consultant', expectedCount: 4},
];

const questionsByRole = {};

for (const role of roles) {
  const headerIdx = sourceContent.indexOf(role.header);
  if (headerIdx === -1) {
    console.log(`No header found: ${role.label}`);
    continue;
  }

  // Find next role header
  let nextHeaderIdx = sourceContent.length;
  for (let i = roles.indexOf(role) + 1; i < roles.length; i++) {
    const nextIdx = sourceContent.indexOf(roles[i].header, headerIdx + 1);
    if (nextIdx !== -1 && nextIdx < nextHeaderIdx) {
      nextHeaderIdx = nextIdx;
    }
  }

  const sectionContent = sourceContent.substring(headerIdx, nextHeaderIdx);

  // Extract all question objects from this section
  const questions = [];
  const lines = sectionContent.split('\n');
  let i = 0;

  while (i < lines.length) {
    if (lines[i].trim() === '{') {
      // Collect until matching closing brace
      const objLines = [lines[i]];
      let braceCount = 1;
      let j = i + 1;

      while (j < lines.length && braceCount > 0) {
        objLines.push(lines[j]);
        braceCount += (lines[j].match(/{/g) || []).length;
        braceCount -= (lines[j].match(/}/g) || []).length;
        j++;
      }

      questions.push(objLines.join('\n'));
      i = j;
    } else {
      i++;
    }
  }

  questionsByRole[role.label] = questions;
  console.log(`${role.label}: ${questions.length} questions`);
}

// Now append questions to target file
let totalAppended = 0;

for (const [roleLabel, questions] of Object.entries(questionsByRole)) {
  if (!questions || questions.length === 0) continue;

  // Find the "case_interview: [" pattern for this role
  const patternToFind = `"${roleLabel}": {\n    case_interview: [`;
  const roleIdx = targetContent.indexOf(patternToFind);

  if (roleIdx === -1) {
    console.log(`Role section not found in target: ${roleLabel}`);
    continue;
  }

  // Find the closing ] of the case_interview array
  const searchStart = roleIdx + patternToFind.length;
  let bracketCount = 1;
  let pos = searchStart;

  while (bracketCount > 0 && pos < targetContent.length) {
    if (targetContent[pos] === '[') bracketCount++;
    else if (targetContent[pos] === ']') bracketCount--;
    pos++;
  }

  const closingBracketPos = pos - 1;

  // Insert questions before the closing bracket
  let insertText = '';
  for (const q of questions) {
    insertText += ',\n      ' + q;
  }

  targetContent = targetContent.substring(0, closingBracketPos) + insertText + targetContent.substring(closingBracketPos);
  totalAppended += questions.length;
  console.log(`Appended ${questions.length} for ${roleLabel}`);
}

// Write the updated file
fs.writeFileSync(targetFile, targetContent, 'utf-8');
console.log(`\nTotal appended: ${totalAppended}`);

// Count final results
console.log('\nFinal counts:');
for (const [roleLabel] of Object.entries(questionsByRole)) {
  const pattern = `"${roleLabel}": {`;
  const roleIdx = targetContent.indexOf(pattern);
  if (roleIdx !== -1) {
    const section = targetContent.substring(roleIdx, roleIdx + 100000);
    const count = (section.match(/"q":/g) || []).length;
    console.log(`${roleLabel}: ${count}`);
  }
}
