import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3001;

app.use(express.json({ limit: '10mb' }));

app.post('/api/messages', async (req, res) => {
  const { stream, ...body } = req.body;

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(stream ? { ...body, stream: true } : body),
    });

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      if (!upstream.ok) {
        const errData = await upstream.json().catch(() => ({}));
        res.write(`data: ${JSON.stringify({ type: "error", error: errData })}\n\n`);
        res.end();
        return;
      }

      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value, { stream: true }));
        }
      } catch (e) {
        res.write(`data: ${JSON.stringify({ type: "error", error: { message: e.message } })}\n\n`);
      } finally {
        res.end();
      }
      return;
    }

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    if (stream) {
      try { res.write(`data: ${JSON.stringify({ type: "error", error: { message: err.message } })}\n\n`); res.end(); } catch {}
    } else {
      res.status(502).json({ error: { message: err.message } });
    }
  }
});

app.post('/api/signup-check', async (req, res) => {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || '127.0.0.1';

  const windowStart = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

  try {
    const { count, error: countErr } = await supabase
      .from('signup_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('attempted_at', windowStart);

    if (countErr) return res.status(200).json({ allowed: true });

    if (count >= 2) {
      return res.status(429).json({ error: 'Too many signup attempts. Please try again later.' });
    }

    await supabase.from('signup_attempts').insert({ ip_address: ip });
    return res.status(200).json({ allowed: true });
  } catch {
    return res.status(200).json({ allowed: true });
  }
});

app.post('/api/send-emails', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('id,email,display_name,created_at,free_sessions_used,email_day1_sent,email_day3_sent,email_day5_sent')
      .neq('subscription_status', 'pro');

    if (error) throw error;

    let sent = 0;
    const now = new Date();

    for (const user of users || []) {
      if (!user.email) continue;
      const name = user.display_name || user.email.split('@')[0] || 'there';
      const days = Math.floor((now - new Date(user.created_at)) / (1000 * 60 * 60 * 24));
      const sessionsLeft = Math.max(0, 3 - (user.free_sessions_used || 0));

      if (days >= 1 && !user.email_day1_sent) {
        await sendResendEmail(user.email, `${name}, here is how to make the most of your 3 free sessions`, day1Html(name));
        await supabaseAdmin.from('profiles').update({ email_day1_sent: true }).eq('id', user.id);
        sent++;
      } else if (days >= 3 && sessionsLeft > 0 && !user.email_day3_sent) {
        await sendResendEmail(user.email, `${name}, you have ${sessionsLeft} free session${sessionsLeft !== 1 ? 's' : ''} left`, day3Html(name, sessionsLeft));
        await supabaseAdmin.from('profiles').update({ email_day3_sent: true }).eq('id', user.id);
        sent++;
      } else if (sessionsLeft === 0 && days >= 2 && !user.email_day5_sent) {
        await sendResendEmail(user.email, `${name}, your free sessions are used. Here is what Pro users do differently.`, day5Html(name));
        await supabaseAdmin.from('profiles').update({ email_day5_sent: true }).eq('id', user.id);
        sent++;
      }
    }

    return res.json({ success: true, sent });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: err.message });
  }
});

async function sendResendEmail(to, subject, html) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from: 'InterviewAlpha <onboarding@resend.dev>', to, subject, html })
  });
  return response.json();
}

function day1Html(name) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px"><div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px"><h1 style="color:white;margin:0;font-size:1.4rem">Welcome to InterviewAlpha</h1></div><p>Hi ${name},</p><p>You have 3 free sessions waiting. Here is how to make them count:</p><p><strong>Session 1:</strong> Answer any question cold. See your baseline score.</p><p><strong>Session 2:</strong> Read the expert rewrite. Answer a similar question. Watch your score improve.</p><p><strong>Session 3:</strong> Pick your target company. Answer one of their specific questions.</p><a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Start your first session now</a><p>Shraddha<br>Founder, InterviewAlpha</p></div>`;
}

function day3Html(name, sessionsLeft) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px"><div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px"><h1 style="color:white;margin:0;font-size:1.4rem">Your free sessions are waiting</h1></div><p>Hi ${name},</p><p>You still have <strong>${sessionsLeft} free session${sessionsLeft !== 1 ? 's' : ''}</strong> unused.</p><p>Every session gives you a score across 8 competencies and an expert rewrite. Most users say it is the most specific feedback they have ever gotten on an interview answer.</p><a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Use a free session now</a><p>Shraddha<br>Founder, InterviewAlpha</p></div>`;
}

function day5Html(name) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px"><div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px"><h1 style="color:white;margin:0;font-size:1.4rem">You used all 3 free sessions.</h1></div><p>Hi ${name},</p><p>You have seen what InterviewAlpha can do. Pro users get unlimited sessions, company-specific questions, and full 8-competency feedback every day.</p><p><em>"Subscribed after my first free session. Worth every penny. Got an offer within 3 weeks."</em><br><strong>Dhruv Pandit, Data Scientist</strong></p><a href="https://interviewalpha.ai/upgrade" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Upgrade to Pro now</a><p>Not happy in your first 7 days? Email us and we will sort it out.</p><p>Shraddha<br>Founder, InterviewAlpha</p></div>`;
}

app.listen(PORT, () => {
  console.log(`Dev proxy running on http://localhost:${PORT}`);
});
