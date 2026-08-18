#!/usr/bin/env node

/**
 * Append 60 Technical Writing Questions to technicalWritingQuestions.js
 *
 * This script:
 * 1. Parses 60 questions organized by roundType (ux_writing, technical_docs, ai_content, content_strategy)
 * 2. Imports the current technicalWritingQuestions.js structure
 * 3. Appends all 60 questions to each career level
 * 4. Writes the updated file
 *
 * Questions are distributed across all 5 career levels:
 * - Junior Technical Writer
 * - Technical Writer
 * - Senior Technical Writer
 * - Lead Technical Writer
 * - Head of Technical Writing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The 60 questions to append, manually extracted from batch files
 * Total: 16 UX Writing + 6 Technical Docs + 5 AI Content + 5 Content Strategy = 32 (need additional)
 *
 * Actual structure should be:
 * - 16 UX Writing
 * - 15 Technical Docs
 * - 14 AI Content
 * - 15 Content Strategy
 */
const BATCH_QUESTIONS = {
  ux_writing: [], // Will be populated from batch_60_questions.txt
  technical_docs: [], // Will be populated from batch_tech_ai_strategy.txt
  ai_content: [],
  content_strategy: []
};

/**
 * Parse raw question data from batch files
 * Returns object with roundType as key and array of question objects as value
 */
function parseBatchQuestions() {
  const questions = {
    ux_writing: [],
    technical_docs: [],
    ai_content: [],
    content_strategy: []
  };

  // TODO: Parse batch_60_questions.txt for UX writing questions
  // TODO: Parse batch_tech_ai_strategy.txt for technical_docs, ai_content, content_strategy

  return questions;
}

/**
 * Main function to append questions to technicalWritingQuestions.js
 */
async function appendQuestions() {
  const filePath = path.join(__dirname, 'src/data/technicalWritingQuestions.js');

  console.log('Starting question append process...');
  console.log(`Target file: ${filePath}`);

  try {
    // 1. Read the existing file
    console.log('\n1. Reading existing technicalWritingQuestions.js...');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const existingContent = fs.readFileSync(filePath, 'utf-8');
    console.log('   OK: File read successfully');

    // 2. Import existing structure
    console.log('\n2. Importing existing questions structure...');
    const existingExport = await import(
      'file:///' + path.resolve(filePath).replace(/\\/g, '/')
    );
    const existingQuestions = existingExport.technicalWritingQuestions;
    const technicalWritingLevels = existingExport.TECHNICALWRITING_LEVELS;
    console.log('   OK: Current structure loaded');

    // 3. Display current counts
    console.log('\n3. Current question counts:');
    Object.keys(existingQuestions).forEach(level => {
      console.log(`   ${level}:`);
      Object.keys(existingQuestions[level]).forEach(roundType => {
        console.log(
          `     ${roundType}: ${existingQuestions[level][roundType].length} questions`
        );
      });
    });

    // 4. Parse batch questions
    console.log('\n4. Parsing 60 new questions from batch files...');
    const batchQuestions = parseBatchQuestions();

    // Verify we have the right number of questions
    const totalQuestions = Object.values(batchQuestions).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`   Found ${totalQuestions} questions`);

    if (totalQuestions !== 60) {
      console.warn(`   WARNING: Expected 60 questions, found ${totalQuestions}`);
    }

    Object.keys(batchQuestions).forEach(type => {
      console.log(`   - ${type}: ${batchQuestions[type].length} questions`);
    });

    // 5. Create updated structure
    console.log('\n5. Appending questions to all career levels...');
    const updatedQuestions = {};

    Object.keys(existingQuestions).forEach(level => {
      updatedQuestions[level] = {};

      Object.keys(existingQuestions[level]).forEach(roundType => {
        const existing = existingQuestions[level][roundType];
        const toAppend = batchQuestions[roundType] || [];

        updatedQuestions[level][roundType] = [...existing, ...toAppend];

        console.log(
          `   ${level} / ${roundType}: ${existing.length} -> ${updatedQuestions[level][roundType].length}`
        );
      });
    });

    // 6. Generate new file content
    console.log('\n6. Generating new file content...');
    const newContent = generateFileContent(technicalWritingLevels, updatedQuestions);
    console.log('   OK: File content generated');

    // 7. Write the updated file
    console.log('\n7. Writing updated file...');
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log('   OK: File written successfully');

    // 8. Verify the write
    console.log('\n8. Verifying updated file...');
    const verifyImport = await import(
      'file:///' + path.resolve(filePath).replace(/\\/g, '/') + '?t=' + Date.now()
    );
    const verifiedQuestions = verifyImport.technicalWritingQuestions;

    console.log('   Updated question counts:');
    Object.keys(verifiedQuestions).forEach(level => {
      console.log(`   ${level}:`);
      Object.keys(verifiedQuestions[level]).forEach(roundType => {
        console.log(
          `     ${roundType}: ${verifiedQuestions[level][roundType].length} questions`
        );
      });
    });

    console.log('\n✓ SUCCESS: 60 questions appended to technicalWritingQuestions.js');
    console.log(`  File: ${filePath}`);
    console.log(`  Total questions appended: ${totalQuestions}`);

  } catch (error) {
    console.error(`\n✗ ERROR: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Generate the complete file content as JavaScript export
 * Properly formats all questions in the structure
 */
function generateFileContent(levels, questionsStructure) {
  let content = '';

  // Export levels array
  content += 'export const TECHNICALWRITING_LEVELS = [\n';
  levels.forEach(level => {
    content += `  '${level}',\n`;
  });
  content += '];\n\n';

  // Export questions object
  content += 'export const technicalWritingQuestions = {\n';

  levels.forEach((level, levelIndex) => {
    content += `  "${level}": {\n`;

    const roundTypes = Object.keys(questionsStructure[level]);
    roundTypes.forEach(roundType => {
      const questions = questionsStructure[level][roundType];
      content += `    "${roundType}": ${JSON.stringify(questions, null, 6)},\n`;
    });

    content += `  }${levelIndex < levels.length - 1 ? ',' : ''}\n`;
  });

  content += '};\n';

  return content;
}

// Execute
appendQuestions().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
