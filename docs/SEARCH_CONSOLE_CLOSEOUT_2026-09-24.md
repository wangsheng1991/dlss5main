# SEO and Search Console closeout — 2026-09-24

## Production metadata check

The following production pages returned HTTP 200. Each page has a unique `<title>`, a non-empty meta description, a non-empty keyword list, and a canonical URL matching the page URL:

- `/image-upscaler`
- `/image-quality-enhancer`
- `/unblur-image`
- `/image-to-svg`
- `/remove-background`
- `/erase-object`
- `/es/mejorar-calidad-imagen`

The two localized copies of the AI upscaler comparison article also returned independent,
language-appropriate metadata and canonical URLs:

- `/en/blog/best-ai-image-upscaler-2026-comparison`
- `/zh/blog/best-ai-image-upscaler-2026-comparison`
- `/old-photo-restoration`
- `/ai-headshot`
- `/tools/passport-photo`
- `/tools/passport-photo/3-na-4`
- `/tools/passport-photo/35x45-ru`
- `/use-cases/product-photo-enhancer`
- `/use-cases/architecture-render-upscaler`
- `/use-cases/portrait-photo-enhancer`

The passport, restoration and headshot pages include the free preview or free local processing wording in the title, description and keywords where the claim is accurate. Paid enhancement workflows describe the free example preview separately from signed-in processing.

## Indexing requests confirmed

Search Console displayed “已请求编入索引” for these URLs:

- `/tools/passport-photo`
- `/tools/passport-photo/3-na-4`
- `/tools/passport-photo/35x45-ru`
- `/old-photo-restoration`
- `/ai-headshot`
- `/use-cases/product-photo-enhancer`
- `/use-cases/architecture-render-upscaler`
- `/use-cases/portrait-photo-enhancer`
- `/image-upscaler`
- `/image-quality-enhancer`
- `/unblur-image`

The request only places a URL in Google's priority crawl queue; it does not guarantee immediate indexing.

## Sitemap fallback

Google's URL Inspection service returned its rate-limit/error response again while requesting `/image-to-svg`; a follow-up attempt on `/remove-background` explicitly showed the daily quota message. The latest sitemap was resubmitted successfully again on 2026-09-24. Search Console reported:

- Sitemap status: successful
- Last read: 2026-09-24
- Discovered pages: 53
- Discovered videos: 0

The second sitemap submission still reports the same 53 discovered pages and successful status.

The production homepage still links directly to all four pending paths, so they have a crawl path while the manual quota is unavailable.

The sitemap contains the remaining tool pages and all localized blog pages, so Google has a crawl path even while URL Inspection requests are rate-limited.

The stale coverage report also showed one comparison article with an old canonical warning and two
localized comparison pages in “crawled — not indexed”. The production HTML now has self-canonical
URLs for all three. Search Console validation was started for both issue groups on 2026-09-24.

## Automatic follow-up

After Google's daily quota resets, retry URL Inspection for:

- `/image-to-svg`
- `/remove-background`
- `/erase-object`
- `/es/mejorar-calidad-imagen`

The two localized comparison pages will be re-evaluated by the validation run; no manual user action
is required.

No user decision is required for this retry. Internal links, static homepage links, `robots.txt`, `llms.txt` and the successful sitemap submission are already in place.

## 9. 2026-09-24 follow-up: public route metadata and sitemap hygiene

After the initial closeout, the production audit found that the lazy-loaded public routes (`/models`, `/about`, `/download`, `/docs`, `/enterprise`) were returning the homepage shell before JavaScript ran. They now have crawlable static first-screen HTML with route-specific titles, descriptions, keywords, canonicals and internal links. `/comparisons` and `/pricing` were added to the sitemap with the current modification date; `/login` and `/register` were removed from the sitemap and are explicitly `noindex,nofollow`.

The shell now has a homepage canonical, and the prerender step removes shell-level robots/canonical/Open Graph tags before adding route metadata, so each generated page exposes exactly one canonical and one robots directive. A live audit after deployment `dpl_DCyGp5WD28SfwoS85eHsJakKV53m` checked all 53 sitemap URLs: all returned HTTP 200 and all had non-empty, route-matching metadata.

The remaining Search Console actions are recorded in [SEO_SEARCH_CONSOLE_TODO.md](SEO_SEARCH_CONSOLE_TODO.md). They are limited to Google's URL Inspection quota and the logged-in site owner's Search Console controls; no code-side action remains for those four URLs until Google accepts another request.
