---
name: RAKLA Next.js SSR routing
description: The storefront must render through Next.js on the server with Wouter initialized to the route.
---

Do not wrap the whole storefront in a client-only dynamic import with a blank background fallback. A browser that does not complete that client mount can show only the pitch-green background even when the APIs work.

**Why:** The user reported the exact blank state in a regular desktop browser while the development preview's JavaScript-capable capture rendered normally.

**How to apply:** Let Next.js render the client app component into the initial HTML, pass each page's actual pathname as Wouter's SSR path, and read localStorage-backed language/cart/favorites state after hydration so server and browser markup start consistently. Preserve the `/rakla` legacy path as a router base alias.
