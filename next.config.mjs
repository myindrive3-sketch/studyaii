/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-auth', 'pg', 'pdf-parse', 'officeparser'],
  images: {
    // Keep default optimization enabled for better LCP in production.
    unoptimized: false,
  },
  async headers() {
    // Avoid strict CSP in development (Next devtools/HMR inject scripts).
    if (process.env.NODE_ENV !== 'production') return [];

    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value:
          'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
      },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      // Minimal CSP that still allows Next + Gemini/OpenAI server calls (API calls are server-side).
      // If you later add third-party scripts, tighten/adjust accordingly.
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
          "img-src 'self' data: blob:",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "script-src 'self'",
          "connect-src 'self'",
          "object-src 'none'",
          "form-action 'self'",
          'upgrade-insecure-requests',
        ].join('; '),
      },
    ];

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
}

export default nextConfig
