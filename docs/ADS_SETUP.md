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

Story-page ad slots are configured independently in `app/ads/config.ts` as
`lead`, `inline`, and `end`. Each placement is isolated in its own local frame,
which reports `filled`, `no-fill`, or `error` to the page. A no-fill or provider
failure collapses the slot automatically, so it cannot leave a blank ad region.

The current zone ID is retained in all three entries until separate Adsterra
Native zones are created. Once available, replace the `zoneId` of `lead` and
`end` (and `inline` if desired) individually. This gives placement-level
reporting and frequency controls without changing any page component.

To replace a zone or provider:

1. Update the matching entry under `nativeAds` in `app/ads/config.ts`.
2. Keep the provider-specific loading logic inside `app/ads/native/route.ts`.
3. Preserve its fill/error messages so empty slots continue to collapse.

To pause advertising, set `enabled` to `false`. To switch networks, replace the
entries in `scripts` and change `provider`; page-level ad placements do not need
to be edited.
