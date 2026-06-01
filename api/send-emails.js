import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('RESEND_API_KEY starts with:', process.env.RESEND_API_KEY?.substring(0, 8));

  // For testing — only send to interviewalpha.ai@gmail.com
  const testMode = true;
  console.log('Test mode:', testMode);

  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('id,email,display_name,updated_at,free_sessions_used,subscription_status,email_day1_sent,email_day3_sent,email_day5_sent,email_count');

    if (error) throw error;

    let sent = 0;
    const MAX_PER_RUN = 90;

    for (const user of users || []) {
      if (sent >= MAX_PER_RUN) break;
      if (!user.email) continue;

      const name = user.display_name || user.email.split('@')[0] || 'there';
      const sessionsLeft = Math.max(0, 3 - (user.free_sessions_used || 0));
      const emailCount = user.email_count || 0;

      // Skip pro users
      if (user.subscription_status === 'pro') continue;

      // Skip if practiced all sessions - send upgrade email instead
      if (sessionsLeft === 0 && !user.email_day5_sent) {
        await sendResendEmail(
          user.email,
          `${name}, your free sessions are used. Here is what Pro users do differently.`,
          email5Html(name)
        );
        await supabaseAdmin.from('profiles')
          .update({ email_day5_sent: true, email_count: emailCount + 1 })
          .eq('id', user.id);
        sent++;
        continue;
      }

      // For everyone else - send rotating content
      if (!user.email_day1_sent || emailCount > 0) {
        const content = getEmailContent(name, emailCount);
        await sendResendEmail(user.email, content.subject, content.html);
        await supabaseAdmin.from('profiles')
          .update({
            email_day1_sent: true,
            email_count: emailCount + 1
          })
          .eq('id', user.id);
        sent++;
      }
    }

    return res.json({ success: true, sent });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function sendResendEmail(to, subject, html) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from: 'InterviewAlpha <communications@interviewalpha.ai>', to, subject, html })
  });
  const data = await response.json();
  console.log('Resend response:', JSON.stringify(data));
  if (data.statusCode >= 400 || data.error) {
    throw new Error(`Resend error: ${data.statusCode} ${data.message}`);
  }
  return data;
}

const getEmailContent = (name, emailCount) => {
  const templates = [
    {
      subject: `${name}, are you afraid of finding out your score?`,
      html: email1Html(name)
    },
    {
      subject: `${name}, when did you last actually answer a question out loud?`,
      html: email2Html(name)
    },
    {
      subject: `${name}, he scored 4 out of 10 and got the offer anyway`,
      html: email3Html(name)
    },
    {
      subject: `${name}, this is why smart people fail PM and DS interviews`,
      html: email4Html(name)
    },
    {
      subject: `${name}, layoffs in 2026 are brutal. Are you actually ready?`,
      html: email5Html(name)
    }
  ];
  return templates[emailCount % templates.length];
};

