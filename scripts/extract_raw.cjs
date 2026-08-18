const fs = require('fs');

const content = fs.readFileSync('content.txt', 'utf-8');

// Find and extract the raw question objects using a simpler method
// Look for pattern: { followed by fields ending with },

const sections = [
  { name: 'behavioral', marker: '// BEHAVIORAL' },
  { name: 'case_study', marker: '// CASE STUDY' },
  { name: 'situational', marker: '// SITUATIONAL' },
  { name: 'technical', marker: '// TECHNICAL' }
];

const result = { behavioral: [], case_study: [], situational: [], technical: [] };

for (const section of sections) {
  const startIdx = content.indexOf(section.marker);
  if (startIdx === -1) continue;
  
  const nextMarker = sections[sections.indexOf(section) + 1];
  let endIdx = content.length;
  if (nextMarker) {
    const nextIdx = content.indexOf(nextMarker.marker);
    if (nextIdx !== -1) endIdx = nextIdx;
  }
  
  const sectionText = content.substring(startIdx, endIdx);
  
  // Extract the raw JavaScript array format
  // Save it with console.log so we can debug
  console.log(`\n=== ${section.name.toUpperCase()} ===`);
  console.log(`Section text length: ${sectionText.length}`);
  console.log(`First 300 chars:\n${sectionText.substring(0, 300)}`);
  
  // Try to find a valid JS-to-JSON conversion
  // Convert single quotes to double, backticks to double quotes, handle template literals
  let jsArray = sectionText;
  
  // Simple transformation: just look for q: and a: fields
  const lines = jsArray.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('q:')) {
      console.log(`Found q at line ${i}: ${line.substring(0, 80)}`);
    }
    if (line.startsWith('roundType:')) {
      console.log(`Found roundType at line ${i}: ${line}`);
    }
  }
}
