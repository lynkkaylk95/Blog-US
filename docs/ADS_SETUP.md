# Advertising setup

Advertising is managed in one place under `app/ads`.

## Monetag verification

The Monetag verification service worker is published from `public/sw.js` and
is available at `/sw.js` on the deployed domain. Do not rename or modify this
file unless Monetag provides a replacement.

## Enabling ads

`app/ads/config.ts` controls the active provider, whether ads are enabled, and
the provider scripts. Monetag verification does not require ads to be enabled.

The active Monetag MultiTag uses zone `268748`. Its global script and attributes
are declared in `app/ads/config.ts`, and the replacement HTTPS service worker is
published from `public/sw.js`.

The primary story-page ad slot uses Adsterra Native unit
`fa440f56b6e1471dc9cd83adbf2d7820`. Adsterra supplies a fixed HTML container ID,
so this unit is rendered only once per page. Compact placements remain reserved
until separate Native unit codes are supplied for them.

To replace this setup with another zone or provider:

1. Replace the entries in `scripts`.
2. Update any provider-specific script attributes.
3. Set `renderSlots` to `true` only for providers that use the website's inline
   ad positions.

To pause advertising, set `enabled` to `false`. To switch networks, replace the
entries in `scripts` and change `provider`; page-level ad placements do not need
to be edited.