function email1Html(name) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0ede8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%);border-radius:20px 20px 0 0;padding:48px 40px;text-align:center">
    <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:999px;padding:6px 16px;margin-bottom:16px">
      <p style="color:white;font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0">InterviewAlpha</p>
    </div>
    <h1 style="color:white;margin:0;font-size:1.8rem;font-weight:900;line-height:1.2">You signed up.<br>Now what?</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:0.9rem;margin:12px 0 0">The easy part is done. Here comes the real one.</p>
  </div>
  <div style="background:#ffffff;padding:40px;border-radius:0 0 20px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.08)">
    <p style="color:#111;font-size:1rem;line-height:1.8;margin:0 0 16px">Hi ${name},</p>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 16px">Signing up was the easy part. The hard part is finding out where your interview answers actually stand right now.</p>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 24px">Most people avoid this. Not because they are lazy. Because they are afraid of what they will find out.</p>
    <div style="background:linear-gradient(135deg,rgba(168,230,207,0.15),rgba(167,139,250,0.15));border-radius:16px;padding:24px;margin:0 0 24px;border:1.5px solid rgba(167,139,250,0.2)">
      <div style="font-size:2rem;margin-bottom:12px">💡</div>
      <p style="color:#111;font-size:0.92rem;line-height:1.7;margin:0;font-style:italic">"Dhruv answered his first question and scored 4 out of 10. That number changed everything. Two weeks later he had a job offer. He was not exceptional. He just knew where he stood and fixed it."</p>
    </div>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 28px">You have 3 free sessions waiting. No credit card. No pressure. Just answer one question and see exactly where you stand today.</p>
    <a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%);color:white;text-align:center;padding:18px 32px;border-radius:14px;text-decoration:none;font-weight:800;font-size:1rem;box-shadow:0 4px 16px rgba(167,139,250,0.4)">Answer my first question →</a>
    <p style="color:#9a9a9a;font-size:0.78rem;margin:20px 0 0;text-align:center">Takes 2 minutes. I read every reply personally.</p>
    <div style="height:1px;background:#f0ede8;margin:28px 0"></div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#a8e6cf,#a78bfa);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:1rem;flex-shrink:0">S</div>
      <div>
        <p style="color:#111;font-weight:700;font-size:0.88rem;margin:0">Shraddha</p>
        <p style="color:#9a9a9a;font-size:0.78rem;margin:2px 0 0">Founder, InterviewAlpha</p>
      </div>
    </div>
  </div>
  <p style="text-align:center;color:#9a9a9a;font-size:0.75rem;margin:16px 0 0"><a href="https://interviewalpha.ai" style="color:#a78bfa;text-decoration:none">interviewalpha.ai</a> · Built for PM and Data Science aspirants</p>
</div>
</body>
</html>`;
}

function email2Html(name) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0ede8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:20px 20px 0 0;padding:48px 40px;text-align:center">
    <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:999px;padding:6px 16px;margin-bottom:16px">
      <p style="color:white;font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0">InterviewAlpha</p>
    </div>
    <h1 style="color:white;margin:0;font-size:1.8rem;font-weight:900;line-height:1.2">Be honest with<br>yourself.</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:0.9rem;margin:12px 0 0">When did you last practice out loud?</p>
  </div>
  <div style="background:#ffffff;padding:40px;border-radius:0 0 20px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.08)">
    <p style="color:#111;font-size:1rem;line-height:1.8;margin:0 0 16px">Hi ${name},</p>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 16px">When was the last time you actually answered an interview question out loud?</p>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 24px">Not read about frameworks. Not watched a YouTube video. Actually answered a question the way you would in a real interview room.</p>
    <div style="margin:0 0 24px">
      <div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #f0ede8">
        <div style="width:36px;height:36px;border-radius:10px;background:#f0ede8;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">📚</div>
        <p style="color:#9a9a9a;font-size:0.88rem;margin:0;text-decoration:line-through">Read about frameworks</p>
      </div>
      <div style="display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #f0ede8">
        <div style="width:36px;height:36px;border-radius:10px;background:#f0ede8;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">▶️</div>
        <p style="color:#9a9a9a;font-size:0.88rem;margin:0;text-decoration:line-through">Watched YouTube videos</p>
      </div>
      <div style="display:flex;align-items:center;gap:14px;padding:14px 0">
        <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#a78bfa,#c084fc);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">🎯</div>
        <p style="color:#111;font-size:0.88rem;font-weight:700;margin:0">Actually practiced answering questions</p>
      </div>
    </div>
    <div style="background:#f9f8f6;border-radius:14px;padding:20px 24px;margin:0 0 28px;border-left:4px solid #7ec8c8">
      <p style="color:#111;font-size:0.92rem;line-height:1.7;margin:0">InterviewAlpha gives you a safe place to blank first. Score your answer. See the expert version. Fix what is missing. Then walk into the real interview ready.</p>
    </div>
    <a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center;padding:18px 32px;border-radius:14px;text-decoration:none;font-weight:800;font-size:1rem;box-shadow:0 4px 16px rgba(102,126,234,0.4)">Practice before my next interview →</a>
    <p style="color:#9a9a9a;font-size:0.78rem;margin:20px 0 0;text-align:center">3 free sessions. No credit card needed.</p>
    <div style="height:1px;background:#f0ede8;margin:28px 0"></div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#a8e6cf,#a78bfa);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:1rem;flex-shrink:0">S</div>
      <div>
        <p style="color:#111;font-weight:700;font-size:0.88rem;margin:0">Shraddha</p>
        <p style="color:#9a9a9a;font-size:0.78rem;margin:2px 0 0">Founder, InterviewAlpha</p>
      </div>
    </div>
  </div>
  <p style="text-align:center;color:#9a9a9a;font-size:0.75rem;margin:16px 0 0"><a href="https://interviewalpha.ai" style="color:#a78bfa;text-decoration:none">interviewalpha.ai</a> · Built for PM and Data Science aspirants</p>
</div>
</body>
</html>`;
}

