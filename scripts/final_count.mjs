import { consultingQuestions } from './src/data/consultingQuestions.js';

console.log('Final Question Count by Role:\n');
let totalQuestionsCount = 0;
for (const [role, data] of Object.entries(consultingQuestions)) {
  if (data.case_interview && Array.isArray(data.case_interview)) {
    const count = data.case_interview.length;
    totalQuestionsCount += count;
    console.log(`${role}: ${count} questions`);
  }
}

console.log(`\nTotal Questions: ${totalQuestionsCount}`);

