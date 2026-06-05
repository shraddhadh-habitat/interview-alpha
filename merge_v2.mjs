import fs from 'fs';

const sourceFile = 'source_questions.txt';
const targetFile = 'src/data/consultingQuestions.js';

let sourceContent = fs.readFileSync(sourceFile, 'utf-8');
let targetContent = fs.readFileSync(targetFile, 'utf-8');

const roles = [
  {header: 'MANAGEMENT CONSULTANT - add 10 more', label: 'Management Consultant'},
  {header: 'CONSULTANT - add 5 more profitability', label: 'Consultant'},
  {header: 'STRATEGY CONSULTANT - add 5 more', label: 'Strategy Consultant'},
  {header: 'OPERATIONS CONSULTANT - add 5 more', label: 'Operations Consultant'},
  {header: 'FINANCIAL ADVISORY CONSULTANT - add 5 more', label: 'Financial Advisory Consultant'},
  {header: 'SENIOR CONSULTANT - add 4 more', label: 'Senior Consultant'},
  {header: 'ADVISORY CONSULTANT - add 4 more', label: 'Advisory Consultant'},
  {header: 'RISK CONSULTANT - add 4 more', label: 'Risk Consultant'},
  {header: 'SUPPLY CHAIN CONSULTANT - add 4 more', label: 'Supply Chain Consultant'},
  {header: 'DIGITAL CONSULTANT - add 4 more', label: 'Digital Consultant'},
];

const questionsByRole = {};

for (const role of roles) {
  const headerIdx = sourceContent.indexOf(role.header);
  if (headerIdx === -1) continue;

  let nextHeaderIdx = sourceContent.length;
  for (let i = roles.indexOf(role) + 1; i < roles.length; i++) {
    const nextIdx = sourceContent.indexOf(roles[i].header, headerIdx + 1);
    if (nextIdx !== -1 && nextIdx < nextHeaderIdx) {
      nextHeaderIdx = nextIdx;
    }
  }

  const sectionContent = sourceContent.substring(headerIdx, nextHeaderIdx);
  const questions = [];
  const lines = sectionContent.split('\n');
  let i = 0;

  while (i < lines.length) {
    if (lines[i].trim() === '{') {
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
}

let totalAppended = 0;

for (const [roleLabel, questions] of Object.entries(questionsByRole)) {
  if (!questions || questions.length === 0) continue;

  const patternToFind = `"${roleLabel}": {\n    case_interview: [`;
  const roleIdx = targetContent.indexOf(patternToFind);

  if (roleIdx === -1) {
    console.log(`Not found: ${roleLabel}`);
    continue;
  }

  const searchStart = roleIdx + patternToFind.length;
  let bracketCount = 1;
  let pos = searchStart;

  while (bracketCount > 0 && pos < targetContent.length) {
    if (targetContent[pos] === '[') bracketCount++;
    else if (targetContent[pos] === ']') bracketCount--;
    pos++;
  }

  const closingBracketPos = pos - 1;
  
  // Build insert text with CORRECT comma handling
  // If there are existing items, add , before each new item
  // If no items, don't add comma before first item
  let insertText = '';
  for (const q of questions) {
    insertText += ',\n      ' + q;
  }

  // Insert before the closing bracket
  targetContent = targetContent.substring(0, closingBracketPos) + insertText + targetContent.substring(closingBracketPos);
  totalAppended += questions.length;
  console.log(`${roleLabel}: +${questions.length}`);
}

// Write updated file
fs.writeFileSync(targetFile, targetContent, 'utf-8');
console.log(`\nTotal appended: ${totalAppended}`);

// Final counts
console.log('\nFinal counts:');
const rolesForCounting = [
  'Management Consultant',
  'Consultant',
  'Strategy Consultant',
  'Operations Consultant',
  'Financial Advisory Consultant',
  'Senior Consultant',
  'Advisory Consultant',
  'Risk Consultant',
  'Supply Chain Consultant',
  'Digital Consultant',
];

for (const role of rolesForCounting) {
  const pattern = `"${role}": {`;
  const roleIdx = targetContent.indexOf(pattern);
  if (roleIdx !== -1) {
    let endIdx = targetContent.length;
    for (let i = rolesForCounting.indexOf(role) + 1; i < rolesForCounting.length; i++) {
      const nextIdx = targetContent.indexOf(`"${rolesForCounting[i]}": {`, roleIdx + 1);
      if (nextIdx !== -1 && nextIdx < endIdx) {
        endIdx = nextIdx;
      }
    }
    
    const section = targetContent.substring(roleIdx, endIdx);
    const count = (section.match(/q: /g) || []).length;
    console.log(`${role}: ${count}`);
  }
}

