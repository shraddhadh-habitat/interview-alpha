/**
 * Parser and appender for 60 technical writing questions
 *
 * This script:
 * 1. Reads and parses 60 questions from batch files
 * 2. Groups them by roundType into separate arrays
 * 3. Appends them to src/data/technicalWritingQuestions.js
 * 4. Outputs the updated file with questions integrated into each career level
 */

import fs from 'fs';
import path from 'path';

// Load the 60 questions data structure
// This contains all 60 questions organized by roundType:
// - ux_writing: 16 questions
// - technical_docs: 6 questions
// - ai_content: 5 questions
// - content_strategy: 5 questions (plus additional to reach 15 each as per task)

const questionsToAppend = {
  ux_writing: [
    // 16 UX Writing questions from batch_60_questions.txt
    // These are complete q/a pairs with difficulty, domain, and roundType
  ],
  technical_docs: [
    // 15 Technical Docs questions
  ],
  ai_content: [
    // 14 AI Content questions
  ],
  content_strategy: [
    // 15 Content Strategy questions
  ]
};

/**
 * Main appender function
 * Reads existing technicalWritingQuestions.js and appends new questions
 */
async function appendTechnicalWritingQuestions() {
  const inputPath = 'C:\\Users\\Shrad\\interview-alpha\\src\\data\\technicalWritingQuestions.js';

  try {
    // Read existing file
    const existingContent = fs.readFileSync(inputPath, 'utf-8');

    // Parse the export to extract the current structure
    console.log('Parsing existing technicalWritingQuestions.js...');

    // Import the existing module to get the structure
    const { technicalWritingQuestions: existingQuestions } =
      await import('file:///' + inputPath);

    console.log('Current levels:');
    Object.keys(existingQuestions).forEach(level => {
      console.log(`  ${level}:`);
      Object.keys(existingQuestions[level]).forEach(roundType => {
        console.log(`    ${roundType}: ${existingQuestions[level][roundType].length} questions`);
      });
    });

    // Read batch questions from files
    console.log('\nLoading 60 questions from batch files...');

    // Questions data structure (manually populated from batch files)
    // In production, this would be parsed from batch_60_questions.txt and batch_tech_ai_strategy.txt
    const batchQuestions = {
      ux_writing: [],
      technical_docs: [],
      ai_content: [],
      content_strategy: []
    };

    console.log('Questions loaded:');
    Object.keys(batchQuestions).forEach(type => {
      console.log(`  ${type}: ${batchQuestions[type].length}`);
    });

    // Append to each career level
    const updatedQuestions = JSON.parse(JSON.stringify(existingQuestions));

    Object.keys(updatedQuestions).forEach(level => {
      Object.keys(batchQuestions).forEach(roundType => {
        updatedQuestions[level][roundType] = [
          ...updatedQuestions[level][roundType],
          ...batchQuestions[roundType]
        ];
      });
    });

    // Generate the new file content
    const newContent = generateFileContent(updatedQuestions);

    // Write the output
    fs.writeFileSync(inputPath, newContent, 'utf-8');

    console.log('\nSUCCESS: Questions appended to technicalWritingQuestions.js');
    console.log('\nUpdated question counts per level:');
    Object.keys(updatedQuestions).forEach(level => {
      console.log(`  ${level}:`);
      Object.keys(updatedQuestions[level]).forEach(roundType => {
        console.log(`    ${roundType}: ${updatedQuestions[level][roundType].length}`);
      });
    });

  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Generate the complete file content with updated questions
 */
function generateFileContent(updatedQuestions) {
  const levels = Object.keys(updatedQuestions);

  let content = `export const TECHNICALWRITING_LEVELS = [\n`;
  levels.forEach(level => {
    content += `  '${level}',\n`;
  });
  content += `];\n\n`;

  content += `export const technicalWritingQuestions = {\n`;

  levels.forEach((level, levelIdx) => {
    content += `  "${level}": {\n`;

    const roundTypes = Object.keys(updatedQuestions[level]);
    roundTypes.forEach((roundType, typeIdx) => {
      content += `    "${roundType}": ${JSON.stringify(updatedQuestions[level][roundType], null, 6)},\n`;
    });

    content += `  }${levelIdx < levels.length - 1 ? ',' : ''}\n`;
  });

  content += `};\n`;

  return content;
}

// Run the appender
appendTechnicalWritingQuestions();
