---
name: RAKLA project scope
description: User-stated audience and school-project scope for the RAKLA football storefront.
---

RAKLA / ركلة is the school project "The Shop", a Kuwaiti football equipment brand for players aged 14–35: academy players, school teams, weekend/diwaniya friends teams, and futsal players.

Arabic is the default (RTL), with a complete English (LTR) language toggle. The teacher needs a brand presentation at /brand. Commerce remains a school project: checkout records orders but does not collect real payments.

**Why:** The user requested persistent MongoDB catalogue/accounts/orders while explicitly keeping real payment out of scope.

**How to apply:** Keep payment methods demonstrational. Read products and account/order data through the API; cart and favorites remain browser-side unless the user changes that requirement.

Outside the teacher's brand board, descriptive text must appear only in the current language, not Arabic and English simultaneously. Use «ترف» for TF in Arabic; English remains "Turf".

**Why:** The user explicitly corrected mixed-language descriptions and specified the Kuwaiti football term.

**How to apply:** Preserve bilingual brand names and technical surface codes, but render product descriptions and other translated copy in the selected language only. The brand board may show both.

The user supplied official RAKLA transparent PNG logo assets. These are the source of truth for future branding: white bilingual wordmark on dark surfaces, dark green bilingual wordmark on light surfaces, and the football/speed icon for small screens and browser/app icons. Do not recreate them as text or SVG.

**Why:** The user supplied production-intended artwork and explicitly asked to replace the earlier generated mark everywhere.

**How to apply:** Keep the originals in the app's public assets and use the correct variant for the background; the icon is square and the bilingual wordmark already includes the Arabic name.
