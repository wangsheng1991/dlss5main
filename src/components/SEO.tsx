import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';
import { SITE_PROFILE, brandCopy } from '../config/profile';

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

  return (
    <Helmet>
      {pageLanguage && <html lang={pageLanguage} />}
      {/* Standard metadata tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords.length > 0 && <meta name="keywords" content={brandCopy(keywords.join(', '))} />}
      <meta name="robots" content={robots} />

      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      {pageLanguage && <meta property="og:locale" content={pageLanguage.replace('-', '_')} />}

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />

      <link rel="canonical" href={pageUrl} />
      {alternates.map(alternate => (
        <link key={`${alternate.hrefLang}-${alternate.href}`} rel="alternate" hrefLang={alternate.hrefLang} href={alternate.href} />
      ))}

      {/* Structured Data (JSON-LD) for GEO and Rich Snippets */}
      {structuredData && (
        <script type="application/ld+json">
          {brandCopy(JSON.stringify(structuredData))}
        </script>
      )}
    </Helmet>
  );
}
