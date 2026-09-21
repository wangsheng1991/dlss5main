import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ToolLandingView from '../components/ToolLandingView';
import { TOOL_LANDING_BY_PATH, toolAlternates, toolSchema } from '../content/toolLandings';

export default function ToolLanding() {
  const { locale, slug } = useParams<{ locale?: string; slug?: string }>();
  const path = locale ? `/${locale}/${slug || ''}` : `/${slug || ''}`;
  const tool = TOOL_LANDING_BY_PATH[path] || TOOL_LANDING_BY_PATH['/image-upscaler'];
  return <>
    <SEO title={tool.title} description={tool.description} keywords={tool.keywords} canonical={tool.path} language={tool.language} structuredData={toolSchema(tool)} alternates={toolAlternates(tool)} />
    <ToolLandingView tool={tool} />
  </>;
}