function email3Html(name) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0ede8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);border-radius:20px 20px 0 0;padding:48px 40px;text-align:center">
    <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:999px;padding:6px 16px;margin-bottom:16px">
      <p style="color:white;font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0">InterviewAlpha</p>
    </div>
    <h1 style="color:white;margin:0;font-size:1.8rem;font-weight:900;line-height:1.2">He scored 4 out of 10.<br>Then got the offer.</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:0.9rem;margin:12px 0 0">This is not a motivational story. It is a system.</p>
  </div>
  <div style="background:#ffffff;padding:40px;border-radius:0 0 20px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.08)">
    <p style="color:#111;font-size:1rem;line-height:1.8;margin:0 0 16px">Hi ${name},</p>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 24px">Dhruv answered his first product sense question on InterviewAlpha and scored 4 out of 10. Most people would close the tab. Dhruv read the feedback carefully and understood exactly what a senior PM would say instead.</p>
    <div style="background:#f9f8f6;border-radius:16px;padding:24px;margin:0 0 24px">
      <p style="color:#111;font-weight:700;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px">Dhruv's progression</p>
      <div style="display:flex;gap:8px;align-items:center">
        <div style="flex:1;background:white;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
          <p style="font-size:2rem;font-weight:900;color:#f5576c;margin:0">4</p>
          <p style="font-size:0.72rem;color:#9a9a9a;margin:4px 0 0;font-weight:600">Day 1</p>
        </div>
        <div style="color:#9a9a9a;font-size:1.2rem;padding:0 4px;flex-shrink:0">→</div>
        <div style="flex:1;background:white;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
          <p style="font-size:2rem;font-weight:900;color:#a78bfa;margin:0">8</p>
          <p style="font-size:0.72rem;color:#9a9a9a;margin:4px 0 0;font-weight:600">Week 2</p>
        </div>
        <div style="color:#9a9a9a;font-size:1.2rem;padding:0 4px;flex-shrink:0">→</div>
        <div style="flex:1;background:linear-gradient(135deg,rgba(168,230,207,0.2),rgba(167,139,250,0.2));border-radius:12px;padding:16px;text-align:center;border:1.5px solid rgba(167,139,250,0.3)">
          <p style="font-size:1.5rem;font-weight:900;color:#22c55e;margin:0">✓</p>
          <p style="font-size:0.72rem;color:#22c55e;margin:4px 0 0;font-weight:700">Offer</p>
        </div>
      </div>
    </div>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 16px">I am not telling you this to impress you. Dhruv was not exceptional. He just knew where he stood and fixed it.</p>
    <p style="color:#111;font-size:0.92rem;line-height:1.8;margin:0 0 28px;font-weight:600">What would your score be today?</p>
    <a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:white;text-align:center;padding:18px 32px;border-radius:14px;text-decoration:none;font-weight:800;font-size:1rem;box-shadow:0 4px 16px rgba(245,87,108,0.4)">Find out my score →</a>
    <p style="color:#9a9a9a;font-size:0.78rem;margin:20px 0 0;text-align:center">3 free sessions. No credit card needed.</p>
    <div style="height:1px;background:#f0ede8;margin:28px 0"></div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#a8e6cf,#a78bfa);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:1rem;flex-shrink:0">S</div>
      <div>
        <p style="color:#111;font-weight:700;font-size:0.88rem;margin:0">Shraddha</p>
        <p style="color:#9a9a9a;font-size:0.78rem;margin:2px 0 0">Founder, InterviewAlpha</p>
      </div>
    </div>
  </div>
  <p style="text-align:center;color:#9a9a9a;font-size:0.75rem;margin:16px 0 0"><a href="https://interviewalpha.ai" style="color:#a78bfa;text-decoration:none">interviewalpha.ai</a> · Built for PM and Data Science aspirants</p>
