import fs from 'fs';

const sourceFile = 'source_questions.txt';
const targetFile = 'src/data/consultingQuestions.js';

console.log('Reading files...');
let sourceContent = fs.readFileSync(sourceFile, 'utf-8');
let targetContent = fs.readFileSync(targetFile, 'utf-8');

console.log(`Source size: ${sourceContent.length} chars, Target size: ${targetContent.length} chars`);

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
  if (headerIdx === -1) {
    console.log(`No header: ${role.label}`);
    continue;
  }

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
  console.log(`${role.label}: ${questions.length} questions`);
}

let totalAppended = 0;

for (const [roleLabel, questions] of Object.entries(questionsByRole)) {
  if (!questions || questions.length === 0) continue;

  const patternToFind = `"${roleLabel}": {\n    case_interview: [`;
  const roleIdx = targetContent.indexOf(patternToFind);

  if (roleIdx === -1) {
    console.log(`Not found in target: ${roleLabel}`);
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
  let insertText = '';
  for (const q of questions) {
    insertText += ',\n      ' + q;
  }

  targetContent = targetContent.substring(0, closingBracketPos) + insertText + targetContent.substring(closingBracketPos);
  totalAppended += questions.length;
  console.log(`Added ${questions.length} to ${roleLabel}`);
}

fs.writeFileSync(targetFile, targetContent, 'utf-8');
console.log(`\nDone! Total appended: ${totalAppended}`);

console.log('\nFinal counts:');
for (const [roleLabel] of Object.entries(questionsByRole)) {
  const pattern = `"${roleLabel}": {`;
  const roleIdx = targetContent.indexOf(pattern);
  if (roleIdx !== -1) {
    const section = targetContent.substring(roleIdx, roleIdx + 150000);
    const count = (section.match(/"q":/g) || []).length;
    console.log(`${roleLabel}: ${count}`);
  }
}

