import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const SUPABASE_URL = 'https://wcqfqwzrdjaohhkrytpq.supabase.co'
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') || ''

serve(async () => {
  try {
    // Fetch free users who need emails
    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?subscription_status=eq.free&select=id,email,display_name,created_at,free_sessions_used,email_day1_sent,email_day3_sent,email_day5_sent`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`
      }
    })
    const data = await res.json()
    const users = Array.isArray(data) ? data : []

    let sent = 0
    const now = new Date()

    for (const user of users) {
      const name = user.display_name || user.email?.split('@')[0] || 'there'
      const created = new Date(user.created_at)
      const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
      const sessionsLeft = Math.max(0, 3 - (user.free_sessions_used || 0))

      // Day 1 email
      if (days >= 1 && !user.email_day1_sent) {
        await sendEmail(user.email, `${name}, here is how to make the most of your 3 free sessions`, day1Html(name))
        await updateProfile(SUPABASE_URL, SERVICE_ROLE_KEY, user.id, { email_day1_sent: true })
        sent++
      }

      // Day 3 email
      if (days >= 3 && sessionsLeft > 0 && !user.email_day3_sent) {
        await sendEmail(user.email, `${name}, you have ${sessionsLeft} free session${sessionsLeft !== 1 ? 's' : ''} left`, day3Html(name, sessionsLeft))
        await updateProfile(SUPABASE_URL, SERVICE_ROLE_KEY, user.id, { email_day3_sent: true })
        sent++
      }

      // Day 5 email
      if (sessionsLeft === 0 && days >= 2 && !user.email_day5_sent) {
        await sendEmail(user.email, `${name}, your free sessions are used. Here is what Pro users do differently.`, day5Html(name))
        await updateProfile(SUPABASE_URL, SERVICE_ROLE_KEY, user.id, { email_day5_sent: true })
        sent++
      }
    }

    return new Response(JSON.stringify({ success: true, sent }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'InterviewAlpha <communications@interviewalpha.ai>',
      to,
      subject,
      html
    })
  })
}

async function updateProfile(url: string, key: string, id: string, data: object) {
  await fetch(`${url}/rest/v1/profiles?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

function day1Html(name: string) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px">
      <h1 style="color:white;margin:0;font-size:1.4rem">Welcome to InterviewAlpha</h1>
    </div>
    <p>Hi ${name},</p>
    <p>You have 3 free sessions waiting. Here is how to make them count:</p>
    <p><strong>Session 1:</strong> Answer any question cold. See your baseline score.</p>
    <p><strong>Session 2:</strong> Read the expert rewrite. Answer a similar question. Watch your score improve.</p>
    <p><strong>Session 3:</strong> Pick your target company. Answer one of their specific questions.</p>
    <a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Start your first session now</a>
    <p>Shraddha<br>Founder, InterviewAlpha</p>
  </div>`
}

function day3Html(name: string, sessionsLeft: number) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px">
      <h1 style="color:white;margin:0;font-size:1.4rem">Your free sessions are waiting</h1>
    </div>
    <p>Hi ${name},</p>
    <p>You still have <strong>${sessionsLeft} free session${sessionsLeft !== 1 ? 's' : ''}</strong> unused.</p>
    <p>Every session gives you a score across 8 competencies and an expert rewrite of your answer. Most users say it is the most specific feedback they have ever gotten on an interview answer.</p>
    <a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Use a free session now</a>
    <p>Shraddha<br>Founder, InterviewAlpha</p>
  </div>`
}

function day5Html(name: string) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px">
      <h1 style="color:white;margin:0;font-size:1.4rem">You used all 3 free sessions.</h1>
    </div>
    <p>Hi ${name},</p>
    <p>You have seen what InterviewAlpha can do. Pro users get unlimited sessions, company-specific questions, and full 8-competency feedback every day.</p>
    <p><em>"Subscribed after my first free session. Worth every penny. Got an offer within 3 weeks."</em><br><strong>Dhruv Pandit, Data Scientist</strong></p>
    <a href="https://interviewalpha.ai/upgrade" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Upgrade to Pro now</a>
    <p>Not happy in your first 7 days? Email us and we will sort it out.</p>
    <p>Shraddha<br>Founder, InterviewAlpha</p>
  </div>`
}
