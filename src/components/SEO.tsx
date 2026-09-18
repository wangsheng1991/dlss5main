import React from 'react';
import { Helmet } from 'react-helmet-async';

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
}

const BASE_URL = 'https://www.dlss5nvidia.com';

export default function SEO({
  title,
  description,
  keywords = [],
  canonical,
  type = 'website',
  name = 'DLSS 5 Neural Monolith',
  image = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgMs1RSg3O_1Sa3p30fgI3YUHwQQfFs07kGZMGKyFyoEQm-OV9Q80s9L_VAjq6PPIL4xtaTqR0T9Spv2YqokmfgYPWeEDIaoQr-b_cWhfmnIgq8aEqqG60kty-pmpK8FVMaWQnJO_alw5WYwG3TGhDdxNpx_ZwZgY2ckp1k1TV_tLi7iFmt5rkfCNyQR5qc2MSI7WWxfd4pus_zzslLB6bpO80SJcRC5MWqi1CClqIJAQIYCs8gvSG8VE1od87qiiz6z58h1Ej7OY',
  structuredData,
  language
}: SEOProps) {
  const pageUrl = canonical?.startsWith('http') ? canonical : `${BASE_URL}${canonical || '/'}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const pageLanguage = language || undefined;

  return (
    <Helmet>
      {pageLanguage && <html lang={pageLanguage} />}
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content="index,follow,max-image-preview:large" />

      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      {pageLanguage && <meta property="og:locale" content={pageLanguage.replace('-', '_')} />}

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <link rel="canonical" href={pageUrl} />

      {/* Structured Data (JSON-LD) for GEO and Rich Snippets */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
