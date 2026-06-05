import fs from 'fs';

const content = fs.readFileSync('src/data/consultingQuestions.js', 'utf-8');

// Try different patterns
const patterns = [
  `"Consultant": {\n    case_interview: [`,
  `"Management Consultant": {\n    case_interview: [`,
  `"Consultant": {`,
];

for (const pat of patterns) {
  const idx = content.indexOf(pat);
  console.log(`Pattern "${pat}" found at: ${idx}`);
}

// Show what's actually at position 0-200
console.log('\nFirst 300 chars:');
console.log(JSON.stringify(content.substring(0, 300)));

