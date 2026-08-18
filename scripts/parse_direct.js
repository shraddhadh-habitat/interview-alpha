const fs = require('fs');

// Read the content
let content = fs.readFileSync('content.txt', 'utf-8');

// The content has sections separated by comments
// Each section has questions in JavaScript object format
// We need to extract each section and convert to JSON

const sections = ['BEHAVIORAL', 'CASE STUDY', 'SITUATIONAL', 'TECHNICAL'];
const results = {};

for (let s = 0; s < sections.length; s++) {
  const sectionName = sections[s];
  const marker = '// ' + sectionName;
  
  const idx = content.indexOf(marker);
  if (idx === -1) continue;
  
  // Find next section marker
  const nextSection = sections[s + 1];
  let endIdx = content.length;
  if (nextSection) {
    const nextMarker = '// ' + nextSection;
    const nextIdx = content.indexOf(nextMarker);
    if (nextIdx !== -1) {
      endIdx = nextIdx;
    }
  }
  
  const sectionContent = content.substring(idx, endIdx);
  
  // Count how many complete objects
  const qCount = (sectionContent.match(/\n\s*\{\s*$/gm) || []).length +
                 (sectionContent.match(/\n\s*\{/gm) || []).length;
  
  console.log(`Section: ${sectionName}`);
  console.log(`  Raw section length: ${sectionContent.length}`);
  console.log(`  Content preview (500 chars):`);
  console.log(sectionContent.substring(0, 500));
  console.log();
}
