export type MicroTool = {
  path: string;
  slug: string;
  heading: string;
  description: string;
  keywords: string[];
};

/** Small deterministic utilities that deliver a file locally, without a model call or credits. */
export const MICRO_TOOLS: MicroTool[] = [
  {
    path: '/tools/passport-photo',
    slug: 'passport-photo',
    heading: 'Passport Photo Maker',
    description: 'Create a printable passport or document photo from your own image. Choose a verified size, align the head guide and export a print sheet locally in your browser.',
    keywords: ['passport photo maker', 'passport photo online', '3x4 photo online', '35x45 passport photo', 'printable ID photo', 'фото 3 на 4 онлайн'],
  },
];

export const MICRO_TOOL_BY_PATH = Object.fromEntries(MICRO_TOOLS.map(tool => [tool.path, tool])) as Record<string, MicroTool>;
