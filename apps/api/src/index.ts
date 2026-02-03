import express from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import contractsRouter from './routes/contracts';
import { authenticate } from './middleware/auth';

const app = express();
app.use(bodyParser.json());

// Simple auth middleware - replace with real Supabase JWT verification
app.use(authenticate);

app.use('/.netlify/functions/api/contracts', contractsRouter);

// Health
app.get('/.netlify/functions/api/health', (_req, res) => res.json({ ok: true }));

export const handler = serverless(app);

// For local dev
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8888;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}
