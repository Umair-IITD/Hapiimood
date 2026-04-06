import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.hapiimood.com https://*.clerk.accounts.dev https://challenges.cloudflare.com; connect-src 'self' https://clerk.hapiimood.com https://*.clerk.accounts.dev https://*.supabase.co https://api.groq.com https://challenges.cloudflare.com; img-src 'self' data: https://img.clerk.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://challenges.cloudflare.com; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
};
 
export default nextConfig;
