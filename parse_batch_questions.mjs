#!/usr/bin/env node

/**
 * Parse batch question files into structured JSON
 *
 * Reads batch_60_questions.txt and batch_tech_ai_strategy.txt
 * Extracts question objects and groups by roundType
 * Outputs structured JSON ready for appending
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Parse a single question object from raw text
 * Expects format: { q: "...", a: "...", ... }
 */
function parseQuestion(text) {
  try {
    // Try to parse as JSON
    return JSON.parse(text);
  } catch (e) {
    console.warn(`Failed to parse question: ${e.message}`);
    return null;
  }
}

/**
 * Split batch file by question boundaries
 * Questions are separated by },{ pattern
 */
function splitQuestions(content) {
  // Find all question objects in the content
  const matches = content.match(/\{[^{}]*\{[\s\S]*?\}\}(?=,\s*\{|\s*$)/g);

  if (!matches) {
    // Try simpler approach: split by closing brace followed by opening brace
    return content.split(/(?<=\}),\s*(?=\{)/).map(q => {
      if (!q.startsWith('{')) q = '{' + q;
      if (!q.endsWith('}')) q = q + '}';
      return q.trim();
    });
  }

  return matches;
}

/**
 * Extract questions from batch files
 */
function extractBatchQuestions() {
  const questions = {
    ux_writing: [],
    technical_docs: [],
    ai_content: [],
    content_strategy: []
  };

  // Read batch_60_questions.txt (UX writing questions)
  console.log('Parsing batch_60_questions.txt...');
  const batch60Path = path.join(__dirname, 'batch_60_questions.txt');

  if (fs.existsSync(batch60Path)) {
    const batch60Content = fs.readFileSync(batch60Path, 'utf-8');

    // Extract all { ... } blocks
    const blocks = batch60Content.split('\n\n').filter(b => b.includes('"q":'));

    blocks.forEach(block => {
      try {
        // Clean up the block
        let cleaned = block.trim();

        // Handle case where multiple questions are in one block
        const questionMatches = cleaned.match(/\{[\s\S]*?\n\},/g) || [cleaned];

        questionMatches.forEach(qMatch => {
          // Ensure it's valid JSON
          let json = qMatch.trim();
          if (json.endsWith(',')) json = json.slice(0, -1);
          if (!json.startsWith('{')) json = '{' + json;
          if (!json.endsWith('}')) json = json + '}';

          const parsed = parseQuestion(json);
          if (parsed && parsed.roundType === 'ux_writing') {
            questions.ux_writing.push(parsed);
          }
        });
      } catch (e) {
        console.warn(`Skipped malformed question in batch_60_questions.txt`);
      }
    });
  } else {
    console.warn(`File not found: ${batch60Path}`);
  }

  // Read batch_tech_ai_strategy.txt (technical_docs, ai_content, content_strategy)
  console.log('Parsing batch_tech_ai_strategy.txt...');
  const batchTechPath = path.join(__dirname, 'batch_tech_ai_strategy.txt');

  if (fs.existsSync(batchTechPath)) {
    const batchTechContent = fs.readFileSync(batchTechPath, 'utf-8');

    const blocks = batchTechContent.split('\n\n').filter(b => b.includes('"q":'));

    blocks.forEach(block => {
      try {
        let cleaned = block.trim();

        const questionMatches = cleaned.match(/\{[\s\S]*?\n\},/g) || [cleaned];

        questionMatches.forEach(qMatch => {
          let json = qMatch.trim();
          if (json.endsWith(',')) json = json.slice(0, -1);
          if (!json.startsWith('{')) json = '{' + json;
          if (!json.endsWith('}')) json = json + '}';

          const parsed = parseQuestion(json);
          if (parsed) {
            const type = parsed.roundType;
            if (questions[type]) {
              questions[type].push(parsed);
            }
          }
        });
      } catch (e) {
        console.warn(`Skipped malformed question in batch_tech_ai_strategy.txt`);
      }
    });
  } else {
    console.warn(`File not found: ${batchTechPath}`);
  }

  return questions;
}

/**
 * Main function
 */
function main() {
  console.log('=== Batch Question Parser ===\n');

  // Extract questions
  const questions = extractBatchQuestions();

  // Display results
  console.log('\nExtraction Results:');
  let totalCount = 0;
  Object.keys(questions).forEach(type => {
    const count = questions[type].length;
    totalCount += count;
    console.log(`  ${type}: ${count} questions`);
  });

  console.log(`\nTotal: ${totalCount} questions`);

  // Validate question structure
  console.log('\nValidating question structure...');
  let validCount = 0;
  Object.keys(questions).forEach(type => {
    questions[type].forEach((q, idx) => {
      if (q.q && q.a && q.difficulty && q.domain && q.roundType) {
        validCount++;
      } else {
        console.warn(
          `  Invalid question in ${type}[${idx}]: missing fields`
        );
      }
    });
  });

  console.log(`  Valid questions: ${validCount}/${totalCount}`);

  // Save to JSON file
  const outputPath = path.join(__dirname, 'parsed_batch_questions.json');
  fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf-8');

  console.log(`\n✓ Questions saved to: ${outputPath}`);
  console.log('\nNext step: Run append_60_questions_to_technical_writing.mjs');
}

// Execute
main();
