import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client, Pool } from 'pg';
import { getMigrations } from 'better-auth/db/migration';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env.local and configure it.');
  process.exit(1);
}

async function ensureDatabase(connectionString) {
  const url = new URL(connectionString);
  const dbName = url.pathname.slice(1);

  url.pathname = '/postgres';

  const admin = new Client({ connectionString: url.toString() });
  await admin.connect();

  const exists = await admin.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  );

  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Created database "${dbName}".`);
  } else {
    console.log(`Database "${dbName}" already exists.`);
  }

  await admin.end();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

const authOptions = {
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET || 'migration-secret',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
};

try {
  await ensureDatabase(process.env.DATABASE_URL);

  const { runMigrations } = await getMigrations(authOptions);
  await runMigrations();
  console.log('Better Auth database tables migrated successfully.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} finally {
  await pool.end();
}
