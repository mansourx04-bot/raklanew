---
name: RAKLA Next.js SSR routing
description: The storefront must render through Next.js on the server with Wouter initialized to the route.
---

Do not wrap the whole storefront in a client-only dynamic import with a blank background fallback. A browser that does not complete that client mount can show only the pitch-green background even when the APIs work.

**Why:** The user reported the exact blank state in a regular desktop browser while the development preview's JavaScript-capable capture rendered normally.

**How to apply:** Let Next.js render the client app component into the initial HTML, pass each page's actual pathname as Wouter's SSR path, and read localStorage-backed language/cart/favorites state after hydration so server and browser markup start consistently. Preserve the `/rakla` legacy path as a router base alias.

Replit's development preview can use a nested host such as `<id>.sisko.replit.dev`. Next.js `allowedDevOrigins: ['*.replit.dev']` does not match that extra subdomain level; it can return 403 for `/_next` JavaScript resources, leaving server-rendered loading states in a normal browser while API calls work manually.

**Why:** A Chrome-style request for a Next dev script from the nested preview host returned 403 before the host pattern was allowed, while the same request returned 200 afterward.

**How to apply:** Include `*.sisko.replit.dev` in `allowedDevOrigins` for the Replit preview and restart the Next workflow. Verify both preview scripts load and browser API requests complete.
