import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import ToolLandingView from '../components/ToolLandingView';
import { TOOL_LANDING_BY_PATH, toolAlternates, toolSchema } from '../content/toolLandings';

/**
 * One component serves every tool page, so the page is chosen from the address the visitor is on.
 * Route params cannot do it: the routes are literal paths, so `useParams()` is empty on all of them
 * and every tool page used to fall back to the upscaler's copy.
 */
export default function ToolLanding() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, '') || '/';
  const tool = TOOL_LANDING_BY_PATH[path] || TOOL_LANDING_BY_PATH['/image-upscaler'];
  return <>
    <SEO title={tool.title} description={tool.description} keywords={tool.keywords} canonical={tool.path} language={tool.language} structuredData={toolSchema(tool)} alternates={toolAlternates(tool)} />
    <ToolLandingView tool={tool} />
  </>;
}
