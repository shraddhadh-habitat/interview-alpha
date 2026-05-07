const fs = require('fs');
const newQuestions = require('./src/data/technical_pm_questions.cjs');

function escape(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\`')
    .replace(/\$/g, '\$');
}

function formatQuestions(questions, type, startIdx) {
  const typeMap = { product: 'p', behavioral: 'b', ai: 'ai', ait: 'ait' };
  const prefix = 'tpm-' + typeMap[type];
  
  return questions.map((q, i) => {
    const id = `${prefix}-${startIdx + i}`;
    const qText = escape(q.q);
    const aText = escape(q.a);
    return `      {
        id: "${id}",
        q: "${qText}",
        a: \`${aText}\`
      }`;
  }).join(',\n');
}

const product = formatQuestions(newQuestions.slice(0, 20), 'product', 21);
const behavioral = formatQuestions(newQuestions.slice(20, 30), 'behavioral', 11);
const ai = formatQuestions(newQuestions.slice(30, 40), 'ai', 11);
const ait = formatQuestions(newQuestions.slice(40, 50), 'ait', 11);

fs.writeFileSync('new_product.txt', ',\n' + product);
fs.writeFileSync('new_behavioral.txt', ',\n' + behavioral);
fs.writeFileSync('new_ai.txt', ',\n' + ai);
fs.writeFileSync('new_ait.txt', ',\n' + ait);

console.log('Saved 4 files');
