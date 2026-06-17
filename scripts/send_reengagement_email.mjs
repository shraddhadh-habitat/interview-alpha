import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const DRY_RUN = false;

if (!supabaseUrl || !supabaseKey || !resendApiKey) {
  console.error('Missing required environment variables:');
  console.error('  - SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('  - RESEND_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(resendApiKey);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendReengagementEmails() {
  try {
    // Fetch users with free_sessions_used = 0 and display_name is set
    const { data: users, error } = await supabase
      .from('profiles')
      .select('email, display_name')
      .eq('free_sessions_used', 0)
      .not('display_name', 'is', null)
      .not('display_name', 'ilike', '%test%')
      .not('display_name', 'ilike', '%testing%')
      .not('email', 'ilike', '%guerrillamail%')
      .not('email', 'ilike', '%sharklasers%')
      .not('email', 'ilike', '%bncinema%')
      .not('email', 'ilike', '%spam4%')
      .not('email', 'ilike', '%grr.la%')
      .not('email', 'ilike', '%tempmail%')
      .not('email', 'ilike', '%mailblock%')
      .not('email', 'eq', 'vaishnavi.kulkarni2012@gmail.com')
      .not('email', 'eq', 'interviewalpha.ai@gmail.com')
      .not('email', 'eq', 'shraddhadh@yahoo.co.in')
      .not('email', 'eq', 'dasha.ali@gmail.com');

    if (error) {
      console.error('Error fetching users:', error);
      process.exit(1);
    }

    console.log(`Found ${users.length} users to send emails to\n`);

    if (DRY_RUN) {
      console.log('[DRY RUN] Not sending emails. Set DRY_RUN=false to send.\n');
      console.log('Users that would receive emails:');
      for (const user of users) {
        console.log(`  - ${user.email} (${user.display_name})`);
      }
      console.log(`\nDone. Would send ${users.length} emails.`);
      return;
    }

    let sent = 0;

    for (const user of users) {
      try {
        const emailBody = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
  <div style="background:linear-gradient(135deg,#a8e6cf,#a78bfa);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px">
    <h1 style="color:white;margin:0;font-size:1.4rem">InterviewAlpha</h1>
  </div>

  <p>Hi ${user.display_name},</p>

  <p>You signed up for InterviewAlpha — wanted to make sure you got a chance to actually use it.</p>

  <p>Answer a real PM or Data Science interview question, get scored instantly across 8 competencies, and see exactly how an expert interviewer would expect you to answer it.</p>

  <p>Most candidates are surprised by their first score. Takes 5 minutes.</p>

  <a href="https://interviewalpha.ai" style="display:block;background:linear-gradient(135deg,#a8e6cf,#a78bfa);color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:700;margin:24px 0">
    Start your first session →
  </a>

  <p>Shraddha<br>Founder, InterviewAlpha<br>www.interviewalpha.ai</p>
</div>`;

        await resend.emails.send({
          from: 'Shraddha <shraddha@interviewalpha.ai>',
          to: user.email,
          subject: 'Your 3 free practice sessions are waiting',
          html: emailBody,
        });

        console.log(`Sent to: ${user.email}`);
        sent++;

        // 1 second delay between emails to avoid rate limiting
        if (sent < users.length - 1) {
          await sleep(1000);
        }
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err.message);
      }
    }

    console.log(`\nDone. Sent ${sent} emails.`);
    if (sent === users.length) {
      console.log('All emails sent successfully.');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

sendReengagementEmails();
