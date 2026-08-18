# Append 60 Technical Writing Questions Workflow

## Overview

This workflow appends 60 technical writing interview questions to `src/data/technicalWritingQuestions.js`. The questions are organized by category (roundType) and distributed across all 5 career levels.

## Question Distribution

Total: 60 questions
- **ux_writing**: 16 questions
- **technical_docs**: 15 questions
- **ai_content**: 14 questions
- **content_strategy**: 15 questions

Each question is appended to all 5 career levels:
1. Junior Technical Writer
2. Technical Writer
3. Senior Technical Writer
4. Lead Technical Writer
5. Head of Technical Writing

## Input Files

### batch_60_questions.txt
Contains the first 16 UX writing questions with full q/a pairs, difficulty levels, domains, and roundType.

Example structure:
```
{
  q: "Question text here",
  a: "Answer text here",
  difficulty: "Medium",
  domain: "fintech",
  roundType: "ux_writing",
  ...
}
```

### batch_tech_ai_strategy.txt
Contains technical_docs, ai_content, and content_strategy questions (remaining 44 questions).

### Additional batch files (if provided)
- For additional technical_docs questions (if needed)
- For additional ai_content questions (if needed)
- For additional content_strategy questions (if needed)

## Processing Pipeline

### Step 1: Data Extraction
The appender script extracts questions from batch files and validates:
- Total count = 60 questions
- All questions have required fields (q, a, difficulty, domain, roundType)
- RoundType values match expected categories

### Step 2: Structure Loading
The script imports the existing `technicalWritingQuestions.js` to understand current structure:
```javascript
technicalWritingQuestions = {
  "Junior Technical Writer": {
    ux_writing: [...existing questions],
    technical_docs: [...],
    ai_content: [...],
    content_strategy: [...]
  },
  "Technical Writer": {...},
  "Senior Technical Writer": {...},
  "Lead Technical Writer": {...},
  "Head of Technical Writing": {...}
}
```

### Step 3: Appending
For each of the 5 career levels, append all 60 questions to their respective categories:
- All 16 UX writing questions go to the `ux_writing` array
- All 15 technical_docs questions go to the `technical_docs` array
- All 14 ai_content questions go to the `ai_content` array
- All 15 content_strategy questions go to the `content_strategy` array

### Step 4: File Writing
Generate and write the updated file with proper JavaScript syntax and formatting.

### Step 5: Verification
Verify the file was written correctly by:
- Re-importing the file
- Validating question counts
- Checking file syntax

## Scripts

### Primary Script
**File**: `append_60_questions_to_technical_writing.mjs`

This is the production-ready Node.js script that:
1. Reads existing technicalWritingQuestions.js
2. Parses 60 questions from batch files
3. Appends to all career levels
4. Writes updated file
5. Verifies the result

**Usage**:
```bash
node append_60_questions_to_technical_writing.mjs
```

**Output**:
- Updated `src/data/technicalWritingQuestions.js` with 60 new questions
- Console output showing before/after question counts
- Verification that file was successfully written

## File Structure After Appending

```
src/data/technicalWritingQuestions.js
├── TECHNICALWRITING_LEVELS (exported array)
│   ├── "Junior Technical Writer"
│   ├── "Technical Writer"
│   ├── "Senior Technical Writer"
│   ├── "Lead Technical Writer"
│   └── "Head of Technical Writing"
│
└── technicalWritingQuestions (exported object)
    ├── "Junior Technical Writer": {
    │   ├── ux_writing: [16 + existing questions]
    │   ├── technical_docs: [15 + existing questions]
    │   ├── ai_content: [14 + existing questions]
    │   └── content_strategy: [15 + existing questions]
    │
    ├── "Technical Writer": {...}
    ├── "Senior Technical Writer": {...}
    ├── "Lead Technical Writer": {...}
    └── "Head of Technical Writing": {...}
```

## Important Notes

### No Commits
As per instructions, this workflow prepares the data but does NOT create any git commits. The updated file is ready for manual review and commit.

### Data Preservation
The script preserves all existing questions and only appends new ones. No data loss or overwriting occurs.

### Question Object Structure
Each question maintains this structure:
```javascript
{
  q: "Question text",
  a: "Answer text",
  difficulty: "Easy|Medium|Hard",
  domain: "fintech|banking|insurance|telecom",
  roundType: "ux_writing|technical_docs|ai_content|content_strategy",
  subcategory: null,
  companies: [],
  whatInterviewerTests: "",
  commonMistakes: []
}
```

### File Size
The resulting file will be significantly larger (~5-10 MB) due to 60 complete q/a pairs with detailed answers.

## Validation Checklist

After running the script, verify:
- [ ] File exists and is readable
- [ ] File contains valid JavaScript syntax
- [ ] All 5 career levels are present
- [ ] All 4 roundType categories exist for each level
- [ ] Question counts increased by 60 for each level
- [ ] Each question has required fields (q, a, difficulty, domain, roundType)
- [ ] No existing questions were deleted
- [ ] File can be imported without errors

## Troubleshooting

### Script fails to parse batch files
- Ensure batch_60_questions.txt and batch_tech_ai_strategy.txt are properly formatted JSON lines
- Check that each question object is valid JSON

### File write fails
- Verify write permissions on src/data/
- Ensure disk space is available
- Check that no other process has the file locked

### Import fails after write
- Validate JavaScript syntax in the written file
- Check that all quotes and braces are balanced
- Ensure JSON.stringify output is valid

### Question counts don't match
- Verify all 60 questions were parsed from batch files
- Check that no questions were lost during JSON stringification
- Confirm that each roundType had correct number of questions

## Next Steps

1. Review the updated `src/data/technicalWritingQuestions.js` file
2. Verify all 60 questions are present and correct
3. Test the file in the application (import in other modules)
4. Commit the changes to git when ready

## File Paths

- Script: `C:\Users\Shrad\interview-alpha\append_60_questions_to_technical_writing.mjs`
- Target: `C:\Users\Shrad\interview-alpha\src\data\technicalWritingQuestions.js`
- Input: `C:\Users\Shrad\interview-alpha\batch_60_questions.txt`
- Input: `C:\Users\Shrad\interview-alpha\batch_tech_ai_strategy.txt`
