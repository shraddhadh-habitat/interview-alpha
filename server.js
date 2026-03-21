import 'dotenv/config';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3001;

app.use(
  '/api/messages',
  createProxyMiddleware({
    target: 'https://api.anthropic.com',
    changeOrigin: true,
    pathRewrite: { '^/api/messages': '/v1/messages' },
    on: {
      proxyReq: (proxyReq) => {
        proxyReq.setHeader('x-api-key', process.env.ANTHROPIC_API_KEY ?? '');
        proxyReq.setHeader('anthropic-version', '2023-06-01');
      },
    },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
