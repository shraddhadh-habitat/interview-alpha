const fs = require('fs');

// Read current file
const currentFile = './src/data/pmQuestions.js';
let content = fs.readFileSync(currentFile, 'utf-8');

// Read new questions
const newQuestions = require('./src/data/technical_pm_questions.cjs');

function escapeForJS(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\`')
    .replace(/\$/g, '\$');
}

function formatQuestion(q, id) {
  const qEsc = escapeForJS(q.q);
  const aEsc = escapeForJS(q.a);
  return `      {
        id: "${id}",
        q: "${qEsc}",
        a: \`${aEsc}\`
      }`;
}

const questions = {
  product: newQuestions.slice(0, 20).map((q, i) => formatQuestion(q, `tpm-p-${21+i}`)),
  behavioral: newQuestions.slice(20, 30).map((q, i) => formatQuestion(q, `tpm-b-${11+i}`)),
  ai: newQuestions.slice(30, 40).map((q, i) => formatQuestion(q, `tpm-ai-${11+i}`)),
  ait: newQuestions.slice(40, 50).map((q, i) => formatQuestion(q, `tpm-ait-${11+i}`))
};

// Find positions and insert in reverse order to avoid offset issues
const ait10 = content.indexOf('id: "tpm-ait-10"');
const ait_close = content.indexOf('      },', ait10);
const ai10 = content.indexOf('id: "tpm-ai-10"');
const ai_close = content.indexOf('      },', ai10);
const b10 = content.indexOf('id: "tpm-b-10"');
const b_close = content.indexOf('      },', b10);
const p20 = content.indexOf('id: "tpm-p-20"');
const p_close = content.indexOf('      },', p20);

// Insert in reverse order (ait, ai, behavioral, product)
// AIT
const ait_str = ',\n' + questions.ait.join(',\n');
content = content.slice(0, ait_close + 8) + ait_str + content.slice(ait_close + 8);

// AI
const ai_str = ',\n' + questions.ai.join(',\n');
content = content.slice(0, ai_close + 8) + ai_str + content.slice(ai_close + 8);

// Behavioral
const b_str = ',\n' + questions.behavioral.join(',\n');
content = content.slice(0, b_close + 8) + b_str + content.slice(b_close + 8);

// Product
const p_str = ',\n' + questions.product.join(',\n');
content = content.slice(0, p_close + 8) + p_str + content.slice(p_close + 8);

// Write the merged file
fs.writeFileSync(currentFile, content);
console.log('Merge complete!');

// Verify syntax
const {spawnSync} = require('child_process');
const result = spawnSync('node', ['-c', currentFile], { encoding: 'utf-8' });
if (result.status === 0) {
  console.log('✓ Syntax check passed');
  const count_p = (content.match(/id: "tpm-p-/g) || []).length;
  const count_b = (content.match(/id: "tpm-b-/g) || []).length;
  const count_ai = (content.match(/id: "tpm-ai-/g) || []).length;
  const count_ait = (content.match(/id: "tpm-ait-/g) || []).length;
  console.log(`Questions: product=${count_p}, behavioral=${count_b}, ai=${count_ai}, ait=${count_ait}`);
} else {
  console.log('✗ Syntax error:');
  console.log(result.stderr);
  process.exit(1);
}
