# Email Sequence Setup — Resend + Supabase Edge Functions

Automated 3-email sequence for InterviewAlpha users based on signup date and session usage.

## Overview

- **Day 1**: Welcome email with how to use 3 free sessions
- **Day 3**: Reminder email (only if sessions remaining)
- **Day 5**: Upgrade email (when all sessions are used)

Emails send from `onboarding@resend.dev` until domain is verified, then switch to `communications@interviewalpha.ai`.

---

## Setup Steps

### 1. Install Resend (Already Done)

```bash
npm install resend
```

### 2. Add Environment Variables to Vercel

In Vercel Dashboard → Settings → Environment Variables:

```
RESEND_API_KEY=re_MKWFYVgw_6bz76hGNHqcoyY97m82gbjHY
SUPABASE_SERVICE_ROLE_KEY=[from Supabase Dashboard → Settings → API]
```

Ensure all environments (Production, Preview, Development) are selected.

### 3. Run Database Migration

In Supabase SQL Editor, run:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_day1_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_day3_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_day5_sent BOOLEAN DEFAULT FALSE;
```

Or let Supabase auto-run migrations:
```bash
supabase migration up
```

### 4. Deploy Edge Function

```bash
supabase functions deploy send-email-sequence
```

### 5. Set Up Cron Job (Vercel)

Create `vercel.json` in project root (or update if exists):

```json
{
  "crons": [
    {
      "path": "/api/crons/send-emails",
      "schedule": "0 * * * *"
    }
  ]
}
```

This runs every hour at the top of the hour.

### 6. Create Vercel API Route to Trigger Edge Function

Create `src/pages/api/crons/send-emails.js`:

```javascript
export default async function handler(req, res) {
  // Verify cron secret to prevent unauthorized calls
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/send-email-sequence`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Cron error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

Add `CRON_SECRET` to Vercel environment variables (any random string).

### 7. Test Manually

After deploying, trigger the edge function:

```bash
curl -X POST \
  https://[PROJECT_ID].supabase.co/functions/v1/send-email-sequence \
  -H "Authorization: Bearer [SUPABASE_ANON_KEY]" \
  -H "Content-Type: application/json"
```

Check:
- **Resend Dashboard** → Logs to confirm emails sent
- **Supabase** → Profiles table for `email_day1_sent`, `email_day3_sent`, `email_day5_sent` flags

### 8. When Domain is Verified

After DNS is set up with GoDaddy, change ONE line in `supabase/functions/send-email-sequence/index.ts`:

```typescript
// Change from:
const FROM_EMAIL = "InterviewAlpha <onboarding@resend.dev>";

// To:
const FROM_EMAIL = "InterviewAlpha <communications@interviewalpha.ai>";
```

Then redeploy:
```bash
supabase functions deploy send-email-sequence
```

---

## Files

- `supabase/functions/send-email-sequence/index.ts` — Edge function that sends emails
- `src/emails/Day1Welcome.js` — Welcome email template
- `src/emails/Day3Reminder.js` — Reminder email template
- `src/emails/Day5Upgrade.js` — Upgrade email template
- `supabase/migrations/add_email_tracking_columns.sql` — Database migration

---

## How It Works

1. **Cron trigger** runs every hour (0 * * * *)
2. **Edge function** fetches all free users from Supabase
3. For each user:
   - Calculates days since signup
   - Calculates remaining free sessions
   - Sends appropriate email if conditions are met
   - Updates profile flag so email is never sent twice
4. Returns success/error status

---

## Email Triggers

| Email | Trigger | Condition |
|-------|---------|-----------|
| Day 1 | Days since signup ≥ 1 | `email_day1_sent = false` |
| Day 3 | Days since signup ≥ 3 | `email_day3_sent = false` AND sessions remaining > 0 |
| Day 5 | Sessions used = 3 | `email_day5_sent = false` AND days since signup ≥ 2 |

---

## Troubleshooting

### Emails not sending
- Check Resend API key is correct in Vercel env
- Check `RESEND_API_KEY` is set in Supabase as well
- Verify Supabase function is deployed: `supabase functions list`

### Columns don't exist
- Run migration in Supabase SQL Editor
- Check table structure: `SELECT * FROM profiles LIMIT 1;`

### Cron not running
- Check Vercel Project Settings → Cron Jobs
- Verify `vercel.json` is in root of project
- Check function logs in Vercel Dashboard

---

## Notes

- Email addresses are passed as-is to Resend (make sure they're valid)
- `free_sessions_used` is tracked in practice_attempts table
- All times are UTC (adjust if needed)
- Once domain is verified, update `FROM_EMAIL` and redeploy
