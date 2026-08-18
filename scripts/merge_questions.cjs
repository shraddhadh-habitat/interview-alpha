const newQuestions = require('./src/data/technical_pm_questions.cjs');

// Organize by type
const organized = {
  product: newQuestions.slice(0, 20),
  behavioral: newQuestions.slice(20, 30),
  ai: newQuestions.slice(30, 40),
  ait: newQuestions.slice(40, 50)
};

// Add IDs
const result = {
  product: organized.product.map((q, i) => `      {\n        id: "tpm-p-${21 + i}",\n        q: ${JSON.stringify(q.q)},\n        a: ${JSON.stringify(q.a)}\n      }`),
  behavioral: organized.behavioral.map((q, i) => `      {\n        id: "tpm-b-${11 + i}",\n        q: ${JSON.stringify(q.q)},\n        a: ${JSON.stringify(q.a)}\n      }`),
  ai: organized.ai.map((q, i) => `      {\n        id: "tpm-ai-${11 + i}",\n        q: ${JSON.stringify(q.q)},\n        a: ${JSON.stringify(q.a)}\n      }`),
  ait: organized.ait.map((q, i) => `      {\n        id: "tpm-ait-${11 + i}",\n        q: ${JSON.stringify(q.q)},\n        a: ${JSON.stringify(q.a)}\n      }`)
};

console.log("=== PRODUCT ===");
console.log(result.product.join(",\n"));
console.log("\n=== BEHAVIORAL ===");
console.log(result.behavioral.join(",\n"));
console.log("\n=== AI ===");
console.log(result.ai.join(",\n"));
console.log("\n=== AIT ===");
console.log(result.ait.join(",\n"));
