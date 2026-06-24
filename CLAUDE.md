# Behavioral Guidelines for Claude Code

## 1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.
Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

## 3. Surgical Changes
Touch only what you must. Clean up only your own mess.
When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.
The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution
Define success criteria. Loop until verified.
- Transform tasks into verifiable goals
- For multi-step tasks, state a brief plan before starting
- Strong success criteria let you loop independently

## 5. Critical Flows - NEVER TOUCH WITHOUT EXPLICIT PERMISSION
- Auth flow (App.jsx auth state, profile loading)
- Flow 1: pending_scores → score_token → AuthCallback → PracticeMode
- Flow 2: signup → email verification → new_user=true → forced first question
- Paywall logic (free_sessions_used >= 3)
- LoginModal emailRedirectTo URL
- Supabase RLS policies

## 6. Before Any Change
- Read the relevant file first
- State what you will change and what you will NOT change
- Run npm run build before committing
- Never commit if build fails
