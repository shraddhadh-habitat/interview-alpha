import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pmQuestionsPath = path.join(__dirname, '../src/data/pmQuestions.js');

// Read the file
let fileContent = fs.readFileSync(pmQuestionsPath, 'utf-8');

// Strip markdown patterns
// Replace **text** with text
fileContent = fileContent.replace(/\*\*(.+?)\*\*/g, '$1');

// Replace ## text (and ### text) with just text
fileContent = fileContent.replace(/#{2,3} +(.+?)(?=\n|$)/g, '$1');

// Write back
fs.writeFileSync(pmQuestionsPath, fileContent, 'utf-8');

console.log('✓ Stripped markdown from pmQuestions.js');
