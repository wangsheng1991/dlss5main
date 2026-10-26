import React from 'react';
import SEO from '../components/SEO';
import { DlssCheckerContent } from '../components/DlssCheckerContent';
import { CHECKER_PAGES, checkerSchema } from '../content/dlssChecker';

export default function DlssChecker({slug=''}: {slug?:string}) {
  const page=CHECKER_PAGES.find(p=>p.slug===slug)!;
  return <><SEO title={`${page.heading} | DLSS5NVIDIA`} description={page.intro} canonical={page.path} keywords={[page.keyword]} language="en-US" structuredData={checkerSchema(page)} /><DlssCheckerContent page={page}/></>;
}
