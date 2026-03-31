import 'dotenv/config';
import express from 'express';

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

app.listen(PORT, () => {
  console.log(`Dev proxy running on http://localhost:${PORT}`);
});
