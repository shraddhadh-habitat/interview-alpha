const fs = require('fs');

const content = fs.readFileSync('content.txt', 'utf-8');
const sections = ['BEHAVIORAL', 'CASE STUDY', 'SITUATIONAL', 'TECHNICAL'];
const result = { behavioral: [], case_study: [], situational: [], technical: [] };
const keyMap = { 'BEHAVIORAL': 'behavioral', 'CASE STUDY': 'case_study', 'SITUATIONAL': 'situational', 'TECHNICAL': 'technical' };

for (let s = 0; s < sections.length; s++) {
  const sectionName = sections[s];
  const marker = '// ' + sectionName;
  const idx = content.indexOf(marker);
  if (idx === -1) continue;
  
  const nextSection = sections[s + 1];
  let endIdx = content.length;
  if (nextSection) {
    const nextMarker = '// ' + nextSection;
    const nextIdx = content.indexOf(nextMarker, idx + 1);
    if (nextIdx !== -1) endIdx = nextIdx;
  }
  
  const sectionContent = content.substring(idx, endIdx);
  const questions = [];
  
  // Parse each object in the section
  let i = 0;
  while (i < sectionContent.length) {
    // Find next opening brace
    const openIdx = sectionContent.indexOf('{', i);
    if (openIdx === -1) break;
    
    // Find matching closing brace
    let braceCount = 0;
    let j = openIdx;
    let inString = false;
    let stringChar = null;
    let foundEnd = false;
    
    while (j < sectionContent.length && !foundEnd) {
      const char = sectionContent[j];
      const prevChar = j > 0 ? sectionContent[j-1] : '';
      
      // Track string state (handle both " and `)
      if ((char === '"' || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
      }
      
      // Count braces outside strings
      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            foundEnd = true;
            const objStr = sectionContent.substring(openIdx, j + 1);
            
            // Parse the object
            try {
              const q = parseFieldRegex(objStr, 'q');
              const a = parseFieldRegex(objStr, 'a');
              
              if (q && a) {
                const obj = {
                  q: q,
                  a: a,
                  subcategory: parseFieldRegex(objStr, 'subcategory') || null,
                  difficulty: parseFieldRegex(objStr, 'difficulty') || null,
                  domain: parseFieldRegex(objStr, 'domain') || null,
                  tracks: [],
                  companies: [],
                  roundType: parseFieldRegex(objStr, 'roundType') || '',
                  whatInterviewerTests: parseFieldRegex(objStr, 'whatInterviewerTests') || '',
                  commonMistakes: []
                };
                
                // Try to parse tracks
                try {
                  const tracksStr = parseFieldRegex(objStr, 'tracks');
                  if (tracksStr) obj.tracks = JSON.parse(tracksStr);
                } catch(e) {}
                
                // Try to parse companies
                try {
                  const companiesStr = parseFieldRegex(objStr, 'companies');
                  if (companiesStr) obj.companies = JSON.parse(companiesStr);
                } catch(e) {}
                
                // Try to parse commonMistakes
                try {
                  const mistakesStr = parseFieldRegex(objStr, 'commonMistakes');
                  if (mistakesStr) obj.commonMistakes = JSON.parse(mistakesStr);
                } catch(e) {}
                
                questions.push(obj);
              }
            } catch (e) {
              // Skip this object if parsing fails
            }
          }
        }
      }
      
      j++;
    }
    
    i = j + 1;
  }
  
  result[keyMap[sectionName]] = questions;
  console.log(`Parsed ${sectionName}: ${questions.length} questions`);
}

// Helper function to extract field values
function parseFieldRegex(objStr, field) {
  // Handle different field formats
  const patterns = [
    new RegExp(`${field}:\s*"([^"]*(?:\\.[^"]*)*)"`, 's'),      // double quotes
    new RegExp(`${field}:\s*\`([^\`]*(?:\\.[^\`]*)*)\``, 's'),  // backticks
    new RegExp(`${field}:\s*\[([^\]]*(?:\\.[^\]]*)*)\]`, 's')  // arrays
  ];
  
  for (const pattern of patterns) {
    const match = objStr.match(pattern);
    if (match) {
      let value = match[1];
      // Clean up escapes
      value = value.replace(/\n/g, '\n');
      value = value.replace(/\\"/g, '"');
      value = value.replace(/\\`/g, '`');
      return value.trim();
    }
  }
  
  return null;
}

// Write result to file
fs.writeFileSync('extracted_50_questions.json', JSON.stringify(result, null, 2));
console.log('\nWrote extracted_50_questions.json');
const total = result.behavioral.length + result.case_study.length + result.situational.length + result.technical.length;
console.log(`Total: ${total} questions`);
