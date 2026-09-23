import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolLanding from './pages/ToolLanding';
import { AuthProvider } from './contexts/AuthContext';
import { profileHas, type SiteSection } from './config/profile';

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
const About = lazy(() => import('./pages/About'));
const Download = lazy(() => import('./pages/Download'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Comparisons = lazy(() => import('./pages/Comparisons'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Refund = lazy(() => import('./pages/Refund'));
const UseCaseLanding = lazy(() => import('./pages/UseCaseLanding'));
const PassportPhoto = lazy(() => import('./pages/PassportPhoto'));

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
          <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-black flex flex-col">
            <Navbar />
            <div className="flex-1">
              <Suspense fallback={<div className="pt-40 pb-24 text-center text-zinc-500">Loading…</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/models" element={orHome('models', <Models />)} />
                  <Route path="/docs" element={orHome('docs', <Docs />)} />
                  <Route path="/blog" element={orHome('blog', <Blog />)} />
                  <Route path="/blog/:slug" element={orHome('blog', <Blog />)} />
                  <Route path="/:locale/blog" element={orHome('blog', <Blog />)} />
                  <Route path="/:locale/blog/:slug" element={orHome('blog', <Blog />)} />
                  <Route path="/about" element={orHome('about', <About />)} />
                  <Route path="/download" element={orHome('download', <Download />)} />
                  <Route path="/enterprise" element={orHome('enterprise', <Enterprise />)} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/comparisons" element={orHome('comparisons', <Comparisons />)} />
                  <Route path="/image-upscaler" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/image-quality-enhancer" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/unblur-image" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/image-to-svg" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/remove-background" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/erase-object" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/es/mejorar-calidad-imagen" element={orHome('tools', <ToolLanding />)} />
                  <Route path="/use-cases/product-photo-enhancer" element={orHome('useCases', <UseCaseLanding />)} />
                  <Route path="/use-cases/architecture-render-upscaler" element={orHome('useCases', <UseCaseLanding />)} />
                  <Route path="/use-cases/portrait-photo-enhancer" element={orHome('useCases', <UseCaseLanding />)} />
                  <Route path="/tools/passport-photo" element={orHome('microTools', <PassportPhoto />)} />
                  <Route path="/tools/passport-photo/:spec" element={orHome('microTools', <PassportPhoto />)} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/refund" element={<Refund />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
