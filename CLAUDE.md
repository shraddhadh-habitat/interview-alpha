# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed.

## ⚠️ CRITICAL: Git Operations
Never run `git add`, `git commit`, or `git push` without explicit instruction from the user. Always show diffs and wait for approval before any git operations.

## 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

## 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked
- No abstractions for single-use code
- If you write 200 lines and it could be 50, rewrite it

## 3. Surgical Changes
Touch only what you must. Clean up only your own mess.
- Don't improve adjacent code, comments, or formatting
- Don't refactor things that aren't broken
- Match existing style, even if you'd do it differently
- Every changed line must trace directly to the request

## 4. Diff Before Applying
ALWAYS show full diff before making any change.
Wait for explicit approval. Never auto-apply.

## 5. Project-Specific Rules
- Never touch auth files unless explicitly named
- Never run git add/commit/push unless instructed
- Run diagnostic grep before attempting any CSS fix
- If unsure about a class name or handler, ask first
- Show confidence level on all non-obvious claims
