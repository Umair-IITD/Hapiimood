import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';

const isPublicRoute = createRouteMatcher(['/', '/privacy', '/terms', '/contact', '/sign-in(.*)', '/sign-up(.*)']);

// In-memory rate limiting (Replace with Upstash/Redis in production)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export default clerkMiddleware(async (auth, request) => {
  // Rate Limiting Logic
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }
  rateLimitMap.set(ip, userData);

  if (userData.count > MAX_REQUESTS) {
    logger.security("Rate limit exceeded", { ip, count: userData.count });
    return new Response(
      JSON.stringify({ error: "Too Many Requests", retryAfter: 60 }),
      { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
    );
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
