import { Resend } from "https://cdn.jsdelivr.net/npm/resend@3.0.0/+esm";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  "https://wcqfqwzrdjaohhkrytpq.supabase.co",
  Deno.env.get("SERVICE_ROLE_KEY")!
);

// FROM email — change to communications@interviewalpha.ai once domain verified
const FROM_EMAIL = "InterviewAlpha <onboarding@resend.dev>";

const day1WelcomeEmailHTML = (userName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ede8; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 1.4rem; font-weight: 800; margin: 0; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 1.05rem; font-weight: 700; color: #111; margin-bottom: 16px; }
    p { color: #6b6b6b; font-size: 0.92rem; line-height: 1.7; margin: 0 0 16px; }
    .tip-card { background: #f9f8f6; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 3px solid #a78bfa; }
    .tip-card p { margin: 0; color: #444; }
    .tip-number { font-weight: 800; color: #a78bfa; margin-bottom: 6px; }
    .cta-button { display: block; background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); color: #ffffff; text-decoration: none; text-align: center; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 0.95rem; margin: 24px 0; }
    .footer { padding: 20px 40px; text-align: center; border-top: 1px solid #e4e1db; }
    .footer p { font-size: 0.75rem; color: #9a9a9a; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to InterviewAlpha</h1>
    </div>
    <div class="body">
      <p class="greeting">Hi ${userName},</p>
      <p>You just signed up for InterviewAlpha. You have 3 free sessions waiting for you.</p>
      <p>Most people sign up and never start. Do not be that person. Here is how to make your 3 sessions count:</p>

      <div class="tip-card">
        <p class="tip-number">Session 1</p>
        <p>Answer any question cold, no preparation. Just like a real interview. See your score. This is your baseline.</p>
      </div>

      <div class="tip-card">
        <p class="tip-number">Session 2</p>
        <p>Read the expert rewrite from session 1 carefully. Then answer a similar question. Watch your score improve.</p>
      </div>

      <div class="tip-card">
        <p class="tip-number">Session 3</p>
        <p>Pick a company you want to work at. Answer one of their specific questions. This is the closest thing to a real interview you will get without being in the room.</p>
      </div>

      <a href="https://interviewalpha.ai" class="cta-button">Start your first session now</a>

      <p>Takes 2 minutes. No resume needed. Just answer like you are in the room.</p>
      <p>Good luck,<br><strong>Shraddha</strong><br>Founder, InterviewAlpha</p>
    </div>
    <div class="footer">
      <p>InterviewAlpha. Built for PM and Data Science aspirants.<br>
      <a href="https://interviewalpha.ai" style="color: #a78bfa;">interviewalpha.ai</a></p>
    </div>
  </div>
</body>
</html>
`;

const day3ReminderEmailHTML = (userName: string, sessionsLeft: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ede8; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 1.4rem; font-weight: 800; margin: 0; }
    .body { padding: 36px 40px; }
    p { color: #6b6b6b; font-size: 0.92rem; line-height: 1.7; margin: 0 0 16px; }
    .urgency-box { background: #fff5f5; border: 1px solid #fca5a5; border-radius: 12px; padding: 16px 20px; margin: 20px 0; text-align: center; }
    .urgency-box p { color: #dc2626; font-weight: 700; margin: 0; }
    .cta-button { display: block; background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); color: #ffffff; text-decoration: none; text-align: center; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 0.95rem; margin: 24px 0; }
    .footer { padding: 20px 40px; text-align: center; border-top: 1px solid #e4e1db; }
    .footer p { font-size: 0.75rem; color: #9a9a9a; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your free sessions are waiting</h1>
    </div>
    <div class="body">
      <p>Hi ${userName},</p>
      <p>You signed up 3 days ago and still have <strong>${sessionsLeft} free session${
  sessionsLeft !== 1 ? "s" : ""
}</strong> unused.</p>

      ${
        sessionsLeft === 1
          ? `
      <div class="urgency-box">
        <p>Only 1 free session left. Use it before it expires.</p>
      </div>
      `
          : ""
      }

      <p>Here is what you are missing:</p>
      <p>Every session gives you a score across 8 competencies and an expert rewrite of your answer. Most users who see their first score say it is the most specific feedback they have ever gotten on an interview answer.</p>
      <p>Your next interview could be closer than you think. The best time to practice is right now.</p>

      <a href="https://interviewalpha.ai" class="cta-button">Use a free session now</a>

      <p>It takes 2 minutes. You do not need to prepare anything.</p>
      <p>Shraddha<br>Founder, InterviewAlpha</p>
    </div>
    <div class="footer">
      <p>InterviewAlpha. <a href="https://interviewalpha.ai" style="color: #a78bfa;">interviewalpha.ai</a></p>
    </div>
  </div>
</body>
</html>
`;

const day5UpgradeEmailHTML = (userName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ede8; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 1.4rem; font-weight: 800; margin: 0; }
    .body { padding: 36px 40px; }
    p { color: #6b6b6b; font-size: 0.92rem; line-height: 1.7; margin: 0 0 16px; }
    .comparison { margin: 20px 0; }
    .comparison-row { display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start; }
    .free-col { flex: 1; background: #f9f9f9; border-radius: 8px; padding: 10px 12px; font-size: 0.82rem; color: #9a9a9a; }
    .pro-col { flex: 1; background: linear-gradient(135deg, rgba(168,230,207,0.1), rgba(167,139,250,0.1)); border: 1px solid rgba(167,139,250,0.2); border-radius: 8px; padding: 10px 12px; font-size: 0.82rem; color: #111; font-weight: 600; }
    .testimonial { background: #f9f8f6; border-radius: 12px; padding: 20px; margin: 20px 0; font-style: italic; color: #444; font-size: 0.88rem; line-height: 1.7; }
    .testimonial-author { font-style: normal; font-weight: 700; color: #111; margin-top: 10px; font-size: 0.82rem; }
    .price-box { background: linear-gradient(135deg, rgba(168,230,207,0.1), rgba(167,139,250,0.1)); border: 1.5px solid rgba(167,139,250,0.25); border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .price-box .price { font-size: 1.8rem; font-weight: 800; color: #111; }
    .price-box .period { font-size: 0.82rem; color: #9a9a9a; }
    .cta-button { display: block; background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); color: #ffffff; text-decoration: none; text-align: center; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 0.95rem; margin: 24px 0; }
    .guarantee { text-align: center; font-size: 0.78rem; color: #9a9a9a; }
    .footer { padding: 20px 40px; text-align: center; border-top: 1px solid #e4e1db; }
    .footer p { font-size: 0.75rem; color: #9a9a9a; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You used all 3 free sessions.</h1>
    </div>
    <div class="body">
      <p>Hi ${userName},</p>
      <p>You have used all your free sessions. That means you have seen what InterviewAlpha can do.</p>
      <p>Here is the difference between what you had and what Pro users get every day:</p>

      <div class="comparison">
        <div class="comparison-row">
          <div class="free-col">3 sessions total</div>
          <div class="pro-col">Unlimited sessions every day</div>
        </div>
        <div class="comparison-row">
          <div class="free-col">General questions only</div>
          <div class="pro-col">Google, Amazon, Flipkart, Meta specific questions</div>
        </div>
        <div class="comparison-row">
          <div class="free-col">PM questions only</div>
          <div class="pro-col">PM + Data Science + all future tracks</div>
        </div>
        <div class="comparison-row">
          <div class="free-col">No resume tools</div>
          <div class="pro-col">ATS Checker + Resume Optimizer + Templates</div>
        </div>
      </div>

      <div class="testimonial">
        "Subscribed after my first free session. Worth every penny. Got an offer within 3 weeks."
        <div class="testimonial-author">Dhruv Pandit, Data Scientist</div>
      </div>

      <div class="price-box">
        <p style="margin: 0 0 8px; font-weight: 700; color: #111;">Start Pro today</p>
        <p class="price">799 <span class="period">/month</span></p>
        <p style="font-size: 0.78rem; color: #9a9a9a; margin: 4px 0 0;">Or 583/month on the yearly plan</p>
      </div>

      <a href="https://interviewalpha.ai/upgrade" class="cta-button">Upgrade to Pro now</a>

      <p class="guarantee">Not happy in your first 7 days? Email us and we will sort it out.</p>

      <p>Shraddha<br>Founder, InterviewAlpha</p>
    </div>
    <div class="footer">
      <p>InterviewAlpha. <a href="https://interviewalpha.ai" style="color: #a78bfa;">interviewalpha.ai</a></p>
    </div>
  </div>
</body>
</html>
`;

interface Profile {
  id: string;
  email: string;
  display_name?: string;
  created_at: string;
  free_sessions_used?: number;
  subscription_status: string;
  email_day1_sent?: boolean;
  email_day3_sent?: boolean;
  email_day5_sent?: boolean;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const now = new Date();

    // Fetch all free users
    const { data: users, error: fetchError } = await supabase
      .from("profiles")
      .select(
        "id, email, display_name, created_at, free_sessions_used, subscription_status, email_day1_sent, email_day3_sent, email_day5_sent"
      )
      .eq("subscription_status", "free");

    if (fetchError) {
      throw fetchError;
    }

    if (!users?.length) {
      return new Response(JSON.stringify({ sent: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    let sent = 0;

    for (const user of users as Profile[]) {
      const createdAt = new Date(user.created_at);
      const daysSinceSignup = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const userName = user.display_name || user.email?.split("@")[0] || "there";
      const sessionsLeft = Math.max(0, 3 - (user.free_sessions_used || 0));

      // DAY 1 EMAIL — send on day 1, not sent before
      if (daysSinceSignup >= 1 && !user.email_day1_sent) {
        const emailSubject = `${userName}, here is how to make the most of your 3 free sessions`;
        const emailHtml = day1WelcomeEmailHTML(userName);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        });

        await supabase
          .from("profiles")
          .update({ email_day1_sent: true })
          .eq("id", user.id);
        sent++;
        console.log(`Day 1 email sent to ${user.email}`);
      }

      // DAY 3 EMAIL — send on day 3+, sessions still remaining, not sent before
      if (daysSinceSignup >= 3 && sessionsLeft > 0 && !user.email_day3_sent) {
        const emailSubject = `${userName}, you have ${sessionsLeft} free session${
          sessionsLeft !== 1 ? "s" : ""
        } left`;
        const emailHtml = day3ReminderEmailHTML(userName, sessionsLeft);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        });

        await supabase
          .from("profiles")
          .update({ email_day3_sent: true })
          .eq("id", user.id);
        sent++;
        console.log(`Day 3 email sent to ${user.email}`);
      }

      // DAY 5 EMAIL — send when sessions are 0, at least 2 days since signup, not sent before
      if (sessionsLeft === 0 && daysSinceSignup >= 2 && !user.email_day5_sent) {
        const emailSubject = `${userName}, your free sessions are used. Here is what Pro users do differently.`;
        const emailHtml = day5UpgradeEmailHTML(userName);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        });

        await supabase
          .from("profiles")
          .update({ email_day5_sent: true })
          .eq("id", user.id);
        sent++;
        console.log(`Day 5 email sent to ${user.email}`);
      }
    }

    return new Response(JSON.stringify({ success: true, sent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email sequence error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
