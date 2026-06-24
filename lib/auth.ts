import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import pool from './db';
import fs from 'node:fs';
import path from 'node:path';

function readDotEnvLocalValue(key: string) {
  try {
    const file = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    const line = file
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#') && l.startsWith(`${key}=`));
    if (!line) return undefined;
    const raw = line.slice(key.length + 1).trim();
    return raw.replace(/^['"]|['"]$/g, '') || undefined;
  } catch {
    return undefined;
  }
}

// In some Windows shells, environment variables can be pre-set and Next won't override them from .env.local.
// In development, if placeholders are detected, fall back to reading .env.local directly.
function resolveEnv(key: string) {
  const v = process.env[key];
  if (process.env.NODE_ENV !== 'production' && v && v.includes('your-google')) {
    return readDotEnvLocalValue(key) || v;
  }
  return v || (process.env.NODE_ENV !== 'production' ? readDotEnvLocalValue(key) : undefined);
}

const googleClientId = resolveEnv('GOOGLE_CLIENT_ID');
const googleClientSecret = resolveEnv('GOOGLE_CLIENT_SECRET');

const authBaseUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined) ||
  'http://localhost:3000';

function computeTrustedOrigins() {
  const envList = (
    process.env.TRUSTED_ORIGINS ||
    process.env.NEXT_PUBLIC_TRUSTED_ORIGINS ||
    ''
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const vercelOrigin =
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`;
  const publicVercelOrigin =
    process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

  const fallbackOrigins = [
    authBaseUrl,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    vercelOrigin,
    publicVercelOrigin,
  ].filter(Boolean) as string[];

  // Production should be strict: only allow the deployed URL(s).
  if (process.env.NODE_ENV === 'production') {
    return Array.from(new Set([...fallbackOrigins, ...envList]));
  }

  // Development convenience: allow common localhost variants.
  return Array.from(
    new Set([
      authBaseUrl,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      ...envList,
      'http://localhost:*',
      'http://127.0.0.1:*',
    ])
  );
}

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
  trustedOrigins: computeTrustedOrigins(),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: authBaseUrl,
  appName: 'StudyAI',
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
