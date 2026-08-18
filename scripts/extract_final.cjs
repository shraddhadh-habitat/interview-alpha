const fs = require('fs');

const rawContent = fs.readFileSync('content.txt', 'utf-8');

const sections = {
  behavioral: { marker: '// BEHAVIORAL', key: 'behavioral' },
  case_study: { marker: '// CASE STUDY', key: 'case_study' },
  situational: { marker: '// SITUATIONAL', key: 'situational' },
  technical: { marker: '// TECHNICAL', key: 'technical' }
};

const result = { behavioral: [], case_study: [], situational: [], technical: [] };

for (const [sectionName, sectionInfo] of Object.entries(sections)) {
  const startIdx = rawContent.indexOf(sectionInfo.marker);
  if (startIdx === -1) continue;
  
  let endIdx = rawContent.length;
  for (const [otherName, otherInfo] of Object.entries(sections)) {
    if (otherName !== sectionName) {
      const otherIdx = rawContent.indexOf(otherInfo.marker, startIdx + 1);
      if (otherIdx !== -1 && otherIdx < endIdx) {
        endIdx = otherIdx;
      }
    }
  }
  
  const sectionText = rawContent.substring(startIdx, endIdx);
  
  let idx = 0;
  const questions = [];
  
  while (true) {
    // Find q: \"
    const qMarker = 'q: \\\"';
    const qStart = sectionText.indexOf(qMarker, idx);
    if (qStart === -1) break;
    
    // Find closing \"
    let qEnd = qStart + qMarker.length;
    while (qEnd < sectionText.length) {
      if (sectionText[qEnd] === '\' && sectionText[qEnd + 1] === '\"') {
        break;
      }
      qEnd++;
    }
    
    if (qEnd >= sectionText.length) {
      idx = qStart + 1;
      continue;
    }
    
    const q = sectionText.substring(qStart + qMarker.length, qEnd);
    
    // Find a: `
    const aMarker = 'a: `';
    const aStart = sectionText.indexOf(aMarker, qEnd);
    if (aStart === -1) {
      idx = qStart + 1;
      break;
    }
    
    // Find closing `
    let aEnd = aStart + aMarker.length;
    while (aEnd < sectionText.length && sectionText[aEnd] !== '`') {
      aEnd++;
    }
    
    if (aEnd >= sectionText.length) {
      idx = aStart + 1;
      continue;
    }
    
    const a = sectionText.substring(aStart + aMarker.length, aEnd);
    
    // Find roundType
    const rtMarker = 'roundType: \\\"';
    const rtStart = sectionText.indexOf(rtMarker, aEnd);
    let rt = '';
    if (rtStart !== -1) {
      let rtEnd = rtStart + rtMarker.length;
      while (rtEnd < sectionText.length) {
        if (sectionText[rtEnd] === '\' && sectionText[rtEnd + 1] === '\"') {
          break;
        }
        rtEnd++;
      }
      rt = sectionText.substring(rtStart + rtMarker.length, rtEnd);
    }
    
    // Unescape: \" becomes ", \n becomes \n
    const qUnescaped = q.replace(/\\\"/g, '\"').replace(/\n/g, '\n');
    const aUnescaped = a.replace(/\\\"/g, '\"').replace(/\n/g, '\n');
    
    if (q && a) {
      questions.push({
        q: qUnescaped,
        a: aUnescaped,
        subcategory: null,
        difficulty: null,
        domain: null,
        tracks: [],
        companies: [],
        roundType: rt,
        whatInterviewerTests: '',
        commonMistakes: []
      });
    }
    
    idx = Math.max(aEnd + 1, (rtStart || aEnd) + 1);
  }
  
  result[sectionInfo.key] = questions;
  console.log(`${sectionName}: ${questions.length} questions`);
}

fs.writeFileSync('extracted_50_questions.json', JSON.stringify(result, null, 2));
const total = Object.values(result).reduce((sum, arr) => sum + arr.length, 0);
console.log('\nTotal:', total, 'questions');

if (result.behavioral.length > 0) {
  const sample = result.behavioral[0];
  console.log('\nFirst behavioral question:');
  console.log('q:', sample.q.substring(0, 100));
  console.log('rt:', sample.roundType);
}
