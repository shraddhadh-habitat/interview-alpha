/**
 * Formats inline label-based text into line-separated format.
 * Handles patterns like "Pro: ... Con: ... Use: ..." and
 * concept labels like "Random: ... Stratified: ..."
 *
 * Input:  "Random: every item equal probability. Pro: unbiased, simple. Con: might miss minorities."
 * Output: "Random: every item equal probability.\nPro: unbiased, simple.\nCon: might miss minorities."
 */

// Common labels that should always start on a new line
const BREAK_LABELS = [
  'Pro',
  'Con',
  'Cons',
  'Pros',
  'Use',
  'Uses',
  'Example',
  'Examples',
  'Note',
  'Notes',
  'When',
  'Why',
  'How',
  'What',
  'Key',
  'Step',
  'Tip',
  'Tips',
  'Rule',
  'Result',
  'Output',
  'Input',
  'Benefit',
  'Benefits',
  'Drawback',
  'Drawbacks',
  'Advantage',
  'Advantages',
  'Disadvantage',
  'Disadvantages',
  'Formula',
  'Definition',
  'Random',
  'Stratified',
  'Systematic',
  'Cluster',
  'Simple',
  'Complex',
  'Basic',
  'Advanced',
];

export function formatLabeledText(text: string): string {
  if (!text) return text;

  // Build a regex that matches ". LabelWord:" or "word. LabelWord:" patterns
  // This inserts a newline before each label that follows a period+space
  const labelPattern = new RegExp(
    `\\.\\s+(${BREAK_LABELS.join('|')})\\s*:`,
    'g'
  );

  return text.replace(labelPattern, (match, label) => `.\n${label}:`);
}

/**
 * Splits text into an array of lines, each starting with a label.
 * Use this if you want to render each line as a separate <p> or <div>.
 */
export function splitIntoLabeledLines(text: string): string[] {
  const formatted = formatLabeledText(text);
  return formatted
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
