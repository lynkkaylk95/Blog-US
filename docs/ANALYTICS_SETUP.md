# Analytics and Search Console setup

Configure these environment variables in Cloudflare before the production deployment:

| Variable | Value |
| --- | --- |
| `SITE_URL` | The canonical origin, for example `https://example.com` |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | The GA4 web stream measurement ID, for example `G-XXXXXXXXXX` |
| `GOOGLE_SITE_VERIFICATION` | Only the `content` value from Google's verification meta tag |
| `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` | The site token from Cloudflare Web Analytics |

## Google Analytics

Create a GA4 property and web data stream, then copy its Measurement ID. The site uses basic consent mode: no Google script or request is made before a visitor allows optional analytics. Advertising storage and personalization remain denied.

## Google Search Console

Add the production site in Search Console. A Domain property verified by DNS covers all protocols and subdomains. If using a URL-prefix property, copy the HTML-tag verification token into `GOOGLE_SITE_VERIFICATION`, deploy, verify ownership, then submit `/sitemap.xml`.

## Cloudflare Web Analytics

If Cloudflare already injects Web Analytics automatically for the proxied domain, leave `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` unset to avoid a second beacon. Otherwise, create or open the Web Analytics site and copy its token into the variable.

After deployment, verify the homepage source contains `google-site-verification`, accept analytics and inspect the GA4 Realtime report, then confirm page views and Web Vitals appear in Cloudflare Web Analytics.
