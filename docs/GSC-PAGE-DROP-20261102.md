Serves R3 (correct titles and landing URLs) and R5 (verify before shipping). This is a technical investigation, not a change to the product's core positioning.

# GSC page visibility and indexing check — 2026-11-02

## Scope and evidence limits

Property: `sc-domain:dlss5nvidia.com`. Read the owner's signed-in Google Search Console directly; the GSC Wizard connection is subscription-blocked and was not upgraded.

The default performance report's latest available day was October 30. Compare October 30 with October 29 and also October 23 (same weekday). These are single-day comparisons, not a settled multi-day post-drop trend. GSC dates are the report's calendar dates; do not substitute Cloudflare UTC-day counts or analytics sessions for GSC clicks. No assertion about October 31 / November 1 search performance is made here.

Sources: GSC [day-over-day page comparison](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adlss5nvidia.com&start_date=20261030&end_date=20261030&compare_start_date=20261029&compare_end_date=20261029&breakdown=page&metrics=CLICKS%2CIMPRESSIONS%2CPOSITION), corresponding query/device/country tabs, and individual URL Inspection reports. Local screenshots and inspection extracts are in the sibling `vercel-cpu-deploy-20261102` evidence directory, outside the repository.

## Pages losing visibility

Numbers below were read from GSC's page comparison table. Arrow order is October 29 → October 30; smaller position is better. Averages can change with query composition and do not prove that every query's rank held.

| Page | Impressions | Clicks | Average position |
| --- | ---: | ---: | ---: |
| `/download` | 766 → 247 | 63 → 34 | 7.3 → 6.8 |
| `/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026` | 263 → 96 | 4 → 2 | 4.9 → 5.0 |
| `/games` | 197 → 79 | 5 → 1 | 7.2 → 9.4 |
| `/system-requirements` | 171 → 62 | 1 → 2 | 7.0 → 7.2 |
| `/dlss-5-apk` | 193 → 103 | 45 → 33 | 4.4 → 4.1 |
| `/` | 199 → 127 | 33 → 23 | 4.5 → 4.6 |
| `/visual-enhancer` | 432 → 401 | 48 → 46 | 4.0 → 4.2 |

Overall GSC clicks: 231 → 157; impressions: 3,021 → 1,467. Derived changes are -32.0% and -51.4%. `/download` lost 519 impressions, about 33.4% of the overall net impression loss (derived, not an independent GSC metric; page and property aggregation may differ).

Same-weekday check (October 23 → October 30): `/download` 818 → 247 impressions / 80 → 34 clicks; comparison article 334 → 96 impressions; homepage 231 → 127 impressions; image-quality page 222 → 120 impressions. In contrast, `/visual-enhancer` rose 239 → 401 impressions / 18 → 46 clicks, and `/dlss-5-apk` rose 1 → 103 impressions / 1 → 33 clicks. Overall clicks were 156 → 157. This is a changing page mix, not evidence that every page or channel has collapsed. It does not prove that APK growth caused the download decline.

Largest query impression losses, October 29 → 30:

| Query | Impressions | Average position |
| --- | ---: | ---: |
| `dlss 5 download` | 156 → 16 | 8.3 → 8.7 |
| `dlss 5 requirements` | 37 → 11 | 8.6 → 8.2 |
| `dlss 5 supported cards` | 44 → 21 | 7.1 → 6.8 |
| `dlss 5 visual enhancer` | 40 → 18 | 2.7 → 2.8 |
| `fsr 4.1 vs dlss 5` | 18 → 1 | 4.8 → 1.0 |

Both devices lost impressions: mobile 1,212 → 557; desktop 1,777 → 892. Not a mobile-only pattern. Largest country impression losses shown included US 334 → 90, UK 127 → 8 and Germany 113 → 34; their displayed average ranks improved. Demand, query mix, serving changes and reporting maturity remain possible; no confirmed algorithmic cause is established.

## Individual index inspections

All six inspected loss pages were indexed, allowed crawling/indexing, fetched successfully with smartphone Googlebot and had matching declared / Google-selected canonicals:

| URL | Last crawl as displayed in the Chinese GSC UI |
| --- | --- |
| `/download` | 2026-10-30 23:58:38 |
| comparison article (English) | 2026-10-31 10:08:18 |
| `/system-requirements` | 2026-10-31 00:28:14 |
| `/dlss-5-apk` | 2026-10-26 15:29:34 |
| `/games` | 2026-10-16 02:11:10 |
| `/` | 2026-10-31 17:31:47 |

These inspections are current snapshots with the displayed last crawl, not a historical daily index-state series. A successful October 31 crawl is useful evidence against an ongoing failure but cannot prove there was no transient problem earlier.

The index summary is dated October 23: 115 indexed / 17 excluded. Its five old “duplicate without user-selected canonical” examples include `/zh/blog`, three legacy Chinese articles and an old `/en/blog/…` URL. The English alias already has a 301 in `vercel.json`. The one crawled-not-indexed example is `/zh/blog/broadcast-2-3-upscaling`, not a major loss page. Do not interpret the stale summary as an October 30/31 deindexing event.

The Chinese comparison article now appears indexed, last crawl October 30 01:27:06, with Google selecting itself, but its **user-declared canonical was reported as absent**. Current production browser DOM independently reproduced conflicting Chinese and English canonicals on that URL.

## Render findings and fixes

1. **Conflicting canonical on explicit Chinese blog routes.** `Blog.tsx` inferred `/zh/` only for articles with `assetBase`. Legacy articles and the index therefore appended an English canonical to their Chinese prerendered shell. Fix locale inference for all explicit `/zh/` and `/en/` blog routes. This also keeps the Chinese index's title/language and structured-data identity aligned with its route. Existing exact-duplicate cleanup can then leave one correct canonical.
2. **Duplicate document titles.** Production `/download` and the Chinese article each retained two identical `<title>` elements; GSC's historical and live download HTML displayed the same duplication. Extend the existing React-safe cleanup to titles, retaining the first non-React-owned copy because Helmet updates `document.title`. Never remove React-owned nodes. This is a metadata hygiene fix, not proof of the traffic-drop cause.

The historical download render reported 17/38 resources not loaded (media, images, fonts and analytics). All referenced first-party files exist in the current build. The November 2 live GSC test returned HTTP 200, indexable, a correctly rendered mobile screenshot and **no JavaScript console messages**; only two Clarity/Bing tracking image redirects failed, out of 41 resources. No first-party resource failure was reproduced live, so no speculative media or server change was made.

## Validation and remaining uncertainty

- Production build and article Markdown validation pass.
- Type checking passes; 116/116 repository tests pass.
- Browser checks of the built site: download has one title; download → models → download preserves navigation and the appropriate title; legacy Chinese article has one Chinese self-canonical and one title; language toggle selects the English canonical/title; returning to the Chinese index leaves one `/zh/blog` canonical and Chinese document language.
- The three named external Penguin acceptance-gate scripts in AGENTS.md are absent from this machine (including the documented session-workspace location). They cannot be reported as executed. No article copy, protected evidence assets or positioning was edited.
- No ranking-recovery promise: the fixes address reproduced metadata bugs. The large English download/query impression loss is not explained by the much smaller Chinese canonical issue. Obtain settled October 31 onward data before declaring a sustained decline or assigning demand / algorithm / serving causes.

After deployment, verify production metadata again and submit only the corrected Chinese index and representative Chinese article for reindexing. Do not remove the functioning English pages, merge translations, add noindex, or change the subscription plan.
