# Advertising setup

The only current advertising integration is the MaxValue verification script in
`app/layout.tsx`. Its authorized-seller records are published from
`public/ads.txt` (with a repository-root copy in `ads.txt`).

`public/sw.js` is a cleanup worker that unregisters the previously removed
Monetag service worker and clears its caches.
