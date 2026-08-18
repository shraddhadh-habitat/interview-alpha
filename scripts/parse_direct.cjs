const fs = require('fs');

// Read the content
const content = fs.readFileSync('content.txt', 'utf-8');

// The content has sections separated by comments
const sections = ['BEHAVIORAL', 'CASE STUDY', 'SITUATIONAL', 'TECHNICAL'];

for (let s = 0; s < sections.length; s++) {
  const sectionName = sections[s];
  const marker = '// ' + sectionName;
  
  const idx = content.indexOf(marker);
  if (idx === -1) {
    console.log(`Section ${sectionName}: NOT FOUND`);
    continue;
  }
  
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
  
  // Count objects by looking for "roundType:" 
  const rtCount = (sectionContent.match(/roundType:/g) || []).length;
  
  console.log(`\nSection: ${sectionName}`);
  console.log(`  roundType count: ${rtCount}`);
  console.log(`  Section length: ${sectionContent.length} chars`);
  
  // Print first 300 chars after the section header
  const headerEnd = sectionContent.indexOf('\n') + 1;
  console.log(`  Preview:\n${sectionContent.substring(headerEnd, headerEnd + 300)}`);
}
