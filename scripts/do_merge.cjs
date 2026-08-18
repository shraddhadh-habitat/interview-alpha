const fs = require('fs');

const pmFile = './src/data/pmQuestions.js';
const content = fs.readFileSync(pmFile, 'utf-8');

// Read new questions
const newQuestions = require('./src/data/technical_pm_questions.cjs');

// Organize by type
const newProduct = newQuestions.slice(0, 20);
const newBehavioral = newQuestions.slice(20, 30);
const newAI = newQuestions.slice(30, 40);
const newAIT = newQuestions.slice(40, 50);

// Create formatted strings
function formatQuestions(questions, type, startIdx) {
  const typeMap = { product: 'p', behavioral: 'b', ai: 'ai', ait: 'ait' };
  const prefix = 'tpm-' + typeMap[type];
  
  return questions.map((q, i) => {
    const id = `${prefix}-${startIdx + i}`;
    const qStr = q.q.replace(/`/g, '\`').replace(/\$/g, '\$');
    const aStr = q.a.replace(/`/g, '\`').replace(/\$/g, '\$');
    return `      {
        id: "${id}",
        q: "${qStr}",
        a: \`${aStr}\`
      }`;
  }).join(',\n');
}

const productStr = formatQuestions(newProduct, 'product', 21);
const behavioralStr = formatQuestions(newBehavioral, 'behavioral', 11);
const aiStr = formatQuestions(newAI, 'ai', 11);
const aitStr = formatQuestions(newAIT, 'ait', 11);

// Find insertion points using simpler patterns
let productInsert = content.indexOf('    ],\n    behavioral: [');
let behavioralInsert = content.indexOf('    ],\n    ai: [', productInsert);
let aiInsert = content.indexOf('    ],\n    ai_technical: [');
let aitInsert = content.indexOf('    ],\n\n\n  // ─────────────────────────────────────────────\n  // COMPANY PREP');

console.log('Points:', { productInsert, behavioralInsert, aiInsert, aitInsert });

// If exact pattern not found, try simpler search
if (behavioralInsert === -1) {
  behavioralInsert = content.indexOf('    ai: [');
  if (behavioralInsert > 0) {
    // Find the ], before it
    behavioralInsert = content.lastIndexOf('    ],', behavioralInsert);
  }
}

if (aiInsert === -1) {
  aiInsert = content.indexOf('    ai_technical: [');
  if (aiInsert > 0) {
    aiInsert = content.lastIndexOf('    ],', aiInsert);
  }
}

if (aitInsert === -1) {
  aitInsert = content.indexOf('  // ─────────────────────────────────────────────\n  // COMPANY PREP');
  if (aitInsert > 0) {
    aitInsert = content.lastIndexOf('    ],', aitInsert);
  }
}

console.log('Final points:', { productInsert, behavioralInsert, aiInsert, aitInsert });

// Insert in reverse order
let merged = content;
merged = merged.slice(0, aitInsert) + ',\n' + aitStr + merged.slice(aitInsert);
merged = merged.slice(0, aiInsert) + ',\n' + aiStr + merged.slice(aiInsert + (aitStr.length + 2));
merged = merged.slice(0, behavioralInsert) + ',\n' + behavioralStr + merged.slice(behavioralInsert + (aiStr.length + aitStr.length + 4));
merged = merged.slice(0, productInsert) + ',\n' + productStr + merged.slice(productInsert + (behavioralStr.length + aiStr.length + aitStr.length + 6));

fs.writeFileSync(pmFile, merged, 'utf-8');
console.log('Merge complete!');
