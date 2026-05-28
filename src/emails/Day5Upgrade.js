export const day5UpgradeEmail = (userName) => ({
  subject: `${userName}, your free sessions are used. Here is what Pro users do differently.`,
  html: `
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
  `
});
