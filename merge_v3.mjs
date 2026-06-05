import fs from 'fs';

let sourceContent = fs.readFileSync('source_questions.txt', 'utf-8');
let targetContent = fs.readFileSync('src/data/consultingQuestions.js', 'utf-8');

// Normalize line endings for parsing
const sourceLines = sourceContent.split(/\r?\n/);
const targetLines = targetContent.split(/\r?\n/);

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

// Extract questions from source
for (const role of roles) {
  const headerIdx = sourceLines.findIndex(l => l.includes(role.header));
  if (headerIdx === -1) continue;

  const nextRoleIdx = sourceLines.length;
  let nextRoleHeader = sourceLines.length;
  for (let i = headerIdx + 1; i < sourceLines.length; i++) {
    for (let j = roles.indexOf(role) + 1; j < roles.length; j++) {
      if (sourceLines[i].includes(roles[j].header)) {
        nextRoleHeader = i;
        break;
      }
    }
    if (nextRoleHeader < sourceLines.length) break;
  }

  const questions = [];
  let i = headerIdx + 1;

  while (i < nextRoleHeader) {
    if (sourceLines[i].trim() === '{') {
      const objLines = [sourceLines[i]];
      let braceCount = 1;
      let j = i + 1;

      while (j < sourceLines.length && braceCount > 0) {
        objLines.push(sourceLines[j]);
        const line = sourceLines[j];
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;
        j++;
      }

      questions.push(objLines.join('\n'));
      i = j;
    } else {
      i++;
    }
  }

  questionsByRole[role.label] = questions;
  console.log(`${role.label}: ${questions.length}`);
}

// Append to target
let totalAppended = 0;

for (const [roleLabel, questions] of Object.entries(questionsByRole)) {
  if (!questions || questions.length === 0) continue;

  // Find the role in target with exact pattern match
  const targetLineIdx = targetLines.findIndex(l => l.includes(`"${roleLabel}": {`));
  if (targetLineIdx === -1) {
    console.log(`Role not found: ${roleLabel}`);
    continue;
  }

  // Find case_interview array start
  let caseInterviewIdx = -1;
  for (let i = targetLineIdx; i < Math.min(targetLineIdx + 10, targetLines.length); i++) {
    if (targetLines[i].includes('case_interview: [')) {
      caseInterviewIdx = i;
      break;
    }
  }

  if (caseInterviewIdx === -1) {
    console.log(`case_interview not found for ${roleLabel}`);
    continue;
  }

  // Find closing ] of the case_interview array
  let bracketCount = 1;
  let closingLineIdx = -1;
  for (let i = caseInterviewIdx + 1; i < targetLines.length; i++) {
    const line = targetLines[i];
    bracketCount += (line.match(/\[/g) || []).length;
    bracketCount -= (line.match(/\]/g) || []).length;
    
    if (bracketCount === 0) {
      closingLineIdx = i;
      break;
    }
  }

  if (closingLineIdx === -1) {
    console.log(`Closing bracket not found for ${roleLabel}`);
    continue;
  }

  // Insert new questions before the closing bracket
  const newLines = [];
  for (const q of questions) {
    newLines.push(',');
    newLines.push('      ' + q);
  }

  targetLines.splice(closingLineIdx, 0, ...newLines);
  totalAppended += questions.length;
  console.log(`✓ Added ${questions.length} to ${roleLabel}`);
}

// Write back with original line endings
const LF = '\n';
const updatedContent = targetLines.join(LF);
fs.writeFileSync('src/data/consultingQuestions.js', updatedContent, 'utf-8');
console.log(`\nTotal appended: ${totalAppended}`);

// Final count
console.log('\nFinal counts:');
const finalContent = fs.readFileSync('src/data/consultingQuestions.js', 'utf-8');
const finalLines = finalContent.split(/\r?\n/);

for (const role of ['Management Consultant', 'Consultant', 'Strategy Consultant', 'Operations Consultant',
                     'Financial Advisory Consultant', 'Senior Consultant', 'Advisory Consultant',
                     'Risk Consultant', 'Supply Chain Consultant', 'Digital Consultant']) {
  const roleIdx = finalLines.findIndex(l => l.includes(`"${role}": {`));
  if (roleIdx !== -1) {
    let count = 0;
    for (let i = roleIdx; i < Math.min(roleIdx + 100000, finalLines.length); i++) {
      if (finalLines[i].includes('q:') && !finalLines[i].trim().startsWith('//')) {
        count++;
      }
      if (finalLines[i].includes('case_interview: [')) break;
    }
    // Recount properly
    let inRole = false;
    let braceDepth = 0;
    count = 0;
    for (let i = roleIdx; i < finalLines.length; i++) {
      const line = finalLines[i];
      if (line.includes('case_interview: [')) inRole = true;
      if (!inRole) continue;
      
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;
      
      if (line.trim().startsWith('q:')) count++;
      
      if (braceDepth === 0 && inRole && line.includes(']')) break;
    }
    console.log(`${role}: ${count}`);
  }
}

