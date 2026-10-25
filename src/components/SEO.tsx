import { reviewedPageSchema } from '../content/schemaReview';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';
import { SITE_PROFILE, brandCopy } from '../config/profile';
import { siteOrganizationSchema } from '../content/seoDefinitions';

interface SEOProps {
  snippetTitle?: string;
  snippetDescription?: string;
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  name?: string;
  image?: string;
  keywords?: string[];
  structuredData?: object;
  language?: string;
  alternates?: Array<{ hrefLang: string; href: string }>;
  robots?: string;
}

const BASE_URL = SITE_URL;

/**
 * React stamps every DOM node it creates with a private `__reactFiber$…` / `__reactProps$…` key.
 * Deleting one of those behind React's back leaves its fiber holding a node that is no longer in the
 * tree, and the very next client-side route change dies in
 * `Cannot read properties of null (reading 'removeChild')` — the page keeps the stale content and the
 * link appears to do nothing.
 *
 * Measured on 2026-10-13: the collapse effect below removed 15 React-owned tags on /image-upscaler
 * (13 meta, 1 link, 1 JSON-LD script) and every route doing that lost its client-side navigation,
 * while `/` and `/login` — where nothing needed collapsing — kept working.
 */
const isReactOwned = (element: Element) =>
  Object.keys(element).some(key => key.startsWith('__reactFiber$') || key.startsWith('__reactProps$') || key.startsWith('__reactMarker$'));

/**
 * Collapse duplicate head tags, keeping the newest copy of each semantic key, but **never** remove a
 * tag React owns: when React has its own copy the stale static-shell or Helmet-injected ones go
 * instead, and a group of several React-owned copies is left alone rather than risking the crash.
 */
const collapseDuplicates = (elements: Element[], keyOf: (element: Element) => string) => {
  const groups = new Map<string, Element[]>();
  for (const element of elements) {
    const key = keyOf(element);
    const list = groups.get(key);
    if (list) list.push(element);
    else groups.set(key, [element]);
  }
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const owned = list.filter(isReactOwned);
    const keep = new Set(owned.length ? owned : [list[list.length - 1]]);
    for (const element of list) {
      if (!keep.has(element) && !isReactOwned(element)) element.remove();
    }
  }
};

