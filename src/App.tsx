import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';

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
                  <Route path="/models" element={<Models />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<Blog />} />
                  <Route path="/:locale/blog" element={<Blog />} />
                  <Route path="/:locale/blog/:slug" element={<Blog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/download" element={<Download />} />
                  <Route path="/enterprise" element={<Enterprise />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/comparisons" element={<Comparisons />} />
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
