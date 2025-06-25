import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ["/dashboard", "/api/(.*)"],  // Protect routes like /dashboard or specific APIs
};
