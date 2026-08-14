import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from current directory or root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  API_KEY: z.string().default('my-secret-api-key'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
