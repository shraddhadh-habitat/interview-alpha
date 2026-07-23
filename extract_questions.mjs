import fs from 'fs';

// Read the content file
const rawContent = fs.readFileSync('content.txt', 'utf-8');

// Simple regex to find and extract complete question objects
// This looks for patterns like: { q: "...", a: `...`, ... roundType: "..." }

// First, let's try a smarter approach:  find each { and match braces until }

function extractObjectsFromText(text) {
  const objects = [];
  let depth = 0;
  let current = '';
  let inString = false;
  let stringChar = null;
  let i = 0;
  
  while (i < text.length) {
    const char = text[i];
    const prevChar = i > 0 ? text[i-1] : '';
    
    // Handle string boundaries
    if ((char === '"' || char === '`') && prevChar !== '\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
    }
    
    // Count braces only outside strings
    if (!inString) {
      if (char === '{') {
        if (depth === 0) {
          current = char;
        } else {
          current += char;
        }
        depth++;
      } else if (char === '}') {
        current += char;
        depth--;
        if (depth === 0) {
          // We have a complete object
          if (current.trim().length > 20) {
            objects.push(current);
          }
          current = '';
        } else if (depth > 0) {
          current += char;
        }
      } else if (depth > 0) {
        current += char;
      }
    } else {
      if (depth > 0) {
        current += char;
      }
    }
    
    i++;
  }
  
  return objects;
}

// Split content by sections
const sections = {
  behavioral: { start: 'BEHAVIORAL', count: 13 },
  case_study: { start: 'CASE STUDY', count: 13 },
  situational: { start: 'SITUATIONAL', count: 10 },
  technical: { start: 'TECHNICAL', count: 13 }
};

const results = {
  behavioral: [],
  case_study: [],
  situational: [],
  technical: []
};

let currentSection = null;
let currentSectionObjects = [];
let i = 0;

for (const key in sections) {
  const section = sections[key];
  const startStr = '// ' + section.start;
  const idx = rawContent.indexOf(startStr);
  
  if (idx !== -1) {
    // Find the next section start
    let endIdx = rawContent.length;
    for (const otherKey in sections) {
      if (otherKey !== key) {
        const otherIdx = rawContent.indexOf('// ' + sections[otherKey].start, idx + 1);
        if (otherIdx !== -1 && otherIdx < endIdx) {
          endIdx = otherIdx;
        }
      }
    }
    
    const sectionText = rawContent.substring(idx, endIdx);
    console.log(`\n${key.toUpperCase()}: ${sectionText.length} chars`);
    
    // For now, just count the q: occurrences
    const qCount = (sectionText.match(/q:/g) || []).length;
    console.log(`  Found ${qCount} questions`);
    
    // Print first question preview
    const qIdx = sectionText.indexOf('q:');
    if (qIdx !== -1) {
      console.log(`  Preview: ${sectionText.substring(qIdx, qIdx + 150)}`);
    }
  }
}
