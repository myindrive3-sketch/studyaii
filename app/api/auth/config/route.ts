export const dynamic = 'force-dynamic';

export async function GET() {
  const readDotEnvLocalValue = (key: string) => {
    try {
      const fs = require('node:fs') as typeof import('node:fs');
      const path = require('node:path') as typeof import('node:path');
      const file = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
      const line = file
        .split(/\r?\n/)
        .map((l: string) => l.trim())
        .find((l: string) => l && !l.startsWith('#') && l.startsWith(`${key}=`));
      if (!line) return undefined;
      const raw = line.slice(key.length + 1).trim();
      return raw.replace(/^['"]|['"]$/g, '') || undefined;
    } catch {
      return undefined;
    }
  };

  const resolveEnv = (key: string) => {
    const v = process.env[key];
    if (process.env.NODE_ENV !== 'production' && v && v.includes('your-google')) {
      return readDotEnvLocalValue(key) || v;
    }
    return v || (process.env.NODE_ENV !== 'production' ? readDotEnvLocalValue(key) : undefined);
  };

  const clientId = resolveEnv('GOOGLE_CLIENT_ID');
  const clientSecret = resolveEnv('GOOGLE_CLIENT_SECRET');
  const google =
    Boolean(clientId && clientSecret) &&
    !clientId!.includes('your-google') &&
    !clientSecret!.includes('your-google');

  // Avoid leaking secrets; expose only presence/prefix in development for debugging.
  if (process.env.NODE_ENV !== 'production') {
    return Response.json({
      google,
      hasClientId: Boolean(clientId),
      hasClientSecret: Boolean(clientSecret),
      clientIdPrefix: clientId ? `${clientId.slice(0, 12)}...` : null,
    });
  }

  return Response.json({ google });
}
