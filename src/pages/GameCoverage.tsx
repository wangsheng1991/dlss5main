import React from 'react';
import SEO from '../components/SEO';
import GameCoverageContent from '../components/GameCoverageContent';
import { GAME_COVERAGE_PAGES, gameCoverageSchema } from '../content/gameCoverage';
import { GAME_DETAIL_EVIDENCE } from '../content/gamesStatusEvidence';

export default function GameCoverage({slug}: {slug:string}) {
  const page=GAME_COVERAGE_PAGES.find(p=>p.slug===slug)!;
  return <><SEO title={page.title} description={GAME_DETAIL_EVIDENCE[slug].detail.en} canonical={page.path} keywords={[page.keyword]} language="en-US" structuredData={gameCoverageSchema(page)}/><GameCoverageContent page={page}/></>;
}