</div>
</body>
</html>`;
}

function email4Html(name) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0ede8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);border-radius:20px 20px 0 0;padding:48px 40px;text-align:center">
    <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:999px;padding:6px 16px;margin-bottom:16px">
      <p style="color:white;font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0">InterviewAlpha</p>
    </div>
    <h1 style="color:white;margin:0;font-size:1.8rem;font-weight:900;line-height:1.2">The real reason smart<br>people fail interviews</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:0.9rem;margin:12px 0 0">It is not what you think.</p>
  </div>
  <div style="background:#ffffff;padding:40px;border-radius:0 0 20px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.08)">
    <p style="color:#111;font-size:1rem;line-height:1.8;margin:0 0 16px">Hi ${name},</p>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 24px">It is not knowledge. Most people who fail PM and DS interviews know their stuff. It is how they communicate under pressure. Three things show up again and again:</p>
    <div style="background:#f9f8f6;border-radius:14px;padding:20px;margin:0 0 12px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#4facfe,#00f2fe);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:0.85rem;flex-shrink:0">1</div>
        <p style="color:#111;font-weight:700;font-size:0.9rem;margin:0">Answering the question asked, not behind it</p>
      </div>
      <p style="color:#6b6b6b;font-size:0.84rem;line-height:1.6;margin:0;padding-left:44px">"How would you improve YouTube?" is not about features. It is about users, business model, and trade-offs.</p>
    </div>
    <div style="background:#f9f8f6;border-radius:14px;padding:20px;margin:0 0 12px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#a78bfa,#c084fc);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:0.85rem;flex-shrink:0">2</div>
        <p style="color:#111;font-weight:700;font-size:0.9rem;margin:0">Jumping to solutions before framing the problem</p>
      </div>
      <p style="color:#6b6b6b;font-size:0.84rem;line-height:1.6;margin:0;padding-left:44px">The best candidates spend 40% of their time making sure they are solving the right problem. Most spend 0%.</p>
    </div>
    <div style="background:#f9f8f6;border-radius:14px;padding:20px;margin:0 0 28px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#a8e6cf,#7ec8c8);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:0.85rem;flex-shrink:0">3</div>
        <p style="color:#111;font-weight:700;font-size:0.9rem;margin:0">Forgetting metrics</p>
      </div>
      <p style="color:#6b6b6b;font-size:0.84rem;line-height:1.6;margin:0;padding-left:44px">Every answer needs success criteria. Interviewers always notice when this is missing.</p>
    </div>
    <a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);color:white;text-align:center;padding:18px 32px;border-radius:14px;text-decoration:none;font-weight:800;font-size:1rem;box-shadow:0 4px 16px rgba(79,172,254,0.4)">See which mistake I make →</a>
    <p style="color:#9a9a9a;font-size:0.78rem;margin:20px 0 0;text-align:center">3 free sessions. No credit card needed.</p>
    <div style="height:1px;background:#f0ede8;margin:28px 0"></div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#a8e6cf,#a78bfa);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:1rem;flex-shrink:0">S</div>
      <div>
        <p style="color:#111;font-weight:700;font-size:0.88rem;margin:0">Shraddha</p>
        <p style="color:#9a9a9a;font-size:0.78rem;margin:2px 0 0">Founder, InterviewAlpha</p>
      </div>
    </div>
  </div>
  <p style="text-align:center;color:#9a9a9a;font-size:0.75rem;margin:16px 0 0"><a href="https://interviewalpha.ai" style="color:#a78bfa;text-decoration:none">interviewalpha.ai</a> · Built for PM and Data Science aspirants</p>
</div>
</body>
</html>`;
}