export default function SEO({
  snippetTitle,
  snippetDescription,
  title,
  description,
  keywords = [],
  canonical,
  type = 'website',
  name = SITE_PROFILE.siteName,
  image = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgMs1RSg3O_1Sa3p30fgI3YUHwQQfFs07kGZMGKyFyoEQm-OV9Q80s9L_VAjq6PPIL4xtaTqR0T9Spv2YqokmfgYPWeEDIaoQr-b_cWhfmnIgq8aEqqG60kty-pmpK8FVMaWQnJO_alw5WYwG3TGhDdxNpx_ZwZgY2ckp1k1TV_tLi7iFmt5rkfCNyQR5qc2MSI7WWxfd4pus_zzslLB6bpO80SJcRC5MWqi1CClqIJAQIYCs8gvSG8VE1od87qiiz6z58h1Ej7OY',
  structuredData,
  language,
  alternates = [],
  robots = 'index,follow,max-image-preview:large'
}: SEOProps) {
  // Titles and descriptions are written for the original storefront; a differently branded
  // deployment rewrites the names in them here rather than in every page (see `config/profile.ts`).
  const pageTitle = brandCopy(title);
  const pageDescription = brandCopy(description);
  const pageUrl = canonical?.startsWith('http') ? canonical : `${BASE_URL}${canonical || '/'}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const pageLanguage = language || undefined;
  const reviewedSchema = reviewedPageSchema(structuredData, pageUrl, pageTitle, pageDescription);
  const organization = canonical === '/' ? null : siteOrganizationSchema();

  // Some prerendered shells can be restored by React 19 as well as reconciled by Helmet. Both
  // copies carry data-rh and are valid individually, but retaining two identical canonicals or
  // JSON-LD graphs is harmful to crawlers. Collapse exact duplicates after Helmet has committed.
  // Locale-aware pages can deliberately replace the static English shell metadata with a translated
  // value, so metadata is also collapsed by semantic key (description, og:title, etc.) rather than
  // only when the complete HTML happens to be identical.
  useEffect(() => {
    const collapseManagedMeta = () => {
      const elements = [...document.querySelectorAll(
        'meta[name="description"], meta[name="keywords"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"]',
      )];
      // Helmet appends the active route's tags after the static shell. Working back to front keeps the
      // newest locale-specific value and drops the stale shell value.
      collapseDuplicates(elements, element => (element.getAttribute('name')
        ? `name:${element.getAttribute('name')}`
        : `property:${element.getAttribute('property')}`));
    };
    const dedupe = (selector: string, signature: (element: Element) => string) => {
      collapseDuplicates([...document.querySelectorAll(selector)], signature);
    };
    const collapseJsonLd = () => {
      const elements = [...document.querySelectorAll('script[type="application/ld+json"]')];
      // A translated route has the same CollectionPage/WebPage identity as the static English
      // shell, but a different JSON string. Keep the newest graph for each semantic page identity;
      // this preserves the site Organization graph while replacing the stale route graph.
      collapseDuplicates(elements, element => {
        let key = element.textContent || '';
        try {
          const parsed = JSON.parse(key) as { '@type'?: string; '@id'?: string; url?: string; '@graph'?: Array<{ '@type'?: string; '@id'?: string; url?: string }> };
          const nodes = parsed['@graph'] || [parsed];
          key = nodes
            .map(node => `${node['@type'] || ''}:${node['@id'] || node.url || ''}`)
            .sort()
            .join('|');
        } catch {
          // Keep the original text as a safe fallback for malformed third-party additions.
        }
        return key;
      });
    };
    collapseManagedMeta();
    dedupe('link[rel="canonical"], link[rel="alternate"]', element => element.outerHTML);
    collapseJsonLd();
    const observer = new MutationObserver(() => {
      collapseManagedMeta();
      dedupe('link[rel="canonical"], link[rel="alternate"]', element => element.outerHTML);
      collapseJsonLd();
    });
    observer.observe(document, { childList: true, subtree: true });
    const timer = window.setTimeout(() => {
      observer.disconnect();
      dedupe('link[rel="canonical"], link[rel="alternate"]', element => element.outerHTML);
      collapseManagedMeta();
      collapseJsonLd();
    }, 3000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pageUrl, pageDescription, keywords, robots, structuredData, organization]);

  return (
    <Helmet>
      {pageLanguage && <html lang={pageLanguage} />}
      {/* Standard metadata tags */}
      <title>{snippetTitle === undefined ? pageTitle : brandCopy(snippetTitle)}</title>
      <meta name="description" content={snippetDescription === undefined ? pageDescription : brandCopy(snippetDescription)} data-rh="true" />
      {keywords.length > 0 && <meta name="keywords" content={brandCopy(keywords.join(', '))} data-rh="true" />}
      <meta name="robots" content={robots} data-rh="true" />

      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} data-rh="true" />
      <meta property="og:title" content={pageTitle} data-rh="true" />
      <meta property="og:description" content={pageDescription} data-rh="true" />
      <meta property="og:site_name" content={name} data-rh="true" />
      <meta property="og:image" content={imageUrl} data-rh="true" />
      <meta property="og:url" content={pageUrl} data-rh="true" />
      {pageLanguage && <meta property="og:locale" content={pageLanguage.replace('-', '_')} data-rh="true" />}

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} data-rh="true" />
      <meta name="twitter:card" content="summary_large_image" data-rh="true" />
      <meta name="twitter:title" content={pageTitle} data-rh="true" />
      <meta name="twitter:description" content={pageDescription} data-rh="true" />
      <meta name="twitter:image" content={imageUrl} data-rh="true" />

      <link rel="canonical" href={pageUrl} data-rh="true" />
      {alternates.map(alternate => (
        <link key={`${alternate.hrefLang}-${alternate.href}`} rel="alternate" hrefLang={alternate.hrefLang} href={alternate.href} data-rh="true" />
      ))}

      {organization && (
        <script type="application/ld+json" data-rh="true">
          {brandCopy(JSON.stringify(organization))}
        </script>
      )}
      {/* Structured Data (JSON-LD) for GEO and Rich Snippets */}
      {reviewedSchema && (
        <script type="application/ld+json" data-rh="true">
          {brandCopy(JSON.stringify(reviewedSchema))}
        </script>
      )}
    </Helmet>
  );
}
