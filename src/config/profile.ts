import { readBuildEnv } from './build-env';

/**
 * Which site this build is.
 *
 * The product, the app, the billing and the policies are one codebase, and that is deliberate: a
 * bug fixed once is fixed everywhere. What differs between deployments is presentation — the domain
 * (`site.ts`), the brand its copy names, and which sections of the site exist at all. Keeping that
 * difference in data rather than in a branch means it stays visible and reviewable; a fork would
 * drift silently.
 *
 * If a deployment ever needs structurally different pages, that is the signal to fork rather than to
 * add another flag here.
 */
export type SiteSection =
  /** The research-desk blog and its articles. */
  | 'blog'
  | 'about'
  | 'download'
  | 'models'
  | 'docs'
  | 'enterprise'
  | 'comparisons'
  /** The SEO landing pages for individual tools (`TOOL_LANDINGS`). */
  | 'tools';

export type SiteProfile = {
  id: string;
  /** Short name in the navbar, the footer and any copy that names the product. */
  brand: string;
  /** Longer form used inside page titles and structured data. */
  productName: string;
  /** Default `og:site_name`. */
  siteName: string;
  /** The name the policies and the storefront use for the business behind the subscription. */
  legalName: string;
  /** `Organization` name in JSON-LD. */
  orgName: string;
  /** The business the policy pages say the subscription is sold by (`config/legal.ts`). */
  operatorName: string;
  /** `SoftwareApplication` name in JSON-LD, which reads wrong if the aside is substituted away. */
  softwareName: string;
  /** Sections this deployment publishes; anything absent 404s to the home page and never prerenders. */
  sections: readonly SiteSection[];
  /**
   * Brand names to rewrite in copy written for the original storefront. Applied to translated
   * strings, page titles and prerendered HTML — never to URLs, so slugs stay intact.
   */
  brandTokens: ReadonlyArray<readonly [string, string]>;
  /** Sentences that must stay untouched by `brandTokens` because they name NVIDIA's own IP. */
  brandTokenGuard: RegExp;
  /**
   * Extra `<!-- begin:name -->…<!-- end:name -->` blocks this deployment drops, for copy that only
   * makes sense on one brand and no section owns — see the terminology notes in `public/llms.txt`.
   * Names must not collide with a `SiteSection`; every marker is stripped for every profile either
   * way, so a deployment that drops nothing is unaffected.
   */
  dropBlocks?: readonly string[];
  /** Translation keys whose wording cannot be fixed by substitution. */
  copyOverrides: Record<string, string>;
};

/** The paths each section owns, so any list of URLs can be filtered the way the router is. */
const SECTION_PATHS: Record<SiteSection, readonly string[]> = {
  blog: ['/blog', '/en/blog', '/zh/blog'],
  about: ['/about'],
  download: ['/download'],
  models: ['/models'],
  docs: ['/docs'],
  enterprise: ['/enterprise'],
  comparisons: ['/comparisons'],
  tools: [
    '/image-upscaler',
    '/image-quality-enhancer',
    '/unblur-image',
    '/image-to-svg',
    '/remove-background',
    '/erase-object',
    '/es/mejorar-calidad-imagen',
  ],
};

const ALL_SECTIONS = Object.keys(SECTION_PATHS) as SiteSection[];

/**
 * The sentences that name NVIDIA's own property — every disclaimer on the site, in the terms and in
 * the articles. They must survive substitution, because swapping the brand into them turns a true
 * statement into a false one ("ColorReco is a registered trademark of NVIDIA Corporation").
 *
 * The guard matches on "NVIDIA Corporation" as well as the English phrasing, because the translated
 * disclaimers keep the company name in Latin script but translate the word "trademark": a guard on
 * the English wording alone would silently fail in the other seven locales.
 */
const TRADEMARK_NOTICE = /trademarks? of NVIDIA|NVIDIA Corporation/i;

