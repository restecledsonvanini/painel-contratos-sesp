import express from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import contractsRouter from './routes/contracts';
import referencesRouter from './routes/references';
import { authenticate } from './middleware/auth';
import { errorHandler } from './lib/errors';

const app = express();
app.use(bodyParser.json());
app.use(authenticate);

app.use('/.netlify/functions/api/contracts', contractsRouter);
app.use('/.netlify/functions/api/references', referencesRouter);

app.get('/.netlify/functions/api/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export const handler = serverless(app);
export { app };

