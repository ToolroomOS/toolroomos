# ToolroomOS website

Marketing site for **toolroomos.com**. Plain HTML, CSS and JavaScript: no build step, no dependencies.

```
index.html                  the page
404.html                    not-found page
favicon.svg, robots.txt, sitemap.xml
assets/styles.css           brand tokens, layout and all animations
assets/main.js              scroll reveals, the "one job" story, mobile menu
assets/logo.svg, og.svg     logo and social share image
staticwebapp.config.json    Azure Static Web Apps: headers, caching, 404
```

## Run locally
```
python -m http.server 8765
```
Then open http://localhost:8765.

## Deploy (Azure Static Web App)
- App location: `/` (this folder). Output location: empty. No API, no build.
- Add `toolroomos.com` and `www.toolroomos.com` as custom domains on the Static Web App.

## Things to update
- **Contact email:** `hello@toolroomos.com` in `index.html` (the `data-contact` link).
- **Sign in links:** they point to `https://home.udayprecisionsolutions.com` (the `data-signin` links). Change them to the new hub address once the apps move to `*.toolroomos.com`.

Brand colours follow the UCS apps: primary `#054b7a` (oklch 0.40 0.10 246), navy `#0d2a44`, amber `#f59e0b`, procure orange `#c2410c`. All motion respects the visitor's "reduce motion" setting.
