# Advertising setup

Advertising is managed in one place under `app/ads`.

## Monetag verification

The Monetag verification service worker is published from `public/sw.js` and
is available at `/sw.js` on the deployed domain. Do not rename or modify this
file unless Monetag provides a replacement.

## Enabling ads

`app/ads/config.ts` controls the active provider, whether ads are enabled, and
the provider scripts. Monetag verification does not require ads to be enabled.

After Monetag supplies the final zone or MultiTag code:

1. Add every external script URL to `scripts`.
2. Change `enabled` to `true`.
3. Set `showPlaceholders` to `false` when the provider renders the real ads.

To pause advertising, set `enabled` to `false`. To switch networks, replace the
entries in `scripts` and change `provider`; page-level ad placements do not need
to be edited.