function email5Html(name) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0ede8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%);border-radius:20px 20px 0 0;padding:48px 40px;text-align:center">
    <div style="display:inline-block;background:rgba(255,255,255,0.1);border-radius:999px;padding:6px 16px;margin-bottom:16px">
      <p style="color:rgba(255,255,255,0.8);font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0">InterviewAlpha</p>
    </div>
    <h1 style="color:white;margin:0;font-size:1.8rem;font-weight:900;line-height:1.2">Layoffs in 2026<br>are brutal.</h1>
    <p style="color:rgba(255,255,255,0.7);font-size:0.9rem;margin:12px 0 0">Are you actually ready?</p>
  </div>
  <div style="background:#ffffff;padding:40px;border-radius:0 0 20px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.08)">
    <p style="color:#111;font-size:1rem;line-height:1.8;margin:0 0 16px">Hi ${name},</p>
    <p style="color:#444;font-size:0.92rem;line-height:1.8;margin:0 0 16px">Thousands of brilliant PMs and data scientists are back in the job market right now. Through no fault of their own.</p>
    <div style="background:linear-gradient(135deg,rgba(15,12,41,0.05),rgba(48,43,99,0.08));border-radius:16px;padding:24px;margin:20px 0;border:1.5px solid rgba(48,43,99,0.15);text-align:center">
      <p style="color:#302b63;font-size:1.1rem;font-weight:800;margin:0 0 8px">Interview skills expire.</p>
      <p style="color:#6b6b6b;font-size:0.85rem;line-height:1.6;margin:0">You can be the best in the room and still fail because you have not practiced answering questions under pressure in years.</p>
    </div>
    <p style="color:#111;font-weight:700;font-size:0.88rem;margin:24px 0 12px">What Pro users get every day:</p>
    <div style="display:flex;flex-direction:column;gap:8px;margin:0 0 28px">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f9f8f6;border-radius:10px">
        <span style="color:#22c55e;font-size:1rem;flex-shrink:0">✓</span>
        <p style="color:#444;font-size:0.88rem;margin:0">Unlimited practice sessions every day</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f9f8f6;border-radius:10px">
        <span style="color:#22c55e;font-size:1rem;flex-shrink:0">✓</span>
        <p style="color:#444;font-size:0.88rem;margin:0">Company questions for Google, Amazon, Flipkart, Meesho, PhonePe</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f9f8f6;border-radius:10px">
        <span style="color:#22c55e;font-size:1rem;flex-shrink:0">✓</span>
        <p style="color:#444;font-size:0.88rem;margin:0">PM and Data Science tracks</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f9f8f6;border-radius:10px">
        <span style="color:#22c55e;font-size:1rem;flex-shrink:0">✓</span>
        <p style="color:#444;font-size:0.88rem;margin:0">Full 8 competency feedback and expert rewrite every time</p>
      </div>
    </div>
    <a href="https://interviewalpha.ai/upgrade" style="display:block;background:linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%);color:white;text-align:center;padding:18px 32px;border-radius:14px;text-decoration:none;font-weight:800;font-size:1rem;box-shadow:0 4px 16px rgba(15,12,41,0.3)">See Pro plans →</a>
    <p style="color:#9a9a9a;font-size:0.78rem;margin:20px 0 0;text-align:center">Not happy in 7 days? Email <a href="mailto:communications@interviewalpha.ai" style="color:#a78bfa;text-decoration:none">communications@interviewalpha.ai</a> and we will sort it out.</p>
    <div style="height:1px;background:#f0ede8;margin:28px 0"></div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#a8e6cf,#a78bfa);display:flex;align-items:center;justify-content:center;font-weight:800;color:white;font-size:1rem;flex-shrink:0">S</div>
      <div>
        <p style="color:#111;font-weight:700;font-size:0.88rem;margin:0">Shraddha</p>
        <p style="color:#9a9a9a;font-size:0.78rem;margin:2px 0 0">Founder, InterviewAlpha</p>
      </div>
    </div>
  </div>
  <p style="text-align:center;color:#9a9a9a;font-size:0.75rem;margin:16px 0 0"><a href="https://interviewalpha.ai" style="color:#a78bfa;text-decoration:none">interviewalpha.ai</a> · Built for PM and Data Science aspirants</p>
</div>
</body>
</html>`;
}
