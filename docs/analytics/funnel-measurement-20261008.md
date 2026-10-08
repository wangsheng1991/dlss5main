# Funnel measurement contract (2026-10-08)

This site reuses the existing Google Analytics loader in `index.html` and its `dataLayer`; no second analytics vendor or database was added. The bridge in `src/lib/analytics.ts` adds a privacy-conscious attribution envelope to each event:

- `page_path`, `locale`, `visitor_state` (`anonymous` or `authenticated`), and `referrer_domain`;
- first-touch `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`, retained in session storage only;
- product dimensions such as `tool`, `sample`, `intent`, and bounded file/pixel buckets where already collected.

The bridge never sends image bytes, image URLs, filenames, prompts, email addresses, Firebase UIDs, tokens, or full referrer URLs. It sanitizes campaign labels and caps their length. `page_view` is emitted once per route transition (same-tick React StrictMode duplicates are suppressed). A future public preview URL can use `?share=` or `/share/`; the route tracker emits `share_link_access` without recording the token.

## Funnel events

| Stage | Event | Meaning | Success definition |
| --- | --- | --- | --- |
| Enter | `page_view` | A route was rendered | Route entry, not a search impression |
| Experience click | `experience_click` | Visitor chose upload, free sample, or a use-case CTA | Link/button click; does not imply a task started |
| Start | `generation_start` | A valid upload or free sample was submitted | The client passed the action to the generation workflow; separate from button impressions |
| Success | `generation_success` | Provider result reached the UI | `SUCCEEDED` with a result URL, or a cached/free sample returned `SUCCEEDED` |
| Failure | `generation_failure` | A task or sample run ended with an actionable error | Terminal failure, rate limit, network error, or timeout |
| Download | `download_click` | Visitor selected a result download/open action | Browser download/open click; does not claim the file was saved |
| Share visit | `share_link_access` | A recipient opened a future public preview | Route/query marker only; never the share token |

Legacy event names (`tool_cta_click`, `generation_submit`, `result_download`, etc.) remain during the migration so existing reports do not break. New reports should use the unified names above and group by `page_path`, `utm_source`, `tool`, and `visitor_state`.

## Verification checklist

1. In a clean browser session, open a UTM-tagged landing page and inspect `window.dataLayer`; confirm one `page_view` contains the campaign fields and `visitor_state: anonymous`.
2. Click the free sample and confirm one `experience_click`, one `generation_start`, then either `generation_success` or one terminal `generation_failure`.
3. Download the returned result and confirm one `download_click`; clicking the same link twice is two user actions, while React StrictMode does not duplicate route views.
4. Sign in and repeat one paid/upload flow. The event envelope changes only to `visitor_state: authenticated`; no account identifier is present.
5. Use an intentionally failing sample/network path and confirm a `generation_failure`, not a false success.
6. Open a future share URL (`?share=example`) and confirm `share_link_access` contains only `share_surface: public_preview`.

## Current limits / TODO

- The site has no public result-share route yet, so `share_link_access` is a forward-compatible hook rather than an active sharing funnel.
- GA4 collection and retention remain controlled by the existing property; this change does not create a server-side export/report. A dashboard or warehouse export is a later, user-approved operations task.
- QA should run the clean-session checklist on both production domains after deployment; no deployment or external publishing is performed by this task.
