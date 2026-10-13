import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RelatedAdditions from './components/RelatedAdditions';
import Home from './pages/Home';
import ToolLanding from './pages/ToolLanding';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { profileHas, type SiteSection } from './config/profile';
import { trackRouteView, trackShareLinkAccess } from './lib/analytics';

function AnalyticsRouteTracker() {
  const { pathname, search } = useLocation();
  const { loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    // Query values are intentionally excluded from page_path; UTM values are retained by the
    // analytics bridge and tool/sample names are supplied by the CTA events themselves.
    trackRouteView(pathname);
    const params = new URLSearchParams(search);
    if (params.has('share') || params.has('shared') || pathname.startsWith('/share/')) trackShareLinkAccess(pathname);
  }, [loading, pathname, search]);
  return null;
}

/**
 * Only the landing page ships in the entry bundle. Every other route is fetched when it is
 * opened, so a first visit downloads a small fraction of the site instead of all of it.
 */
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Models = lazy(() => import('./pages/Models'));
const Docs = lazy(() => import('./pages/Docs'));
const Enterprise = lazy(() => import('./pages/Enterprise'));
const Blog = lazy(() => import('./pages/Blog'));
const Podcast = lazy(() => import('./pages/Podcast'));
const About = lazy(() => import('./pages/About'));
const Download = lazy(() => import('./pages/Download'));
const StudioBeta = lazy(() => import('./pages/StudioBeta'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Comparisons = lazy(() => import('./pages/Comparisons'));
const BeforeAfter = lazy(() => import('./pages/BeforeAfter'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Refund = lazy(() => import('./pages/Refund'));
const UseCaseLanding = lazy(() => import('./pages/UseCaseLanding'));
const PassportPhoto = lazy(() => import('./pages/PassportPhoto'));
const GameCharacterStyle = lazy(() => import('./pages/GameCharacterStyle'));
const VideoUpscaler = lazy(() => import('./pages/VideoUpscaler'));
const SeoExpansion = lazy(() => import('./pages/SeoExpansion'));
/**
 * DLSS 5 checker — the scaffold for the compatibility tool (see
 * `docs/DLSS5-CHECKER-REQUIREMENTS-20261010.md`). It exists only in local development: `DEV` is
 * folded to `false` in a production build, so the import, the chunk and the route all disappear
 * from what is deployed. To ship it, register the route in `scripts/prerender-seo.ts` too (and in
 * the sitemap that step generates).
 */
const DlssChecker = import.meta.env.DEV ? lazy(() => import('./pages/DlssChecker')) : null;

/**
 * Renders a page, or sends the visitor home when this deployment does not publish that section. A
 * link written for the other deployment should land on the store, not on an empty shell — and the
 * prerender step skips those paths for the same reason.
 */
const orHome = (section: SiteSection, page: React.ReactNode): React.ReactNode =>
  profileHas(section) ? page : <Navigate to="/" replace />;

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AnalyticsRouteTracker />
          <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-black flex flex-col">
            <Navbar />
            <div className="flex-1">
              <Suspense fallback={<div className="pt-40 pb-24 text-center text-zinc-500">Loading…</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* The Chinese edition of the home page at its own indexable URL. `/` stays the
                      English x-default; the two declare each other through hreflang. */}
                  <Route path="/zh" element={<Home locale="zh" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/models" element={orHome('models', <Models />)} />
                  <Route path="/docs" element={orHome('docs', <Docs />)} />
                  <Route path="/blog" element={orHome('blog', <Blog />)} />
                  <Route path="/blog/:slug" element={orHome('blog', <Blog />)} />
                  <Route path="/podcast" element={orHome('podcast', <Podcast />)} />
                  <Route path="/podcast/:slug" element={orHome('podcast', <Podcast />)} />
                  {/* Only these two language prefixes have translated blog editions. Keeping the
                      routes explicit prevents /ja/blog and other UI locales from becoming duplicate
                      crawlable pages with a misleading self-canonical. */}
                  <Route path="/en/blog" element={orHome('blog', <Blog />)} />
                  <Route path="/en/blog/:slug" element={orHome('blog', <Blog />)} />
                  <Route path="/zh/blog" element={orHome('blog', <Blog />)} />
                  <Route path="/zh/blog/:slug" element={orHome('blog', <Blog />)} />
                  <Route path="/about" element={orHome('about', <About />)} />
                  <Route path="/download" element={orHome('download', <Download />)} />
                  <Route path="/zh/download" element={orHome('download', <Download forceLocale="zh-CN" />)} />
                  <Route path="/studio-beta" element={orHome('download', <StudioBeta forceLocale="en" />)} />
                  <Route path="/zh/studio-beta" element={orHome('download', <StudioBeta forceLocale="zh" />)} />
                  <Route path="/enterprise" element={orHome('enterprise', <Enterprise />)} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/comparisons" element={orHome('comparisons', <Comparisons />)} />
                  <Route path="/before-after" element={orHome('comparisons', <BeforeAfter />)} />
                  <Route path="/zh/before-after" element={orHome('comparisons', <BeforeAfter locale="zh" />)} />
                  <Route path="/guides" element={orHome('seoExpansion', <SeoExpansion kind="guides" />)} />
                  <Route path="/what-is-dlss-5" element={orHome('seoExpansion', <SeoExpansion kind="what-is" />)} />
                  <Route path="/vs/dlss-5-vs-dlss-4-5" element={orHome('seoExpansion', <SeoExpansion kind="vs-dlss-45" />)} />
                  <Route path="/vs/dlss-5-vs-fsr-4" element={orHome('seoExpansion', <SeoExpansion kind="vs-fsr-4" />)} />
                  <Route path="/system-requirements" element={orHome('seoExpansion', <SeoExpansion kind="system-requirements" />)} />
                  <Route path="/status" element={orHome('seoExpansion', <SeoExpansion kind="status" />)} />
                  <Route path="/dlss-5-apk" element={orHome('seoExpansion', <SeoExpansion kind="dlss-5-apk" />)} />
                  <Route path="/games" element={orHome('seoExpansion', <SeoExpansion kind="games" />)} />
                  <Route path="/games/nba-2k27" element={orHome('seoExpansion', <SeoExpansion kind="nba-2k27" />)} />
                  <Route path="/benchmark" element={orHome('seoExpansion', <SeoExpansion kind="benchmark" />)} />
                  <Route path="/zh/guides" element={orHome('seoExpansion', <SeoExpansion kind="guides" locale="zh" />)} />
                  <Route path="/zh/what-is-dlss-5" element={orHome('seoExpansion', <SeoExpansion kind="what-is" locale="zh" />)} />
                  <Route path="/zh/vs/dlss-5-vs-dlss-4-5" element={orHome('seoExpansion', <SeoExpansion kind="vs-dlss-45" locale="zh" />)} />
                  <Route path="/zh/vs/dlss-5-vs-fsr-4" element={orHome('seoExpansion', <SeoExpansion kind="vs-fsr-4" locale="zh" />)} />
                  <Route path="/zh/system-requirements" element={orHome('seoExpansion', <SeoExpansion kind="system-requirements" locale="zh" />)} />
                  <Route path="/zh/status" element={orHome('seoExpansion', <SeoExpansion kind="status" locale="zh" />)} />
                  <Route path="/zh/dlss-5-apk" element={orHome('seoExpansion', <SeoExpansion kind="dlss-5-apk" locale="zh" />)} />
                  <Route path="/zh/games" element={orHome('seoExpansion', <SeoExpansion kind="games" locale="zh" />)} />
                  <Route path="/zh/games/nba-2k27" element={orHome('seoExpansion', <SeoExpansion kind="nba-2k27" locale="zh" />)} />
                  <Route path="/zh/benchmark" element={orHome('seoExpansion', <SeoExpansion kind="benchmark" locale="zh" />)} />
                  <Route path="/image-upscaler" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/image-quality-enhancer" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/unblur-image" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/old-photo-restoration" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/ai-headshot" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/image-to-svg" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/remove-background" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/erase-object" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/virtual-try-on" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/interior-design" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/portrait-retouch" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/virtual-makeup" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/video-downloader" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/game-character-style" element={orHome('tools', <GameCharacterStyle />)} />
                  <Route path="/video-upscaler" element={orHome('tools', <VideoUpscaler />)} />
                  <Route path="/es/mejorar-calidad-imagen" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/use-cases/product-photo-enhancer" element={orHome('useCases', <UseCaseLanding />)} />
                  <Route path="/use-cases/architecture-render-upscaler" element={orHome('useCases', <UseCaseLanding />)} />
                  <Route path="/use-cases/portrait-photo-enhancer" element={orHome('useCases', <UseCaseLanding />)} />
                  <Route path="/tools/passport-photo" element={orHome('microTools', <PassportPhoto />)} />
                  <Route path="/tools/passport-photo/:spec" element={orHome('microTools', <PassportPhoto />)} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/refund" element={<Refund />} />
                  {/* Scaffold only: a production build has no checker route and no checker chunk. */}
                  {DlssChecker && <Route path="/dlss-checker" element={<DlssChecker />} />}
                </Routes>
                <RelatedAdditions />
              </Suspense>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
