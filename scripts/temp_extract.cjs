const fs = require('fs');

// Read the content file which has the raw questions in JS format
const content = fs.readFileSync('content.txt', 'utf-8');

// Simple approach: split by sections, then look for patterns
const result = { behavioral: [], case_study: [], situational: [], technical: [] };

const sections = [
  { marker: '// BEHAVIORAL', key: 'behavioral' },
  { marker: '// CASE STUDY', key: 'case_study' },
  { marker: '// SITUATIONAL', key: 'situational' },
  { marker: '// TECHNICAL', key: 'technical' }
];

for (const section of sections) {
  const idx = content.indexOf(section.marker);
  if (idx === -1) continue;
  
  // Find end  
  let endIdx = content.length;
  for (let i = sections.indexOf(section) + 1; i < sections.length; i++) {
    const nextIdx = content.indexOf(sections[i].marker);
    if (nextIdx !== -1) {
      endIdx = nextIdx;
      break;
    }
  }
  
  const text = content.substring(idx, endIdx);
  
  // Count q: and roundType: to verify  
  const qCount = (text.match(/q:/g) || []).length;
  const rtCount = (text.match(/roundType:/g) || []).length;
  
  console.log(`${section.key}: ${qCount} q fields, ${rtCount} roundType fields`);
  
  // For now, just save counts
  // Each question should have exactly 1 q, 1 a, 1 roundType
  
  // Extract by finding q: pattern
  const lines = text.split('\n');
  let currentQuestion = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line starts a new object or contains q:
    if (line.includes('q:')) {
      // Extract the question text
      const qMatch = line.match(/q:\s*"([^"]*)/);
      if (qMatch) {
        if (currentQuestion) {
          result[section.key].push(currentQuestion);
        }
        currentQuestion = {
          q: qMatch[1],
          a: '',
          subcategory: null,
          difficulty: null,
          domain: null,
          tracks: [],
          companies: [],
          roundType: '',
          whatInterviewerTests: '',
          commonMistakes: []
        };
      }
    } else if (currentQuestion && line.includes('roundType:')) {
      // Extract roundType
      const rtMatch = line.match(/roundType:\s*"([^"]*)"/);
      if (rtMatch) {
        currentQuestion.roundType = rtMatch[1];
      }
    }
  }
  
  // Add last question
  if (currentQuestion) {
    result[section.key].push(currentQuestion);
  }
  
  console.log(`  Extracted: ${result[section.key].length} question objects\n`);
}

console.log(`\nTotal questions: ${Object.values(result).reduce((sum, arr) => sum + arr.length, 0)}`);

// For now, just write to verify structure
fs.writeFileSync('extracted_50_questions_draft.json', JSON.stringify(result, null, 2));
