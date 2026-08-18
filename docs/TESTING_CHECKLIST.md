# InterviewAlpha Testing Checklist
Run this after every deployment. Check every item.

## 1. Homepage (Logged Out)
- [ ] Homepage loads correctly
- [ ] Hero headline visible
- [ ] CTA button "Answer your first question" visible
- [ ] Feedback Preview section shows PM and DS tabs
- [ ] Sample Questions section shows both PM and DS questions
- [ ] Reviews section rotates
- [ ] Activity ticker appears bottom left
- [ ] No horizontal scroll on desktop or mobile
- [ ] "Or browse questions free" link works

## 2. Signup Flow
- [ ] Click CTA opens signup modal
- [ ] Name, email, phone, password fields work
- [ ] Invalid email shows error
- [ ] Phone less than 10 digits shows error
- [ ] Successful signup shows email verification screen
- [ ] Verification email arrives in inbox

## 3. Login Flow
- [ ] Login with valid credentials works
- [ ] Wrong password shows error
- [ ] Forgot password works

## 4. First Question (New User)
- [ ] New user sees practice screen after login
- [ ] Can select PM or DS track
- [ ] Question displays correctly
- [ ] Text mode works — can type answer
- [ ] Word count shows correctly
- [ ] Submit button disabled under 50 words
- [ ] Submit button enabled at 50+ words
- [ ] Submit Answer button works and returns feedback
- [ ] AI feedback shows score out of 10
- [ ] All 8 competency bars show
- [ ] Expert rewrite shows
- [ ] free_sessions_used increments in Supabase after submit

## 5. Voice Recording
- [ ] Microphone permission requested
- [ ] Recording starts immediately on click
- [ ] Timer starts at 0 and counts up
- [ ] Timer keeps running past 54 seconds
- [ ] Timer keeps running during speech pauses
- [ ] "Continue Recording" button appears during pauses
- [ ] Timer only stops when Stop button clicked
- [ ] Transcription captures full answer
- [ ] Submit Answer button appears after stopping
- [ ] Submit works and returns feedback

## 6. Session Limits
- [ ] Free user with 0 sessions can practice
- [ ] Free user with 1 session can practice
- [ ] Free user with 2 sessions can practice
- [ ] Free user with 3 sessions sees upgrade prompt
- [ ] Pro user has unlimited sessions

## 7. Upgrade Page
- [ ] /upgrade page loads
- [ ] All 3 pricing cards show
- [ ] Monthly, Quarterly, Yearly buttons work
- [ ] Testimonial ticker rotates
- [ ] Trust signals visible

## 8. Resume Tools
- [ ] ATS Checker tab loads
- [ ] Resume Optimizer tab loads
- [ ] Templates tab loads — no preview images
- [ ] Resume Score tab loads — no "coming soon" banner
- [ ] Download Template buttons work

## 9. Admin Panel
- [ ] Admin panel loads for shraddhadh@gmail.com
- [ ] Total users count matches Supabase
- [ ] User list shows all users
- [ ] Filters work — device, status, phone
- [ ] Export CSV works
- [ ] Total Practice Sessions shows correct count

## 10. Email Sequence
- [ ] Test curl command returns success
- [ ] Resend logs show emails sending
- [ ] Emails come from communications@interviewalpha.ai

## 11. Mobile (iPhone and Android)
- [ ] Homepage looks correct on mobile
- [ ] No text overflow or clipping
- [ ] CTA button full width
- [ ] Navigation menu works
- [ ] Voice recording works on mobile
- [ ] Submit button works on mobile

## Quick Supabase Checks
Run these after every deployment:

```sql
-- Check recent sessions
SELECT p.email, s.overall_score, s.track, s.created_at
FROM sessions s
JOIN profiles p ON s.user_id = p.id
ORDER BY s.created_at DESC LIMIT 5;

-- Check session counts
SELECT COUNT(*) FROM sessions;

-- Check recent signups
SELECT email, free_sessions_used, subscription_status, updated_at
FROM profiles
ORDER BY updated_at DESC LIMIT 10;
```
