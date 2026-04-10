# SEO Strategy for DLSS 5 Keywords

## Keyword Analysis (from trend data)

| Rank | Keyword | Trend | Strategy |
|------|---------|-------|----------|
| 1 | nvidia dlss 5 | north +1,350% | **Primary target** - H1, title, URL |
| 2 | nvidia dlss north | +50% | Secondary LSI keyword |
| 3 | dlss nvidia | +30% | Alternate phrasing, natural text |
| 4 | dlss 5 nvidia | +1,300% | Synonym variant |
| 5 | crimson desert dlss | trending | Game-specific content page |
| 6 | dlss 4.5 | south -40% | Comparison/transition content |
| 7 | dlss on | south -30% | FAQ / how-to content |
| 8 | what is dlss | south -30% | Educational entry point |
| 9 | dlss frame generation | south -50% | Technical FAQ content |
| 10 | dlss | stable | Brand term, keep existing |

## Implemented Optimizations

### 1. Title Tag (Homepage)
```
NVIDIA DLSS 5 (Non-Official) | AI Image Upscaling & Super Resolution
```
- "NVIDIA DLSS 5" at the start for maximum keyword weight
- "(Non-Official)" disclaimer - honest, SEO-friendly, converts search intent
- Updated: `src/pages/Home.tsx` line ~88

### 2. Meta Description
```
Experience NVIDIA DLSS 5-style AI image upscaling. Neural Super-Resolution powered by NVIDIA Tensor Cores for instant 4X upscaling. Not official NVIDIA product.
```
- Leads with "NVIDIA DLSS 5" keyword
- Includes "4X upscaling", "Tensor Cores" as LSI terms
- Disclaimer at end builds trust / reduces bounce

### 3. FAQ Structured Data (JSON-LD)
All 4 FAQ questions now use i18n translated text for both languages, with:
- `@type: "FAQPage"` schema for rich snippet eligibility
- Questions optimized for "how to use DLSS 5", "professional work", "what is neural super-resolution", "API for developers"
- Updated: `src/pages/Home.tsx` structuredData block

### 4. Content Text Already Targeting DLSS 5
- Homepage H1: "High-Resolution AI Image Upscaling" (already targets DLSS 5 search intent)
- FAQ section covers: "How to upscale images with AI using DLSS 5?"
- All pages have been i18n-extracted for clean keyword density

## Recommended Future Optimizations

### High Priority
1. **Crimson Desert DLSS page/section** - Create dedicated content for the trending game keyword
2. **"DLSS 5 vs DLSS 4.5" comparison page** - Capture declining DLSS 4.5 searchers with comparison content
3. **Image alt text optimization** - Use descriptive alt text like "DLSS 5 vs standard upscaling comparison in 4K"

### Medium Priority
4. **Schema markup for SoftwareApplication** with `applicationCategory: "MultimediaApplication"` (already in place)
5. **hreflang tags** for multi-language SEO if expanding to more locales
6. **Dedicated API docs page** targeting "DLSS API" / "AI upscaling API" keywords

### Low Priority
7. **Blog section** targeting long-tail: "how to enable DLSS 5 in upcoming games (unofficial guide)"
8. **YouTube embed** of DLSS comparison demos (video SEO)

## Keyword Mapping per Page

| Page | Target Keywords |
|------|----------------|
| Home (/) | NVIDIA DLSS 5, DLSS 5 nvidia, dlss nvidia, dlss 5 |
| Models (/models) | dlss model comparison, neural upscaling models |
| Docs (/docs) | DLSS API, AI upscaling API, developer API |
| Enterprise (/enterprise) | dlss enterprise, custom neural upscaling |
| Dashboard (/dashboard) | dlss 5 tool, image upscaling tool |
| FAQ (Home section) | what is dlss, dlss on, dlss frame generation |

## Disclaimer Strategy
- "(Non-official NVIDIA DLSS)" appears in: Dashboard subtitle, title, footer
- SEO impact: Disclaimer does NOT hurt rankings when content is genuinely useful and clearly labeled
- The structured data and meta description both include "Non-official" for transparency

## Technical Notes
- i18n extracts all text for clean keyword density analysis
- Vercel rewrites enable regional CDN delivery
- sitemap.xml and robots.txt already in place for proper crawling
