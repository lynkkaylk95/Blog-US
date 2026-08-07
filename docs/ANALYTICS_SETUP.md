# Analytics and Search Console setup

Configure these environment variables in Cloudflare before the production deployment:

| Variable | Value |
| --- | --- |
| `SITE_URL` | The canonical origin, for example `https://example.com` |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Optional override; the website currently defaults to `G-2D0SSCEYRN` |
| `GOOGLE_SITE_VERIFICATION` | Only the `content` value from Google's verification meta tag |
| `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` | The site token from Cloudflare Web Analytics |

## Google Analytics

The current GA4 Measurement ID is `G-2D0SSCEYRN`. Google Analytics loads by default without a consent popup. Advertising storage and personalization remain denied. Set `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` only when you need to override this property. Review consent requirements before serving regions where prior consent is required.

## Google Search Console

Add the production site in Search Console. A Domain property verified by DNS covers all protocols and subdomains. If using a URL-prefix property, copy the HTML-tag verification token into `GOOGLE_SITE_VERIFICATION`, deploy, verify ownership, then submit `/sitemap.xml`.

## Cloudflare Web Analytics

If Cloudflare already injects Web Analytics automatically for the proxied domain, leave `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` unset to avoid a second beacon. Otherwise, create or open the Web Analytics site and copy its token into the variable.

After deployment, verify the homepage source contains `google-site-verification`, accept analytics and inspect the GA4 Realtime report, then confirm page views and Web Vitals appear in Cloudflare Web Analytics.
