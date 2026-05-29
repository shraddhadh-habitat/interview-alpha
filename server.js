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

app.listen(PORT, () => {
  console.log(`Dev proxy running on http://localhost:${PORT}`);
});
