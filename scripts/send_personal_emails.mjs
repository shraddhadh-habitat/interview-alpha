if (!process.env.RESEND_API_KEY) {
  console.error('Error: RESEND_API_KEY environment variable not set');
  process.exit(1);
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Shraddha <communications@interviewalpha.ai>';

const emails = [
  {
    to: 'saurav171094@gmail.com',
    subject: 'Saurav — what would your interview score be? 🎯',
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
<div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px">
<h1 style="color:white;margin:0;font-size:1.4rem">InterviewAlpha</h1>
</div>
<p>Hi Saurav,</p>
<p>I'm Shraddha, founder of InterviewAlpha.</p>
<p>16 years at Mastercard, Western Union, and UBS taught me one thing: the difference between candidates who get offers and those who don't isn't ability. It's practice with real feedback.</p>
<p>Most people prepare by reading. Nobody actually practices answering under pressure and finding out where they really stand.</p>
<p>That's exactly what InterviewAlpha fixes.</p>
<p>You answer a real PM or Data Science interview question by voice or text. AI scores you instantly across 8 competencies. You see your actual score and exactly how a stronger answer would have looked.</p>
<p>Most candidates are surprised by their first score. In a good way, because now they know what to work on.</p>
<p>Your first 3 sessions are on us. Takes 5 minutes.</p>
<a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Find out your score at interviewalpha.ai</a>
<p>Reply if you have questions. I read every email personally.</p>
<p>Rooting for you,<br>Shraddha<br>Founder, InterviewAlpha 🚀</p>
</div>`
  },
  {
    to: 'sarveshercs@gmail.com',
    subject: 'Sarvesh — your interview prep just got smarter 🎯',
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
<div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px">
<h1 style="color:white;margin:0;font-size:1.4rem">InterviewAlpha</h1>
</div>
<p>Hi Sarvesh,</p>
<p>I'm Shraddha, founder of InterviewAlpha. I noticed you visited recently and wanted to reach out personally.</p>
<p>I built this after 16 years in product roles at Mastercard, Western Union, and UBS because I kept seeing strong candidates lose out in interviews not from lack of ability but from lack of real practice with real feedback.</p>
<p>You answer a real PM or Data Science question by voice or text. AI scores you instantly across 8 competencies. You see exactly where you stood and how a stronger answer would have looked.</p>
<p>Your first 3 sessions are on us. No card needed. Takes 5 minutes.</p>
<a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Start practicing at interviewalpha.ai</a>
<p>Reply if you have questions. I read every email personally.</p>
<p>Rooting for you,<br>Shraddha<br>Founder, InterviewAlpha 🚀</p>
</div>`
  },
  {
    to: 'abhijithsrao11@gmail.com',
    subject: 'Abhi — ready for your next PM interview? 🎯',
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
<div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px">
<h1 style="color:white;margin:0;font-size:1.4rem">InterviewAlpha</h1>
</div>
<p>Hi Abhi,</p>
<p>I'm Shraddha, founder of InterviewAlpha. I saw you visited our platform and wanted to reach out personally.</p>
<p>I built InterviewAlpha after 16 years in product roles at Mastercard, Western Union, and UBS. The problem I kept seeing: strong candidates failing interviews not because they were not good enough, but because they never practiced with real feedback before the interview that actually mattered.</p>
<p>You answer a real PM or Data Science interview question by voice or text. AI scores you instantly across 8 competencies. You see your actual score and exactly how a stronger answer would have looked.</p>
<p>Your first 3 sessions are on us. Takes 5 minutes.</p>
<a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">Start your sessions at interviewalpha.ai</a>
<p>Reply if you have questions. I read every email personally.</p>
<p>Rooting for you,<br>Shraddha<br>Founder, InterviewAlpha 🚀</p>
</div>`
  }
];

async function sendEmails() {
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: email.to,
          subject: email.subject,
          html: email.html
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`Failed to send to ${email.to}:`, data);
      } else {
        console.log(`Sent to: ${email.to}`);
      }
    } catch (error) {
      console.error(`Error sending to ${email.to}:`, error.message);
    }

    // Wait 2 seconds before next email (except after last one)
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

sendEmails();
