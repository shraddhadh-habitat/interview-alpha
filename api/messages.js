// Simple in-memory rate limiter: max 30 requests per IP per minute
const rateLimitMap = new Map();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Security: rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  // Security: verify internal secret header
  const secret = req.headers['x-ia-secret'];
  if (!secret || secret !== process.env.IA_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Security: check request body size (max 50KB)
  const bodySize = JSON.stringify(req.body).length;
  if (bodySize > 50000) {
    return res.status(413).json({ error: 'Request too large' });
  }

  // Security: basic content filtering
  const bodyStr = JSON.stringify(req.body);
  const blockedPatterns = ['<script>', 'javascript:', 'eval(', 'document.cookie'];
  if (blockedPatterns.some(p => bodyStr.toLowerCase().includes(p))) {
    return res.status(400).json({ error: 'Invalid request content' });
  }

  // Security: cap max_tokens to prevent abuse
  const { stream, ...body } = req.body;
  if (body.max_tokens && body.max_tokens > 4000) {
    body.max_tokens = 4000;
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify(stream ? { ...body, stream: true } : body),
    });

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      if (!upstream.ok) {
        const errorText = await upstream.text();
        let errData;
        try {
          errData = JSON.parse(errorText);
        } catch {
          errData = { message: errorText };
        }
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
      } catch (streamErr) {
        res.write(`data: ${JSON.stringify({ type: "error", error: { message: streamErr.message } })}\n\n`);
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
}
