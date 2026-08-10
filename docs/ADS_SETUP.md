# Advertising setup

Advertising is managed in one place under `app/ads`.

## Monetag verification

The Monetag verification service worker is published from `public/sw.js` and
is available at `/sw.js` on the deployed domain. Do not rename or modify this
file unless Monetag provides a replacement.

## Enabling ads

`app/ads/config.ts` controls the active provider, whether ads are enabled, and
the provider scripts. Monetag verification does not require ads to be enabled.

Monetag has been disabled and removed. `public/sw.js` now only unregisters the
previous Monetag service worker and clears its caches.

Story-page ad slots use Adsterra Native unit
`fa440f56b6e1471dc9cd83adbf2d7820`. Each placement is isolated in its own local
frame so Adsterra's fixed container ID cannot break the page layout. Separate
Adsterra codes are still recommended for accurate placement statistics.

To replace this setup with another zone or provider:

1. Replace the entries in `scripts`.
2. Update any provider-specific script attributes.
3. Set `renderSlots` to `true` only for providers that use the website's inline
   ad positions.

To pause advertising, set `enabled` to `false`. To switch networks, replace the
entries in `scripts` and change `provider`; page-level ad placements do not need
to be edited.
