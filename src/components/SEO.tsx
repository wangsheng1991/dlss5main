import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';
import { SITE_PROFILE, brandCopy } from '../config/profile';
import { siteOrganizationSchema } from '../content/seoDefinitions';

interface SEOProps {
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

export default function SEO({
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
  const organization = canonical === '/' ? null : siteOrganizationSchema();

  // Some prerendered shells can be restored by React 19 as well as reconciled by Helmet. Both
  // copies carry data-rh and are valid individually, but retaining two identical canonicals or
  // JSON-LD graphs is harmful to crawlers. Collapse exact duplicates after Helmet has committed.
  useEffect(() => {
    const dedupe = (selector: string, signature: (element: Element) => string) => {
      const seen = new Set<string>();
      document.querySelectorAll(selector).forEach(element => {
        const key = signature(element);
        if (seen.has(key)) element.remove();
        else seen.add(key);
      });
    };
    dedupe('link[rel="canonical"], link[rel="alternate"]', element => element.outerHTML);
    dedupe('meta[name="description"], meta[name="keywords"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"]', element => element.outerHTML);
    dedupe('script[type="application/ld+json"]', element => element.textContent || '');
    const observer = new MutationObserver(() => {
      dedupe('link[rel="canonical"], link[rel="alternate"]', element => element.outerHTML);
      dedupe('meta[name="description"], meta[name="keywords"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"]', element => element.outerHTML);
      dedupe('script[type="application/ld+json"]', element => element.textContent || '');
    });
    observer.observe(document, { childList: true, subtree: true });
    const timer = window.setTimeout(() => {
      observer.disconnect();
      dedupe('link[rel="canonical"], link[rel="alternate"]', element => element.outerHTML);
      dedupe('meta[name="description"], meta[name="keywords"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"]', element => element.outerHTML);
      dedupe('script[type="application/ld+json"]', element => element.textContent || '');
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
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} data-rh="true" />
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
      {structuredData && (
        <script type="application/ld+json" data-rh="true">
          {brandCopy(JSON.stringify(structuredData))}
        </script>
      )}
    </Helmet>
  );
}