const PROFILES: Record<string, SiteProfile> = {
  /** The original storefront: everything it always had, and nothing rewritten. */
  dlss5: {
    id: 'dlss5',
    brand: 'DLSS 5',
    productName: 'DLSS 5',
    siteName: 'DLSS 5 Neural Monolith',
    legalName: 'DLSS5NVIDIA',
    orgName: 'DLSS 5 NVIDIA Independent Showcase',
    // Long-standing value on the original storefront, kept so the policy pages read exactly as they
    // did before the profiles existed. Worth confirming with the owner: it names no NVIDIA site.
    operatorName: 'ColorReco Tech',
    softwareName: 'DLSS 5 Neural Super-Resolution (Non-Official)',
    sections: ALL_SECTIONS,
    brandTokens: [],
    brandTokenGuard: TRADEMARK_NOTICE,
    copyOverrides: {},
  },
  /**
   * A brand-neutral storefront: the same app, pricing, policies and tool pages, without the
   * research-desk sections and without another company's name in the copy. Used for domains that
   * payment providers will not accept while they carry a trademark the operator does not own.
   */
  store: {
    id: 'store',
    // The brand is the domain, not an invented company: there is no legal entity behind this
    // deployment that a policy page or a receipt could honestly name.
    brand: 'Token2Any',
    productName: 'Token2Any',
    siteName: 'Token2Any',
    legalName: 'Token2Any',
    orgName: 'Token2Any',
    operatorName: 'Token2Any',
    softwareName: 'Token2Any Neural Super-Resolution',
    sections: ['tools'],
    brandTokens: [
      ['DLSS 5 NVIDIA', 'Token2Any'],
      ['DLSS5NVIDIA', 'Token2Any'],
      // Written the other way round in some copy, and in the translations. Longest first, so the
      // version number is consumed before the bare product name gets its turn.
      ['NVIDIA DLSS 5', 'Token2Any'],
      ['NVIDIA DLSS', 'Token2Any'],
      ['DLSS 5', 'Token2Any'],
      ['DLSS5', 'Token2Any'],
      ['DLSS', 'Token2Any'],
      // Product names stay verbatim in every locale, so these work language-agnostically too. The
      // claim they carry ("we run on NVIDIA tensor cores") reads as an affiliate claim on a site
      // that is meant to be independent, so it is dropped rather than reworded per language.
      ['NVIDIA Tensor Core', 'Tensor Core'],
      ['NVIDIA TENSOR CORE', 'TENSOR CORE'],
      ['NVIDIA-accelerated', 'hardware-accelerated'],
    ],
    brandTokenGuard: TRADEMARK_NOTICE,
    dropBlocks: ['brand'],
    copyOverrides: {
      // Substitution cannot fix this one: dropping it is the fix, and that reads the same in every
      // language because the replacement is empty.
      'dashboard.notOfficialDlss': '',
    },
  },
};

export const DEFAULT_PROFILE_ID = 'dlss5';

export const SITE_PROFILE: SiteProfile = PROFILES[readBuildEnv('VITE_SITE_PROFILE') || DEFAULT_PROFILE_ID] || PROFILES[DEFAULT_PROFILE_ID];

/** Does this deployment publish the given section? */
export const profileHas = (section: SiteSection): boolean => SITE_PROFILE.sections.includes(section);

/** Every section, in the order they are declared. */
export const SITE_SECTIONS = ALL_SECTIONS;

/**
 * Does this deployment serve the given path? Used for anything that lists URLs — the sitemap, the
 * crawler notes and the static shell — so none of them advertise a page that only redirects home.
 */
export const isPublishedPath = (pathname: string): boolean => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return !ALL_SECTIONS.filter((section) => !profileHas(section)).some((section) =>
    SECTION_PATHS[section].some((prefix) => clean === prefix || clean.startsWith(`${prefix}/`)),
  );
};

/**
 * Rewrites brand names in prose. Sentences are rewritten one at a time so a truthful disclaimer
 * ("DLSS is a trademark of NVIDIA Corporation") survives intact while the rest of the same document
 * is still rewritten; the original storefront carries no tokens and takes the pass-through.
 */
export const brandCopy = (text: string): string => {
  if (!text || SITE_PROFILE.brandTokens.length === 0) return text;
  return text.split(/(?<=[.!?]\s)/).map(rewriteSentence).join('');
};

const rewriteSentence = (sentence: string): string =>
  SITE_PROFILE.brandTokenGuard.test(sentence)
    ? sentence
    : SITE_PROFILE.brandTokens.reduce((acc, [from, to]) => acc.split(from).join(to), sentence);
