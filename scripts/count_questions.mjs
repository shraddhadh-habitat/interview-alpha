import fs from 'fs';

const content = fs.readFileSync('src/data/consultingQuestions.js', 'utf-8');

const roles = [
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

console.log('Final Question Count by Role:\n');
for (const role of roles) {
  const pattern = `"${role}": {`;
  const roleIdx = content.indexOf(pattern);
  if (roleIdx !== -1) {
    // Find next role or end
    let endIdx = content.length;
    for (let i = roles.indexOf(role) + 1; i < roles.length; i++) {
      const nextIdx = content.indexOf(`"${roles[i]}": {`, roleIdx + 1);
      if (nextIdx !== -1 && nextIdx < endIdx) {
        endIdx = nextIdx;
      }
    }
    
    const section = content.substring(roleIdx, endIdx);
    const count = (section.match(/q: /g) || []).length;
    console.log(`${role}: ${count} questions`);
  }
}

